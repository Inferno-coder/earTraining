import { Router } from 'express';
import { PracticeController } from '../controllers/PracticeController';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const controller = new PracticeController();

// Complete level endpoint requiring JWT token validation
router.post('/level/complete', authMiddleware, controller.completeLevel);
router.post('/attempt', authMiddleware, controller.saveAttempt);

export default router;
