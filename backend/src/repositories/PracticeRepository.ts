import { pool } from '../config/db';
import { PoolClient } from 'pg';
import type { PracticeSession, PracticeAttempt } from '../types/practice';

export class PracticeRepository {
  /**
   * Creates a new practice session entry
   */
  async createSession(
    session: Omit<PracticeSession, 'completed_at' | 'duration_ms' | 'total_questions' | 'correct_answers' | 'accuracy'>
  ): Promise<PracticeSession> {
    try {
      const query = `
        INSERT INTO practice_sessions (id, user_id, stage, level, started_at)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
      const values = [
        session.id,
        session.user_id,
        session.stage,
        session.level,
        session.started_at,
      ];
      const { rows } = await pool.query(query, values);
      return rows[0] as PracticeSession;
    } catch (error: any) {
      throw new Error(`DB Error [createSession]: ${error.message}`);
    }
  }

  /**
   * Retrieves a practice session by its ID
   */
  async findSessionById(id: string): Promise<PracticeSession | null> {
    try {
      const query = 'SELECT * FROM practice_sessions WHERE id = $1';
      const { rows } = await pool.query(query, [id]);
      return rows.length > 0 ? (rows[0] as PracticeSession) : null;
    } catch (error: any) {
      throw new Error(`DB Error [findSessionById]: ${error.message}`);
    }
  }

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
   * Calculates total attempts and correct ones for a specific session
   */
  async countSessionAttempts(sessionId: string, client?: PoolClient): Promise<{ total: number; correct: number }> {
    try {
      const query = `
        SELECT 
          COUNT(*)::int as total,
          COUNT(CASE WHEN is_correct = true THEN 1 END)::int as correct
        FROM practice_attempts
        WHERE session_id = $1
      `;
      const conn = client || pool;
      const { rows } = await conn.query(query, [sessionId]);
      return {
        total: rows[0].total || 0,
        correct: rows[0].correct || 0,
      };
    } catch (error: any) {
      throw new Error(`DB Error [countSessionAttempts]: ${error.message}`);
    }
  }

  /**
   * Finishes a practice session and stores summary statistics
   */
  async finishSession(
    id: string,
    completedAt: string,
    durationMs: number,
    total: number,
    correct: number,
    accuracy: number,
    client?: PoolClient
  ): Promise<PracticeSession> {
    try {
      const query = `
        UPDATE practice_sessions
        SET completed_at = $2,
            duration_ms = $3,
            total_questions = $4,
            correct_answers = $5,
            accuracy = $6
        WHERE id = $1
        RETURNING *
      `;
      const values = [id, completedAt, durationMs, total, correct, accuracy];
      const conn = client || pool;
      const { rows } = await conn.query(query, values);
      return rows[0] as PracticeSession;
    } catch (error: any) {
      throw new Error(`DB Error [finishSession]: ${error.message}`);
    }
  }
}
