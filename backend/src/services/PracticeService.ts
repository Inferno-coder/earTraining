import crypto from 'crypto';
import { PracticeRepository } from '../repositories/PracticeRepository';
import type { PracticeAttempt } from '../types/practice';

export class PracticeService {
  private repository: PracticeRepository;

  constructor() {
    this.repository = new PracticeRepository();
  }

  /**
   * Logs a single question attempt without validating a DB session
   */
  async logAttempt(
    userId: string,
    payload: {
      sessionId: string;
      stage: number;
      level: number;
      questionType: string;
      playedData: any;
      userAnswer: any;
      isCorrect: boolean;
      responseTimeMs: number | null;
    }
  ): Promise<PracticeAttempt> {
    const { sessionId, stage, level, questionType, playedData, userAnswer, isCorrect, responseTimeMs } = payload;

    if (!questionType || playedData === undefined || userAnswer === undefined || isCorrect === undefined) {
      throw new Error('Validation Error: Missing required fields to log practice attempt');
    }

    const attemptId = crypto.randomUUID();
    const attempt: PracticeAttempt = {
      id: attemptId,
      session_id: sessionId,
      user_id: userId,
      stage,
      level,
      question_type: questionType,
      played_data: playedData,
      user_answer: userAnswer,
      is_correct: isCorrect,
      response_time_ms: responseTimeMs,
    };

    const savedAttempt = await this.repository.saveAttempt(attempt);

    // Prune old attempts in the background (fire-and-forget) to keep the API fast and responsive
    this.repository.pruneOldAttempts(userId).catch((err) => {
      console.error('[PracticeService] Background pruning error:', err);
    });

    return savedAttempt;
  }
}
