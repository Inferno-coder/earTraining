import { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Square, 
  X, 
  Sliders 
} from 'lucide-react';
import { playNote, initAudio } from '../utils/audio';

interface SwaraOption {
  note: string;
  label: string;
  carnaticName: string;
  semitones: number;
  isBlack: boolean;
  leftIndex?: number;
}

const SWARA_OPTIONS: SwaraOption[] = [
  { note: 'C4', label: 'Sa', carnaticName: 'Shadjam', semitones: 0, isBlack: false },
  { note: 'C#4', label: 'R1', carnaticName: 'Shuddha Rishabham', semitones: 1, isBlack: true, leftIndex: 0 },
  { note: 'D4', label: 'R2 / G1', carnaticName: 'Chatushruti Rishabham', semitones: 2, isBlack: false },
  { note: 'D#4', label: 'G2 / R3', carnaticName: 'Sadharana Gandharam', semitones: 3, isBlack: true, leftIndex: 1 },
  { note: 'E4', label: 'G3', carnaticName: 'Antara Gandharam', semitones: 4, isBlack: false },
  { note: 'F4', label: 'M1', carnaticName: 'Shuddha Madhyamam', semitones: 5, isBlack: false },
  { note: 'F#4', label: 'M2', carnaticName: 'Prati Madhyamam', semitones: 6, isBlack: true, leftIndex: 3 },
  { note: 'G4', label: 'Pa', carnaticName: 'Panchamam', semitones: 7, isBlack: false },
  { note: 'G#4', label: 'D1', carnaticName: 'Shuddha Dhaivatam', semitones: 8, isBlack: true, leftIndex: 4 },
  { note: 'A4', label: 'D2 / N1', carnaticName: 'Chatushruti Dhaivatam', semitones: 9, isBlack: false },
  { note: 'A#4', label: 'N2 / D3', carnaticName: 'Kaisiki Nishadam', semitones: 10, isBlack: true, leftIndex: 5 },
  { note: 'B4', label: 'N3', carnaticName: 'Kakali Nishadam', semitones: 11, isBlack: false },
  { note: 'C5', label: "Sa'", carnaticName: 'Shadjam (Tarastayi)', semitones: 12, isBlack: false },
];

const whiteKeys = SWARA_OPTIONS.filter(o => !o.isBlack);
const blackKeys = SWARA_OPTIONS.filter(o => o.isBlack);

interface CustomPracticeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CustomPracticeModal({ isOpen, onClose }: CustomPracticeModalProps) {
  const [selectedNotes, setSelectedNotes] = useState<string[]>(['C4', 'E4', 'G4', 'C5']); // Default Sa - Ga - Pa - Sa'
  const [speed, setSpeed] = useState<'slow' | 'medium' | 'fast'>('medium');
  const [speedMs, setSpeedMs] = useState<number>(800);
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [currentlyPlayingNote, setCurrentlyPlayingNote] = useState<string | null>(null);

  const loopTimeoutRef = useRef<any>(null);
  
  // Use a ref to store the latest state variables for the loop timeout function
  const stateRef = useRef({
    selectedNotes: [] as string[],
    speedMs: 800,
    currentIndex: 0,
    isLooping: false,
  });

  useEffect(() => {
    stateRef.current.selectedNotes = selectedNotes;
    stateRef.current.speedMs = speedMs;
    stateRef.current.isLooping = isLooping;
  }, [selectedNotes, speedMs, isLooping]);

  // Cleanup on unmount/close
  useEffect(() => {
    return () => {
      stopLooping();
    };
  }, []);

  const toggleNote = (note: string) => {
    setSelectedNotes(prev => {
      const isSelected = prev.includes(note);
      let newSelection: string[];
      if (isSelected) {
        newSelection = prev.filter(n => n !== note);
      } else {
        // Keep it in the exact clicked order (append to the end)
        newSelection = [...prev, note];
      }

      // If loop is active and new list is empty, stop loop
      if (newSelection.length === 0 && isLooping) {
        stopLooping();
      }

      return newSelection;
    });
  };

  const selectAll = () => {
    setSelectedNotes(SWARA_OPTIONS.map(o => o.note));
  };

  const selectNatural = () => {
    setSelectedNotes(['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5']);
  };

  const clearAll = () => {
    stopLooping();
    setSelectedNotes([]);
  };

  const triggerNextNote = () => {
    if (!stateRef.current.isLooping) return;
    const activeList = stateRef.current.selectedNotes;
    if (activeList.length === 0) {
      stopLooping();
      return;
    }

    const nextIndex = (stateRef.current.currentIndex + 1) % activeList.length;
    stateRef.current.currentIndex = nextIndex;

    const noteToPlay = activeList[nextIndex];
    setCurrentlyPlayingNote(noteToPlay);

    // Get note duration
    let duration = '0.5s';
    if (speed === 'slow') duration = '1.0s';
    else if (speed === 'fast') duration = '0.25s';

    playNote(noteToPlay, duration).catch(err => console.error('Loop play error:', err));

    loopTimeoutRef.current = setTimeout(() => {
      triggerNextNote();
    }, stateRef.current.speedMs);
  };

  const startLooping = async () => {
    if (selectedNotes.length === 0) return;
    
    stopLooping();
    await initAudio();
    setIsLooping(true);

    const startIndex = 0;
    stateRef.current.currentIndex = startIndex;
    stateRef.current.isLooping = true;

    const noteToPlay = selectedNotes[startIndex];
    setCurrentlyPlayingNote(noteToPlay);

    let duration = '0.5s';
    if (speed === 'slow') duration = '1.0s';
    else if (speed === 'fast') duration = '0.25s';

    playNote(noteToPlay, duration).catch(err => console.error('Loop start error:', err));

    loopTimeoutRef.current = setTimeout(() => {
      triggerNextNote();
    }, speedMs);
  };

  const stopLooping = () => {
    setIsLooping(false);
    setCurrentlyPlayingNote(null);
    if (loopTimeoutRef.current) {
      clearTimeout(loopTimeoutRef.current);
      loopTimeoutRef.current = null;
    }
  };

  const handleClose = () => {
    stopLooping();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      {/* Backdrop click to close */}
      <div className="absolute inset-0 cursor-pointer" onClick={handleClose} />
      
      {/* Modal Card */}
      <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col relative shadow-2xl z-10 animate-fade-in-up">
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-indigo-600 to-purple-600 p-2.5 rounded-xl shadow-lg">
              <Sliders className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                Custom Practice Room
              </h3>
              <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                Design custom swara scales, configure playback speed, and loop patterns.
              </p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="bg-white/5 hover:bg-white/10 border border-white/10 p-2 rounded-xl text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Swara Selection Header & Utilities */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block text-left">
                Select Swaras (Swarasthanas)
              </span>
              <div className="flex gap-2">
                <button
                  onClick={selectNatural}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-[10px] font-mono font-bold transition-all cursor-pointer border border-white/5"
                >
                  Saptaswaras (Natural)
                </button>
                <button
                  onClick={selectAll}
                  className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-gray-300 text-[10px] font-mono font-bold transition-all cursor-pointer border border-white/5"
                >
                  Select All (12 Notes)
                </button>
                <button
                  onClick={clearAll}
                  className="px-2.5 py-1 bg-red-950/20 hover:bg-red-950/40 text-red-400 text-[10px] font-mono font-bold transition-all cursor-pointer border border-red-900/30"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Piano Keyboard for Selection */}
            <div className="relative w-full max-w-2xl mx-auto select-none bg-slate-950 p-4 border border-white/10 rounded-2xl shadow-xl aspect-[16/6.5]">
              {/* White Keys */}
              <div className="w-full h-full flex gap-1 relative z-10">
                {whiteKeys.map((key) => {
                  const isSelected = selectedNotes.includes(key.note);
                  const isPlaying = currentlyPlayingNote === key.note;
                  return (
                    <button
                      key={key.note}
                      onClick={() => toggleNote(key.note)}
                      className={`flex-1 h-full rounded-b-xl flex flex-col justify-end items-center pb-3 transition-all duration-150 cursor-pointer ${
                        isPlaying
                          ? 'bg-amber-400 border-t-4 border-amber-500 pt-0 text-slate-950 translate-y-0.5 shadow-none'
                          : isSelected
                          ? 'bg-indigo-600/30 border-b-[6px] border-indigo-500 text-white border-t border-indigo-400/20 shadow-[0_0_10px_rgba(99,102,241,0.2)]'
                          : 'bg-white hover:bg-slate-50 border-b-[6px] border-slate-300 text-slate-800'
                      }`}
                    >
                      <span className="block text-sm md:text-base font-extrabold font-serif leading-none">
                        {key.label}
                      </span>
                      <span className="block text-[8px] font-mono mt-1 opacity-70">
                        {key.note}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Black Keys */}
              {blackKeys.map((key) => {
                const isSelected = selectedNotes.includes(key.note);
                const isPlaying = currentlyPlayingNote === key.note;
                const leftOffset = `calc(12.5% * (${key.leftIndex!} + 1) - 4.2%)`;
                return (
                  <button
                    key={key.note}
                    onClick={() => toggleNote(key.note)}
                    style={{ left: leftOffset, width: '8.4%' }}
                    className={`absolute top-4 h-[60%] rounded-b-lg flex flex-col justify-end items-center pb-2 z-20 transition-all duration-150 cursor-pointer ${
                      isPlaying
                        ? 'bg-amber-400 border-t-2 border-amber-500 pt-0 text-slate-950 translate-y-0.5 shadow-none'
                        : isSelected
                        ? 'bg-violet-600 border-b-4 border-violet-850 border-x border-violet-700/50 text-white shadow-[0_0_12px_rgba(139,92,246,0.4)]'
                        : 'bg-slate-900 hover:bg-slate-850 border-b-4 border-black border-x border-slate-800 text-slate-300'
                    }`}
                  >
                    <span className="block text-[10px] md:text-xs font-bold font-serif leading-none">
                      {key.label}
                    </span>
                    <span className="block text-[8px] font-mono mt-1 opacity-60">
                      {key.note}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Speed Selection */}
          <div className="space-y-2 text-left">
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block">Playback Speed</span>
            <div className="flex gap-2">
              {[
                { id: 'slow', label: 'Slow (1.5s)', ms: 1500 },
                { id: 'medium', label: 'Medium (0.8s)', ms: 800 },
                { id: 'fast', label: 'Fast (0.4s)', ms: 400 }
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setSpeed(s.id as any);
                    setSpeedMs(s.ms);
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
                    speed === s.id
                      ? 'bg-primary-600 border border-primary-500 text-white shadow-inner'
                      : 'bg-white/5 border border-white/5 text-gray-400 hover:text-gray-200 hover:bg-white/10'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Loop Control Panel */}
          <div className="glass bg-slate-950/40 p-5 border border-white/5 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-left space-y-1">
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block">Loop Control</span>
              {isLooping ? (
                <p className="text-xs text-green-400 animate-pulse font-semibold">Looping selected swaras in click order...</p>
              ) : (
                <p className="text-xs text-gray-400 leading-normal">Play selected swaras repeatedly at current tempo speed.</p>
              )}
            </div>
            
            <div className="w-full sm:w-auto shrink-0">
              {isLooping ? (
                <button
                  onClick={stopLooping}
                  className="w-full sm:px-8 py-3 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-rose-600/20 animate-pulse"
                >
                  <Square className="w-4 h-4 fill-current" />
                  Stop Loop
                </button>
              ) : (
                <button
                  onClick={startLooping}
                  disabled={selectedNotes.length === 0}
                  className={`w-full sm:px-8 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    selectedNotes.length === 0
                      ? 'bg-white/5 border border-white/5 text-gray-655 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20'
                  }`}
                >
                  <Play className="w-4 h-4 fill-current" />
                  Start Loop
                </button>
              )}
            </div>
          </div>

          {/* Selected Swaras list */}
          <div className="space-y-2 text-left">
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block">Selected Scale Mappings</span>
            {selectedNotes.length > 0 ? (
              <div className="flex flex-wrap gap-2 max-h-[120px] overflow-y-auto p-1">
                {selectedNotes.map((note, idx) => {
                  const swara = SWARA_OPTIONS.find(o => o.note === note);
                  if (!swara) return null;
                  const isPlaying = currentlyPlayingNote === note;
                  return (
                    <div
                      key={`${note}-${idx}`}
                      className={`px-3 py-1.5 rounded-xl border text-[11px] font-semibold flex items-center gap-2 transition-all ${
                        isPlaying
                          ? 'bg-amber-400 border-amber-500 text-slate-950 font-bold scale-[1.04]'
                          : 'bg-white/5 border-white/5 text-gray-300'
                      }`}
                    >
                      <span className="font-serif text-xs font-bold">{swara.label}</span>
                      <span className="opacity-70 font-sans">({swara.carnaticName})</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-center text-xs text-gray-500 italic">
                Select at least one swara from the keyboard above to start looping...
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-gray-500">
          <span>SvaraSadhana Custom Practice Lab</span>
          <span>Sa = C4 (261.63 Hz)</span>
        </div>

      </div>
    </div>
  );
}
