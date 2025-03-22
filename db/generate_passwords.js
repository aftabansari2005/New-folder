const bcrypt = require('bcrypt');
const fs = require('fs').promises;
const path = require('path');

const saltRounds = 10;

// Default passwords
const adminPassword = 'admin123';
const userPassword = 'user123';

async function generateHashes() {
    try {
        const adminHash = await bcrypt.hash(adminPassword, saltRounds);
        const userHash = await bcrypt.hash(userPassword, saltRounds);
        
        console.log('Admin password hash:', adminHash);
        console.log('User password hash:', userHash);
        
        // Update the SQL file with the hashed passwords
        const sqlContent = `-- Insert default admin user
INSERT INTO users (username, password_hash, role, created_at)
VALUES (
    'admin',
    '${adminHash}',
    'admin',
    CURRENT_TIMESTAMP
);

-- Insert default regular user
INSERT INTO users (username, password_hash, role, created_at)
VALUES (
    'user',
    '${userHash}',
    'user',
    CURRENT_TIMESTAMP
);`;

        // Write the SQL content to a file
        await fs.writeFile(path.join(__dirname, 'insert_default_users.sql'), sqlContent);
        console.log('SQL file updated successfully!');
    } catch (error) {
        console.error('Error:', error);
    }
}

generateHashes(); 