import { Router } from 'express';
import { UserProgressService } from '../services/UserProgressService';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const service = new UserProgressService();

// GET /api/user/progress retrieves the authenticated user's current progress
router.get('/progress', authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized: Missing authenticated user ID' });
      return;
    }

    const progress = await service.getProgress(userId);
    res.status(200).json(progress);
  } catch (error: any) {
    console.error('[UserProgressRoute] Error fetching progress:', error.message);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

export default router;
