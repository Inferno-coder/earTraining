import { useState } from 'react';
import { ArrowLeft, Volume2 } from 'lucide-react';
import { playNote } from '../../utils/audio';

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

interface Level0Props {
  onBack: () => void;
}

export default function Level0({ onBack }: Level0Props) {
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const [lastPlayedKey, setLastPlayedKey] = useState<KeyboardKey | null>(null);

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

  return (
    <div className="min-h-screen flex flex-col font-sans relative overflow-x-hidden selection:bg-primary-500 selection:text-white">
      
      {/* Background Decorative Blur Blobs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-primary-600 filter blur-3xl opacity-10 animate-pulse-slow"></div>
      <div className="absolute top-2/3 right-1/4 w-96 h-96 rounded-full bg-accent-rose filter blur-3xl opacity-10 animate-pulse-slow"></div>

      {/* Level 0 Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-gray-300 hover:text-white transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Home
        </button>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-mono text-gray-400">STAGE 1</span>
          <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
          <span className="text-sm font-bold text-white tracking-wide">Level 0: Pitch Exploration</span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-gray-400 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
          <Volume2 className="w-3.5 h-3.5 text-primary-400" />
          Octave: C4 - C5
        </div>
      </header>

      {/* Level 0 Main Space */}
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
        <div className="w-full max-w-3xl relative select-none">
          
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
        <div className="max-w-md bg-white/5 border border-white/5 p-4 rounded-xl text-center text-xs text-gray-400 font-mono">
          💡 Keyboard uses 12-Tone Equal Temperament tuning starting at C4 (261.63 Hz) representing the basic Shadjam (Sa) drone anchor.
        </div>

      </main>

      {/* Level 0 Footer */}
      <footer className="glass border-t border-white/5 py-6 mt-12 text-center text-xs text-gray-500 px-6">
        <p>© 2026 SvaraSadhana • Stage 1 Sandbox</p>
      </footer>

    </div>
  );
}
