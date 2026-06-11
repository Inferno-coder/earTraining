import { pool } from './config/db';
import { UserProfileRepository } from './repositories/UserProfileRepository';
import { PracticeService } from './services/PracticeService';
import { UserProgressService } from './services/UserProgressService';

async function testProgression() {
  console.log('--- STARTING USER PROGRESSION SYSTEM INTEGRATION TESTS ---');
  const userRepo = new UserProfileRepository();
  const practiceService = new PracticeService();
  const progressService = new UserProgressService();

  const testUserId = '88888888-9999-aaaa-bbbb-cccccccccccc';

  try {
    // 1. Clean up potential old test state
    await pool.query('DELETE FROM user_progress WHERE user_id = $1', [testUserId]);
    await pool.query('DELETE FROM user_profiles WHERE id = $1', [testUserId]);

    // 2. Initialize profile and verify transaction-based user_progress entry creation
    console.log('\n[Test 1] Initializing user profile (should create user_progress automatically)...');
    await userRepo.createIfNotExists(testUserId);
    
    const initialProgress = await progressService.getProgress(testUserId);
    console.log('Initial Progress:', initialProgress);
    if (
      initialProgress.highest_unlocked_stage !== 1 ||
      initialProgress.highest_unlocked_level !== 1 ||
      initialProgress.total_xp !== 0
    ) {
      throw new Error('Initial progression record fields are incorrect');
    }
    console.log('✅ Test 1 Passed: User progress initialized properly via profile creation transaction.');

    // 3. Start session for Stage 1 Level 1 (requires 10 questions, pass >= 8 correct)
    console.log('\n[Test 2] Starting practice session for Stage 1, Level 1...');
    const sessionId = await practiceService.startSession(testUserId, 1, 1);
    console.log('Session ID:', sessionId);

    // Log 10 attempts (9 correct, 1 incorrect) - should pass the level!
    console.log('Logging 10 attempts (9 correct, 1 incorrect)...');
    for (let i = 0; i < 9; i++) {
      await practiceService.logAttempt(testUserId, {
        sessionId,
        stage: 1,
        level: 1,
        questionType: 'SINGLE_NOTE',
        playedData: { note: 'Sa' },
        userAnswer: { note: 'Sa' },
        isCorrect: true,
        responseTimeMs: 500,
      });
    }
    await practiceService.logAttempt(testUserId, {
      sessionId,
      stage: 1,
      level: 1,
      questionType: 'SINGLE_NOTE',
      playedData: { note: 'Sa' },
      userAnswer: { note: 'Pa' },
      isCorrect: false,
      responseTimeMs: 500,
    });

    console.log('Finishing session to trigger progress update transaction...');
    const finishResult = await practiceService.finishSession(testUserId, sessionId, 10000);
    console.log('Finish Result (pass status):', finishResult.pass);
    console.log('Updated Progress:', finishResult.progress);

    if (!finishResult.pass) {
      throw new Error('Expected Stage 1 Level 1 to be passed');
    }
    if (
      finishResult.progress.highest_unlocked_stage !== 1 ||
      finishResult.progress.highest_unlocked_level !== 2 ||
      finishResult.progress.total_xp !== 140 // 9 * 10 + 50 = 140
    ) {
      throw new Error('Stage 1 Level 1 progression values mismatch');
    }
    console.log('✅ Test 2 Passed: Stage 1 Level 1 successfully completed. Stage 1 Level 2 unlocked.');

    // 4. Complete Stage 1 Level 2 to unlock Stage 2 Level 1
    console.log('\n[Test 3] Simulating completing Stage 1 Level 2 to unlock Stage 2 Level 1...');
    const sessionId2 = await practiceService.startSession(testUserId, 1, 2);
    
    // Log 10 attempts (8 correct, 2 incorrect) - should pass the level!
    for (let i = 0; i < 8; i++) {
      await practiceService.logAttempt(testUserId, {
        sessionId: sessionId2,
        stage: 1,
        level: 2,
        questionType: 'SINGLE_NOTE',
        playedData: { note: 'Pa' },
        userAnswer: { note: 'Pa' },
        isCorrect: true,
        responseTimeMs: 600,
      });
    }
    for (let i = 0; i < 2; i++) {
      await practiceService.logAttempt(testUserId, {
        sessionId: sessionId2,
        stage: 1,
        level: 2,
        questionType: 'SINGLE_NOTE',
        playedData: { note: 'Pa' },
        userAnswer: { note: 'Sa' },
        isCorrect: false,
        responseTimeMs: 600,
      });
    }

    const finishResult2 = await practiceService.finishSession(testUserId, sessionId2, 12000);
    console.log('Finish Result 2 (pass status):', finishResult2.pass);
    console.log('Updated Progress 2:', finishResult2.progress);

    if (!finishResult2.pass) {
      throw new Error('Expected Stage 1 Level 2 to be passed');
    }
    if (
      finishResult2.progress.highest_unlocked_stage !== 2 ||
      finishResult2.progress.highest_unlocked_level !== 1 ||
      finishResult2.progress.total_xp !== 270 // 140 (initial) + (8 * 10 + 50) = 270
    ) {
      throw new Error('Stage 1 Level 2 progression values mismatch');
    }
    console.log('✅ Test 3 Passed: Stage 1 Level 2 completed. Stage 2 Level 1 successfully unlocked!');

    console.log('\n🎉 ALL PROGRESSION INTEGRATION TESTS PASSED SUCCESSFULLY! 🎉');
  } catch (error: any) {
    console.error('❌ Test execution encountered an error:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

testProgression();