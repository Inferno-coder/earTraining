import type { Request, Response } from 'express';
import { PracticeService } from '../services/PracticeService';

export class PracticeController {
  private service: PracticeService;

  constructor() {
    this.service = new PracticeService();
  }

  /**
   * Endpoint handler for POST /api/practice/session/start
   */
  startSession = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized: Authenticated user context not found' });
        return;
      }

      const { stage, level } = req.body;
      const sessionId = await this.service.startSession(userId, Number(stage), Number(level));
      
      res.status(201).json({ sessionId });
    } catch (error: any) {
      console.error('[PracticeController] startSession Error:', error.message);
      res.status(400).json({ error: error.message });
    }
  };

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

      const result = await this.service.logAttempt(userId, req.body);
      res.status(201).json(result);
    } catch (error: any) {
      console.error('[PracticeController] saveAttempt Error:', error.message);
      res.status(400).json({ error: error.message });
    }
  };

  /**
   * Endpoint handler for POST /api/practice/session/finish
   */
  finishSession = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized: Authenticated user context not found' });
        return;
      }

      const { sessionId, durationMs, isCompletedSuccessfully } = req.body;
      const result = await this.service.finishSession(userId, sessionId, Number(durationMs), isCompletedSuccessfully);
      
      res.status(200).json(result);
    } catch (error: any) {
      console.error('[PracticeController] finishSession Error:', error.message);
      res.status(400).json({ error: error.message });
    }
  };
}
