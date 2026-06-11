import { pool } from './config/db';
import { UserProfileRepository } from './repositories/UserProfileRepository';
import { PracticeService } from './services/PracticeService';

async function runTests() {
  console.log('--- STARTING PRACTICE ARCHITECTURE INTEGRATION TESTS ---');
  const userRepo = new UserProfileRepository();
  const service = new PracticeService();

  const testUserId = '77777777-8888-bbbb-cccc-dddddddddddd';

  try {
    // 1. Setup - Create test user profile if not exists
    console.log('\n[Prep] Initializing test user profile...');
    await userRepo.createIfNotExists(testUserId);
    console.log('Test user profile ready.');

    // 2. Start Session
    console.log('\n[Test 1] Starting practice session (Stage 2, Level 3)...');
    const sessionId = await service.startSession(testUserId, 2, 3);
    console.log('Created Session ID:', sessionId);
    if (!sessionId) {
      throw new Error('Failed to create practice session');
    }
    console.log('✅ Test 1 Passed: Practice session started successfully');

    // 3. Log attempts
    console.log('\n[Test 2] Logging 3 practice attempts...');
    
    // Attempt 1: Single Note (Correct)
    const attempt1 = await service.logAttempt(testUserId, {
      sessionId,
      stage: 2,
      level: 3,
      questionType: 'SINGLE_NOTE',
      playedData: { note: 'Ga' },
      userAnswer: { note: 'Ga' },
      isCorrect: true,
      responseTimeMs: 800,
    });
    console.log('Logged Attempt 1:', attempt1.is_correct);

    // Attempt 2: Same/Different (Correct)
    const attempt2 = await service.logAttempt(testUserId, {
      sessionId,
      stage: 2,
      level: 3,
      questionType: 'SAME_DIFFERENT',
      playedData: { first: 'Sa', second: 'Sa' },
      userAnswer: { answer: 'same' },
      isCorrect: true,
      responseTimeMs: 1200,
    });
    console.log('Logged Attempt 2:', attempt2.is_correct);

    // Attempt 3: Higher/Lower (Incorrect)
    const attempt3 = await service.logAttempt(testUserId, {
      sessionId,
      stage: 2,
      level: 3,
      questionType: 'HIGHER_LOWER',
      playedData: { first: 'Ga', second: 'Pa' },
      userAnswer: { answer: 'lower' }, // wrong, Ga to Pa is higher
      isCorrect: false,
      responseTimeMs: 1500,
    });
    console.log('Logged Attempt 3:', attempt3.is_correct);

    console.log('✅ Test 2 Passed: 3 attempts logged successfully');

    // 4. Finish Session
    console.log('\n[Test 3] Finishing practice session (Duration: 15000ms)...');
    const sessionResult = await service.finishSession(testUserId, sessionId, 15000);
    console.log('Finished Session details:', sessionResult);

    // Assert accuracy, total questions, correct answers
    if (
      sessionResult.total_questions !== 3 ||
      sessionResult.correct_answers !== 2 ||
      Number(sessionResult.accuracy) !== 66.67 ||
      sessionResult.duration_ms !== 15000 ||
      !sessionResult.completed_at
    ) {
      console.error('❌ Test 3 Failed: Session statistics mismatch', sessionResult);
      process.exit(1);
    }
    console.log('✅ Test 3 Passed: Session completed statistics computed correctly');

    // 5. Query DB directly for verification
    console.log('\n[Test 4] Querying database directly to verify stored details...');
    const sessionQuery = 'SELECT * FROM practice_sessions WHERE id = $1';
    const { rows: sessionRows } = await pool.query(sessionQuery, [sessionId]);
    console.log('Stored Session:', sessionRows[0]);

    const attemptsQuery = 'SELECT * FROM practice_attempts WHERE session_id = $1 ORDER BY created_at ASC';
    const { rows: attemptRows } = await pool.query(attemptsQuery, [sessionId]);
    console.log(`Stored Attempts: ${attemptRows.length}`);

    if (
      sessionRows.length !== 1 ||
      attemptRows.length !== 3 ||
      sessionRows[0].correct_answers !== 2 ||
      Number(sessionRows[0].accuracy) !== 66.67
    ) {
      console.error('❌ Test 4 Failed: Database verification mismatch');
      process.exit(1);
    }

    console.log('✅ Test 4 Passed: Direct database validation successful');

    console.log('\n🎉 ALL PRACTICE CORE TESTS PASSED SUCCESSFULLY! 🎉');
  } catch (error: any) {
    console.error('❌ Test execution encountered an error:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runTests();
