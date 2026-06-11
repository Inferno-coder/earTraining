import { pool } from './config/db';
import { UserProfileService } from './services/UserProfileService';

async function runTests() {
  console.log('--- STARTING INITIALIZE FLOW INTEGRATION TESTS ---');
  const service = new UserProfileService();
  const testUserId = '88888888-9999-aaaa-bbbb-cccccccccccc';

  try {
    // 1. Reset database state for test user
    console.log('\n[Prep] Cleaning database row for test user...');
    await pool.query('DELETE FROM user_profiles WHERE id = $1', [testUserId]);
    console.log('Database prepped.');

    // 2. Test First-time creation
    console.log('\n[Test 1] Initializing user profile for the first time...');
    const res1 = await service.initializeProfile(testUserId);
    console.log('Response:', res1);

    if (!res1.success || !res1.isNew || res1.profile.id !== testUserId) {
      console.error('❌ Test 1 Failed: Expected successful creation of profile');
      process.exit(1);
    }
    console.log('✅ Test 1 Passed: First login created user profile successfully');

    // 3. Test Idempotency (Duplicate Initialization)
    console.log('\n[Test 2] Re-initializing the same user profile (idempotency check)...');
    const res2 = await service.initializeProfile(testUserId);
    console.log('Response:', res2);

    if (!res2.success || res2.isNew || res2.profile.id !== testUserId) {
      console.error('❌ Test 2 Failed: Expected idempotency to handle existing user cleanly');
      process.exit(1);
    }
    console.log('✅ Test 2 Passed: Second initialization detected existing profile and did not duplicate');

    // 4. Verify Database Row
    console.log('\n[Test 3] Verifying database records directly...');
    const { rows } = await pool.query('SELECT * FROM user_profiles WHERE id = $1', [testUserId]);
    console.log('Database Row:', rows[0]);

    if (rows.length !== 1 || rows[0].id !== testUserId) {
      console.error('❌ Test 3 Failed: Database row mismatch');
      process.exit(1);
    }
    console.log('✅ Test 3 Passed: Row correctly saved in database');

    console.log('\n🎉 ALL INITIALIZATION TESTS PASSED SUCCESSFULLY! 🎉');
  } catch (error: any) {
    console.error('❌ Test execution encountered an error:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runTests();
