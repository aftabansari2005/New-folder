-- Create the database if it doesn't exist
CREATE DATABASE voting_system;

-- Connect to the database
\c voting_system

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create voters table
CREATE TABLE IF NOT EXISTS voters (
    voter_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create queues table
CREATE TABLE IF NOT EXISTS queues (
    room_number INTEGER PRIMARY KEY,
    current_queue INTEGER DEFAULT 0,
    estimated_wait_time INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user (password: admin123)
INSERT INTO users (email, password, role) 
VALUES ('admin@example.com', '$2a$10$8KzaNdKIMyOkASCH4QvSBu6g1.5FQBjfBDuJgYVGYZ7XhMJgHNFBW', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert some test queues
INSERT INTO queues (room_number) 
VALUES (1), (2), (3)
ON CONFLICT (room_number) DO NOTHING; 