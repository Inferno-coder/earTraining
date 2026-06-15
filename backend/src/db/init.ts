import { pool } from '../config/db';

const schema = `
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.practice_attempts (
    id UUID PRIMARY KEY,
    session_id UUID,
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    stage INTEGER NOT NULL,
    level INTEGER NOT NULL,
    question_type TEXT NOT NULL,
    played_data JSONB NOT NULL,
    user_answer JSONB NOT NULL,
    is_correct BOOLEAN NOT NULL,
    response_time_ms INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_progress (
    user_id UUID PRIMARY KEY REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    current_stage INTEGER NOT NULL DEFAULT 1,
    current_level INTEGER NOT NULL DEFAULT 1,
    highest_unlocked_stage INTEGER NOT NULL DEFAULT 1,
    highest_unlocked_level INTEGER NOT NULL DEFAULT 1,
    total_xp INTEGER NOT NULL DEFAULT 0,
    total_questions INTEGER NOT NULL DEFAULT 0,
    total_correct INTEGER NOT NULL DEFAULT 0,
    reconstruction_states JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_practice_attempts_user_id ON public.practice_attempts (user_id);
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

    // Run combined schema creation script
    await pool.query(schema);

    // Migration: drop foreign key constraint on practice_attempts.session_id if exists, and make it nullable
    await pool.query("ALTER TABLE public.practice_attempts DROP CONSTRAINT IF EXISTS practice_attempts_session_id_fkey");
    await pool.query("ALTER TABLE public.practice_attempts ALTER COLUMN session_id DROP NOT NULL");

    // Migration: drop the unused practice_sessions table
    await pool.query("DROP TABLE IF EXISTS public.practice_sessions CASCADE");

    // Migration: ensure reconstruction_states column exists in user_progress table
    await pool.query("ALTER TABLE public.user_progress ADD COLUMN IF NOT EXISTS reconstruction_states JSONB NOT NULL DEFAULT '{}'::jsonb");

    // Migration: ensure index on practice_attempts.user_id exists
    await pool.query("CREATE INDEX IF NOT EXISTS idx_practice_attempts_user_id ON public.practice_attempts (user_id)");

    console.log('[Database Init]: Core backend tables verified and ready.');
  } catch (error: any) {
    console.error('[Database Init Error]: Failed to initialize database tables:', error.message);
  }
}

if (require.main === module) {
  initializeDatabase().then(() => process.exit(0));
}
