import express, { Request } from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import QRCode from 'qrcode';
import path from 'path';
import fs from 'fs';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// Database connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        role: string;
      };
    }
  }
}

// Authentication middleware
const authenticateToken = (req: Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key', (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' } as jwt.SignOptions
    );

    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Queue management routes
app.get('/api/queues', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM queues ORDER BY room_number');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching queues:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/queues/update', authenticateToken, async (req, res) => {
  try {
    const { roomNumber, currentQueue, estimatedWaitTime } = req.body;
    const result = await pool.query(
      'UPDATE queues SET current_queue = $1, estimated_wait_time = $2, updated_at = CURRENT_TIMESTAMP WHERE room_number = $3 RETURNING *',
      [currentQueue, estimatedWaitTime, roomNumber]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating queue:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// QR code generation
app.post('/api/qr/generate', authenticateToken, async (req, res) => {
  try {
    const { voterId, roomNumber } = req.body;
    const qrData = JSON.stringify({ voterId, roomNumber });
    const qrCode = await QRCode.toDataURL(qrData);
    res.json({ qrCode });
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Basic image verification (placeholder for face recognition)
app.post('/api/verify/face', authenticateToken, async (req, res) => {
  try {
    const { imageData, voterId } = req.body;
    const result = await pool.query('SELECT voter_id FROM voters WHERE voter_id = $1', [voterId]);
    const voter = result.rows[0];

    if (!voter) {
      return res.status(404).json({ error: 'Voter not found' });
    }

    // Remove data:image/jpeg;base64, prefix if present
    const base64Image = imageData.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64Image, 'base64');

    try {
      // Store the image for manual verification if needed
      const imagePath = path.join(__dirname, 'uploads', `${voterId}_${Date.now()}.jpg`);
      fs.mkdirSync(path.join(__dirname, 'uploads'), { recursive: true });
      fs.writeFileSync(imagePath, imageBuffer);

      // For now, we'll just verify that an image was successfully processed
      res.json({ 
        verified: true,
        message: 'Image verification successful',
        imagePath: imagePath
      });
    } catch (error) {
      console.error('Image processing error:', error);
      return res.status(400).json({ error: 'Invalid image data' });
    }
  } catch (error) {
    console.error('Image verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('joinQueue', (roomNumber) => {
    socket.join(`queue_${roomNumber}`);
    console.log(`Client joined queue room: ${roomNumber}`);
  });

  socket.on('leaveQueue', (roomNumber) => {
    socket.leave(`queue_${roomNumber}`);
    console.log(`Client left queue room: ${roomNumber}`);
  });

  socket.on('refreshQueues', async () => {
    try {
      const result = await pool.query('SELECT * FROM queues ORDER BY room_number');
      io.emit('queueUpdate', result.rows);
    } catch (error) {
      console.error('Error refreshing queues:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 