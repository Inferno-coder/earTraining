import type { Request, Response } from 'express';
import { UserProfileService } from '../services/UserProfileService';

export class UserProfileController {
  private service: UserProfileService;

  constructor() {
    this.service = new UserProfileService();
  }

  /**
   * Endpoint handler for POST /api/users/initialize
   */
  initialize = async (req: Request, res: Response): Promise<void> => {
    try {
      // req.user is securely populated by authMiddleware after JWT validation
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized: Missing authenticated user ID' });
        return;
      }

      console.log(`[UserProfileController]: Initializing profile for user: ${userId}`);
      const result = await this.service.initializeProfile(userId);
      res.status(200).json(result);
    } catch (error: any) {
      console.error('[UserProfileController] Sync Error:', error.message);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  };
}
