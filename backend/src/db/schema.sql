-- Schema Definition for ClearEar Studio Core Backend (Simplified)

CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.practice_sessions (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    stage INTEGER NOT NULL,
    level INTEGER NOT NULL,
    started_at TIMESTAMPTZ NOT NULL,
    completed_at TIMESTAMPTZ,
    duration_ms INTEGER,
    total_questions INTEGER,
    correct_answers INTEGER,
    accuracy NUMERIC
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
