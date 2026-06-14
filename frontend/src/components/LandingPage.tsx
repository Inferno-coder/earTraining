import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Music,
  ArrowRight,
  ChevronRight,
  Shield,
  Sliders,
  Zap,
  BookOpen,
  X,
  Award,
  Sparkles,
  User,
  LogOut
} from 'lucide-react';
import CustomPracticeModal from './CustomPracticeModal';
import EditProfileModal from './EditProfileModal';
import { useAuth } from '../auth/useAuth';


type RagaName = 'Mayamalavagowla' | 'Shankarabharanam' | 'Kharaharapriya' | 'Kalyani';

interface SwaraMock {
  name: string;
  fullName: string;
  semitones: number;
}

const RAGA_PREVIEWS: Record<RagaName, { scale: string; desc: string; swaras: SwaraMock[] }> = {
  'Mayamalavagowla': {
    scale: 'S R1 G3 M1 P D1 N3 S\'',
    desc: 'The traditional scale for beginners, characterized by its symmetric, emotive, and close-interval semitones.',
    swaras: [
      { name: 'Sa', fullName: 'Shadjam', semitones: 0 },
      { name: 'Ri', fullName: 'Shuddha Rishabham', semitones: 1 },
      { name: 'Ga', fullName: 'Antara Gandharam', semitones: 4 },
      { name: 'Ma', fullName: 'Shuddha Madhyamam', semitones: 5 },
      { name: 'Pa', fullName: 'Panchamam', semitones: 7 },
      { name: 'Dha', fullName: 'Shuddha Dhaivatam', semitones: 8 },
      { name: 'Ni', fullName: 'Kakali Nishadam', semitones: 11 },
      { name: 'Sa\'', fullName: 'Shadjam (Tarastayi)', semitones: 12 },
    ]
  },
  'Shankarabharanam': {
    scale: 'S R2 G3 M1 P D2 N3 S\'',
    desc: 'Equivalent to the Western Major scale. Bright, majestic, and fundamental to classical melody composition.',
    swaras: [
      { name: 'Sa', fullName: 'Shadjam', semitones: 0 },
      { name: 'Ri', fullName: 'Chatushruti Rishabham', semitones: 2 },
      { name: 'Ga', fullName: 'Antara Gandharam', semitones: 4 },
      { name: 'Ma', fullName: 'Shuddha Madhyamam', semitones: 5 },
      { name: 'Pa', fullName: 'Panchamam', semitones: 7 },
      { name: 'Dha', fullName: 'Chatushruti Dhaivatam', semitones: 9 },
      { name: 'Ni', fullName: 'Kakali Nishadam', semitones: 11 },
      { name: 'Sa\'', fullName: 'Shadjam (Tarastayi)', semitones: 12 },
    ]
  },
  'Kharaharapriya': {
    scale: 'S R2 G2 M1 P D2 N2 S\'',
    desc: 'A symmetric scale matching the Dorian mode. Expresses deep, meditative, and classical devotion.',
    swaras: [
      { name: 'Sa', fullName: 'Shadjam', semitones: 0 },
      { name: 'Ri', fullName: 'Chatushruti Rishabham', semitones: 2 },
      { name: 'Ga', fullName: 'Sadharana Gandharam', semitones: 3 },
      { name: 'Ma', fullName: 'Shuddha Madhyamam', semitones: 5 },
      { name: 'Pa', fullName: 'Panchamam', semitones: 7 },
      { name: 'Dha', fullName: 'Chatushruti Dhaivatam', semitones: 9 },
      { name: 'Ni', fullName: 'Kaisiki Nishadam', semitones: 10 },
      { name: 'Sa\'', fullName: 'Shadjam (Tarastayi)', semitones: 12 },
    ]
  },
  'Kalyani': {
    scale: 'S R2 G3 M2 P D2 N3 S\'',
    desc: 'Features the sharp Madhyamam (M2), creating a bright, expansive Lydian atmosphere filled with light.',
    swaras: [
      { name: 'Sa', fullName: 'Shadjam', semitones: 0 },
      { name: 'Ri', fullName: 'Chatushruti Rishabham', semitones: 2 },
      { name: 'Ga', fullName: 'Antara Gandharam', semitones: 4 },
      { name: 'Ma', fullName: 'Prati Madhyamam', semitones: 6 },
      { name: 'Pa', fullName: 'Panchamam', semitones: 7 },
      { name: 'Dha', fullName: 'Chatushruti Dhaivatam', semitones: 9 },
      { name: 'Ni', fullName: 'Kakali Nishadam', semitones: 11 },
      { name: 'Sa\'', fullName: 'Shadjam (Tarastayi)', semitones: 12 },
    ]
  }
};

interface LandingPageProps {
  onLaunch: () => void;
}

export default function LandingPage({ onLaunch }: LandingPageProps) {
  const { signOut, session, user } = useAuth();
  const navigate = useNavigate();
  const [selectedRaga, setSelectedRaga] = useState<RagaName>('Mayamalavagowla');
  const [showCurriculumModal, setShowCurriculumModal] = useState(false);
  const [showCustomPracticeModal, setShowCustomPracticeModal] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  // Close dropdown on click outside
  useEffect(() => {
    if (!showProfileDropdown) return;
    const handleOutsideClick = () => {
      setShowProfileDropdown(false);
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [showProfileDropdown]);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowProfileDropdown(prev => !prev);
  };

  const handleLaunchAcademy = () => {
    if (!session) {
      navigate('/login');
    } else {
      onLaunch();
    }
  };

  const handleCustomPractice = () => {
    if (!session) {
      navigate('/login');
    } else {
      setShowCustomPracticeModal(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-primary-500 selection:text-white">

      {/* Background Decorative Blur Blobs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-primary-600 filter blur-3xl opacity-10 animate-pulse-slow"></div>
      <div className="absolute top-2/3 right-1/4 w-96 h-96 rounded-full bg-accent-rose filter blur-3xl opacity-10 animate-pulse-slow"></div>

      {/* Header Navigation */}
      <header className="sticky top-0 z-50 glass border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-primary-600 to-accent-amber p-2.5 rounded-xl shadow-lg shadow-primary-700/20">
            <Music className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <span className="text-xl font-bold bg-gradient-to-r from-white via-primary-100 to-accent-amber bg-clip-text text-transparent tracking-wide">
              ClearEar Studio
            </span>
            <span className="block text-[10px] text-gray-400 font-mono tracking-widest uppercase">Carnatic Music Lab</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <button
            onClick={() => setShowCurriculumModal(true)}
            className="hover:text-white transition-colors cursor-pointer bg-transparent border-none p-0 flex items-center gap-1 font-medium"
          >
            <BookOpen className="w-4 h-4 text-primary-400" />
            Curriculum
          </button>
          <button
            onClick={handleCustomPractice}
            className="hover:text-white transition-colors cursor-pointer bg-transparent border-none p-0 flex items-center gap-1 font-medium"
          >
            <Sliders className="w-4 h-4 text-indigo-400" />
            Custom Hearing Practice
          </button>
        </nav>

        <div className="flex items-center gap-4">
          {session && (
            <span className="hidden sm:inline text-xs font-semibold text-gray-300 font-mono tracking-wide">
              Welcome, <span className="text-accent-amber font-bold">{user?.user_metadata?.name || user?.email?.split('@')[0]}</span>!
            </span>
          )}
          <button
            onClick={handleLaunchAcademy}
            className="px-5 py-2.5 rounded-xl text-xs font-bold border border-white/10 text-white transition-all shadow-md shadow-primary-600/20 hover:scale-[1.03] cursor-pointer btn-shimmer"
          >
            Launch Academy
          </button>
          {session ? (
            <div className="relative">
              {/* Profile Avatar Button */}
              <button
                onClick={toggleDropdown}
                className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-600 to-accent-amber p-0.5 shadow-lg shadow-primary-700/20 hover:scale-[1.05] hover:shadow-primary-500/40 transition-all cursor-pointer flex items-center justify-center border border-white/15"
              >
                <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center font-bold text-white uppercase text-sm tracking-wide">
                  {(user?.user_metadata?.name || user?.email || 'M')[0]}
                </div>
              </button>

              {/* Dropdown Menu */}
              {showProfileDropdown && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 mt-3 w-64 bg-[#0c101b] border border-white/10 rounded-2xl p-4 shadow-2xl shadow-black/80 z-50 space-y-4 animate-scale-up text-left font-sans"
                >
                  {/* User Info Header */}
                  <div className="space-y-1">
                    <p className="font-bold text-sm text-white truncate">
                      {user?.user_metadata?.name || 'Musician'}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                  </div>

                  <hr className="border-white/5" />

                  {/* Actions */}
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setShowProfileDropdown(false);
                        setShowEditProfileModal(true);
                      }}
                      className="w-full px-3 py-2.5 rounded-xl text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2 cursor-pointer border-none text-left"
                    >
                      <User className="w-3.5 h-3.5 text-primary-400" />
                      Edit Profile
                    </button>
                    <button
                      onClick={() => {
                        setShowProfileDropdown(false);
                        signOut();
                      }}
                      className="w-full px-3 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all flex items-center gap-2 cursor-pointer border-none text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2.5 rounded-xl text-xs font-bold border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-12 md:py-20 relative z-10 space-y-24 md:space-y-32">

        {/* Hero Section */}
        <section className="flex flex-col lg:flex-row gap-12 items-center text-left">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-accent-amber text-xs font-semibold">
              <Zap className="w-3.5 h-3.5 animate-pulse text-amber-500" />
              Revolutionizing Swara Ear Training
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Master the Geometry of <br />
              <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-accent-amber bg-clip-text text-transparent text-primary-glow">
                Carnatic Swarasthanas
              </span>
            </h1>

            <p className="text-gray-300 text-base md:text-lg max-w-2xl leading-relaxed">
              ClearEar Studio is a dedicated ear training and vocal pitch recognition laboratory designed for South Indian classical music. Train your mind to identify microtonal intervals, refine your vocal swara precision, and align with the pure resonance of the Tanpura.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={handleLaunchAcademy}
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-extrabold text-white shadow-lg transition-all scale-100 hover:scale-[1.03] cursor-pointer btn-shimmer btn-glow group"
              >
                Launch Learning Sandbox
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </button>

              <button
                onClick={handleCustomPractice}
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold border border-white/10 text-white shadow-lg transition-all scale-100 hover:scale-[1.03] cursor-pointer btn-practice-gradient group"
              >
                <Sliders className="w-4 h-4 group-hover:rotate-45 transition-transform" />
                Custom Hearning Practice
              </button>

              <button
                onClick={() => {
                  setActiveTab(1);
                  setShowCurriculumModal(true);
                }}
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold bg-primary-500/10 hover:bg-primary-500/20 border border-primary-500/20 text-primary-300 transition-all cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                View Curriculum
              </button>
            </div>
          </div>

          {/* Interactive CSS Dashboard Visual Mockup */}
          <div className="w-full lg:w-[480px] p-6 bg-slate-900/40 border border-white/10 rounded-3xl relative overflow-hidden shadow-2xl backdrop-blur-md">

            {/* Visualizer Header Mockup */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">Active Sadhana Session</span>
              </div>
              <span className="text-[10px] font-mono bg-primary-500/20 text-primary-300 border border-primary-500/30 px-2.5 py-0.5 rounded-full">
                Sruti: C# (1.5 Kattai)
              </span>
            </div>

            {/* Vocal Tuner Ring Mockup */}
            <div className="h-48 rounded-2xl bg-black/40 border border-white/5 relative flex flex-col items-center justify-center mb-6 overflow-hidden">
              {/* Radial gradient background */}
              <div className="absolute inset-0 bg-radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)"></div>

              {/* Animated wave lines */}
              <div className="absolute inset-x-0 bottom-0 h-16 flex items-end justify-center gap-1 opacity-20 px-8">
                {[40, 60, 45, 90, 80, 55, 75, 60, 45, 80, 100, 70, 50, 65, 85, 40].map((h, i) => (
                  <div
                    key={i}
                    className="w-1 bg-primary-400 rounded-t"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>

              <div className="z-10 space-y-1.5 text-center">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Sung Pitch detected</span>
                <div className="text-4xl font-extrabold font-mono text-white tracking-tight">
                  277.2 <span className="text-lg font-light text-gray-400">Hz</span>
                </div>
                <div className="text-lg font-bold text-accent-amber flex items-center justify-center gap-1.5 font-serif">
                  <span className="w-2 h-2 rounded-full bg-accent-rose animate-pulse"></span>
                  Ri <span className="text-xs font-sans text-gray-400">(Shuddha Rishabham)</span>
                </div>
                <span className="text-[10px] text-green-400 font-mono font-semibold bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">
                  Perfect Pitch (+2 Cents)
                </span>
              </div>
            </div>

            {/* Keypad Mockup */}
            <div className="grid grid-cols-4 gap-2.5 text-left">
              {[
                { name: 'Sa', active: false },
                { name: 'Ri', active: true },
                { name: 'Ga', active: false },
                { name: 'Ma', active: false },
                { name: 'Pa', active: false },
                { name: 'Dha', active: false },
                { name: 'Ni', active: false },
                { name: 'Sa\'', active: false }
              ].map((swara) => (
                <div
                  key={swara.name}
                  className={`p-3 rounded-xl border text-center transition-all ${swara.active
                    ? 'bg-gradient-to-br from-primary-700/50 to-primary-900/50 border-primary-500 shadow-md shadow-primary-700/20 scale-[1.03]'
                    : 'bg-slate-950/60 border-white/5 opacity-85'
                    }`}
                >
                  <span className={`block text-lg font-extrabold font-serif ${swara.active ? 'text-white' : 'text-primary-300'}`}>
                    {swara.name}
                  </span>
                  <span className="text-[9px] font-mono text-gray-500">
                    {swara.active ? 'Active' : 'Idle'}
                  </span>
                </div>
              ))}
            </div>

            {/* Static Stats Footer */}
            <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-gray-400">
              <span className="flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5 text-amber-500" />
                Score: 14 / 15 (93%)
              </span>
              <span>Raga: Mayamalavagowla</span>
            </div>

          </div>
        </section>

        {/* Feature Grid Section */}
        <section id="features" className="space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl md:text-4xl font-extrabold">
              Engineered for Classical Rigor
            </h2>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
              We translate centuries-old melodic structures of Carnatic classical music into visual, interactive training systems suitable for modern mobile devices and web browsers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Feature 1 */}
            <div className="glass rounded-2xl p-6 text-left border-white/5 glass-hover">
              <div className="w-12 h-12 rounded-xl bg-primary-500/10 border border-primary-500/25 flex items-center justify-center text-primary-400 mb-6 shadow-inner">
                <Music className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Sandbox Pitch Keyboard</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Explore the foundational C4-C5 octave sandbox. Click white and black keys to hear synthesized pitches and examine relative swara mappings.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass rounded-2xl p-6 text-left border-white/5 glass-hover">
              <div className="w-12 h-12 rounded-xl bg-accent-rose/10 border border-accent-rose/25 flex items-center justify-center text-accent-rose mb-6 shadow-inner">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">5-Stage Curriculum</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Follow a progressive, structured syllabus. Learn sequentially from relative pitch and direction up to complex dictations.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass rounded-2xl p-6 text-left border-white/5 glass-hover">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-accent-amber mb-6 shadow-inner">
                <Sliders className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Sequence Reconstruction</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Transcribe and reconstruct melodic phrases note-by-note using color-coded swara pads. Control dictation speed settings dynamically.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="glass rounded-2xl p-6 text-left border-white/5 glass-hover">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/25 flex items-center justify-center text-green-400 mb-6 shadow-inner">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Swarasthana & Tanpura</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Master microtonal swarasthanas (R1/R2, G2/G3...) using focused binary reference keyboards, supported by an ambient Tanpura drone.
              </p>
            </div>

          </div>
        </section>

        {/* Dynamic Static Preview: Raga Explorer */}
        <section id="raga-explorer" className="glass rounded-3xl p-8 md:p-12 border-white/5 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row gap-8 items-start text-left">
            <div className="w-full lg:w-1/3 space-y-6">
              <span className="text-xs font-mono text-primary-400 uppercase tracking-widest font-bold block">Melodic Scale Reference</span>
              <h2 className="text-3xl font-extrabold tracking-tight">Raga Scales</h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                Carnatic ragas use specific combinations of the 12 swarasthanas. Select a raga below to view its scale structure, notes, and interval offsets.
              </p>

              {/* Raga selector buttons */}
              <div className="flex flex-col gap-2 pt-2">
                {(Object.keys(RAGA_PREVIEWS) as RagaName[]).map((raga) => (
                  <button
                    key={raga}
                    onClick={() => setSelectedRaga(raga)}
                    className={`w-full py-3.5 px-4 rounded-xl font-semibold text-sm text-left flex justify-between items-center transition-all cursor-pointer ${selectedRaga === raga
                      ? 'bg-primary-600 text-white font-bold shadow-md shadow-primary-700/20'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                      }`}
                  >
                    <span>{raga}</span>
                    <ChevronRight className="w-4 h-4 opacity-70" />
                  </button>
                ))}
              </div>
            </div>

            {/* Raga Detail Board Card */}
            <div className="flex-1 w-full bg-slate-950/60 border border-white/5 p-6 md:p-8 rounded-2xl space-y-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 pb-4 border-b border-white/5">
                <div>
                  <h3 className="text-2xl font-bold text-white font-serif">{selectedRaga}</h3>
                  <span className="text-xs font-mono text-gray-400 mt-1 block">Aarohanam Structure</span>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-xl text-center md:text-right shrink-0">
                  <span className="text-[10px] font-mono text-accent-amber uppercase tracking-wider block">Scale Formula</span>
                  <span className="text-sm font-mono text-white font-bold">{RAGA_PREVIEWS[selectedRaga].scale}</span>
                </div>
              </div>

              <p className="text-gray-300 text-sm leading-relaxed italic">
                "{RAGA_PREVIEWS[selectedRaga].desc}"
              </p>

              {/* Swara Row */}
              <div className="space-y-3">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block">Swaras in Scale</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {RAGA_PREVIEWS[selectedRaga].swaras.map((swara) => (
                    <div
                      key={swara.name}
                      className="p-3 bg-white/5 border border-white/5 rounded-xl hover:border-primary-500/30 transition-all text-left"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-lg font-extrabold font-serif text-primary-300">{swara.name}</span>
                        <span className="text-[9px] font-mono text-gray-500">+{swara.semitones} ST</span>
                      </div>
                      <span className="block text-[11px] font-semibold text-white/90 truncate">{swara.fullName}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Methodology / How it Works */}
        <section id="methodology" className="space-y-12 text-left">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-mono text-primary-400 uppercase tracking-widest font-bold block">Scientific & Systematic Training</span>
            <h2 className="text-3xl md:text-4xl font-extrabold">The Training Journey</h2>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
              Classical ear training takes dedicated structure. ClearEar Studio is built to guide you from foundational pitch matching to advanced melodic contour recognition.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">

            {/* Step 1 */}
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-primary-600/10 border border-primary-500/20 flex items-center justify-center font-mono font-bold text-primary-400">
                01
              </div>
              <h3 className="text-lg font-bold">Auditory Calibration</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Establish your baseline pitch. Play note pitches in the Sandbox keyboard or toggle the ambient synthetic Tanpura drone in the reconstruction game to anchor your ears to the Adhara Shadjam (Sa).
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-accent-rose/10 border border-accent-rose/20 flex items-center justify-center font-mono font-bold text-accent-rose">
                02
              </div>
              <h3 className="text-lg font-bold">Focused Training Levels</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Build relative pitch skills step-by-step. Classify adjacent note directions (Same/Different, Higher/Lower), identify absolute swaras, and isolate microtonal swarasthanas (R1/R2, G2/G3...) on focused keyboards.
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center font-mono font-bold text-accent-amber">
                03
              </div>
              <h3 className="text-lg font-bold">Melodic Recall & Reconstruction</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Transcribe complex classical phrases. Listen to sequences of notes at slow, medium, or fast tempos, and input them sequentially using color-coded swara pads to build active melodic recall.
              </p>
            </div>

          </div>
        </section>

        {/* CTA Launch Section */}
        <section id="launch" className="glass rounded-3xl p-8 md:p-16 text-center border-white/5 relative overflow-hidden bg-gradient-to-tr from-slate-950 via-slate-900/60 to-slate-950 shadow-2xl">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-primary-600 filter blur-3xl opacity-10 -z-10"></div>

          <div className="max-w-2xl mx-auto space-y-6">
            <div className="inline-flex p-3 rounded-2xl bg-primary-600/15 border border-primary-500/30 text-primary-400 mb-2">
              <Zap className="w-6 h-6 animate-pulse" />
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">Ready to Train Your Ears?</h2>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
              Start building your swara recognition today. Perfect for classical students, amateur singers, and seasoned musicians aiming for absolute pitch perfection.
            </p>
            <div className="pt-4 flex justify-center">
              <button
                onClick={handleLaunchAcademy}
                className="flex items-center gap-2 mx-auto px-8 py-4 rounded-xl font-extrabold text-white shadow-xl transition-all scale-100 hover:scale-[1.03] cursor-pointer btn-shimmer btn-glow group"
              >
                Launch Learning Sandbox
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="glass border-t border-white/5 py-12 text-center text-xs text-gray-400 space-y-4 px-6 mt-12">
        <div className="flex justify-center gap-8">
          <a href="#features" className="hover:text-primary-400 transition-colors">Features</a>
          <a href="#raga-explorer" className="hover:text-primary-400 transition-colors">Scales</a>
          <a href="#methodology" className="hover:text-primary-400 transition-colors">Methodology</a>
          <button onClick={() => setShowCurriculumModal(true)} className="hover:text-primary-400 transition-colors">Curriculum</button>
          <a href="#" className="hover:text-primary-400 transition-colors flex items-center gap-1 font-sans"><Shield className="w-3.5 h-3.5" /> Privacy</a>
        </div>
        <p>© 2026 ClearEar Studio. Empowering Indian Classical Music Ear Training.</p>
        <p className="text-[10px] text-gray-600">Built using React, Vite, and Tailwind CSS v4.</p>
      </footer>

      {/* Curriculum / Syllabus Modal Overlay */}
      {showCurriculumModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 cursor-pointer"
            onClick={() => setShowCurriculumModal(false)}
          />

          <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col relative shadow-2xl z-10 animate-fade-in-up">
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex justify-between items-start">
              <div>
                <h3 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2">
                  <Award className="w-6 h-6 text-accent-amber" />
                  ClearEar Studio Ear Training Path
                </h3>
                <p className="text-gray-400 text-xs md:text-sm mt-1">
                  A systematic 5-stage training path from absolute pitch basics to Carnatic microtonal mastery.
                </p>
              </div>
              <button
                onClick={() => setShowCurriculumModal(false)}
                className="bg-white/5 hover:bg-white/10 border border-white/10 p-2 rounded-xl text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 flex-1 overflow-hidden">

              {/* Left Column Tabs Selector */}
              <div className="bg-slate-950/50 p-4 border-r border-white/5 space-y-2 overflow-y-auto max-h-[20vh] md:max-h-none">
                {[
                  { id: 1, name: "Stage 1", title: "Pitch Basics", label: "Fundamentals" },
                  { id: 2, name: "Stage 2", title: "Saptaswaras", label: "Identification" },
                  { id: 3, name: "Stage 3", title: "Sequence dict.", label: "Relative Pitch" },
                  { id: 4, name: "Stage 4", title: "Reconstruction", label: "Melodic Memory" },
                  { id: 5, name: "Stage 5", title: "Swarasthanas", label: "Microtonal" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left p-3.5 rounded-2xl transition-all cursor-pointer flex flex-col gap-1 ${activeTab === tab.id
                      ? 'bg-primary-600/20 border border-primary-500/40 text-white shadow-inner'
                      : 'hover:bg-white/5 border border-transparent text-gray-400 hover:text-gray-200'
                      }`}
                  >
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-primary-400">{tab.name}</span>
                    <span className="text-sm font-bold leading-tight">{tab.title}</span>
                    <span className="text-[10px] text-gray-500 font-mono">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Right Column Content Area */}
              <div className="col-span-3 p-6 overflow-y-auto space-y-6 max-h-[50vh] md:max-h-[60vh]">

                {/* Stage Title and Summary */}
                <div className="space-y-2 text-left">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-primary-500/10 border border-primary-500/20 text-primary-300">
                      Stage {activeTab} of 5
                    </span>
                    <span className="text-gray-500">•</span>
                    <span className="text-xs text-accent-amber font-mono font-bold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      {activeTab === 1 && "Relative Pitch Calibrations"}
                      {activeTab === 2 && "Absolute Scale Anchors"}
                      {activeTab === 3 && "Aural Recall Training"}
                      {activeTab === 4 && "Melodic Dictation Loop"}
                      {activeTab === 5 && "12-Semitone Mastery"}
                    </span>
                  </div>
                  <h4 className="text-xl font-extrabold text-white">
                    {activeTab === 1 && "Stage 1: Pitch Fundamentals"}
                    {activeTab === 2 && "Stage 2: Swara Identification"}
                    {activeTab === 3 && "Stage 3: Melodic Sequence Dictation"}
                    {activeTab === 4 && "Stage 4: Sequence Dictation & Memory"}
                    {activeTab === 5 && "Stage 5: Swarasthana Mastery (Microtonal)"}
                  </h4>
                  <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
                    {activeTab === 1 && "Build a strong foundation. These exercises train your ears to identify basic differences in relative frequency and directions without naming them yet."}
                    {activeTab === 2 && "Map pitches to Carnatic classical swara labels. Train your mind to link auditory pitches with their corresponding musical syllables."}
                    {activeTab === 3 && "Extend your retention span. Transcribe multi-note patterns sequentially, training the brain to store and identify continuous melodic contours."}
                    {activeTab === 4 && "Active reconstruction sandbox. Rebuild phrases step-by-step from audio memory, utilizing interactive swara pads with user-defined tempo speeds."}
                    {activeTab === 5 && "The ultimate classical challenge. Identify microtonal variations (swarasthanas) for Ri, Ga, Ma, Dha, and Ni, distinguishing between closely related pitch degrees."}
                  </p>
                </div>

                {/* Levels Timeline */}
                <div className="space-y-4">
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block text-left">Stage Levels</span>

                  <div className="space-y-3">
                    {activeTab === 1 && [
                      { level: "Level 0", title: "Pitch Exploration Sandbox", desc: "Interact with white and black keys to examine C4 to C5 pitches and see their Carnatic equivalents." },
                      { level: "Level 1", title: "Same or Different?", desc: "Hear two consecutive pitches played sequentially and identify if they are identical or different." },
                      { level: "Level 2", title: "Higher or Lower?", desc: "Hear two adjacent notes and determine if the second goes up (Aarohanam) or down (Avarohanam)." }
                    ].map((lvl, i) => (
                      <div key={i} className="flex gap-4 p-3.5 bg-slate-950/40 border border-white/5 rounded-2xl">
                        <span className="h-6 px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold shrink-0">{lvl.level}</span>
                        <div className="space-y-0.5 text-left">
                          <h5 className="text-xs md:text-sm font-bold text-white">{lvl.title}</h5>
                          <p className="text-gray-400 text-xs leading-relaxed">{lvl.desc}</p>
                        </div>
                      </div>
                    ))}

                    {activeTab === 2 && [
                      { level: "Level 1", title: "Anchor Notes (Sa - Pa)", desc: "Identify Shadjam (Sa) and Panchamam (Pa), the absolute pitch anchors in Carnatic classical music." },
                      { level: "Level 2", title: "Perfect Fourth Anchor (Sa - Ma - Pa)", desc: "Differentiate between Sa, Pa, and Shuddha Madhyamam (Ma)." },
                      { level: "Level 3", title: "Lower Register (Sa - Ri - Ga - Ma - Pa)", desc: "Distinguish the first five natural white keys of the scale." },
                      { level: "Level 4", title: "Upper Register (Dha - Ni)", desc: "Focused training on identifying Dhaivatam (Dha) and Nishadam (Ni)." },
                      { level: "Level 5", title: "Full Octave Swara Board", desc: "Identify all 8 natural white-key swaras of the scale across the octave." }
                    ].map((lvl, i) => (
                      <div key={i} className="flex gap-4 p-3.5 bg-slate-950/40 border border-white/5 rounded-2xl">
                        <span className="h-6 px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold shrink-0">{lvl.level}</span>
                        <div className="space-y-0.5 text-left">
                          <h5 className="text-xs md:text-sm font-bold text-white">{lvl.title}</h5>
                          <p className="text-gray-400 text-xs leading-relaxed">{lvl.desc}</p>
                        </div>
                      </div>
                    ))}

                    {activeTab === 3 && [
                      { level: "Level 1", title: "2-Note Sequence Dictation", desc: "Listen to 2-note sequences and select the correct swara labels from multiple-choice choices." },
                      { level: "Level 2", title: "3-Note Sequence Dictation", desc: "Reconstruct 3-note relative pitch sequences sequentially." },
                      { level: "Level 3", title: "4-Note Sequence Dictation", desc: "Transcribe 4-note melodic sequences sequentially." }
                    ].map((lvl, i) => (
                      <div key={i} className="flex gap-4 p-3.5 bg-slate-950/40 border border-white/5 rounded-2xl">
                        <span className="h-6 px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold shrink-0">{lvl.level}</span>
                        <div className="space-y-0.5 text-left">
                          <h5 className="text-xs md:text-sm font-bold text-white">{lvl.title}</h5>
                          <p className="text-gray-400 text-xs leading-relaxed">{lvl.desc}</p>
                        </div>
                      </div>
                    ))}

                    {activeTab === 4 && [
                      { level: "Level 1", title: "Interactive Melodic Reconstruction", desc: "Listen to sequence phrases and reconstruct them note-by-note using direct swara pads. Control speed parameters (slow, medium, fast) to adapt learning pace." }
                    ].map((lvl, i) => (
                      <div key={i} className="flex gap-4 p-3.5 bg-slate-950/40 border border-white/5 rounded-2xl">
                        <span className="h-6 px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold shrink-0">{lvl.level}</span>
                        <div className="space-y-0.5 text-left">
                          <h5 className="text-xs md:text-sm font-bold text-white">{lvl.title}</h5>
                          <p className="text-gray-400 text-xs leading-relaxed">{lvl.desc}</p>
                        </div>
                      </div>
                    ))}

                    {activeTab === 5 && [
                      { level: "Level 1", title: "Rishabha Recognition (R1 vs R2)", desc: "Differentiate Shuddha Rishabham (R1) from Chatusruti Rishabham (R2). Active reference keys on the keyboard are locked strictly to target notes." },
                      { level: "Level 2", title: "Gandhara Recognition (G2 vs G3)", desc: "Differentiate Sadharana Gandharam (G2) from Antara Gandharam (G3)." },
                      { level: "Level 3", title: "Madhyama Recognition (M1 vs M2)", desc: "Differentiate Shuddha Madhyamam (M1) from Prati Madhyamam (M2)." },
                      { level: "Level 4", title: "Dhaivata Recognition (D1 vs D2)", desc: "Differentiate Shuddha Dhaivatam (D1) from Chatusruti Dhaivatam (D2)." },
                      { level: "Level 5", title: "Nishada Recognition (N2 vs N3)", desc: "Differentiate Kaisiki Nishadam (N2) from Kakali Nishadam (N3)." },
                      { level: "Level 6", title: "Mixed Swarasthana Identification", desc: "Classify single target notes randomly played from all 10 swarasthana variations." },
                      { level: "Level 7", title: "Advanced Swarasthana Dictation", desc: "Dictate complex microtonal phrases (3 to 7 notes) from memory using 13 active swara keys." }
                    ].map((lvl, i) => (
                      <div key={i} className="flex gap-4 p-3.5 bg-slate-950/40 border border-white/5 rounded-2xl">
                        <span className="h-6 px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold shrink-0">{lvl.level}</span>
                        <div className="space-y-0.5 text-left">
                          <h5 className="text-xs md:text-sm font-bold text-white">{lvl.title}</h5>
                          <p className="text-gray-400 text-xs leading-relaxed">{lvl.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Footer Launch CTA */}
            <div className="p-4 bg-slate-950/80 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-3">
              <span className="text-[10px] font-mono text-gray-500">
                ClearEar Studio Ear Training Academy • Version 1.0
              </span>
              <button
                onClick={() => {
                  setShowCurriculumModal(false);
                  handleLaunchAcademy();
                }}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-primary-600 hover:bg-primary-500 text-white transition-all shadow-md shadow-primary-600/20 cursor-pointer"
              >
                Start Training Now
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Practice Modal */}
      <CustomPracticeModal
        isOpen={showCustomPracticeModal}
        onClose={() => setShowCustomPracticeModal(false)}
      />

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEditProfileModal}
        onClose={() => setShowEditProfileModal(false)}
      />

    </div>
  );
}
