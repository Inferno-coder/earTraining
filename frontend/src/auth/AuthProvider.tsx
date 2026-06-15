import { createContext, useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Session, AuthResponse, AuthError } from '@supabase/supabase-js';
import { getUserProgress } from '../lib/api';
import type { UserProgress } from '../lib/api';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  progress: UserProgress | null;
  updateProgress: (prog: UserProgress) => void;
  refreshProgress: () => Promise<void>;
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<AuthResponse>;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signInWithGoogle: () => Promise<{ data: any; error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  resetPasswordForEmail: (email: string) => Promise<{ error: AuthError | null }>;
  updateUserPassword: (password: string) => Promise<{ error: AuthError | null }>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const initializedUserIdRef = useRef<string | null>(null);

  const updateProgress = (prog: UserProgress) => {
    setProgress(prog);
  };

  const refreshProgress = async () => {
    if (!session) {
      setProgress(null);
      return;
    }
    try {
      const prog = await getUserProgress(session.access_token);
      setProgress(prog);
    } catch (err) {
      console.error('[AuthProvider] Error refreshing progress:', err);
    }
  };

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        if (session) {
          try {
            const prog = await getUserProgress(session.access_token);
            setProgress(prog);
          } catch (err) {
            console.error('Error fetching initial progress:', err);
          }
        }
      } catch (err) {
        console.error('Error fetching initial session:', err);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);

        const currentUserId = currentSession?.user?.id || null;
        if (!currentSession) {
          initializedUserIdRef.current = null;
          setProgress(null);
        }

        // Auto-initialize local database user profile on session load or login
        if (currentSession && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
          if (initializedUserIdRef.current === currentUserId) {
            return;
          }
          initializedUserIdRef.current = currentUserId;

          const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';
          try {
            console.log('[AuthProvider]: Initializing local database user profile...');
            const response = await fetch(`${backendUrl}/api/users/initialize`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentSession.access_token}`,
              },
            });

            if (!response.ok) {
              const errData = await response.json().catch(() => ({}));
              console.error('[AuthProvider] Failed to sync user profile:', errData.error || response.statusText);
              initializedUserIdRef.current = null; // Reset on failure to allow retry
            } else {
              const resData = await response.json();
              console.log('[AuthProvider] Local user profile synchronized:', resData);
              // Fetch user progress here!
              try {
                const prog = await getUserProgress(currentSession.access_token);
                setProgress(prog);
              } catch (err) {
                console.error('[AuthProvider] Error fetching progress after profile sync:', err);
              }
            }
          } catch (err) {
            console.error('[AuthProvider] Error contacting local backend for profile sync:', err);
            initializedUserIdRef.current = null; // Reset on error to allow retry
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);


  const signUp = async (email: string, password: string, metadata?: Record<string, any>): Promise<AuthResponse> => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
  };

  const signIn = async (email: string, password: string): Promise<AuthResponse> => {
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const signInWithGoogle = async () => {
    return await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        queryParams: {
          prompt: 'select_account',
        },
      },
    });
  };

  const signOut = async (): Promise<{ error: AuthError | null }> => {
    return await supabase.auth.signOut();
  };

  const resetPasswordForEmail = async (email: string): Promise<{ error: AuthError | null }> => {
    const redirectTo = `${window.location.origin}/reset-password`;
    return await supabase.auth.resetPasswordForEmail(email, { redirectTo });
  };

  const updateUserPassword = async (password: string): Promise<{ error: AuthError | null }> => {
    return await supabase.auth.updateUser({ password });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        progress,
        updateProgress,
        refreshProgress,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        resetPasswordForEmail,
        updateUserPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
