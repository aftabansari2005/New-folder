# Voting System Backend

This is the backend server for the Indian Voting System, providing APIs for queue management, voter verification, and real-time updates.

## Features

- Real-time queue management using WebSocket
- QR code-based voter identification
- Facial recognition for voter verification
- Secure authentication with JWT
- PostgreSQL database with optimized schema
- Comprehensive audit logging
- RESTful API endpoints

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone [repository-url]
cd voting-system/backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a PostgreSQL database:
```bash
createdb voting_system
```

4. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. Run database migrations:
```bash
npm run db:migrate
```

## Development

Start the development server:
```bash
npm run dev
```

The server will start on http://localhost:3001 (or the port specified in your .env file).

## Production

1. Build the TypeScript code:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## API Endpoints

### Authentication
- POST /api/auth/login - User login

### Queue Management
- GET /api/queues - Get all queue statuses
- POST /api/queues/update - Update queue status

### Voter Verification
- POST /api/qr/generate - Generate QR code for voter
- POST /api/verify/face - Verify voter using facial recognition

## WebSocket Events

### Client to Server
- joinQueue - Join a specific queue room
- leaveQueue - Leave a specific queue room
- refreshQueues - Request queue status update

### Server to Client
- queueUpdate - Real-time queue status updates

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Rate limiting
- Input validation
- SQL injection prevention
- XSS protection

## Database Schema

The system uses the following main tables:
- users - User accounts and authentication
- voters - Voter information and face descriptors
- queues - Real-time queue status
- voting_records - Voting history and verification
- audit_logs - System activity logging

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the ISC License. 