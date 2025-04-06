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

async function updatePasswords() {
  try {
    // Update admin password
    const adminPassword = 'admin123';
    const adminHashedPassword = await bcrypt.hash(adminPassword, 10);
    
    const adminResult = await pool.query(
      'UPDATE users SET password = $1 WHERE email = $2 RETURNING *',
      [adminHashedPassword, 'admin@example.com']
    );
    
    console.log('Admin password updated successfully:', adminResult.rows[0]);

    // Update regular user password
    const userPassword = 'user123';
    const userHashedPassword = await bcrypt.hash(userPassword, 10);
    
    const userResult = await pool.query(
      'UPDATE users SET password = $1 WHERE email = $2 RETURNING *',
      [userHashedPassword, 'user@example.com']
    );
    
    console.log('User password updated successfully:', userResult.rows[0]);
  } catch (error) {
    console.error('Error updating passwords:', error);
  } finally {
    await pool.end();
  }
}

updatePasswords(); 