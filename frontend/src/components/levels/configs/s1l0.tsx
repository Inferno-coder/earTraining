import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Volume2 } from 'lucide-react';
import { playNote } from '../../../utils/audio';
import LevelSelector from '../LevelSelector';

interface KeyboardKey {
  note: string;
  label: string;
  swara: string;
  swaraFull: string;
  isBlack: boolean;
  leftIndex?: number;
}

const whiteKeys: KeyboardKey[] = [
  { note: 'C4', label: 'C', swara: 'Sa', swaraFull: 'Shadjam', isBlack: false },
  { note: 'D4', label: 'D', swara: 'Ri', swaraFull: 'Chatushruti Rishabham', isBlack: false },
  { note: 'E4', label: 'E', swara: 'Ga', swaraFull: 'Antara Gandharam', isBlack: false },
  { note: 'F4', label: 'F', swara: 'Ma', swaraFull: 'Shuddha Madhyamam', isBlack: false },
  { note: 'G4', label: 'G', swara: 'Pa', swaraFull: 'Panchamam', isBlack: false },
  { note: 'A4', label: 'A', swara: 'Dha', swaraFull: 'Chatushruti Dhaivatam', isBlack: false },
  { note: 'B4', label: 'B', swara: 'Ni', swaraFull: 'Kakali Nishadam', isBlack: false },
  { note: 'C5', label: 'C\'', swara: 'Sa\'', swaraFull: 'Shadjam (Tarastayi)', isBlack: false }
];

const blackKeys: KeyboardKey[] = [
  { note: 'C#4', label: 'C#', swara: 'Ri₁', swaraFull: 'Shuddha Rishabham', isBlack: true, leftIndex: 0 },
  { note: 'D#4', label: 'D#', swara: 'Ga₂', swaraFull: 'Sadharana Gandharam', isBlack: true, leftIndex: 1 },
  { note: 'F#4', label: 'F#', swara: 'Ma₂', swaraFull: 'Prati Madhyamam', isBlack: true, leftIndex: 3 },
  { note: 'G#4', label: 'G#', swara: 'Dha₁', swaraFull: 'Shuddha Dhaivatam', isBlack: true, leftIndex: 4 },
  { note: 'A#4', label: 'A#', swara: 'Ni₂', swaraFull: 'Kaisiki Nishadam', isBlack: true, leftIndex: 5 }
];

interface Stage1Level0Props {
  onBack: () => void;
  onNext: () => void;
  onChangeLevel?: (stage: number, level: number) => void;
}

export default function Stage1Level0({ onBack, onNext, onChangeLevel }: Stage1Level0Props) {
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const [lastPlayedKey, setLastPlayedKey] = useState<KeyboardKey | null>(null);
  const [tourStep, setTourStep] = useState<number>(0);

  const [isAutoplayActive, setIsAutoplayActive] = useState<boolean>(() => {
    return localStorage.getItem('earTraining_autoplay_active') === 'true';
  });

  const toggleAutoplay = () => {
    const nextVal = !isAutoplayActive;
    setIsAutoplayActive(nextVal);
    localStorage.setItem('earTraining_autoplay_active', nextVal.toString());
  };

  useEffect(() => {
    if (isAutoplayActive) {
      const timeoutId = setTimeout(() => {
        onNext();
      }, 1500); // Wait 1.5s in sandbox then proceed
      return () => clearTimeout(timeoutId);
    }
  }, [isAutoplayActive, onNext]);

  // Auto-start tour if not completed before
  useEffect(() => {
    const tourCompleted = localStorage.getItem('exploreTourCompleted');
    if (!tourCompleted) {
      setTourStep(1);
    }
  }, []);

  const handlePlayKey = async (key: KeyboardKey) => {
    setActiveNote(key.note);
    setLastPlayedKey(key);
    
    try {
      await playNote(key.note, '0.5s');
    } catch (err) {
      console.error('Audio playback failed:', err);
    }

    setTimeout(() => {
      setActiveNote(prev => prev === key.note ? null : prev);
    }, 400);
  };

  const handleNextStep = () => {
    if (tourStep < 3) {
      setTourStep(prev => prev + 1);
    } else {
      localStorage.setItem('exploreTourCompleted', 'true');
      setTourStep(0);
    }
  };

  const handlePrevStep = () => {
    if (tourStep > 1) {
      setTourStep(prev => prev - 1);
    }
  };

  const skipTour = () => {
    localStorage.setItem('exploreTourCompleted', 'true');
    setTourStep(0);
  };

  const startTour = () => {
    setTourStep(1);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans relative overflow-x-hidden selection:bg-primary-500 selection:text-white">
      
      {/* Background Decorative Blur Blobs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-primary-600 filter blur-3xl opacity-10 animate-pulse-slow"></div>
      <div className="absolute top-2/3 right-1/4 w-96 h-96 rounded-full bg-accent-rose filter blur-3xl opacity-10 animate-pulse-slow"></div>

      {/* Tour Backdrop Overlay */}
      {tourStep > 0 && (
        <div 
          onClick={skipTour} 
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-[99] transition-all duration-300 cursor-pointer"
        />
      )}

      {/* Header */}
      <header className={`sticky top-0 glass border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center transition-all duration-300 ${
        tourStep === 2 || tourStep === 3 ? 'z-[101]' : 'z-50'
      }`}>
        <button 
          onClick={onBack}
          className={`flex items-center gap-2 text-sm font-semibold text-gray-300 hover:text-white transition-all cursor-pointer group ${
            tourStep === 2 
              ? 'relative z-[102] bg-slate-900 border border-white/10 px-3 py-1.5 rounded-xl ring-4 ring-primary-500 shadow-[0_0_15px_rgba(139,92,246,0.5)]' 
              : ''
          }`}
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Home
        </button>
        
        <LevelSelector currentStage={1} currentLevel={0} onChangeLevel={onChangeLevel} />

        <div className="flex items-center gap-3">
          <button
            onClick={toggleAutoplay}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border cursor-pointer ${isAutoplayActive
              ? 'bg-red-500/20 border-red-500/30 text-red-300 hover:bg-red-500/45 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
              : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/45 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
            }`}
          >
            {isAutoplayActive ? '⏹️ Stop Autoplay' : '🤖 Autoplay'}
          </button>
          <div className="hidden md:flex items-center gap-2 text-xs font-mono text-gray-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
            <Volume2 className="w-3.5 h-3.5 text-primary-400" />
            Octave: C4 - C5
          </div>
          <button 
            onClick={onNext}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs md:text-sm font-bold rounded-xl bg-primary-600 hover:bg-primary-500 text-white transition-all cursor-pointer shadow-md shadow-primary-600/20 ${
              tourStep === 3 
                ? 'relative z-[102] ring-4 ring-primary-500 shadow-[0_0_15px_rgba(139,92,246,0.5)]' 
                : ''
            }`}
          >
            Go to Level 1
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Space */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 md:py-16 flex flex-col items-center justify-center relative z-10 space-y-8 md:space-y-12">
        
        {/* Header Info */}
        <div className="text-center max-w-2xl space-y-4">
          <span className="text-xs font-mono text-primary-400 uppercase tracking-widest font-bold block">Keyboard Pitch Sandbox</span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Swara Keyboard Map</h2>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed">
            Explore how individual Western notes align with Carnatic Swaras. Click any key to trigger its synthesized pitch.
          </p>
        </div>

        {/* Feedback Display Board */}
        <div className="w-full max-w-xl p-5 bg-slate-900/60 border border-white/5 rounded-2xl flex items-center justify-between min-h-[90px] shadow-lg">
          {lastPlayedKey ? (
            <>
              <div className="text-left space-y-1">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block">Last Played note</span>
                <div className="text-2xl font-extrabold text-white flex items-baseline gap-2 font-mono">
                  {lastPlayedKey.note}
                  <span className="text-sm font-normal text-gray-400 font-sans">({lastPlayedKey.label})</span>
                </div>
              </div>
              
              <div className="text-right space-y-1">
                <span className="text-[10px] font-mono text-primary-400 uppercase tracking-wider block">Carnatic Swara</span>
                <div className="text-2xl font-bold text-accent-amber font-serif">
                  {lastPlayedKey.swara}
                </div>
                <span className="block text-[10px] text-gray-400">{lastPlayedKey.swaraFull}</span>
              </div>
            </>
          ) : (
            <div className="w-full text-center text-gray-500 text-sm italic py-2">
              Click any key on the keyboard below to start playing sound...
            </div>
          )}
        </div>

        {/* Keyboard Container */}
        <div className={`w-full max-w-3xl relative select-none transition-all duration-300 ${
          tourStep === 1 
            ? 'z-[101] relative ring-4 ring-primary-500 rounded-3xl shadow-[0_0_25px_rgba(139,92,246,0.4)]' 
            : ''
        }`}>
          
          {/* The Piano Keys */}
          <div className="w-full bg-slate-950 p-4 border border-white/10 rounded-3xl shadow-2xl relative flex aspect-[16/7] md:aspect-[16/6] z-20">
            
            {/* White Keys Row */}
            <div className="w-full h-full flex relative z-10 gap-1 md:gap-1.5">
              {whiteKeys.map((key) => {
                const isPressed = activeNote === key.note;
                return (
                  <button
                    key={key.note}
                    onClick={() => handlePlayKey(key)}
                    className={`flex-1 h-full rounded-b-2xl flex flex-col justify-end items-center pb-4 md:pb-6 transition-all duration-100 shadow-md cursor-pointer ${
                      isPressed 
                        ? 'bg-primary-100 border-t-[6px] border-primary-500 pt-0 translate-y-0.5 shadow-none' 
                        : 'bg-white hover:bg-slate-50 border-b-[6px] border-slate-300'
                    }`}
                  >
                    <div className="text-center select-none pointer-events-none">
                      <span className="block text-xl md:text-3xl font-extrabold text-slate-800 font-serif leading-none">
                        {key.label}
                      </span>
                      <span className="block text-xs md:text-sm font-bold text-primary-700 font-sans mt-2">
                        {key.swara}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Black Keys Overlaid */}
            {blackKeys.map((key) => {
              const isPressed = activeNote === key.note;
              const leftOffset = `calc(12.5% * (${key.leftIndex!} + 1) - 4.2%)`;
              return (
                <button
                  key={key.note}
                  onClick={() => handlePlayKey(key)}
                  style={{ left: leftOffset, width: '8.4%' }}
                  className={`absolute h-[62%] rounded-b-xl flex flex-col justify-end items-center pb-3 transition-all duration-100 shadow-lg z-30 cursor-pointer ${
                    isPressed 
                      ? 'bg-primary-900 border-t-4 border-primary-400 pt-0 translate-y-0.5 shadow-none' 
                      : 'bg-slate-900 hover:bg-slate-800 border-b-4 border-black border-x border-slate-800'
                  }`}
                >
                  <div className="text-center select-none pointer-events-none">
                    <span className="block text-sm md:text-base font-extrabold text-slate-200 font-serif leading-none">
                      {key.label}
                    </span>
                    <span className="block text-[9px] md:text-xs font-bold text-accent-amber font-sans mt-1.5">
                      {key.swara}
                    </span>
                  </div>
                </button>
              );
            })}

          </div>

          {/* Keyboard visual stand glow */}
          <div className="absolute -bottom-2 inset-x-8 h-4 bg-primary-600/20 filter blur-md -z-10 rounded-full"></div>

        </div>

        {/* Quick Level 0 Instructions */}
        <div className="flex flex-col items-center gap-4 max-w-md w-full">
          <div className="bg-white/5 border border-white/5 p-4 rounded-xl text-center text-xs text-gray-400 font-mono w-full">
            💡 Keyboard uses 12-Tone Equal Temperament tuning starting at C4 (261.63 Hz) representing the basic Shadjam (Sa) drone anchor.
          </div>
          <button
            onClick={startTour}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600/10 hover:bg-primary-600/20 border border-primary-500/20 text-primary-300 hover:text-primary-200 text-xs font-bold font-mono transition-all duration-100 shadow-lg shadow-black/20 cursor-pointer"
          >
            💡 Meet Svara Guru & Start Guide
          </button>
        </div>

      </main>

      {/* Onboarding Tour Card */}
      {tourStep > 0 && (
        <div className="fixed bottom-6 inset-x-4 md:inset-x-auto md:bottom-10 md:right-10 z-[101] max-w-lg bg-slate-900/95 border border-white/10 p-5 rounded-3xl shadow-2xl flex flex-col sm:flex-row gap-4 items-center sm:items-start backdrop-blur-md animate-fade-in-up">
          <div className="flex-shrink-0 bg-slate-950 p-2 rounded-2xl border border-white/5 shadow-inner">
            <SvaraGuruSVG />
          </div>
          <div className="flex-1 text-center sm:text-left space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono text-primary-400 font-bold uppercase tracking-wider">
                Guide • Step {tourStep} of 3
              </span>
              <button 
                onClick={skipTour}
                className="text-xs font-semibold text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
              >
                Skip Guide
              </button>
            </div>
            
            <div className="space-y-1.5">
              <h4 className="text-base font-extrabold text-white">
                {tourStep === 1 && "🎹 Explore the Keyboard"}
                {tourStep === 2 && "🏠 Navigation: Back to Home"}
                {tourStep === 3 && "🎯 Navigation: Go to Level 1"}
              </h4>
              <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
                {tourStep === 1 && "Welcome to ClearEar Studio! Start by clicking any white or black key on the keyboard. Hear the synthesized note and see how Western notes match their Carnatic Swaras."}
                {tourStep === 2 && "Click 'Back to Home' at the top-left to exit this lesson. From the home page, you can access the Custom Practice Room to build your own scales, choose playback speeds, and loop note sequences."}
                {tourStep === 3 && "Once you have practiced and calibrated your ears, click 'Go to Level 1' in the top-right to start your first pitch discrimination quiz!"}
              </p>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              {tourStep > 1 && (
                <button
                  onClick={handlePrevStep}
                  className="px-3.5 py-1.5 text-xs font-semibold text-gray-300 hover:text-white border border-white/10 hover:bg-white/5 rounded-xl transition-all cursor-pointer"
                >
                  Back
                </button>
              )}
              <button
                onClick={handleNextStep}
                className="px-4 py-1.5 text-xs font-bold bg-primary-600 hover:bg-primary-500 text-white rounded-xl shadow-md shadow-primary-600/25 transition-all cursor-pointer flex items-center gap-1"
              >
                {tourStep === 3 ? "Explore Now! 🎉" : "Next Step ➔"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="glass border-t border-white/5 py-6 mt-12 text-center text-xs text-gray-500 px-6">
        <p>© 2026 ClearEar Studio • Stage 1 Sandbox</p>
      </footer>

    </div>
  );
}

// Wise & Friendly Classical Music Guide Avatar
function SvaraGuruSVG() {
  return (
    <svg viewBox="0 0 100 100" className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-[0_0_12px_rgba(245,158,11,0.4)]">
      <defs>
        {/* Guru skin gradient */}
        <radialGradient id="guruGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffedd5" />
          <stop offset="70%" stopColor="#fed7aa" />
          <stop offset="100%" stopColor="#fdba74" />
        </radialGradient>
        {/* Tilak/Bindi gradient */}
        <linearGradient id="tilakGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#b91c1c" />
        </linearGradient>
        {/* Headphones neon gradient */}
        <linearGradient id="phoneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      
      {/* Topknot / Traditional Bun */}
      <circle cx="50" cy="22" r="10" fill="#ea580c" className="animate-bounce" style={{ animationDuration: '3s' }} />
      <circle cx="50" cy="28" r="6" fill="#f97316" />
      {/* Bun decoration - gold bead */}
      <circle cx="50" cy="16" r="3" fill="#fbbf24" />
      
      {/* Ears */}
      <circle cx="20" cy="55" r="7" fill="#fdba74" />
      <circle cx="80" cy="55" r="7" fill="#fdba74" />
      
      {/* Face */}
      <circle cx="50" cy="55" r="28" fill="url(#guruGrad)" stroke="#ea580c" strokeWidth="1.5" />
      
      {/* Wise Guru white beard */}
      <path d="M28,68 Q50,95 72,68 Q50,78 28,68 Z" fill="#fff" stroke="#e2e8f0" strokeWidth="1" className="animate-pulse" />
      
      {/* Traditional Tilak (Bindi) on forehead */}
      <path d="M50,34 Q47,43 50,47 Q53,43 50,34 Z" fill="url(#tilakGrad)" />
      <circle cx="50" cy="49" r="1.5" fill="#fbbf24" />
      
      {/* Peaceful closed eyes (Meditation/Listening vibe) */}
      <path d="M32,54 Q40,58 43,53" fill="none" stroke="#431407" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M68,54 Q60,58 57,53" fill="none" stroke="#431407" strokeWidth="2.5" strokeLinecap="round" />
      
      {/* Eyebrows */}
      <path d="M30,48 Q37,45 42,50" fill="none" stroke="#431407" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M70,48 Q63,45 58,50" fill="none" stroke="#431407" strokeWidth="1.5" strokeLinecap="round" />
      
      {/* Cute happy smile */}
      <path d="M44,64 Q50,70 56,64" fill="none" stroke="#b91c1c" strokeWidth="2.5" strokeLinecap="round" className="animate-pulse" />
      
      {/* Neon headphones band */}
      <path d="M22,50 A28,28 0 0,1 78,50" fill="none" stroke="url(#phoneGrad)" strokeWidth="4" strokeLinecap="round" />
      
      {/* Headphones ear pads (glowing) */}
      <rect x="14" y="46" width="8" height="18" rx="4" fill="#8b5cf6" stroke="#a78bfa" strokeWidth="1" />
      <rect x="78" y="46" width="8" height="18" rx="4" fill="#8b5cf6" stroke="#a78bfa" strokeWidth="1" />
      
      {/* Sound waves emitted from headphones (glowing arcs) */}
      <path d="M8,55 A22,22 0 0,1 8,45" fill="none" stroke="#c084fc" strokeWidth="1.5" strokeLinecap="round" className="animate-ping" style={{ animationDuration: '2s' }} />
      <path d="M92,55 A22,22 0 0,0 92,45" fill="none" stroke="#c084fc" strokeWidth="1.5" strokeLinecap="round" className="animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
    </svg>
  );
}


