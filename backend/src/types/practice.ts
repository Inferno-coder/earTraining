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
