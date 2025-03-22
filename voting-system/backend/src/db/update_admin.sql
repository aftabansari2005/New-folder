-- Update admin user password (admin123)
UPDATE users 
SET password = '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iq.1ZxQKzqK2'
WHERE email = 'admin@example.com'; 