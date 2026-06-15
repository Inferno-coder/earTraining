import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load env variables
dotenv.config();

const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

// Create connection pool: check if DATABASE_URL or POSTGRES_URL is provided, otherwise fallback to local configurations.
export const pool = connectionString
  ? new Pool({
      connectionString,
      ssl: isProduction ? { rejectUnauthorized: false } : false,
    })
  : new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'eartraining',
      database: process.env.DB_NAME || 'postgres',
    });

// Global error handler for connection pool
pool.on('error', (err) => {
  console.error('[Database Pool Error]: Unexpected error on idle client', err.message);
});

