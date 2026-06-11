import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/useAuth';
import { supabase } from '../lib/supabase';
import { X, User, ShieldAlert, CheckCircle2, Lock } from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const isGoogleUser = user?.app_metadata?.provider === 'google';
  
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Initialize form with current user metadata
  useEffect(() => {
    if (user?.user_metadata?.name) {
      setName(user.user_metadata.name);
    }
  }, [user]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const updates: any = {};
    let hasChanges = false;

    // Check if name has changed
    if (name.trim() !== (user?.user_metadata?.name || '')) {
      updates.data = { name: name.trim() };
      hasChanges = true;
    }

    // Check if password has been filled (only for non-Google users)
    if (password && !isGoogleUser) {
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      updates.password = password;
      hasChanges = true;
    }

    if (!hasChanges) {
      setError('No changes detected to update.');
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser(updates);
      
      if (updateError) {
        setError(updateError.message);
      } else {
        setSuccess('Profile updated successfully!');
        setPassword('');
        setConfirmPassword('');
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      {/* Backdrop overlay trigger click close */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-md overflow-hidden relative shadow-2xl z-10 animate-fade-in-up">
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-primary-400" />
              Edit Profile
            </h3>
            <p className="text-gray-400 text-xs mt-1">
              Update your account credentials and personal name.
            </p>
          </div>
          <button
            onClick={onClose}
            className="bg-white/5 hover:bg-white/10 border border-white/10 p-2 rounded-xl text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex gap-2 items-start animate-fade-in">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-4 rounded-xl bg-green-950/40 border border-green-500/30 text-green-300 text-xs flex gap-2 items-start animate-fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {/* Full Name Input */}
          <div className="space-y-2">
            <label htmlFor="modalFullName" className="text-xs font-semibold text-gray-300 font-mono uppercase tracking-wider block">
              Full Name
            </label>
            <input
              id="modalFullName"
              type="text"
              required
              disabled={loading}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Thyagaraja"
              className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-sans text-sm disabled:opacity-50"
            />
          </div>

          {!isGoogleUser && (
            <div className="pt-2 border-t border-white/5 space-y-4">
              <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-gray-400">
                <Lock className="w-3.5 h-3.5 text-indigo-400" />
                Change Password (Optional)
              </div>

              {/* New Password Input */}
              <div className="space-y-2">
                <label htmlFor="modalPassword" className="text-xs font-semibold text-gray-300 font-mono uppercase tracking-wider block">
                  New Password
                </label>
                <input
                  id="modalPassword"
                  type="password"
                  disabled={loading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-sans text-sm disabled:opacity-50"
                />
              </div>

              {/* Confirm New Password Input */}
              <div className="space-y-2">
                <label htmlFor="modalConfirmPassword" className="text-xs font-semibold text-gray-300 font-mono uppercase tracking-wider block">
                  Confirm New Password
                </label>
                <input
                  id="modalConfirmPassword"
                  type="password"
                  disabled={loading}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-sans text-sm disabled:opacity-50"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t border-white/5 flex items-center justify-end gap-3">
            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-bold border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-md shadow-primary-600/20 scale-100 hover:scale-[1.02] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed btn-shimmer flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
