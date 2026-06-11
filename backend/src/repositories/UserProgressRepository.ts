import { pool } from '../config/db';
import { PoolClient } from 'pg';
import type { UserProgress } from '../types/progress';

export class UserProgressRepository {
  /**
   * Find a user's progress by their User ID
   */
  async findByUserId(userId: string): Promise<UserProgress | null> {
    try {
      const query = 'SELECT * FROM user_progress WHERE user_id = $1';
      const { rows } = await pool.query(query, [userId]);
      return rows.length > 0 ? (rows[0] as UserProgress) : null;
    } catch (error: any) {
      throw new Error(`DB Error [findByUserId]: ${error.message}`);
    }
  }

  /**
   * Initialize a default user progress record if not exists
   */
  async createDefault(userId: string): Promise<UserProgress> {
    try {
      const query = `
        INSERT INTO user_progress (
          user_id, current_stage, current_level, highest_unlocked_stage, highest_unlocked_level, total_xp, total_questions, total_correct
        )
        VALUES ($1, 1, 1, 1, 1, 0, 0, 0)
        ON CONFLICT (user_id) DO NOTHING
        RETURNING *
      `;
      const { rows } = await pool.query(query, [userId]);
      if (rows.length > 0) {
        return rows[0] as UserProgress;
      }
      const existing = await this.findByUserId(userId);
      if (!existing) {
        throw new Error(`Failed to retrieve user progress for ID: ${userId}`);
      }
      return existing;
    } catch (error: any) {
      throw new Error(`DB Error [createDefault]: ${error.message}`);
    }
  }

  /**
   * Updates user progress using a specific client (for database transactions)
   */
  async updateInTransaction(client: PoolClient, progress: UserProgress): Promise<UserProgress> {
    try {
      const query = `
        UPDATE user_progress
        SET current_stage = $2,
            current_level = $3,
            highest_unlocked_stage = $4,
            highest_unlocked_level = $5,
            total_xp = $6,
            total_questions = $7,
            total_correct = $8,
            updated_at = NOW()
        WHERE user_id = $1
        RETURNING *
      `;
      const values = [
        progress.user_id,
        progress.current_stage,
        progress.current_level,
        progress.highest_unlocked_stage,
        progress.highest_unlocked_level,
        progress.total_xp,
        progress.total_questions,
        progress.total_correct,
      ];
      const { rows } = await client.query(query, values);
      return rows[0] as UserProgress;
    } catch (error: any) {
      throw new Error(`DB Transaction Error [updateInTransaction]: ${error.message}`);
    }
  }

  /**
   * Updates user progress using the default pool connection
   */
  async update(progress: UserProgress): Promise<UserProgress> {
    try {
      const query = `
        UPDATE user_progress
        SET current_stage = $2,
            current_level = $3,
            highest_unlocked_stage = $4,
            highest_unlocked_level = $5,
            total_xp = $6,
            total_questions = $7,
            total_correct = $8,
            updated_at = NOW()
        WHERE user_id = $1
        RETURNING *
      `;
      const values = [
        progress.user_id,
        progress.current_stage,
        progress.current_level,
        progress.highest_unlocked_stage,
        progress.highest_unlocked_level,
        progress.total_xp,
        progress.total_questions,
        progress.total_correct,
      ];
      const { rows } = await pool.query(query, values);
      return rows[0] as UserProgress;
    } catch (error: any) {
      throw new Error(`DB Error [updateProgress]: ${error.message}`);
    }
  }
}
