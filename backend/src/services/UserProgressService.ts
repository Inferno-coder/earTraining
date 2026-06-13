import { PoolClient } from 'pg';
import { UserProgressRepository } from '../repositories/UserProgressRepository';
import type { UserProgress } from '../types/progress';

export interface LevelCoord {
  stage: number;
  level: number;
}

/**
 * Curriculum map defining level progression.
 */
export const getNextLevel = (stage: number, level: number): LevelCoord | null => {
  // Stage 1 progression
  if (stage === 1) {
    if (level === 1) return { stage: 1, level: 2 };
    if (level === 2) return { stage: 2, level: 1 }; // Transition to Stage 2
  }
  // Stage 2 progression
  if (stage === 2) {
    if (level === 1) return { stage: 2, level: 2 };
    if (level === 2) return { stage: 2, level: 3 };
    if (level === 3) return { stage: 2, level: 4 };
    if (level === 4) return { stage: 2, level: 5 };
    if (level === 5) return { stage: 3, level: 1 }; // Transition to Stage 3
  }
  // Stage 3 progression
  if (stage === 3) {
    if (level === 1) return { stage: 3, level: 2 };
    if (level === 2) return { stage: 3, level: 3 };
    if (level === 3) return { stage: 4, level: 1 }; // Transition to Stage 4 (Melodic Reconstruction)
  }
  // Stage 4 progression
  if (stage === 4) {
    if (level === 1) return { stage: 5, level: 1 }; // Transition to Stage 5
  }
  // Stage 5 progression
  if (stage === 5) {
    if (level === 1) return { stage: 5, level: 2 };
    if (level === 2) return { stage: 5, level: 3 };
    if (level === 3) return { stage: 5, level: 4 };
    if (level === 4) return { stage: 5, level: 5 };
    if (level === 5) return { stage: 5, level: 6 };
    if (level === 6) return { stage: 5, level: 7 };
    if (level === 7) return { stage: 5, level: 8 }; // Unlocks virtual level 8 to indicate Stage 5 Level 7 completion
  }
  return null;
};

/**
 * Checks if a level is further along in curriculum than another
 */
export const isFurther = (a: LevelCoord, b: LevelCoord): boolean => {
  if (a.stage > b.stage) return true;
  if (a.stage === b.stage && a.level > b.level) return true;
  return false;
};

/**
 * Evaluates whether the user's score meets the passing criteria
 */
export const checkLevelPass = (total: number, correct: number): boolean => {
  if (total <= 10) return correct >= 8;
  if (total <= 15) return correct >= 12;
  if (total <= 20) return correct >= 16;
  return correct >= 20; // 25 questions or more
};

export class UserProgressService {
  private repository: UserProgressRepository;

  constructor() {
    this.repository = new UserProgressRepository();
  }

  /**
   * Fetch user progress, automatically creating defaults if it doesn't exist
   */
  async getProgress(userId: string): Promise<UserProgress> {
    if (!userId) {
      throw new Error('User ID is required to fetch progress');
    }
    const progress = await this.repository.findByUserId(userId);
    if (!progress) {
      // Self-healing fallback: create progression entry if missing
      return await this.repository.createDefault(userId);
    }
    return progress;
  }

  /**
   * Performs the mathematical calculations for progression and updates the database row.
   * Can accept a specific PoolClient to run inside an active database transaction.
   */
  async processSessionEnd(
    userId: string,
    stage: number,
    level: number,
    totalQuestions: number,
    correctAnswers: number,
    client: PoolClient,
    isCompletedSuccessfully?: boolean
  ): Promise<{ pass: boolean; updatedProgress: UserProgress }> {
    // 1. Fetch current progress
    let progress = await this.repository.findByUserId(userId);
    if (!progress) {
      // Create defaults if somehow missing
      progress = await this.repository.createDefault(userId);
    }

    // 2. Evaluate if level passed (Bypass threshold checks for Reconstruction levels ONLY if completed successfully)
    const isReconstructionLevel = (stage === 4 && level === 1) || (stage === 5 && level === 7);
    const pass = isReconstructionLevel ? !!isCompletedSuccessfully : checkLevelPass(totalQuestions, correctAnswers);

    // 3. Compute XP gained (Only for Reconstruction levels)
    const xpGained = isReconstructionLevel ? (correctAnswers * 10) + (pass ? 50 : 0) : 0;

    // 4. Copy state to avoid mutations
    const updated: UserProgress = {
      ...progress,
      total_xp: progress.total_xp + xpGained,
      total_questions: progress.total_questions + totalQuestions,
      total_correct: progress.total_correct + correctAnswers,
    };

    // 5. Update level locking progression if passed
    if (pass) {
      const nextCoord = getNextLevel(stage, level);
      if (nextCoord) {
        const highestCoord: LevelCoord = {
          stage: progress.highest_unlocked_stage,
          level: progress.highest_unlocked_level
        };

        // Only increase unlocked boundaries if this next coordinate represents a new furthest unlock
        if (isFurther(nextCoord, highestCoord)) {
          updated.highest_unlocked_stage = nextCoord.stage;
          updated.highest_unlocked_level = nextCoord.level;
          updated.current_stage = nextCoord.stage;
          updated.current_level = nextCoord.level;
        }
      }
    }

    // 6. Update database row (using the transaction client if available)
    const result = await this.repository.updateInTransaction(client, updated);

    return {
      pass,
      updatedProgress: result
    };
  }

  /**
   * Saves intermediate reconstruction level progress (note length and XP) to user progress
   */
  async saveReconstructionProgress(
    userId: string,
    stage: number,
    level: number,
    unlockedLength: number,
    lengthXP: number
  ): Promise<UserProgress> {
    const key = `s${stage}l${level}`;
    return await this.repository.updateReconstructionState(userId, key, {
      unlocked_length: unlockedLength,
      length_xp: lengthXP
    });
  }
}
