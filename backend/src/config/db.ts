import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load env variables
dotenv.config();

// Create connection pool to local PostgreSQL
export const pool = new Pool({
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
