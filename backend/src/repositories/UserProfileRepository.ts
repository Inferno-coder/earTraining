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
    try {
      // ON CONFLICT DO NOTHING ensures database-level idempotency
      const query = `
        INSERT INTO user_profiles (id)
        VALUES ($1)
        ON CONFLICT (id) DO NOTHING
        RETURNING *
      `;
      const { rows } = await pool.query(query, [id]);
      
      if (rows.length > 0) {
        return rows[0];
      }
      
      // If it already existed, fetch and return the existing profile
      return await this.findById(id);
    } catch (error: any) {
      throw new Error(`Local DB Error [createIfNotExists]: ${error.message}`);
    }
  }
}
