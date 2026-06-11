import { pool } from '../config/db';

const schema = `
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
`;

/**
 * Initializes local database tables with safe migrations
 */
export async function initializeDatabase() {
  try {
    console.log('[Database Init]: Verifying and initializing database tables...');

    // Migration Check: If old webhook columns (like username) exist, drop and clean up
    const checkQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'user_profiles' AND column_name = 'username'
    `;
    const { rows } = await pool.query(checkQuery);
    
    if (rows.length > 0) {
      console.log('[Database Init]: Outdated schema detected (username column exists). Re-initializing table...');
      await pool.query('DROP TABLE IF EXISTS public.user_profiles CASCADE');
    }

    await pool.query(schema);
    console.log('[Database Init]: user_profiles table is verified and ready.');
  } catch (error: any) {
    console.error('[Database Init Error]: Failed to initialize database tables:', error.message);
  }
}

if (require.main === module) {
  initializeDatabase().then(() => process.exit(0));
}
