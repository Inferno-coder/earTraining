import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { Music, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const { resetPasswordForEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { error: resetError } = await resetPasswordForEmail(email);
      if (resetError) {
        setError(resetError.message);
      } else {
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
              Reset Password
            </h1>
            <p className="text-xs text-gray-400 font-mono tracking-widest uppercase mt-1">
              Recover your sandbox access
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
                <h3 className="text-lg font-bold text-white">Check your email</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  We've sent a password recovery link to <strong className="text-gray-200">{email}</strong>. Please click the link to reset your password.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-primary-400 hover:text-primary-300 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to login
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <p className="text-xs text-gray-400 leading-relaxed">
                Enter the email address associated with your account, and we will email you a link to reset your password.
              </p>

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-xs font-semibold text-gray-300 font-mono uppercase tracking-wider block">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  disabled={loading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-sans text-sm disabled:opacity-50"
                />
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
                    <span>Sending link...</span>
                  </>
                ) : (
                  <span>Send Recovery Link</span>
                )}
              </button>

              {/* Footer */}
              <div className="text-center pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
