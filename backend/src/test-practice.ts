import { pool } from './config/db';
import { UserProfileRepository } from './repositories/UserProfileRepository';
import { UserProgressService } from './services/UserProgressService';
import { PracticeService } from './services/PracticeService';
import crypto from 'crypto';

async function runTests() {
  console.log('--- STARTING PRACTICE SYSTEM LEVEL COMPLETION TESTS ---');
  const userRepo = new UserProfileRepository();
  const progressService = new UserProgressService();
  const practiceService = new PracticeService();

  const testUserId = '77777777-8888-bbbb-cccc-dddddddddddd';
  const dummySessionId = crypto.randomUUID();

  try {
    // 1. Setup - Create test user profile if not exists
    console.log('\n[Prep] Initializing test user profile...');
    await userRepo.createIfNotExists(testUserId);
    
    // Clean up old progress
    await pool.query('DELETE FROM user_progress WHERE user_id = $1', [testUserId]);
    await pool.query('DELETE FROM practice_attempts WHERE user_id = $1', [testUserId]);
    await userRepo.createIfNotExists(testUserId);
    console.log('Test user profile ready.');

    // 2. Log attempt directly without session
    console.log('\n[Test 1] Logging attempt directly without session database row...');
    const attempt = await practiceService.logAttempt(testUserId, {
      sessionId: dummySessionId,
      stage: 2,
      level: 3,
      questionType: 'SINGLE_NOTE',
      playedData: { note: 'Sa' },
      userAnswer: { note: 'Sa' },
      isCorrect: true,
      responseTimeMs: 900
    });
    console.log('Logged Attempt ID:', attempt.id);
    console.log('✅ Test 1 Passed: Successfully logged attempt without pre-existing session row.');

    // 3. Complete Level with passing score
    console.log('\n[Test 2] Simulating successful level completion (Stage 2, Level 3)...');
    const result = await progressService.processLevelCompletion(testUserId, 2, 3, 10, 8);
    console.log('Pass Status:', result.pass);
    console.log('Updated Progress:', result.updatedProgress);

    if (!result.pass) {
      throw new Error('Expected Stage 2 Level 3 to pass');
    }
    console.log('✅ Test 2 Passed: Successfully processed passing level completion.');

    // 4. Complete Level with failing score
    console.log('\n[Test 3] Simulating failing level completion (Stage 2, Level 3)...');
    const resultFail = await progressService.processLevelCompletion(testUserId, 2, 3, 10, 5);
    console.log('Pass Status:', resultFail.pass);
    console.log('Updated Progress:', resultFail.updatedProgress);

    if (resultFail.pass) {
      throw new Error('Expected Stage 2 Level 3 to fail');
    }
    console.log('✅ Test 3 Passed: Successfully processed failing level completion.');

    console.log('\n🎉 ALL PRACTICE SYSTEM TESTS PASSED SUCCESSFULLY! 🎉');
  } catch (error: any) {
    console.error('❌ Test execution encountered an error:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runTests();
