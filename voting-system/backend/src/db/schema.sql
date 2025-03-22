-- Create database if it doesn't exist
SELECT 'CREATE DATABASE voting_system'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'voting_system');

-- Connect to the database
\c voting_system;

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user', -- 'admin' or 'user'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create voters table
CREATE TABLE voters (
    id SERIAL PRIMARY KEY,
    voter_id VARCHAR(255) UNIQUE NOT NULL,
    qr_code TEXT,
    qr_code_expiry TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create queues table
CREATE TABLE queues (
    id SERIAL PRIMARY KEY,
    room_number INTEGER NOT NULL,
    current_queue INTEGER DEFAULT 0,
    estimated_wait_time INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create voting_records table
CREATE TABLE IF NOT EXISTS voting_records (
    id SERIAL PRIMARY KEY,
    voter_id INTEGER REFERENCES voters(id),
    room_number INTEGER NOT NULL,
    voting_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    verification_method VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(255) NOT NULL,
    details JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_voters_user_id ON voters(user_id);
CREATE INDEX IF NOT EXISTS idx_voters_voter_id ON voters(voter_id);
CREATE INDEX IF NOT EXISTS idx_voting_records_voter_id ON voting_records(voter_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating timestamps
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_voters_updated_at ON voters;
CREATE TRIGGER update_voters_updated_at
    BEFORE UPDATE ON voters
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_queues_updated_at ON queues;
CREATE TRIGGER update_queues_updated_at
    BEFORE UPDATE ON queues
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user
INSERT INTO users (email, password, role) VALUES 
('admin@example.com', '$2b$10$YourHashedPasswordHere', 'admin');

-- Insert sample queue data
INSERT INTO queues (room_number, current_queue, estimated_wait_time) VALUES 
(1, 0, 0),
(2, 0, 0),
(3, 0, 0); 