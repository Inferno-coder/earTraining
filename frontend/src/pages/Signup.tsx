import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { Music, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';

export const Signup: React.FC = () => {
  const { signUp, signInWithGoogle, session } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      const { error: googleError } = await signInWithGoogle();
      if (googleError) {
        setError(googleError.message);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to initialize Google Sign In.');
    } finally {
      setGoogleLoading(false);
    }
  };

  // If already authenticated, redirect to /
  useEffect(() => {
    if (session) {
      navigate('/');
    }
  }, [session, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const { error: signUpError } = await signUp(email, password, { name: fullName });
      if (signUpError) {
        setError(signUpError.message);
      } else {
        setSuccess(true);
        setFullName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred during signup.');
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
              ClearEar Studio
            </h1>
            <p className="text-xs text-gray-400 font-mono tracking-widest uppercase mt-1">
              Create Your Ear Training Account
            </p>
          </div>
        </div>

        {/* Signup Glassmorphic Container */}
        <div className="glass rounded-3xl p-8 border border-white/10 shadow-2xl relative">
          {success ? (
            <div className="space-y-6 text-center py-4">
              <div className="flex justify-center">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">Account Created Successfully!</h3>
                <p className="text-xs text-gray-300 leading-relaxed px-2">
                  A verification email has been sent to your address (if verification is enabled). Please check your inbox and verify your email to log in.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  to="/login"
                  className="w-full inline-flex justify-center py-3 rounded-xl text-xs font-bold bg-primary-600 hover:bg-primary-500 text-white transition-all shadow-md shadow-primary-600/20 cursor-pointer"
                >
                  Go to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex gap-2 items-start animate-fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Google Sign In Button */}
              <button
                type="button"
                disabled={loading || googleLoading}
                onClick={handleGoogleSignIn}
                className="w-full py-3.5 rounded-xl border border-white/10 bg-slate-950/40 hover:bg-slate-950/80 hover:border-white/20 text-white font-bold text-sm transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed scale-100 hover:scale-[1.01]"
              >
                {googleLoading ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                )}
                <span>Continue with Google</span>
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-[1px] bg-white/5"></div>
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">or</span>
                <div className="flex-1 h-[1px] bg-white/5"></div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">

              {/* Full Name Field */}
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-xs font-semibold text-gray-300 font-mono uppercase tracking-wider block">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  required
                  disabled={loading}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Future maestro's name..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-sans text-sm disabled:opacity-50"
                />
              </div>

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

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-xs font-semibold text-gray-300 font-mono uppercase tracking-wider block">
                  Password (min. 6 characters)
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
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  disabled={loading}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
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
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <span>Sign Up</span>
                )}
              </button>
            </form>
          </>
        )}

          {/* Footer Navigation Link */}
          <div className="mt-6 text-center text-xs text-gray-400 font-sans">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-semibold transition-colors underline underline-offset-4 decoration-primary-500/30">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
