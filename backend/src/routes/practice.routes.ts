import { Router } from 'express';
import { PracticeController } from '../controllers/PracticeController';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const controller = new PracticeController();

// All practice history endpoints require JWT token validation
router.post('/session/start', authMiddleware, controller.startSession);
router.post('/attempt', authMiddleware, controller.saveAttempt);
router.post('/session/finish', authMiddleware, controller.finishSession);

export default router;
