import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

async function updateAdminPassword() {
  try {
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await pool.query(
      'UPDATE users SET password = $1 WHERE email = $2 RETURNING *',
      [hashedPassword, 'admin@example.com']
    );
    
    console.log('Admin password updated successfully:', result.rows[0]);
  } catch (error) {
    console.error('Error updating admin password:', error);
  } finally {
    await pool.end();
  }
}

updateAdminPassword(); 