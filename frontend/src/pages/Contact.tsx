import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import {
  ArrowLeft,
  Mail,
  Copy,
  Check,
  Send,
  Music,
  Code,
  Heart,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import violinBg from '../assets/violin_bg.jpg';

const Linkedin = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

interface FormState {
  name: string;
  email: string;
  category: string;
  message: string;
}

const MUSICAL_QUOTES = [
  { text: "Where words fail, music speaks.", author: "Hans Christian Andersen" },
  { text: "Music in the soul can be heard by the universe.", author: "Lao Tzu" },
  { text: "The swaras are not just notes; they are pure frequencies of emotions.", author: "Carnatic Wisdom" },
  { text: "Music is the shorthand of emotion.", author: "Leo Tolstoy" }
];

export default function Contact() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    category: 'Feedback',
    message: ''
  });

  const [copied, setCopied] = useState(false);
  const [sendingStep, setSendingStep] = useState<'idle' | 'folding' | 'flying' | 'success'>('idle');
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [fadeQuote, setFadeQuote] = useState(true);
  const [highlightEditor, setHighlightEditor] = useState(false);

  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  // Visualizer heights
  const [visualizerHeights, setVisualizerHeights] = useState<number[]>(Array(20).fill(15));
  const visualizerInterval = useRef<any>(null);

  // Initialize passive visualizer
  useEffect(() => {
    visualizerInterval.current = setInterval(() => {
      setVisualizerHeights(prev =>
        prev.map(() => Math.floor(Math.random() * 35) + 10)
      );
    }, 150);

    return () => {
      if (visualizerInterval.current) clearInterval(visualizerInterval.current);
    };
  }, []);

  // Cycle quotes
  useEffect(() => {
    const interval = setInterval(() => {
      setFadeQuote(false);
      setTimeout(() => {
        setQuoteIndex((prev) => (prev + 1) % MUSICAL_QUOTES.length);
        setFadeQuote(true);
      }, 500);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Prefill name and email if user is logged in
  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'Anonymous User',
        email: user.email || ''
      }));
    }
  }, [user]);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('pradeepceo18@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    // Focus and scroll message textarea
    if (messageInputRef.current) {
      messageInputRef.current.focus();
      messageInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Highlight the textarea container briefly
    setHighlightEditor(true);
    setTimeout(() => setHighlightEditor(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    setSendingStep('folding');

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';
      const response = await fetch(`${backendUrl}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error('Failed to send message via API');
      }

      setTimeout(() => {
        setSendingStep('flying');
      }, 1200);

      setTimeout(() => {
        setSendingStep('success');
      }, 2400);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      alert('Failed to send the message. Please try again later or email pradeepceo18@gmail.com directly.');
      setSendingStep('idle');
    }
  };

  const notesList = [
    { left: '6%', symbol: '♩', delay: '-2s', duration: '20s', size: '18px' },
    { left: '15%', symbol: '♪', delay: '-10s', duration: '16s', size: '22px' },
    { left: '26%', symbol: '♫', delay: '-5s', duration: '24s', size: '16px' },
    { left: '35%', symbol: '♬', delay: '-14s', duration: '18s', size: '20px' },
    { left: '44%', symbol: '♭', delay: '-1s', duration: '26s', size: '14px' },
    { left: '58%', symbol: '♯', delay: '-18s', duration: '22s', size: '24px' },
    { left: '65%', symbol: '𝄞', delay: '-8s', duration: '21s', size: '28px' },
    { left: '74%', symbol: '♩', delay: '-20s', duration: '17s', size: '18px' },
    { left: '83%', symbol: '♪', delay: '-12s', duration: '25s', size: '20px' },
    { left: '92%', symbol: '♫', delay: '-16s', duration: '23s', size: '22px' }
  ];

  return (
    <div className="min-h-screen bg-[#05070c] text-white relative overflow-hidden flex flex-col font-sans selection:bg-primary-500 selection:text-white">

      {/* Background Violin Image - Shifted right & opacity boosted to 80% to be highly visible */}
      <div
        className="absolute inset-0 bg-no-repeat opacity-80 pointer-events-none transition-transform duration-1000 scale-[1.01]"
        style={{
          backgroundImage: `url(${violinBg})`,
          backgroundPosition: '68% center',
          backgroundSize: 'cover'
        }}
      />
      {/* Refined gradient overlays to keep details highly visible while keeping text legible */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#05070c] via-[#05070c]/30 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-radial-gradient(circle at center, transparent 35%, rgba(5, 7, 12, 0.45) 90%) pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#05070c]/70 via-transparent to-[#05070c]/60 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-gradient(circle at top right, rgba(139,92,246,0.3) 0%, transparent 60%) pointer-events-none" />
      <div className="absolute inset-0 bg-radial-gradient(circle at bottom left, rgba(244,63,94,0.2) 0%, transparent 60%) pointer-events-none" />

      {/* Styled Animations for Premium Visuals */}
      <style>{`
        @keyframes float-music-note {
          0% {
            transform: translateY(105vh) rotate(0deg) translateX(0);
            opacity: 0;
          }
          15% {
            opacity: 0.45;
          }
          85% {
            opacity: 0.45;
          }
          100% {
            transform: translateY(-10vh) rotate(360deg) translateX(80px);
            opacity: 0;
          }
        }
        .bg-float-note {
          animation: float-music-note linear infinite;
        }

        /* Highly translucent glass for max background visibility */
        .glass-contact {
          background: rgba(8, 11, 20, 0.22);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .glass-contact:hover {
          background: rgba(8, 11, 20, 0.32);
          border-color: rgba(139, 92, 246, 0.4);
          box-shadow: 0 0 30px rgba(139, 92, 246, 0.15);
        }

        /* Text shadow for absolute readability on lighter backgrounds */
        .text-readable {
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.95), 0 1px 1px rgba(0, 0, 0, 0.9);
        }

        .form-focus-glow:focus-within {
          box-shadow: 0 0 25px rgba(139, 92, 246, 0.3);
          border-color: rgba(139, 92, 246, 0.6);
        }

        /* Letter folding animation */
        .folding-letter-container {
          transition: all 1s cubic-bezier(0.76, 0, 0.24, 1);
        }

        @keyframes float-ambient {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-8px) scale(1.01); }
        }
        .animate-float-ambient {
          animation: float-ambient 5s ease-in-out infinite;
        }

        /* Direct Coordinates Animated Glow Cards */
        .glow-card {
          position: relative;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .glow-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          transition: 0.6s ease;
        }
        .glow-card:hover::before {
          left: 100%;
        }
        .glow-card-email:hover {
          border-color: rgba(244, 63, 94, 0.4);
          box-shadow: 0 0 20px rgba(244, 63, 94, 0.15);
          transform: translateY(-2px);
          background: rgba(244, 63, 94, 0.06);
        }
        .glow-card-linkedin:hover {
          border-color: rgba(59, 130, 246, 0.4);
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.15);
          transform: translateY(-2px);
          background: rgba(59, 130, 246, 0.06);
        }
      `}</style>

      {/* Floating Note Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {notesList.map((note, idx) => (
          <span
            key={idx}
            className="absolute bg-float-note text-primary-400/35 font-mono select-none"
            style={{
              left: note.left,
              fontSize: note.size,
              animationDelay: note.delay,
              animationDuration: note.duration,
              bottom: '-50px'
            }}
          >
            {note.symbol}
          </span>
        ))}
      </div>

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center backdrop-blur-md">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 transition-all cursor-pointer group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>

        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-tr from-primary-600 to-accent-amber p-2 rounded-lg shadow-lg">
            <Music className="w-4 h-4 text-white animate-spin-slow" />
          </div>
          <span className="hidden sm:inline text-sm font-bold bg-gradient-to-r from-white via-primary-100 to-accent-amber bg-clip-text text-transparent tracking-wide font-mono uppercase">
            ClearEar Studio
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 md:px-8 py-8 md:py-12 relative z-10 flex flex-col justify-center gap-10">

        {/* Page Title Header */}
        <div className="text-center space-y-3 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-accent-amber" />
            Interactive Contact
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-readable">
            Connect & Harmonize
          </h1>
          <p className="text-gray-200 text-xs md:text-sm max-w-xl mx-auto leading-relaxed text-readable">
            Have questions about Swara intervals, features suggestion for the lab, or just want to send a friendly hello? Drop me a note!
          </p>
        </div>

        {/* Form and Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

          {/* LEFT COLUMN: Profile card */}
          <div className="lg:col-span-5 flex flex-col gap-6 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>

            {/* Pradeep Profile Card - Stretches dynamically to match form height */}
            <div className="glass-contact rounded-3xl p-6 md:p-8 flex-1 flex flex-col justify-between relative overflow-hidden group animate-float-ambient">
              {/* Card Corner Ambient Light */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary-500/20 to-transparent blur-2xl" />

              <div className="space-y-5">
                {/* Header Profile Section */}
                <div className="flex items-center gap-4">
                  {/* Glowing Portrait Ring with double pulsing effect */}
                  <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary-500 to-accent-amber p-[2px] shadow-lg shadow-primary-500/10 group-hover:scale-105 transition-transform duration-300">
                    <span className="absolute inset-0 rounded-2xl bg-primary-500/20 animate-ping opacity-60" />
                    <span className="absolute inset-0 rounded-2xl bg-accent-amber/20 animate-ping opacity-30" style={{ animationDelay: '0.5s' }} />
                    <img
                      src={violinBg}
                      alt="Violin"
                      className="w-full h-full rounded-2xl object-cover relative z-10 border border-white/5"
                    />
                  </div>

                  <div className="space-y-0.5">
                    <h3 className="text-2xl font-bold text-white text-gold-glow flex items-center gap-1.5">
                      Pradeep
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-500/15 border border-primary-500/25 text-primary-300 text-[10px] font-bold font-mono">
                        <Code className="w-3 h-3 text-primary-400" />
                        Software Engineer
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-accent-rose/15 border border-accent-rose/25 text-accent-rose text-[10px] font-bold font-mono">
                        <Heart className="w-3 h-3 text-accent-rose" />
                        Music Lover
                      </span>
                    </div>
                  </div>
                </div>

                {/* About Bio */}
                <p className="text-gray-100 text-xs md:text-sm leading-relaxed text-readable">
                  Hey! I'm a software engineer who lives at the intersection of logical code and classical soundwaves. ClearEar Studio is to help musicians and music enthusiasts master the beautiful, microtonal complexity of Carnatic Swaras.
                </p>

                {/* Quotes Carousel */}
                <div className="bg-black/55 border border-white/10 rounded-2xl p-4 relative min-h-[90px] flex flex-col justify-center">
                  <div className="absolute top-1 left-2 text-primary-500/30 font-serif text-3xl select-none">“</div>
                  <div className={`space-y-1 text-center transition-all duration-500 ${fadeQuote ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
                    <p className="text-xs text-gray-200 italic font-serif leading-relaxed px-4 text-readable">
                      {MUSICAL_QUOTES[quoteIndex].text}
                    </p>
                    <p className="text-[9px] text-accent-amber font-mono font-bold tracking-wide">
                      — {MUSICAL_QUOTES[quoteIndex].author}
                    </p>
                  </div>
                </div>

                {/* Direct Coordinates */}
                <div className="space-y-3 pt-4 border-t border-white/5">
                  <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block font-bold text-readable">
                    Direct Connect
                  </p>
                  <div className="flex flex-col gap-3">
                    {/* Gmail Card */}
                    <button
                      onClick={handleCopyEmail}
                      type="button"
                      className="glow-card glow-card-email flex items-center justify-between gap-3 p-3 md:p-3.5 rounded-2xl text-left cursor-pointer group/email w-full transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-accent-rose/10 text-accent-rose border border-accent-rose/20 group-hover/email:scale-110 transition-transform">
                          <Mail className="w-4 h-4" />
                        </div>
                        <div className="overflow-hidden">
                          <span className="block text-[9px] font-mono uppercase tracking-wider text-gray-400 font-bold">Email</span>
                          <span className="block text-xs font-semibold text-gray-200 group-hover/email:text-white transition-colors">pradeepceo18@gmail.com</span>
                        </div>
                      </div>
                      <div className="text-gray-400 group-hover/email:text-white transition-colors p-1.5 rounded-lg group-hover/email:bg-white/5 flex-shrink-0">
                        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </div>
                    </button>

                    {/* LinkedIn Card */}
                    <a
                      href="https://www.linkedin.com/in/pradeepceo18/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glow-card glow-card-linkedin flex items-center gap-3 p-3 md:p-3.5 rounded-2xl text-left cursor-pointer group/li transition-all no-underline"
                    >
                      <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover/li:scale-110 transition-transform">
                        <Linkedin className="w-4 h-4" />
                      </div>
                      <div className="overflow-hidden">
                        <span className="block text-[9px] font-mono uppercase tracking-wider text-gray-400 font-bold">LinkedIn</span>
                        <span className="block text-xs font-semibold text-gray-200 group-hover/li:text-white transition-colors">pradeepceo18</span>
                      </div>
                    </a>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* RIGHT COLUMN: The Interactive Contact Form */}
          <div className="lg:col-span-7 flex flex-col animate-fade-in-up" style={{ animationDelay: '0.3s' }}>

            <div className="glass-contact rounded-3xl p-6 md:p-8 flex-1 flex flex-col relative overflow-hidden group">

              {/* Form header and visualizer */}
              <div className="mb-5 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary-400" />
                  <h3 className="text-xl font-bold text-readable">Write a Note</h3>
                </div>

                <div className="flex items-end gap-[2px] h-6 px-3 py-1 bg-black/60 rounded-full border border-white/10 pointer-events-none self-start sm:self-auto">
                  {visualizerHeights.map((h, idx) => (
                    <div
                      key={idx}
                      className={`w-[2px] rounded-t transition-all duration-150 ${idx % 3 === 0 ? 'bg-primary-500' : idx % 3 === 1 ? 'bg-accent-amber' : 'bg-accent-rose'
                        }`}
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>

              {/* Envelope flight animation */}
              {sendingStep !== 'idle' && sendingStep !== 'success' && (
                <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md z-40 flex flex-col items-center justify-center p-6 animate-fade-in">
                  <div className="relative w-48 h-32 flex items-center justify-center">
                    {/* The Envelope */}
                    <div className={`absolute border border-white/10 rounded-lg bg-slate-900 flex flex-col justify-end p-4 transition-all duration-700 ${sendingStep === 'folding'
                      ? 'w-36 h-24 opacity-100 rotate-0 translate-y-0 scale-100'
                      : 'w-24 h-16 opacity-0 rotate-12 -translate-y-16 scale-50'
                      }`}>
                      <div className="absolute top-0 inset-x-0 h-1/2 bg-slate-800 border-b border-white/10 origin-top transition-transform duration-500" style={{ transform: sendingStep === 'folding' ? 'rotateX(180deg)' : 'rotateX(0deg)' }} />
                      <div className="text-[8px] font-mono text-center text-gray-500 mt-2">ClearEar Notes</div>
                    </div>

                    {/* The Paper Airplane */}
                    <div
                      className={`absolute text-primary-400 flex flex-col items-center justify-center transition-all ${sendingStep === 'folding'
                        ? 'opacity-0 scale-50 rotate-0 translate-y-12'
                        : 'opacity-100 scale-100 rotate-[35deg] translate-x-[200px] -translate-y-[200px]'
                        }`}
                      style={{
                        transitionDuration: '1200ms',
                        transitionTimingFunction: 'cubic-bezier(0.25, 1, 0.5, 1)'
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-14 h-14 text-accent-amber animate-pulse">
                        <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                      </svg>
                      <span className="text-[9px] font-mono text-accent-rose mt-1 tracking-widest font-bold uppercase animate-bounce">
                        FLYING NOTE!
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-center mt-6 z-10">
                    <p className="text-sm font-bold text-white font-mono uppercase tracking-widest animate-pulse">
                      {sendingStep === 'folding' ? 'SEALING LETTER...' : 'SENDING NOTE VIA AIRPLANE...'}
                    </p>
                    <p className="text-xs text-gray-400">
                      Linking message into system mail parameters.
                    </p>
                  </div>
                </div>
              )}

              {/* Form fields */}
              <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  {/* Row 1: Name and Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1 text-left">
                      <label htmlFor="form-name" className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block font-bold text-readable">Your Name</label>
                      <div className="bg-black/45 rounded-xl border border-white/10 form-focus-glow transition-all">
                        <input
                          type="text"
                          id="form-name"
                          required
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="e.g. Swara Student"
                          className="w-full bg-transparent px-4 py-3 text-xs text-white placeholder-gray-500 outline-none border-none font-semibold"
                        />
                      </div>
                    </div>

                    <div className="space-y-1 text-left">
                      <label htmlFor="form-email" className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block font-bold text-readable">Your Email</label>
                      <div className="bg-black/45 rounded-xl border border-white/10 form-focus-glow transition-all">
                        <input
                          type="email"
                          id="form-email"
                          required
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="name@example.com"
                          className="w-full bg-transparent px-4 py-3 text-xs text-white placeholder-gray-500 outline-none border-none font-semibold"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Note Category Selector */}
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block font-bold text-readable">Note Type</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { value: 'Feedback', label: 'App Feedback 🎵' },
                        { value: 'ThankYou', label: 'Thank Note ✨' },
                        { value: 'Inquiry', label: 'Inquiry 💡' },
                      ].map((cat) => (
                        <button
                          key={cat.value}
                          type="button"
                          onClick={() => setForm({ ...form, category: cat.value })}
                          className={`py-2 px-3 rounded-xl border text-center text-xs font-semibold transition-all cursor-pointer ${form.category === cat.value
                            ? 'bg-primary-600/35 border-primary-500 text-white shadow-md shadow-primary-600/10'
                            : 'bg-black/40 border-white/10 text-gray-300 hover:text-white hover:bg-white/10'
                            }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category Helper Info Tip */}
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 font-semibold flex items-start gap-2 animate-fade-in text-left">
                    <span className="shrink-0 text-xs">💡</span>
                    <span>
                      Submit your feedback to be featured in the **Musician Testimonials** section on the home page once approved by the admin!
                    </span>
                  </div>

                  {/* Row 3: Message Text Area */}
                  <div className="space-y-1 text-left">
                    <label htmlFor="form-message" className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block font-bold text-readable">Your Message</label>
                    <div className={`bg-black/45 rounded-xl border transition-all duration-500 ${highlightEditor
                      ? 'border-primary-500 ring-4 ring-primary-500/30 scale-[1.01] shadow-2xl shadow-primary-500/25 bg-primary-950/20'
                      : 'border-white/10 form-focus-glow'
                      }`}>
                      <textarea
                        id="form-message"
                        ref={messageInputRef}
                        required
                        rows={7}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder="Write a sweet note or critical feedback... I read everything!"
                        className="w-full bg-transparent px-4 py-3 text-xs text-white placeholder-gray-500 outline-none border-none resize-none font-semibold"
                      />
                    </div>
                  </div>
                </div>

                {/* Submission Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs font-extrabold text-white transition-all scale-100 hover:scale-[1.01] active:scale-[0.99] cursor-pointer btn-shimmer btn-glow"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Send Note
                  </button>
                </div>
              </form>

            </div>
          </div>

        </div>

      </main>

      {/* Success Modal Overlay */}
      {sendingStep === 'success' && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 cursor-pointer"
            onClick={() => setSendingStep('idle')}
          />

          <div className="bg-slate-900/95 border border-white/10 rounded-3xl w-full max-w-md p-8 text-center relative shadow-2xl z-10 animate-scale-up space-y-5">

            {/* Animated Ring Checkmark */}
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 success-checkmark-glow animate-pulse">
              <Check className="w-8 h-8 animate-bounce" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white">Message Sent!</h3>
              <p className="text-gray-300 text-xs leading-relaxed px-2">
                Awesome, <span className="text-accent-amber font-bold">{form.name}</span>! Your note has been delivered successfully. I will read it and get back to you at <span className="text-primary-300 font-semibold font-mono">{form.email}</span>.
              </p>
            </div>

            <div className="bg-slate-950/40 rounded-2xl p-3.5 text-xs text-gray-400 leading-normal text-left font-mono border border-white/5">
              <span className="text-accent-amber font-bold block mb-1">WHAT JUST HAPPENED?</span>
              Your message was sent directly through the secure API and recorded in our database. No email application or configuration was required!
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <button
                onClick={() => {
                  setSendingStep('idle');
                  setForm({ name: '', email: '', category: 'Feedback', message: '' });
                }}
                className="w-full py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold transition-all cursor-pointer"
              >
                Done & Clear Form
              </button>

              <button
                onClick={() => navigate('/')}
                className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
              >
                Back to Home
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Tiny clean footer */}
      <footer className="py-5 text-center text-[10px] text-gray-600 border-t border-white/5 relative z-10">
        <p>© 2026 ClearEar Studio • Built with passion for classical pitch & ear development.</p>
      </footer>
    </div>
  );
}
