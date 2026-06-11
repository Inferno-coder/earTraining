import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Play, RefreshCw, Volume2, RotateCcw, Eye, Delete, EyeOff, VolumeX, Home } from 'lucide-react';
import { playNote, startTanpura, stopTanpura } from '../../utils/audio';
import type { ReconstructionConfig } from './configs/types';
import { useAuth } from '../../auth/useAuth';
import { startPracticeSession, logPracticeAttempt, finishPracticeSession } from '../../lib/api';

const swaraDetailsMap: Record<string, { full: string; note: string; color: string; hoverColor: string; shadow: string }> = {
  'Sa': { full: 'Shadjam', note: 'C4', color: 'bg-rose-500/10 border-rose-500/30 hover:border-rose-400 text-rose-300', hoverColor: 'hover:bg-rose-500/20', shadow: 'shadow-[0_0_15px_rgba(244,63,94,0.3)]' },
  'R1': { full: 'Shuddha Rishabham', note: 'C#4', color: 'bg-rose-500/10 border-rose-500/30 hover:border-rose-400 text-rose-300', hoverColor: 'hover:bg-rose-500/20', shadow: 'shadow-[0_0_15px_rgba(244,63,94,0.3)]' },
  'Ri': { full: 'Chatushruti Rishabham', note: 'D4', color: 'bg-orange-500/10 border-orange-500/30 hover:border-orange-400 text-orange-300', hoverColor: 'hover:bg-orange-500/20', shadow: 'shadow-[0_0_15px_rgba(249,115,22,0.3)]' },
  'R2': { full: 'Chatushruti Rishabham', note: 'D4', color: 'bg-orange-500/10 border-orange-500/30 hover:border-orange-400 text-orange-300', hoverColor: 'hover:bg-orange-500/20', shadow: 'shadow-[0_0_15px_rgba(249,115,22,0.3)]' },
  'G2': { full: 'Sadharana Gandharam', note: 'D#4', color: 'bg-amber-500/10 border-amber-500/30 hover:border-amber-400 text-amber-300', hoverColor: 'hover:bg-amber-500/20', shadow: 'shadow-[0_0_15px_rgba(245,158,11,0.3)]' },
  'Ga': { full: 'Antara Gandharam', note: 'E4', color: 'bg-yellow-500/10 border-yellow-500/30 hover:border-yellow-400 text-yellow-300', hoverColor: 'hover:bg-yellow-500/20', shadow: 'shadow-[0_0_15px_rgba(234,179,8,0.3)]' },
  'G3': { full: 'Antara Gandharam', note: 'E4', color: 'bg-yellow-500/10 border-yellow-500/30 hover:border-yellow-400 text-yellow-300', hoverColor: 'hover:bg-yellow-500/20', shadow: 'shadow-[0_0_15px_rgba(234,179,8,0.3)]' },
  'M1': { full: 'Shuddha Madhyamam', note: 'F4', color: 'bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-400 text-emerald-300', hoverColor: 'hover:bg-emerald-500/20', shadow: 'shadow-[0_0_15px_rgba(16,185,129,0.3)]' },
  'Ma': { full: 'Shuddha Madhyamam', note: 'F4', color: 'bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-400 text-emerald-300', hoverColor: 'hover:bg-emerald-500/20', shadow: 'shadow-[0_0_15px_rgba(16,185,129,0.3)]' },
  'M2': { full: 'Prati Madhyamam', note: 'F#4', color: 'bg-teal-500/10 border-teal-500/30 hover:border-teal-400 text-teal-300', hoverColor: 'hover:bg-teal-500/20', shadow: 'shadow-[0_0_15px_rgba(20,184,166,0.3)]' },
  'Pa': { full: 'Panchamam', note: 'G4', color: 'bg-cyan-500/10 border-cyan-500/30 hover:border-cyan-400 text-cyan-300', hoverColor: 'hover:bg-cyan-500/20', shadow: 'shadow-[0_0_15px_rgba(6,182,212,0.3)]' },
  'D1': { full: 'Shuddha Dhaivatam', note: 'G#4', color: 'bg-blue-500/10 border-blue-500/30 hover:border-blue-400 text-blue-300', hoverColor: 'hover:bg-blue-500/20', shadow: 'shadow-[0_0_15px_rgba(59,130,246,0.3)]' },
  'Dha': { full: 'Chatushruti Dhaivatam', note: 'A4', color: 'bg-indigo-500/10 border-indigo-500/30 hover:border-indigo-400 text-indigo-300', hoverColor: 'hover:bg-indigo-500/20', shadow: 'shadow-[0_0_15px_rgba(99,102,241,0.3)]' },
  'D2': { full: 'Chatushruti Dhaivatam', note: 'A4', color: 'bg-indigo-500/10 border-indigo-500/30 hover:border-indigo-400 text-indigo-300', hoverColor: 'hover:bg-indigo-500/20', shadow: 'shadow-[0_0_15px_rgba(99,102,241,0.3)]' },
  'N2': { full: 'Kaisiki Nishadam', note: 'A#4', color: 'bg-violet-500/10 border-violet-500/30 hover:border-violet-400 text-violet-300', hoverColor: 'hover:bg-violet-500/20', shadow: 'shadow-[0_0_15px_rgba(139,92,246,0.3)]' },
  'Ni': { full: 'Kakali Nishadam', note: 'B4', color: 'bg-purple-500/10 border-purple-500/30 hover:border-purple-400 text-purple-300', hoverColor: 'hover:bg-purple-500/20', shadow: 'shadow-[0_0_15px_rgba(168,85,247,0.3)]' },
  'N3': { full: 'Kakali Nishadam', note: 'B4', color: 'bg-purple-500/10 border-purple-500/30 hover:border-purple-400 text-purple-300', hoverColor: 'hover:bg-purple-500/20', shadow: 'shadow-[0_0_15px_rgba(168,85,247,0.3)]' },
  "Sa'": { full: 'Tarastayi Shadjam', note: 'C5', color: 'bg-fuchsia-500/10 border-fuchsia-500/30 hover:border-fuchsia-400 text-fuchsia-300', hoverColor: 'hover:bg-fuchsia-500/20', shadow: 'shadow-[0_0_15px_rgba(217,70,239,0.3)]' }
};

const speedSettings = {
  slow: { noteDur: '0.75s', delay: 850 },
  medium: { noteDur: '0.45s', delay: 550 },
  fast: { noteDur: '0.22s', delay: 320 }
};

const getReconstructionTotalQuestions = (length: number): number => {
  if (length === 3) return 15;
  if (length === 4) return 20;
  if (length === 5) return 20;
  if (length === 6) return 25;
  if (length === 7) return 25;
  return 15; // fallback
};

interface ReconstructionEngineProps {
  config: ReconstructionConfig;
  onBack: () => void;
  onNext?: () => void;
  onHome: () => void;
}

export default function ReconstructionEngine({ config, onBack, onNext, onHome }: ReconstructionEngineProps) {
  // Auth & API states
  const { session } = useAuth();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [attemptStartTime, setAttemptStartTime] = useState<number | null>(null);
  const [sessionFinished, setSessionFinished] = useState<boolean>(false);

  const [sequenceLength, setSequenceLength] = useState<number>(config.defaultLength);
  const [targetSequence, setTargetSequence] = useState<string[]>([]);
  const [userSequence, setUserSequence] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackActiveIndex, setPlaybackActiveIndex] = useState<number | null>(null);
  const [speed, setSpeed] = useState<'slow' | 'medium' | 'fast'>('medium');
  
  const [tanpuraActive, setTanpuraActive] = useState<boolean>(false);
  const [roundStatus, setRoundStatus] = useState<'idle' | 'playing' | 'entering' | 'correct' | 'incorrect'>('idle');
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  
  const [score, setScore] = useState<number>(0);
  const [attempts, setAttempts] = useState<number>(0);

  const initSession = async () => {
    if (!session?.access_token) return;
    try {
      const sid = await startPracticeSession(session.access_token, config.stage, config.level);
      setSessionId(sid);
      setSessionStartTime(Date.now());
      setSessionFinished(false);
    } catch (err) {
      console.error('[ReconstructionEngine] Failed to start reconstruction session:', err);
    }
  };

  const endSession = async () => {
    if (session?.access_token && sessionId && sessionStartTime && !sessionFinished) {
      const durationMs = Date.now() - sessionStartTime;
      try {
        setSessionFinished(true);
        await finishPracticeSession(session.access_token, sessionId, durationMs);
        console.log('[ReconstructionEngine] Practice session finished successfully');
      } catch (err) {
        console.error('[ReconstructionEngine] Failed to finish reconstruction session:', err);
      }
    }
  };

  const handleBack = async () => {
    await endSession();
    onBack();
  };

  const handleHome = async () => {
    await endSession();
    onHome();
  };

  const handleNext = async () => {
    await endSession();
    if (onNext) onNext();
  };

  // Helper to fetch details with fallback
  const getSwaraDetails = (swara: string) => {
    if (swaraDetailsMap[swara]) return swaraDetailsMap[swara];
    return {
      full: swara,
      note: config.swaraToNote[swara] || 'C4',
      color: 'bg-slate-500/10 border-slate-500/30 hover:border-slate-400 text-slate-300',
      hoverColor: 'hover:bg-slate-500/20',
      shadow: 'shadow-[0_0_15px_rgba(148,163,184,0.3)]'
    };
  };

  // Generate target sequence
  const generateSequence = (len: number) => {
    const seq: string[] = [];
    for (let i = 0; i < len; i++) {
      const randNote = config.notesList[Math.floor(Math.random() * config.notesList.length)];
      seq.push(randNote);
    }
    return seq;
  };

  // Start new round
  const startNewRound = (len: number = sequenceLength) => {
    const newSeq = generateSequence(len);
    setTargetSequence(newSeq);
    setUserSequence([]);
    setRoundStatus('idle');
    setShowAnswer(false);
    setPlaybackActiveIndex(null);
  };

  // Sync sequence generation with length changes or config updates
  useEffect(() => {
    startNewRound(sequenceLength);
  }, [sequenceLength]);

  // Restart practice session when configuration changes
  useEffect(() => {
    setSessionId(null);
    setSessionStartTime(null);
    setAttemptStartTime(null);
    setSessionFinished(false);
    setScore(0);
    setAttempts(0);
    initSession();
  }, [config]);

  // Clean up Tanpura on unmount
  useEffect(() => {
    return () => {
      stopTanpura();
    };
  }, []);

  // Toggle Tanpura drone
  const handleToggleTanpura = async () => {
    if (tanpuraActive) {
      stopTanpura();
      setTanpuraActive(false);
    } else {
      try {
        await startTanpura(261.63);
        setTanpuraActive(true);
      } catch (err) {
        console.error('Failed to start Tanpura drone:', err);
      }
    }
  };

  // Play target sequence melody
  const handlePlaySequence = async () => {
    const totalRounds = getReconstructionTotalQuestions(sequenceLength);
    if (isPlaying || targetSequence.length === 0 || attempts >= totalRounds) return;
    setIsPlaying(true);
    setRoundStatus('playing');
    setUserSequence([]);
    setShowAnswer(false);
    setAttemptStartTime(Date.now());

    const { noteDur, delay } = speedSettings[speed];

    for (let i = 0; i < targetSequence.length; i++) {
      setPlaybackActiveIndex(i);
      try {
        await playNote(targetSequence[i], noteDur);
      } catch (err) {
        console.error('Sequence playback failed:', err);
      }
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    setPlaybackActiveIndex(null);
    setIsPlaying(false);
    setRoundStatus('entering');
  };

  // Handle user swara button tap
  const handleTapSwara = async (swara: string) => {
    const totalRounds = getReconstructionTotalQuestions(sequenceLength);
    if (isPlaying || roundStatus === 'correct' || roundStatus === 'incorrect' || targetSequence.length === 0 || !sessionId || attempts >= totalRounds) return;

    // Play note sound instantly
    const details = getSwaraDetails(swara);
    try {
      await playNote(details.note, '0.4s');
    } catch (err) {
      console.error('Note playback failed:', err);
    }

    // Append to user sequence
    const updatedUserSeq = [...userSequence, swara];
    setUserSequence(updatedUserSeq);

    // Auto-check once user sequence is full
    if (updatedUserSeq.length === sequenceLength) {
      const targetSwaras = targetSequence.map(note => config.noteToSwara[note]);
      const isCorrect = updatedUserSeq.every((s, idx) => s === targetSwaras[idx]);

      const newAttemptsCount = attempts + 1;
      setAttempts(newAttemptsCount);
      if (isCorrect) {
        setScore(prev => prev + 1);
        setRoundStatus('correct');
      } else {
        setRoundStatus('incorrect');
      }

      const now = Date.now();
      const responseTimeMs = attemptStartTime ? now - attemptStartTime : null;

      if (session?.access_token) {
        try {
          await logPracticeAttempt(session.access_token, {
            sessionId,
            stage: config.stage,
            level: config.level,
            questionType: 'MELODY_RECONSTRUCTION',
            playedData: targetSequence,
            userAnswer: updatedUserSeq,
            isCorrect,
            responseTimeMs
          });
        } catch (err) {
          console.error('[ReconstructionEngine] Failed to log reconstruction attempt:', err);
        }
      }

      // Finish session automatically if rounds are complete
      if (newAttemptsCount >= totalRounds && session?.access_token && !sessionFinished) {
        const durationMs = sessionStartTime ? now - sessionStartTime : 0;
        try {
          setSessionFinished(true);
          await finishPracticeSession(session.access_token, sessionId, durationMs);
          console.log('[ReconstructionEngine] Practice session finished successfully');
        } catch (err) {
          console.error('[ReconstructionEngine] Failed to finish practice session:', err);
        }
      }
    }
  };

  // Undo last note
  const handleUndo = () => {
    if (userSequence.length > 0 && roundStatus === 'entering') {
      setUserSequence(prev => prev.slice(0, -1));
    }
  };

  // Clear current entry
  const handleClear = () => {
    if (roundStatus === 'entering') {
      setUserSequence([]);
    }
  };

  // Retry same sequence
  const handleRetrySame = () => {
    setUserSequence([]);
    setRoundStatus('idle');
    setShowAnswer(false);
  };

  // Generate difficulty selectors dynamically
  const lengths = [];
  for (let i = config.minLength; i <= config.maxLength; i++) {
    lengths.push(i);
  }

  // Row columns for swara keypad grid
  const keypadColClass = 
    config.swaraButtons.length <= 8 
      ? 'grid-cols-4 md:grid-cols-8' 
      : 'grid-cols-4 md:grid-cols-7 lg:grid-cols-13';

  return (
    <div className="min-h-screen flex flex-col font-sans relative overflow-x-hidden selection:bg-primary-500 selection:text-white">
      {/* Background Decorative Blur Blobs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-primary-600 filter blur-3xl opacity-10 animate-pulse-slow"></div>
      <div className="absolute top-2/3 right-1/4 w-96 h-96 rounded-full bg-accent-rose filter blur-3xl opacity-10 animate-pulse-slow"></div>

      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleBack}
            className="flex items-center gap-2 text-sm font-semibold text-gray-300 hover:text-white transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back
          </button>
          <span className="text-white/20">|</span>
          <button 
            onClick={handleHome}
            className="flex items-center gap-1.5 text-sm font-semibold text-gray-300 hover:text-white transition-colors cursor-pointer group"
          >
            <Home className="w-3.5 h-3.5" />
            Home
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-mono text-gray-400">STAGE {config.stage}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-accent-rose animate-pulse"></span>
          <span className="text-sm font-bold text-white tracking-wide">Level {config.level}: {config.title}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-xs font-mono text-gray-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
            <Volume2 className="w-3.5 h-3.5 text-primary-400" />
            Active: {config.enabledNotesLabel}
          </div>
          {onNext && (
            <button 
              onClick={handleNext}
              className="flex items-center gap-1.5 px-4 py-2 text-xs md:text-sm font-bold rounded-xl bg-primary-600 hover:bg-primary-500 text-white transition-colors cursor-pointer shadow-md shadow-primary-600/20"
            >
              Next Level
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 pt-3 pb-8 md:pt-6 md:pb-12 flex flex-col relative z-10 space-y-6 md:space-y-8">
        
        {/* Title Block */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono text-accent-rose uppercase tracking-widest font-bold block">Interactive Dictation</span>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">{config.title}</h2>
          <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
            {config.subtitle}
          </p>
        </div>

        {/* Dashboard Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Settings & Stats Panel (Left 4 columns) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Sequence Length Selector Card */}
            {lengths.length > 1 && (
              <div className="glass rounded-3xl p-5 border-white/5 space-y-4 flex flex-col justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Difficulty Configuration</span>
                  <h3 className="text-sm font-bold text-white">Sequence Length</h3>
                </div>

                <div className="flex bg-black/30 p-1 rounded-2xl border border-white/5 gap-1 overflow-x-auto">
                  {lengths.map((len) => {
                    const isActive = sequenceLength === len;
                    return (
                      <button
                        key={len}
                        disabled={isPlaying}
                        onClick={() => setSequenceLength(len)}
                        className={`w-9 h-9 text-xs rounded-xl font-bold transition-all flex items-center justify-center shrink-0 cursor-pointer ${
                          isActive
                            ? 'bg-gradient-to-tr from-primary-600 to-accent-rose text-white shadow-md shadow-primary-700/30'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {len}
                      </button>
                    );
                  })}
                </div>

                <p className="text-[10px] text-gray-400 font-mono italic">
                  💡 Target plays {sequenceLength} random notes.
                </p>
              </div>
            )}

            {/* Tanpura & Scoreboard Card */}
            <div className="glass rounded-3xl p-5 border-white/5 flex flex-col justify-between space-y-4">
              
              {/* Tanpura Control */}
              <div className="flex justify-between items-center">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1">
                    🪕 Tanpura Drone
                  </h4>
                  <span className="text-[9px] text-gray-400 font-mono">Ambient drone in C4</span>
                </div>
                <button
                  onClick={handleToggleTanpura}
                  className={`px-3 py-1.5 text-[10px] font-mono font-bold rounded-xl border transition-all cursor-pointer flex items-center gap-1 ${
                    tanpuraActive
                      ? 'bg-accent-amber/20 border-accent-amber/40 text-accent-amber'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  {tanpuraActive ? <Volume2 className="w-3.5 h-3.5 text-accent-amber animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
                  {tanpuraActive ? 'ON' : 'OFF'}
                </button>
              </div>

              {/* Playback Speed Switch */}
              <div className="space-y-2 pt-3 border-t border-white/5">
                <h4 className="text-xs font-bold text-white">Playback Speed</h4>
                <div className="flex bg-black/30 p-0.5 rounded-xl border border-white/5 gap-1">
                  {(['slow', 'medium', 'fast'] as const).map((s) => {
                    const isActive = speed === s;
                    return (
                      <button
                        key={s}
                        disabled={isPlaying}
                        onClick={() => setSpeed(s)}
                        className={`flex-1 py-1 text-[9px] font-mono font-bold rounded-lg uppercase tracking-wider transition-all cursor-pointer ${
                          isActive
                            ? 'bg-gradient-to-tr from-primary-600 to-accent-rose text-white shadow-sm'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="h-px bg-white/5"></div>

              {/* Scoreboard */}
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-300 font-medium">Session Score</span>
                <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-xs font-mono text-gray-300">
                  Correct: <strong className="text-white text-sm">{score}</strong> / {attempts}
                </div>
              </div>
            </div>

          </div>

          {/* Melody Board Panel (Right 8 columns) */}
          <div className="lg:col-span-8 glass rounded-3xl p-6 border-white/5 shadow-xl flex flex-col justify-between space-y-6">
            
            {/* Player Visualizer & Slots */}
            <div className="p-5 bg-slate-950/70 border border-white/5 rounded-2xl flex flex-col items-center justify-center space-y-5 shadow-inner relative overflow-hidden">
              {/* Background glow when playing */}
              {roundStatus === 'playing' && (
                <div className="absolute inset-0 bg-primary-500/5 filter blur-xl animate-pulse"></div>
              )}

              {/* Play Trigger */}
              <button
                disabled={isPlaying}
                onClick={handlePlaySequence}
                className={`w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center gap-1 transition-all duration-300 cursor-pointer shadow-lg relative ${
                  isPlaying
                    ? 'bg-slate-900 border-white/5 text-gray-500 shadow-none cursor-not-allowed scale-95'
                    : 'bg-gradient-to-tr from-primary-600/20 via-primary-700/10 to-accent-rose/20 hover:from-primary-600/35 hover:to-accent-rose/35 border-primary-500/30 text-white hover:border-primary-400/50 scale-100 hover:scale-105 shadow-primary-700/10'
                }`}
              >
                {isPlaying ? (
                  <>
                    <RefreshCw className="w-7 h-7 text-primary-400 animate-spin" />
                    <span className="text-[9px] font-mono tracking-widest uppercase font-bold text-primary-400">Playing</span>
                  </>
                ) : (
                  <>
                    <Play className="w-8 h-8 fill-current text-white animate-pulse" />
                    <span className="text-[9px] font-mono tracking-widest uppercase font-bold text-gray-300">Play melody</span>
                  </>
                )}
              </button>

              {/* Slots row */}
              <div className="flex flex-wrap gap-2.5 justify-center items-center py-2 w-full">
                {Array.from({ length: sequenceLength }).map((_, idx) => {
                  const isPlaybackActive = playbackActiveIndex === idx;
                  const swara = userSequence[idx];
                  const hasValue = !!swara;
                  
                  let borderStyle = "border-white/10 bg-slate-950/40";
                  let textStyle = "text-gray-500";
                  
                  if (isPlaybackActive) {
                    borderStyle = "border-primary-400 bg-primary-950/20 shadow-[0_0_12px_rgba(139,92,246,0.4)] animate-pulse";
                  } else if (roundStatus === 'correct') {
                    borderStyle = "border-green-500 bg-green-950/20 shadow-[0_0_12px_rgba(34,197,94,0.4)]";
                    textStyle = "text-green-400 font-extrabold";
                  } else if (roundStatus === 'incorrect') {
                    borderStyle = "border-red-500 bg-red-950/20 shadow-[0_0_12px_rgba(239,68,68,0.4)]";
                    textStyle = "text-red-400 font-extrabold";
                  } else if (hasValue) {
                    borderStyle = "border-amber-500 bg-amber-950/10 shadow-[0_0_8px_rgba(245,158,11,0.2)]";
                    textStyle = "text-accent-amber font-bold";
                  }
                  
                  return (
                    <div 
                      key={idx}
                      className={`w-12 h-12 md:w-14 md:h-14 rounded-xl border flex items-center justify-center transition-all duration-200 text-base md:text-xl font-serif ${borderStyle} ${textStyle}`}
                    >
                      {swara || (isPlaybackActive ? "♪" : "?")}
                    </div>
                  );
                })}
              </div>

              {/* Reveal answer row */}
              {showAnswer && (
                <div className="p-3 bg-slate-900/90 border border-white/5 rounded-xl text-center text-xs text-accent-amber font-serif leading-relaxed animate-fade-in-up w-full max-w-xs">
                  <span className="font-sans text-[9px] text-gray-500 font-mono uppercase tracking-wider block mb-0.5">Correct Sequence</span>
                  {targetSequence.map(note => config.noteToSwara[note]).join(' - ')}
                </div>
              )}
            </div>

            {/* Swara Keypad Grid */}
            <div className="space-y-4">
              <span className="text-xs font-mono text-gray-400 uppercase tracking-widest block text-left">
                {roundStatus === 'correct' ? '🎉 Reconstructed!' : roundStatus === 'incorrect' ? '❌ Sequence mismatch' : '👇 Tap Swaras in Order'}
              </span>

              <div className={`grid ${keypadColClass} gap-2`}>
                {config.swaraButtons.map((swara) => {
                  const details = getSwaraDetails(swara);
                  const totalRounds = getReconstructionTotalQuestions(sequenceLength);
                  const isDisabled = isPlaying || roundStatus === 'correct' || roundStatus === 'incorrect' || attempts >= totalRounds;
                  return (
                    <button
                      key={swara}
                      disabled={isDisabled}
                      onClick={() => handleTapSwara(swara)}
                      className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center cursor-pointer ${details.color} ${details.hoverColor} ${details.shadow} active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed`}
                    >
                      <span className="block text-base md:text-lg font-extrabold font-serif leading-none">
                        {swara}
                      </span>
                      <span className="block text-[8px] font-sans opacity-60 tracking-tight mt-1 leading-none truncate max-w-full">
                        {details.full}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col space-y-4 pt-4 border-t border-white/5 w-full">
              {attempts >= getReconstructionTotalQuestions(sequenceLength) ? (
                <div className="p-4 bg-primary-950/40 border border-primary-500/30 rounded-xl space-y-3 w-full">
                  <p className="text-sm font-bold text-white text-center">🏁 Level Complete!</p>
                  <p className="text-xs text-gray-300 text-center">
                    You scored <strong className="text-white text-sm">{score}</strong> out of {getReconstructionTotalQuestions(sequenceLength)} rounds ({Math.round((score / getReconstructionTotalQuestions(sequenceLength)) * 100)}%).
                  </p>
                  <button
                    onClick={() => {
                      setScore(0);
                      setAttempts(0);
                      setSessionId(null);
                      setSessionStartTime(null);
                      setSessionFinished(false);
                      startNewRound(sequenceLength);
                      initSession();
                    }}
                    className="w-full py-2.5 rounded-xl font-bold bg-primary-600 hover:bg-primary-500 text-white flex items-center justify-center gap-1.5 transition-all text-sm cursor-pointer"
                  >
                    Start New Practice
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2.5 justify-end min-h-[48px] w-full">
                  {roundStatus === 'entering' && (
                    <>
                      <button
                        disabled={userSequence.length === 0}
                        onClick={handleUndo}
                        className="py-2 px-3 text-xs font-semibold rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white transition-all flex items-center gap-1 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Delete className="w-3.5 h-3.5" />
                        Backspace
                      </button>
                      <button
                        disabled={userSequence.length === 0}
                        onClick={handleClear}
                        className="py-2 px-3 text-xs font-semibold rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white transition-all flex items-center gap-1 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Clear
                      </button>
                    </>
                  )}

                  {roundStatus === 'incorrect' && (
                    <>
                      <button
                        onClick={() => setShowAnswer(!showAnswer)}
                        className="py-2 px-3.5 text-xs font-semibold rounded-xl bg-amber-500/10 border border-amber-500/30 text-accent-amber hover:bg-amber-500/20 transition-all flex items-center gap-1 cursor-pointer"
                      >
                        {showAnswer ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        {showAnswer ? 'Hide Answer' : 'Show Answer'}
                      </button>
                      <button
                        onClick={handleRetrySame}
                        className="py-2 px-3.5 text-xs font-bold rounded-xl bg-white/10 border border-white/10 text-white hover:bg-white/15 transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Retry
                      </button>
                      <button
                        onClick={() => startNewRound(sequenceLength)}
                        className="py-2 px-3.5 text-xs font-bold rounded-xl bg-primary-600 hover:bg-primary-500 text-white transition-all flex items-center gap-1 cursor-pointer"
                      >
                        Next Melody
                      </button>
                    </>
                  )}

                  {roundStatus === 'correct' && (
                    <button
                      onClick={() => startNewRound(sequenceLength)}
                      className="py-2.5 px-5 text-xs font-bold rounded-xl bg-green-600 hover:bg-green-500 text-white transition-all flex items-center gap-1 cursor-pointer shadow-md shadow-green-600/20"
                    >
                      Correct! Next Melody
                    </button>
                  )}
                </div>
              )}
            </div>

          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="glass border-t border-white/5 py-6 mt-12 text-center text-xs text-gray-500 px-6">
        <p>© 2026 ClearEar Studio • Stage {config.stage} Dictation</p>
      </footer>
    </div>
  );
}
