export interface PracticeSession {
  id: string;
  user_id: string;
  stage: number;
  level: number;
  started_at: string;
  completed_at: string | null;
  duration_ms: number | null;
  total_questions: number | null;
  correct_answers: number | null;
  accuracy: number | null;
}

export interface PracticeAttempt {
  id: string;
  session_id: string;
  user_id: string;
  stage: number;
  level: number;
  question_type: string;
  played_data: any; // Maps to PostgreSQL JSONB
  user_answer: any; // Maps to PostgreSQL JSONB
  is_correct: boolean;
  response_time_ms: number | null;
  created_at?: string;
}
