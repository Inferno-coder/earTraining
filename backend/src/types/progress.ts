export interface UserProgress {
  user_id: string;
  current_stage: number;
  current_level: number;
  highest_unlocked_stage: number;
  highest_unlocked_level: number;
  total_xp: number;
  total_questions: number;
  total_correct: number;
  reconstruction_states?: Record<string, { unlocked_length: number; length_xp: number }>;
  created_at?: string;
  updated_at?: string;
}
