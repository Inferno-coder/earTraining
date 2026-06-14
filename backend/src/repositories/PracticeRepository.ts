import { pool } from '../config/db';
import type { PracticeAttempt } from '../types/practice';

export class PracticeRepository {
  /**
   * Saves a single practice question attempt
   */
  async saveAttempt(attempt: PracticeAttempt): Promise<PracticeAttempt> {
    try {
      const query = `
        INSERT INTO practice_attempts (
          id, session_id, user_id, stage, level, question_type, played_data, user_answer, is_correct, response_time_ms
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `;
      const values = [
        attempt.id,
        attempt.session_id,
        attempt.user_id,
        attempt.stage,
        attempt.level,
        attempt.question_type,
        JSON.stringify(attempt.played_data),
        JSON.stringify(attempt.user_answer),
        attempt.is_correct,
        attempt.response_time_ms,
      ];
      const { rows } = await pool.query(query, values);
      return rows[0] as PracticeAttempt;
    } catch (error: any) {
      throw new Error(`DB Error [saveAttempt]: ${error.message}`);
    }
  }
}
