import { pool } from '../config/db';

export class UserProfileRepository {
  /**
   * Find a user profile by ID
   */
  async findById(id: string): Promise<any | null> {
    try {
      const query = 'SELECT * FROM user_profiles WHERE id = $1';
      const { rows } = await pool.query(query, [id]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error: any) {
      throw new Error(`Local DB Error [findById]: ${error.message}`);
    }
  }

  /**
   * Create a user profile if it does not already exist
   */
  async createIfNotExists(id: string): Promise<any> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // 1. Insert user profile
      const userQuery = `
        INSERT INTO user_profiles (id)
        VALUES ($1)
        ON CONFLICT (id) DO NOTHING
        RETURNING *
      `;
      const userRes = await client.query(userQuery, [id]);
      const isNew = userRes.rows.length > 0;

      if (isNew) {
        // 2. Insert default user progression record
        const progressQuery = `
          INSERT INTO user_progress (
            user_id, current_stage, current_level, highest_unlocked_stage, highest_unlocked_level, total_xp, total_questions, total_correct
          )
          VALUES ($1, 1, 1, 1, 1, 0, 0, 0)
        `;
        await client.query(progressQuery, [id]);
      }

      await client.query('COMMIT');

      if (isNew) {
        return userRes.rows[0];
      }
      
      // If it already existed, fetch and return the existing profile
      return await this.findById(id);
    } catch (error: any) {
      await client.query('ROLLBACK');
      throw new Error(`Local DB Error [createIfNotExists]: ${error.message}`);
    } finally {
      client.release();
    }
  }
}
