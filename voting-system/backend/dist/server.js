"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
const pg_1 = require("pg");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const qrcode_1 = __importDefault(require("qrcode"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        methods: ['GET', 'POST'],
    },
});
const pool = new pg_1.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432'),
});
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '50mb' }));
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key', (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const user = result.rows[0];
        const validPassword = await bcryptjs_1.default.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'your_jwt_secret_key', { expiresIn: '24h' });
        res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.get('/api/queues', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM queues ORDER BY room_number');
        res.json(result.rows);
    }
    catch (error) {
        console.error('Error fetching queues:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.post('/api/queues/update', authenticateToken, async (req, res) => {
    try {
        const { roomNumber, currentQueue, estimatedWaitTime } = req.body;
        const result = await pool.query('UPDATE queues SET current_queue = $1, estimated_wait_time = $2, updated_at = CURRENT_TIMESTAMP WHERE room_number = $3 RETURNING *', [currentQueue, estimatedWaitTime, roomNumber]);
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error('Error updating queue:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.post('/api/qr/generate', authenticateToken, async (req, res) => {
    try {
        const { voterId, roomNumber } = req.body;
        const qrData = JSON.stringify({ voterId, roomNumber });
        const qrCode = await qrcode_1.default.toDataURL(qrData);
        res.json({ qrCode });
    }
    catch (error) {
        console.error('Error generating QR code:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.post('/api/verify/face', authenticateToken, async (req, res) => {
    try {
        const { imageData, voterId } = req.body;
        const result = await pool.query('SELECT voter_id FROM voters WHERE voter_id = $1', [voterId]);
        const voter = result.rows[0];
        if (!voter) {
            return res.status(404).json({ error: 'Voter not found' });
        }
        const base64Image = imageData.replace(/^data:image\/\w+;base64,/, '');
        const imageBuffer = Buffer.from(base64Image, 'base64');
        try {
            const imagePath = path_1.default.join(__dirname, 'uploads', `${voterId}_${Date.now()}.jpg`);
            fs_1.default.mkdirSync(path_1.default.join(__dirname, 'uploads'), { recursive: true });
            fs_1.default.writeFileSync(imagePath, imageBuffer);
            res.json({
                verified: true,
                message: 'Image verification successful',
                imagePath: imagePath
            });
        }
        catch (error) {
            console.error('Image processing error:', error);
            return res.status(400).json({ error: 'Invalid image data' });
        }
    }
    catch (error) {
        console.error('Image verification error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
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
        }
        catch (error) {
            console.error('Error refreshing queues:', error);
        }
    });
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map