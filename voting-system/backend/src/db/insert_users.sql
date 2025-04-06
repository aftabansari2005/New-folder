-- Clear existing users
DELETE FROM users;

-- Insert default admin user
INSERT INTO users (email, password, name, role)
VALUES (
    'admin@example.com',
    '$2b$10$Oi.WA/oYDg2YfhqesmJBkOFdqk.Kajug0HTI8hQAPgdyL0X7Y2DPO',
    'Admin User',
    'admin'
);

-- Insert default regular user
INSERT INTO users (email, password, name, role)
VALUES (
    'user@example.com',
    '$2b$10$JsJZQp9p0VL9IvcNmtuCB.MK21BvJLLkg3aIvlDCc5yxTFiCCahmW',
    'Regular User',
    'user'
); 