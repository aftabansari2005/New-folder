-- Insert default admin user
INSERT INTO users (username, password_hash, role, created_at)
VALUES (
    'admin',
    '$2b$10$Oi.WA/oYDg2YfhqesmJBkOFdqk.Kajug0HTI8hQAPgdyL0X7Y2DPO',
    'admin',
    CURRENT_TIMESTAMP
);

-- Insert default regular user
INSERT INTO users (username, password_hash, role, created_at)
VALUES (
    'user',
    '$2b$10$JsJZQp9p0VL9IvcNmtuCB.MK21BvJLLkg3aIvlDCc5yxTFiCCahmW',
    'user',
    CURRENT_TIMESTAMP
);