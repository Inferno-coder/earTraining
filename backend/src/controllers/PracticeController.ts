import type { Request, Response } from 'express';
import { UserProgressService } from '../services/UserProgressService';
import { PracticeService } from '../services/PracticeService';

export class PracticeController {
  private progressService: UserProgressService;
  private practiceService: PracticeService;

  constructor() {
    this.progressService = new UserProgressService();
    this.practiceService = new PracticeService();
  }

  /**
   * Endpoint handler for POST /api/practice/attempt
   */
  saveAttempt = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized: Authenticated user context not found' });
        return;
      }

      const result = await this.practiceService.logAttempt(userId, req.body);
      res.status(201).json(result);
    } catch (error: any) {
      console.error('[PracticeController] saveAttempt Error:', error.message);
      res.status(400).json({ error: error.message });
    }
  };

  /**
   * Endpoint handler for POST /api/practice/level/complete
   */
  completeLevel = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized: Authenticated user context not found' });
        return;
      }

      const { stage, level, totalQuestions, correctAnswers, isCompletedSuccessfully } = req.body;
      if (stage === undefined || level === undefined || totalQuestions === undefined || correctAnswers === undefined) {
        res.status(400).json({ error: 'Bad Request: Missing required parameters to complete practice level' });
        return;
      }

      const result = await this.progressService.processLevelCompletion(
        userId,
        Number(stage),
        Number(level),
        Number(totalQuestions),
        Number(correctAnswers),
        isCompletedSuccessfully
      );
      
      res.status(200).json(result);
    } catch (error: any) {
      console.error('[PracticeController] completeLevel Error:', error.message);
      res.status(400).json({ error: error.message });
    }
  };
}
