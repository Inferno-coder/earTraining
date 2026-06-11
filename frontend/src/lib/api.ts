const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

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

export const startPracticeSession = async (token: string, stage: number, level: number): Promise<string> => {
  const response = await fetch(`${backendUrl}/api/practice/session/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ stage, level }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to start practice session: ${response.statusText}`);
  }

  const data = await response.json();
  return data.sessionId;
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

export const finishPracticeSession = async (token: string, sessionId: string, durationMs: number): Promise<any> => {
  const response = await fetch(`${backendUrl}/api/practice/session/finish`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ sessionId, durationMs }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to finish practice session: ${response.statusText}`);
  }

  return await response.json();
};
