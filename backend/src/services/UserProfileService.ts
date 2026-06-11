import { UserProfileRepository } from '../repositories/UserProfileRepository';

export class UserProfileService {
  private repository: UserProfileRepository;

  constructor() {
    this.repository = new UserProfileRepository();
  }

  /**
   * Initializes a user profile: checks if it exists, creates it if not, and returns status
   */
  async initializeProfile(userId: string): Promise<{ success: boolean; isNew: boolean; profile: any }> {
    if (!userId) {
      throw new Error('User ID is required to initialize a profile');
    }

    // Check if user already has a profile
    const existing = await this.repository.findById(userId);
    if (existing) {
      return {
        success: true,
        isNew: false,
        profile: existing,
      };
    }

    // Otherwise, create it idempotently
    const newProfile = await this.repository.createIfNotExists(userId);
    return {
      success: true,
      isNew: true,
      profile: newProfile,
    };
  }
}
