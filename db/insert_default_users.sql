-- Insert default admin user
INSERT INTO users (username, password_hash, role, created_at)
VALUES (
    'admin',
    '$2b$10$YourHashedPasswordHere', -- This will be replaced with actual hashed password
    'admin',
    CURRENT_TIMESTAMP
);

-- Insert default regular user
INSERT INTO users (username, password_hash, role, created_at)
VALUES (
    'user',
    '$2b$10$YourHashedPasswordHere', -- This will be replaced with actual hashed password
    'user',
    CURRENT_TIMESTAMP
); 