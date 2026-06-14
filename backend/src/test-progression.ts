import { pool } from './config/db';
import { UserProfileRepository } from './repositories/UserProfileRepository';
import { UserProgressService } from './services/UserProgressService';

async function testProgression() {
  console.log('--- STARTING USER PROGRESSION SYSTEM INTEGRATION TESTS ---');
  const userRepo = new UserProfileRepository();
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

    // 3. Complete Stage 1 Level 1 (requires 10 questions, pass >= 8 correct)
    console.log('\n[Test 2] Simulating level completion for Stage 1, Level 1...');
    console.log('Submitting 10 questions (9 correct, 1 incorrect)...');
    const finishResult = await progressService.processLevelCompletion(testUserId, 1, 1, 10, 9);
    console.log('Finish Result (pass status):', finishResult.pass);
    console.log('Updated Progress:', finishResult.updatedProgress);

    if (!finishResult.pass) {
      throw new Error('Expected Stage 1 Level 1 to be passed');
    }
    if (
      finishResult.updatedProgress.highest_unlocked_stage !== 1 ||
      finishResult.updatedProgress.highest_unlocked_level !== 2 ||
      finishResult.updatedProgress.total_questions !== 10 ||
      finishResult.updatedProgress.total_correct !== 9
    ) {
      throw new Error('Stage 1 Level 1 progression values mismatch');
    }
    console.log('✅ Test 2 Passed: Stage 1 Level 1 successfully completed. Stage 1 Level 2 unlocked.');

    // 4. Complete Stage 1 Level 2 to unlock Stage 2 Level 1
    console.log('\n[Test 3] Simulating completing Stage 1 Level 2 to unlock Stage 2 Level 1...');
    console.log('Submitting 10 questions (8 correct, 2 incorrect)...');
    const finishResult2 = await progressService.processLevelCompletion(testUserId, 1, 2, 10, 8);
    console.log('Finish Result 2 (pass status):', finishResult2.pass);
    console.log('Updated Progress 2:', finishResult2.updatedProgress);

    if (!finishResult2.pass) {
      throw new Error('Expected Stage 1 Level 2 to be passed');
    }
    if (
      finishResult2.updatedProgress.highest_unlocked_stage !== 2 ||
      finishResult2.updatedProgress.highest_unlocked_level !== 1 ||
      finishResult2.updatedProgress.total_questions !== 20 ||
      finishResult2.updatedProgress.total_correct !== 17
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