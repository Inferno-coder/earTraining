import { Router } from 'express';
import { UserProfileController } from '../controllers/UserProfileController';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const controller = new UserProfileController();

// POST /initialize is protected by the authMiddleware verifying Supabase JWT
router.post('/initialize', authMiddleware, controller.initialize);

export default router;
