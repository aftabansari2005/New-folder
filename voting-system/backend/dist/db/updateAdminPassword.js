"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pool = new pg_1.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432'),
});
async function updateAdminPassword() {
    try {
        const password = 'admin123';
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const result = await pool.query('UPDATE users SET password = $1 WHERE email = $2 RETURNING *', [hashedPassword, 'admin@example.com']);
        console.log('Admin password updated successfully:', result.rows[0]);
    }
    catch (error) {
        console.error('Error updating admin password:', error);
    }
    finally {
        await pool.end();
    }
}
updateAdminPassword();
//# sourceMappingURL=updateAdminPassword.js.map