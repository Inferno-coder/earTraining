import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import {
  ArrowLeft,
  MessageSquare,
  Check,
  X,
  Clock,
  Sparkles,
  Calendar,
  Mail,
  Shield,
  Loader2,
  AlertCircle
} from 'lucide-react';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  category: string;
  message: string;
  approved: boolean;
  created_at: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { session, user, loading: authLoading } = useAuth();
  
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'other'>('pending');
  const [actioningId, setActioningId] = useState<string | null>(null);

  // Fetch all messages on mount
  useEffect(() => {
    if (authLoading || !user || user.email !== 'pradeepceo18@gmail.com' || !session) return;
    
    const fetchMessages = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';
        const response = await fetch(`${backendUrl}/api/contact/admin/messages`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch contact messages');
        }

        const data = await response.json();
        setMessages(data);
      } catch (err: any) {
        console.error('Error fetching admin messages:', err);
        setError(err.message || 'An error occurred while loading feedback');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [authLoading, user, session]);

  // Handle Approve / Disapprove
  const handleToggleApproval = async (id: string, currentStatus: boolean) => {
    if (!session) return;
    try {
      setActioningId(id);
      
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';
      const response = await fetch(`${backendUrl}/api/contact/admin/messages/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ approved: !currentStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update message status');
      }

      const resData = await response.json();
      const updatedMessage = resData.data;

      // Update local state
      setMessages(prev => prev.map(m => m.id === id ? { ...m, approved: updatedMessage.approved } : m));
    } catch (err: any) {
      alert(`Error updating message status: ${err.message}`);
    } finally {
      setActioningId(null);
    }
  };

  // Guard checks
  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#05070c] text-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
          <p className="text-xs font-mono text-gray-400 uppercase tracking-widest animate-pulse">
            Verifying Admin Credentials...
          </p>
        </div>
      </div>
    );
  }

  // Redirect if not the explicit admin email
  if (!user || user.email !== 'pradeepceo18@gmail.com') {
    return <Navigate to="/" replace />;
  }

  // Filter messages based on active tab
  const pendingMessages = messages.filter(m => !m.approved && m.category === 'ThankYou');
  const approvedMessages = messages.filter(m => m.approved);
  const otherMessages = messages.filter(m => !m.approved && m.category !== 'ThankYou');

  const getActiveList = () => {
    if (activeTab === 'pending') return pendingMessages;
    if (activeTab === 'approved') return approvedMessages;
    return otherMessages;
  };

  const activeList = getActiveList();

  return (
    <div className="min-h-screen bg-[#05070c] text-white flex flex-col font-sans relative overflow-hidden">
      
      {/* Background Decorative Blur Blobs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-primary-600/10 filter blur-3xl opacity-30 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-600/10 filter blur-3xl opacity-30 pointer-events-none" />

      {/* Styled Animations / Utilities */}
      <style>{`
        .glass-panel {
          background: rgba(8, 11, 20, 0.45);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .text-readable {
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
        }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 glass-panel border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center backdrop-blur-md">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 transition-all cursor-pointer group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>

        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 rounded-lg shadow-lg">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-bold bg-gradient-to-r from-white via-primary-100 to-accent-amber bg-clip-text text-transparent tracking-wide font-mono uppercase">
            Admin Control Center
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 md:px-8 py-8 md:py-12 relative z-10 space-y-8">
        
        {/* Page Title */}
        <div className="text-left space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-accent-amber" />
            Feedback Moderation System
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-readable">
            Admin Testimonials Control
          </h1>
          <p className="text-gray-400 text-xs md:text-sm max-w-2xl leading-relaxed">
            Review and moderate feedback from swara learners. Approved comments automatically display in the landing page testimonials.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap gap-2.5 border-b border-white/5 pb-4">
          <button
            onClick={() => setActiveTab('pending')}
            className={`py-2 px-4 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'pending'
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-md shadow-amber-500/5'
                : 'bg-white/5 border-transparent text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Clock className="w-4 h-4" />
            Pending Reviews
            {pendingMessages.length > 0 && (
              <span className="bg-amber-500 text-[#05070c] text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full">
                {pendingMessages.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('approved')}
            className={`py-2 px-4 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'approved'
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-md shadow-emerald-500/5'
                : 'bg-white/5 border-transparent text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Check className="w-4 h-4" />
            Approved Testimonials
            {approvedMessages.length > 0 && (
              <span className="bg-emerald-500 text-[#05070c] text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full">
                {approvedMessages.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('other')}
            className={`py-2 px-4 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'other'
                ? 'bg-blue-500/15 border-blue-500/40 text-blue-300 shadow-md shadow-blue-500/5'
                : 'bg-white/5 border-transparent text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Inquiries & Feedback
            {otherMessages.length > 0 && (
              <span className="bg-blue-500 text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full">
                {otherMessages.length}
              </span>
            )}
          </button>
        </div>

        {/* Content list */}
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center bg-black/20 rounded-3xl border border-white/5">
            <Loader2 className="w-8 h-8 text-primary-500 animate-spin mb-3" />
            <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">Loading messages from server...</p>
          </div>
        ) : error ? (
          <div className="p-8 bg-rose-500/10 border border-rose-500/20 rounded-3xl flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-rose-400 shrink-0" />
            <div className="space-y-1 text-left">
              <h4 className="font-bold text-white">Error Loading Data</h4>
              <p className="text-gray-300 text-xs leading-relaxed">{error}</p>
            </div>
          </div>
        ) : activeList.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center bg-black/20 rounded-3xl border border-white/5 text-center p-6">
            <MessageSquare className="w-10 h-10 text-gray-600 mb-3" />
            <h3 className="font-bold text-white text-sm">No Messages Found</h3>
            <p className="text-gray-500 text-xs mt-1">
              {activeTab === 'pending' && "There are no new pending Thank Notes to review."}
              {activeTab === 'approved' && "No testimonials have been approved for display yet."}
              {activeTab === 'other' && "There are no inquiries or other general feedback notes."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeList.map((msg) => (
              <div
                key={msg.id}
                className="glass-panel rounded-2xl p-6 md:p-8 text-left transition-all relative overflow-hidden group flex flex-col justify-between gap-6 hover:border-white/10"
              >
                <div className="space-y-4">
                  {/* Top line metadata */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/5 text-gray-300">
                        {msg.category}
                      </span>
                      <span className="text-gray-600 font-mono text-xs">•</span>
                      <div className="flex items-center gap-1 text-[10px] text-gray-500 font-mono">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(msg.created_at).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      {msg.approved ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-bold font-mono text-[9px] uppercase tracking-wider">
                          <Check className="w-3 h-3" /> Approved & Public
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 font-bold font-mono text-[9px] uppercase tracking-wider">
                          <Clock className="w-3 h-3" /> Pending Approval
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <p className="text-gray-100 text-sm md:text-base leading-relaxed italic font-serif">
                    "{msg.message}"
                  </p>
                </div>

                {/* Footer section (Sadhak info and buttons) */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pt-4 border-t border-white/5">
                  {/* Sadhak Info */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 p-[1.5px]">
                      <div className="w-full h-full rounded-lg bg-slate-950 flex items-center justify-center font-bold text-white uppercase text-xs">
                        {msg.name[0]}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-white">{msg.name}</h4>
                        <span className="text-gray-500 text-xs">•</span>
                        <a href={`mailto:${msg.email}`} className="text-xs text-primary-400 hover:underline flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {msg.email}
                        </a>
                      </div>
                      <span className="block text-[10px] font-mono text-gray-500">Sender</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {msg.approved ? (
                      <button
                        onClick={() => handleToggleApproval(msg.id, msg.approved)}
                        disabled={actioningId === msg.id}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 hover:text-rose-200 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {actioningId === msg.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <X className="w-3.5 h-3.5" />
                        )}
                        Remove from Testimonials
                      </button>
                    ) : (
                      <button
                        onClick={() => handleToggleApproval(msg.id, msg.approved)}
                        disabled={actioningId === msg.id}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-[#05070c] transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {actioningId === msg.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#05070c]" />
                        ) : (
                          <Check className="w-3.5 h-3.5" />
                        )}
                        Approve to Testimonials
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-[10px] text-gray-600 border-t border-white/5 relative z-10">
        <p>© 2026 ClearEar Studio • Built for classical swara moderation & administration.</p>
      </footer>
    </div>
  );
}
