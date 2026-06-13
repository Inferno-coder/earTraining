import crypto from 'crypto';
import { pool } from '../config/db';
import { PracticeRepository } from '../repositories/PracticeRepository';
import { UserProgressService } from './UserProgressService';
import type { PracticeSession, PracticeAttempt } from '../types/practice';
import type { UserProgress } from '../types/progress';

export class PracticeService {
  private repository: PracticeRepository;

  constructor() {
    this.repository = new PracticeRepository();
  }

  /**
   * Starts a new practice session for a user
   */
  async startSession(userId: string, stage: number, level: number): Promise<string> {
    if (stage === undefined || level === undefined) {
      throw new Error('Stage and Level are required parameters to start a practice session');
    }

    const sessionId = crypto.randomUUID();
    const startedAt = new Date().toISOString();

    await this.repository.createSession({
      id: sessionId,
      user_id: userId,
      stage,
      level,
      started_at: startedAt,
    });

    return sessionId;
  }

  /**
   * Logs a single question attempt inside an active practice session
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

    if (!sessionId || !questionType || playedData === undefined || userAnswer === undefined || isCorrect === undefined) {
      throw new Error('Validation Error: Missing required fields to log practice attempt');
    }

    // Security validation: verify session exists and belongs to the caller user ID
    const session = await this.repository.findSessionById(sessionId);
    if (!session) {
      throw new Error(`Not Found: Practice session with ID "${sessionId}" does not exist`);
    }
    if (session.user_id !== userId) {
      throw new Error('Unauthorized: You do not own this practice session');
    }

    const attemptId = crypto.randomUUID();
    const attempt: PracticeAttempt = {
      id: attemptId,
      session_id: sessionId,
      user_id: userId,
      stage: stage !== undefined ? stage : session.stage,
      level: level !== undefined ? level : session.level,
      question_type: questionType,
      played_data: playedData,
      user_answer: userAnswer,
      is_correct: isCorrect,
      response_time_ms: responseTimeMs,
    };

    return await this.repository.saveAttempt(attempt);
  }

  /**
   * Finishes a practice session, calculating aggregate statistics from logged attempts
   */
  async finishSession(
    userId: string,
    sessionId: string,
    durationMs: number,
    isCompletedSuccessfully?: boolean
  ): Promise<{ session: PracticeSession; pass: boolean; progress: UserProgress }> {
    if (!sessionId) {
      throw new Error('Validation Error: Session ID is required to complete session');
    }

    // Security validation: verify session exists and belongs to the caller user ID
    const session = await this.repository.findSessionById(sessionId);
    if (!session) {
      throw new Error(`Not Found: Practice session with ID "${sessionId}" does not exist`);
    }
    if (session.user_id !== userId) {
      throw new Error('Unauthorized: You do not own this practice session');
    }

    const completedAt = new Date().toISOString();
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Query attempts logged for this session to get totals
      const { total, correct } = await this.repository.countSessionAttempts(sessionId, client);
      
      // Compute exact accuracy percentage (rounded to 2 decimal places)
      const accuracy = total > 0 ? parseFloat(((correct / total) * 100).toFixed(2)) : 0;

      const updatedSession = await this.repository.finishSession(
        sessionId,
        completedAt,
        durationMs || 0,
        total,
        correct,
        accuracy,
        client
      );

      // Evaluate progression and update user_progress table inside the same transaction
      const progressService = new UserProgressService();
      const { pass, updatedProgress } = await progressService.processSessionEnd(
        userId,
        session.stage,
        session.level,
        total,
        correct,
        client,
        isCompletedSuccessfully
      );

      await client.query('COMMIT');

      return {
        session: updatedSession,
        pass,
        progress: updatedProgress,
      };
    } catch (error: any) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}
