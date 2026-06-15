import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { Music, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';

export const ResetPassword: React.FC = () => {
  const { session, loading: authLoading, updateUserPassword, signOut } = useAuth();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: updateError } = await updateUserPassword(password);
      if (updateError) {
        setError(updateError.message);
      } else {
        setSuccess(true);
        // Sign out to clear the temporary password recovery session
        await signOut();
        // Redirect after a delay
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // If loading, show a loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#05070c] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary-500/20 border-t-primary-500 animate-spin"></div>
          <p className="text-sm font-mono text-gray-400 uppercase tracking-widest animate-pulse">Checking Recovery Link...</p>
        </div>
      </div>
    );
  }

  // If there is no active session and auth finished loading, the reset link is invalid
  const hasNoSession = !session;

  return (
    <div className="min-h-screen flex items-center justify-center relative px-4 py-12 overflow-hidden bg-[#05070c] text-white">
      {/* Background Decorative Blur Blobs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-primary-600 filter blur-3xl opacity-10 animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-accent-rose filter blur-3xl opacity-10 animate-pulse-slow"></div>

      <div className="w-full max-w-md z-10 space-y-8 animate-fade-in-up">
        {/* Header Logo */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="bg-gradient-to-tr from-primary-600 to-accent-amber p-3.5 rounded-2xl shadow-lg shadow-primary-700/20">
            <Music className="w-8 h-8 text-white animate-bounce-slow" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-white via-primary-100 to-accent-amber bg-clip-text text-transparent tracking-wide text-primary-glow">
              Set New Password
            </h1>
            <p className="text-xs text-gray-400 font-mono tracking-widest uppercase mt-1">
              Secure your learning sandbox
            </p>
          </div>
        </div>

        {/* Container */}
        <div className="glass rounded-3xl p-8 border border-white/10 shadow-2xl relative">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex gap-2 items-start animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success ? (
            <div className="space-y-6 text-center py-4">
              <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400">
                <CheckCircle className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">Password Updated</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Your password has been successfully updated. You are being redirected to the Login page to sign in with your new password...
                </p>
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-primary-500/20 border-t-primary-500 animate-spin mx-auto mt-4"></div>
            </div>
          ) : hasNoSession ? (
            <div className="space-y-6 text-center py-4">
              <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-red-950/40 border border-red-500/30 text-red-400">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">Invalid Reset Link</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  The password reset link is invalid, expired, or has already been used. Please request a new recovery link.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  to="/forgot-password"
                  className="w-full inline-flex items-center justify-center py-3 px-4 rounded-xl text-xs font-bold text-white transition-all shadow-md shadow-primary-600/25 bg-primary-600 hover:bg-primary-500 cursor-pointer"
                >
                  Request New Reset Link
                </Link>
              </div>
              <div className="mt-4">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-gray-400 hover:text-white transition-colors underline underline-offset-4 decoration-white/10"
                >
                  Back to login
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <p className="text-xs text-gray-400 leading-relaxed">
                Please choose a strong, secure password that is at least 6 characters long.
              </p>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-xs font-semibold text-gray-300 font-mono uppercase tracking-wider block">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    disabled={loading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-sans text-sm disabled:opacity-50 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-xs font-semibold text-gray-300 font-mono uppercase tracking-wider block">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    disabled={loading}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-sans text-sm disabled:opacity-50 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all shadow-md shadow-primary-600/20 scale-100 hover:scale-[1.02] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed btn-shimmer flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <span>Updating password...</span>
                  </>
                ) : (
                  <span>Update Password</span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
