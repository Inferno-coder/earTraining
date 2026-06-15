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

  /**
   * Enforces the 500-attempt limit per user by deleting the 100 oldest records if total exceeds 500
   */
  async pruneOldAttempts(userId: string): Promise<void> {
    try {
      // 1. Get the current count of practice attempts for this user
      const countQuery = 'SELECT COUNT(*) FROM practice_attempts WHERE user_id = $1';
      const { rows } = await pool.query(countQuery, [userId]);
      const count = parseInt(rows[0].count, 10);

      // 2. If the count exceeds 500, delete the oldest 100 records
      if (count > 500) {
        console.log(`[PracticeRepository]: User ${userId} has ${count} attempts (limit: 500). Pruning oldest 100 records.`);
        const deleteQuery = `
          DELETE FROM practice_attempts
          WHERE id IN (
            SELECT id FROM practice_attempts
            WHERE user_id = $1
            ORDER BY created_at ASC
            LIMIT 100
          )
        `;
        await pool.query(deleteQuery, [userId]);
      }
    } catch (error: any) {
      // Log the error but don't fail the main request
      console.error(`[PracticeRepository] Error pruning old attempts: ${error.message}`);
    }
  }
}

