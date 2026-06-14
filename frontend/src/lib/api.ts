const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

export interface UserProgress {
  user_id: string;
  current_stage: number;
  current_level: number;
  highest_unlocked_stage: number;
  highest_unlocked_level: number;
  total_xp: number;
  total_questions: number;
  total_correct: number;
  reconstruction_states?: Record<string, { unlocked_length: number; length_xp: number }>;
  created_at?: string;
  updated_at?: string;
}

export interface CompleteLevelPayload {
  stage: number;
  level: number;
  totalQuestions: number;
  correctAnswers: number;
  isCompletedSuccessfully?: boolean;
}

export interface CompleteLevelResponse {
  pass: boolean;
  updatedProgress: UserProgress;
}

export interface LogAttemptPayload {
  sessionId: string;
  stage: number;
  level: number;
  questionType: string;
  playedData: any;
  userAnswer: any;
  isCorrect: boolean;
  responseTimeMs: number | null;
}

export const completePracticeLevel = async (
  token: string,
  payload: CompleteLevelPayload
): Promise<CompleteLevelResponse> => {
  const response = await fetch(`${backendUrl}/api/practice/level/complete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to complete practice level: ${response.statusText}`);
  }

  return await response.json();
};

export const logPracticeAttempt = async (token: string, payload: LogAttemptPayload): Promise<any> => {
  const response = await fetch(`${backendUrl}/api/practice/attempt`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to log practice attempt: ${response.statusText}`);
  }

  return await response.json();
};

export const getUserProgress = async (token: string): Promise<UserProgress> => {
  const response = await fetch(`${backendUrl}/api/user/progress`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to fetch user progress: ${response.statusText}`);
  }

  return await response.json();
};

export const saveReconstructionProgress = async (
  token: string,
  stage: number,
  level: number,
  unlockedLength: number,
  lengthXP: number
): Promise<UserProgress> => {
  const response = await fetch(`${backendUrl}/api/user/reconstruction-progress`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ stage, level, unlockedLength, lengthXP }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to save reconstruction progress: ${response.statusText}`);
  }

  return await response.json();
};

