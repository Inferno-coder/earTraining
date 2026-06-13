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

// POST /api/user/reconstruction-progress saves intermediate progress for reconstruction levels
router.post('/reconstruction-progress', authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized: Missing authenticated user ID' });
      return;
    }

    const { stage, level, unlockedLength, lengthXP } = req.body;
    if (
      typeof stage !== 'number' ||
      typeof level !== 'number' ||
      typeof unlockedLength !== 'number' ||
      typeof lengthXP !== 'number'
    ) {
      res.status(400).json({ error: 'Bad Request: Missing or invalid stage, level, unlockedLength, or lengthXP' });
      return;
    }

    const progress = await service.saveReconstructionProgress(userId, stage, level, unlockedLength, lengthXP);
    res.status(200).json(progress);
  } catch (error: any) {
    console.error('[UserProgressRoute] Error saving reconstruction progress:', error.message);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

export default router;
