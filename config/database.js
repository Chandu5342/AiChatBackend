// config/db.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Use the full DB_URL directly
const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: { rejectUnauthorized: false } // Supabase requires this for SSL
  },
  logging: false, // turn off SQL logging
});

export default sequelize;
