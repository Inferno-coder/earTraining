import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, Play, RefreshCw, Volume2, RotateCcw, Eye, Delete, EyeOff, Home, ChevronRight, Lock, Award, Sparkles } from 'lucide-react';
import { playNote, stopTanpura } from '../../utils/audio';
import type { ReconstructionConfig } from './configs/types';
import { useAuth } from '../../auth/useAuth';
import { startPracticeSession, logPracticeAttempt, finishPracticeSession, saveReconstructionProgress } from '../../lib/api';
import LevelSelector from './LevelSelector';

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
  onChangeLevel?: (stage: number, level: number) => void;
}

export default function ReconstructionEngine({ config, onBack, onNext, onHome, onChangeLevel }: ReconstructionEngineProps) {
  // Auth & API states
  const { session, updateProgress, progress } = useAuth();

  const handleLevelChange = async (stage: number, level: number) => {
    await endSession();
    if (onChangeLevel) {
      onChangeLevel(stage, level);
    }
  };
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [attemptStartTime, setAttemptStartTime] = useState<number | null>(null);
  const [sessionFinished, setSessionFinished] = useState<boolean>(false);
  const [completionResponse, setCompletionResponse] = useState<{ pass: boolean; xpGained?: number } | null>(null);

  const isNextLevelUnlocked = (): boolean => {
    if (!progress) return false;
    const { highest_unlocked_stage, highest_unlocked_level } = progress;
    if (highest_unlocked_stage > config.stage) return true;
    if (highest_unlocked_stage === config.stage && highest_unlocked_level > config.level) return true;
    return false;
  };

  const isOrderedLengthProgression = (config.stage === 4 && config.level === 1) || (config.stage === 5 && config.level === 7);
  const isLevelCompletedBefore = progress && (
    progress.highest_unlocked_stage > config.stage ||
    (progress.highest_unlocked_stage === config.stage && progress.highest_unlocked_level > config.level)
  ) ? true : false;

  const levelKey = `s${config.stage}l${config.level}`;

  // Set initial state
  const isInitializedRef = useRef<boolean>(false);

  // Set initial state
  const [unlockedLength, setUnlockedLengthState] = useState<number>(() => {
    if (isOrderedLengthProgression) {
      if (isLevelCompletedBefore) return config.maxLength;
      const backendVal = progress?.reconstruction_states?.[levelKey]?.unlocked_length;
      if (backendVal !== undefined) return backendVal;
      return config.minLength;
    }
    return config.maxLength;
  });

  const [lengthXP, setLengthXPState] = useState<number>(() => {
    if (isOrderedLengthProgression) {
      const backendVal = progress?.reconstruction_states?.[levelKey]?.length_xp;
      if (backendVal !== undefined) return backendVal;
      return 0;
    }
    return 0;
  });

  // Reset initialization ref if level key changes
  useEffect(() => {
    isInitializedRef.current = false;
  }, [levelKey]);

  // Sync state if progress loads/changes from backend (only on initial load)
  useEffect(() => {
    if (progress && !isInitializedRef.current) {
      if (progress.reconstruction_states?.[levelKey]) {
        const { unlocked_length, length_xp } = progress.reconstruction_states[levelKey];
        setUnlockedLengthState(unlocked_length);
        setLengthXPState(length_xp);
        if (!isLevelCompletedBefore) {
          setSequenceLength(unlocked_length);
        }
      }
      isInitializedRef.current = true;
    }
  }, [progress, levelKey, isLevelCompletedBefore]);

  const saveProgress = async (len: number, xp: number) => {
    setUnlockedLengthState(len);
    setLengthXPState(xp);

    if (session?.access_token) {
      try {
        const updatedProg = await saveReconstructionProgress(
          session.access_token,
          config.stage,
          config.level,
          len,
          xp
        );
        updateProgress(updatedProg);
      } catch (err) {
        console.error('[ReconstructionEngine] Failed to save progress to backend:', err);
      }
    }
  };

  const saveLengthXP = (xp: number) => {
    saveProgress(unlockedLength, xp);
  };

  const setUnlockedLength = (len: number) => {
    saveProgress(len, lengthXP);
  };

  const [lengthCompletedThisRound, setLengthCompletedThisRound] = useState<boolean>(false);
  const [showXPGlow, setShowXPGlow] = useState<boolean>(false);
  const [barPulse, setBarPulse] = useState<boolean>(false);
  const [sparkles, setSparkles] = useState<{ id: number; left: number; delay: number }[]>([]);

  const triggerXPEffects = () => {
    // 1. Pulse progress bar container
    setBarPulse(true);
    setTimeout(() => setBarPulse(false), 550);

    // 2. Generate rising sparkles
    const newSparkles = Array.from({ length: 10 }).map((_, i) => ({
      id: Date.now() + i + Math.random(),
      left: Math.random() * 80 + 10, // 10% to 90% width
      delay: Math.random() * 350
    }));
    setSparkles(newSparkles);
    setTimeout(() => setSparkles([]), 1500);

    // 3. Show floating XP pop-up badge
    setShowXPGlow(true);
    setTimeout(() => setShowXPGlow(false), 1800);
  };

  // Sync unlocked length if level becomes completed before
  useEffect(() => {
    if (isOrderedLengthProgression && isLevelCompletedBefore) {
      setUnlockedLength(config.maxLength);
    }
  }, [isLevelCompletedBefore, config]);

  const [sequenceLength, setSequenceLength] = useState<number>(() => {
    if (isOrderedLengthProgression) {
      if (isLevelCompletedBefore) return config.defaultLength;
      const backendVal = progress?.reconstruction_states?.[levelKey]?.unlocked_length;
      if (backendVal !== undefined) return Math.max(backendVal, config.minLength);
      return config.defaultLength;
    }
    return config.defaultLength;
  });

  const [isAutoplayActive, setIsAutoplayActive] = useState<boolean>(() => {
    return localStorage.getItem('earTraining_autoplay_active') === 'true';
  });

  const toggleAutoplay = () => {
    const nextVal = !isAutoplayActive;
    setIsAutoplayActive(nextVal);
    localStorage.setItem('earTraining_autoplay_active', nextVal.toString());
  };

  const [targetSequence, setTargetSequence] = useState<string[]>([]);
  const [userSequence, setUserSequence] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackActiveIndex, setPlaybackActiveIndex] = useState<number | null>(null);
  const [speed, setSpeed] = useState<'slow' | 'medium' | 'fast'>('medium');

  const [roundStatus, setRoundStatus] = useState<'idle' | 'playing' | 'entering' | 'correct' | 'incorrect'>('idle');
  const [showAnswer, setShowAnswer] = useState<boolean>(false);

  const [score, setScore] = useState<number>(0);
  const [attempts, setAttempts] = useState<number>(0);

  useEffect(() => {
    if (!isAutoplayActive) return;

    let timeoutId: any = null;

    if (lengthCompletedThisRound) {
      timeoutId = setTimeout(() => {
        setLengthCompletedThisRound(false);
        const nextLen = sequenceLength + 1;
        saveProgress(nextLen, 0);
        setSequenceLength(nextLen);
        startNewRound(nextLen);
      }, 1500);
      return () => clearTimeout(timeoutId);
    }

    if (completionResponse) {
      timeoutId = setTimeout(() => {
        if (completionResponse.pass && onNext) {
          setScore(0);
          setAttempts(0);
          setSessionId(null);
          setSessionStartTime(null);
          setSessionFinished(false);
          setCompletionResponse(null);
          onNext();
        } else {
          setScore(0);
          setAttempts(0);
          setSessionId(null);
          setSessionStartTime(null);
          setSessionFinished(false);
          setCompletionResponse(null);
          if (isOrderedLengthProgression && !isLevelCompletedBefore) {
            saveProgress(config.minLength, 0);
            setSequenceLength(config.minLength);
            startNewRound(config.minLength);
          } else {
            startNewRound(sequenceLength);
          }
          initSession();
        }
      }, 2000);
      return () => clearTimeout(timeoutId);
    }

    if (targetSequence.length === 0) {
      startNewRound(sequenceLength);
      return;
    }

    if (isPlaying || roundStatus === 'playing') {
      return; // Just wait, state change will trigger next step
    }

    if (roundStatus === 'correct') {
      timeoutId = setTimeout(() => {
        startNewRound(sequenceLength);
      }, 1200);
      return () => clearTimeout(timeoutId);
    }

    if (roundStatus === 'incorrect') {
      timeoutId = setTimeout(() => {
        startNewRound(sequenceLength);
      }, 1200);
      return () => clearTimeout(timeoutId);
    }

    if (roundStatus === 'idle') {
      timeoutId = setTimeout(() => {
        handlePlaySequence();
      }, 600);
      return () => clearTimeout(timeoutId);
    }

    if (roundStatus === 'entering') {
      const targetSwaras = targetSequence.map(note => config.noteToSwara[note]);
      const currentLength = userSequence.length;
      if (currentLength < targetSwaras.length) {
        const nextSwara = targetSwaras[currentLength];
        timeoutId = setTimeout(() => {
          handleTapSwara(nextSwara);
        }, 400);
        return () => clearTimeout(timeoutId);
      }
    }
  }, [
    isAutoplayActive,
    roundStatus,
    isPlaying,
    userSequence,
    targetSequence,
    lengthCompletedThisRound,
    completionResponse,
    sequenceLength,
    onNext
  ]);

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
        const res = await finishPracticeSession(session.access_token, sessionId, durationMs);
        console.log('[ReconstructionEngine] Practice session finished successfully');
        if (res && res.progress) {
          updateProgress(res.progress);
        }
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


  // Play target sequence melody
  const handlePlaySequence = async () => {
    const totalRounds = getReconstructionTotalQuestions(sequenceLength);
    const isFinished = isOrderedLengthProgression && !isLevelCompletedBefore ? !!completionResponse : attempts >= totalRounds;
    if (isPlaying || targetSequence.length === 0 || isFinished) return;
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
    const isFinished = isOrderedLengthProgression && !isLevelCompletedBefore ? !!completionResponse : attempts >= totalRounds;
    if (isPlaying || roundStatus === 'correct' || roundStatus === 'incorrect' || targetSequence.length === 0 || !sessionId || isFinished) return;

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
      let nextLengthXP = lengthXP;
      if (isCorrect) {
        setScore(prev => prev + 1);
        setRoundStatus('correct');
        if (isOrderedLengthProgression && !isLevelCompletedBefore && sequenceLength === unlockedLength) {
          nextLengthXP = lengthXP + 10;
          saveLengthXP(nextLengthXP);
          triggerXPEffects();
        }
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

      if (isOrderedLengthProgression && !isLevelCompletedBefore && sequenceLength === unlockedLength) {
        if (isCorrect && nextLengthXP >= 100) {
          const nextLen = sequenceLength + 1;
          if (nextLen <= config.maxLength) {
            setUnlockedLength(nextLen);
            setLengthCompletedThisRound(true);
          } else {
            // Completed maximum length! Finish session.
            if (session?.access_token && !sessionFinished) {
              const durationMs = sessionStartTime ? now - sessionStartTime : 0;
              try {
                setSessionFinished(true);
                const finalScore = isCorrect ? score + 1 : score;
                const res = await finishPracticeSession(session.access_token, sessionId, durationMs, true);
                console.log('[ReconstructionEngine] Practice session finished successfully');
                if (res && res.progress) {
                  updateProgress(res.progress);
                }
                setCompletionResponse({
                  pass: res.pass,
                  xpGained: (finalScore * 10) + (res.pass ? 50 : 0)
                });
              } catch (err) {
                console.error('[ReconstructionEngine] Failed to finish practice session:', err);
              }
            }
          }
        }
      } else {
        // Finish session automatically if rounds are complete
        if (newAttemptsCount >= totalRounds && session?.access_token && !sessionFinished) {
          const durationMs = sessionStartTime ? now - sessionStartTime : 0;
          try {
            setSessionFinished(true);
            const finalScore = isCorrect ? score + 1 : score;
            const res = await finishPracticeSession(session.access_token, sessionId, durationMs, true);
            console.log('[ReconstructionEngine] Practice session finished successfully');
            if (res && res.progress) {
              updateProgress(res.progress);
            }
            setCompletionResponse({
              pass: res.pass,
              xpGained: (finalScore * 10) + (res.pass ? 50 : 0)
            });
          } catch (err) {
            console.error('[ReconstructionEngine] Failed to finish practice session:', err);
          }
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

  const displayXP = (isLevelCompletedBefore || sequenceLength < unlockedLength) ? 100 : lengthXP;

  const isLevelFinished = isOrderedLengthProgression && !isLevelCompletedBefore
    ? !!completionResponse
    : (attempts >= getReconstructionTotalQuestions(sequenceLength) || !!completionResponse);

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

        <LevelSelector currentStage={config.stage} currentLevel={config.level} onChangeLevel={handleLevelChange} />

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
            Active: {config.enabledNotesLabel}
          </div>
          {onNext && (
            <button
              disabled={!isNextLevelUnlocked()}
              onClick={handleNext}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer shadow-md ${isNextLevelUnlocked()
                ? 'bg-primary-600 hover:bg-primary-500 text-white shadow-primary-600/20 active:scale-95 text-xs md:text-sm font-bold'
                : 'bg-slate-950/40 border border-white/5 text-gray-500 cursor-not-allowed shadow-none font-mono tracking-wider uppercase text-[10px] md:text-xs'
                }`}
            >
              {isNextLevelUnlocked() ? (
                <>
                  <span className="inline-block">Next Level</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                  <span>Next Level</span>
                </>
              )}
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
            {/* Difficulty & Speed Settings Card */}
            {isOrderedLengthProgression && !isLevelCompletedBefore ? (
              <div className="glass rounded-3xl p-5 border-white/5 space-y-5 flex flex-col justify-between relative overflow-hidden">
                {/* Background glow behind active settings */}
                <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-primary-500/10 filter blur-xl animate-pulse-slow"></div>

                <div className="space-y-1 text-left">
                  <span className="text-[10px] font-mono text-primary-400 uppercase tracking-widest font-bold block">Ordered Progression</span>
                  <h3 className="text-sm font-bold text-white">Dictation Settings</h3>
                  <p className="text-[10px] text-gray-400 leading-tight">Master note sequences from 3 to 7 in order.</p>
                </div>

                {/* Sequence Length Steps */}
                <div className="space-y-2 text-left">
                  <div className="flex justify-between items-center text-[10px] font-mono text-gray-400">
                    <span>Active Length</span>
                    <span className="text-white font-bold">{sequenceLength} Notes</span>
                  </div>
                  <div className="flex bg-black/40 p-1 rounded-2xl border border-white/5 gap-1 overflow-x-auto">
                    {lengths.map((len) => {
                      const isCurrent = sequenceLength === len;
                      const isUnlocked = len <= unlockedLength;
                      const isCompleted = len < unlockedLength;

                      return (
                        <button
                          key={len}
                          disabled={!isUnlocked || isPlaying}
                          onClick={() => setSequenceLength(len)}
                          className={`w-9 h-9 text-xs rounded-xl font-bold transition-all flex items-center justify-center shrink-0 relative cursor-pointer ${isCurrent
                            ? 'bg-gradient-to-tr from-primary-600 via-primary-700 to-accent-rose text-white shadow-md shadow-primary-700/30 scale-105'
                            : isCompleted
                              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                              : isUnlocked
                                ? 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
                                : 'bg-slate-950/60 border-white/5 text-gray-600 cursor-not-allowed opacity-50'
                            }`}
                        >
                          <span>{len}</span>
                          {!isUnlocked && (
                            <Lock className="w-2 h-2 text-amber-500 absolute top-0.5 right-0.5" />
                          )}
                          {isCompleted && (
                            <span className="w-1 h-1 rounded-full bg-emerald-400 absolute bottom-1"></span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* XP Progress Bar */}
                <div className="space-y-2 pt-1 relative text-left">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-gray-400 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      Length {sequenceLength} Mastery
                    </span>
                    <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 shadow-sm">
                      {displayXP} / 100 XP
                    </span>
                  </div>

                  <div className="relative">
                    {/* Floating Sparkles rising from the bar */}
                    {sparkles.map((sp) => (
                      <div
                        key={sp.id}
                        className="absolute bottom-2 text-emerald-400 animate-sparkle-rise pointer-events-none z-10"
                        style={{
                          left: `${sp.left}%`,
                          animationDelay: `${sp.delay}ms`,
                        }}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />
                      </div>
                    ))}

                    <div
                      className={`w-full h-3.5 bg-slate-950/80 rounded-full border border-white/5 p-0.5 relative shadow-inner transition-all duration-300 ${barPulse ? 'ring-2 ring-emerald-500/50 scale-[1.02] shadow-[0_0_15px_rgba(16,185,129,0.3)]' : ''
                        }`}
                    >
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 transition-all duration-500 ease-out animate-shimmer-bar relative"
                        style={{ width: `${Math.min((displayXP / 100) * 100, 100)}%` }}
                      >
                        {/* Glow tip at the end of progress */}
                        {displayXP > 0 && (
                          <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#fff,0_0_15px_#10b981] animate-pulse" />
                        )}
                      </div>
                    </div>
                  </div>

                  {showXPGlow && (
                    <div className="absolute -top-3 right-0 text-[10px] text-emerald-400 font-mono font-bold animate-float-up-fade">
                      +10 XP
                    </div>
                  )}
                </div>

                {/* Playback Tempo Switch */}
                <div className="space-y-2 pt-3 border-t border-white/5 text-left">
                  <h4 className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Playback Tempo</h4>
                  <div className="flex bg-black/35 p-1 rounded-2xl border border-white/5 gap-1">
                    {(['slow', 'medium', 'fast'] as const).map((s) => {
                      const isActive = speed === s;
                      return (
                        <button
                          key={s}
                          disabled={isPlaying}
                          onClick={() => setSpeed(s)}
                          className={`flex-1 py-2 text-[10px] font-mono font-bold rounded-xl uppercase tracking-wider transition-all cursor-pointer ${isActive
                            ? 'bg-gradient-to-tr from-primary-600 via-primary-700 to-accent-rose text-white shadow-sm'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>


              </div>
            ) : (
              /* Normal Configuration Card */
              <div className="glass rounded-3xl p-5 border-white/5 space-y-5 flex flex-col justify-between">
                <div className="space-y-1 text-left">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Difficulty Configuration</span>
                  <h3 className="text-sm font-bold text-white">Sequence Settings</h3>
                </div>

                {/* Sequence Length Selection */}
                {lengths.length > 1 && (
                  <div className="space-y-2 text-left">
                    <div className="flex justify-between items-center text-[10px] font-mono text-gray-400">
                      <span>Sequence Length</span>
                      <span className="text-white font-bold">{sequenceLength} Notes</span>
                    </div>
                    <div className="flex bg-black/30 p-1 rounded-2xl border border-white/5 gap-1 overflow-x-auto">
                      {lengths.map((len) => {
                        const isActive = sequenceLength === len;
                        return (
                          <button
                            key={len}
                            disabled={isPlaying}
                            onClick={() => setSequenceLength(len)}
                            className={`w-9 h-9 text-xs rounded-xl font-bold transition-all flex items-center justify-center shrink-0 cursor-pointer ${isActive
                              ? 'bg-gradient-to-tr from-primary-600 to-accent-rose text-white shadow-md shadow-primary-700/30'
                              : 'text-gray-400 hover:text-white hover:bg-white/5'
                              }`}
                          >
                            {len}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Playback Tempo Switch */}
                <div className="space-y-2 pt-3 border-t border-white/5 text-left">
                  <h4 className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Playback Tempo</h4>
                  <div className="flex bg-black/35 p-1 rounded-2xl border border-white/5 gap-1">
                    {(['slow', 'medium', 'fast'] as const).map((s) => {
                      const isActive = speed === s;
                      return (
                        <button
                          key={s}
                          disabled={isPlaying}
                          onClick={() => setSpeed(s)}
                          className={`flex-1 py-2 text-[10px] font-mono font-bold rounded-xl uppercase tracking-wider transition-all cursor-pointer ${isActive
                            ? 'bg-gradient-to-tr from-primary-600 via-primary-700 to-accent-rose text-white shadow-sm'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Session Score Row */}
                {!isOrderedLengthProgression && (
                  <div className="flex justify-between items-center pt-3 border-t border-white/5 text-left">
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-semibold">Session Score</span>
                    <div className="bg-white/5 border border-white/10 px-3 py-1 rounded-xl text-xs font-mono text-gray-300">
                      Correct: <strong className="text-white">{score}</strong> / {attempts}
                    </div>
                  </div>
                )}

                <p className="text-[10px] text-gray-400 font-mono italic pt-1 border-t border-white/5 text-left">
                  💡 Target plays {sequenceLength} random notes.
                </p>
              </div>
            )}

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
                className={`w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center gap-1 transition-all duration-300 cursor-pointer shadow-lg relative ${isPlaying
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
                  const isDisabled = isPlaying || roundStatus === 'correct' || roundStatus === 'incorrect' || isLevelFinished;
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
              {isLevelFinished ? (
                <div className="p-4 bg-primary-950/40 border border-primary-500/30 rounded-xl space-y-3 w-full animate-fade-in-up">
                  <p className="text-sm font-bold text-white text-center">🏁 Level Complete!</p>
                  <p className="text-xs text-gray-300 text-center">
                    {isOrderedLengthProgression && !isLevelCompletedBefore ? (
                      <>
                        You completed all sequence levels in <strong className="text-white text-sm">{attempts}</strong> attempts with a final accuracy of <strong className="text-white text-sm">{attempts > 0 ? Math.round((score / attempts) * 100) : 0}%</strong>.
                      </>
                    ) : (
                      <>
                        You scored <strong className="text-white text-sm">{score}</strong> out of {getReconstructionTotalQuestions(sequenceLength)} rounds ({Math.round((score / getReconstructionTotalQuestions(sequenceLength)) * 100)}%).
                      </>
                    )}
                  </p>

                  {completionResponse && (
                    <div className="p-3 rounded-lg text-center text-xs font-semibold w-full bg-green-500/10 border border-green-500/30 text-green-400">
                      <p className="font-bold text-sm">🎉 Level Passed!</p>
                      <p className="text-[11px] text-gray-300 mt-1">XP Gained: +{completionResponse.xpGained} XP</p>
                      <p className="text-[10px] text-green-300 mt-0.5">Next Level Unlocked!</p>
                    </div>
                  )}

                  <div className="flex gap-2 w-full">
                    <button
                      onClick={() => {
                        setScore(0);
                        setAttempts(0);
                        setSessionId(null);
                        setSessionStartTime(null);
                        setSessionFinished(false);
                        setCompletionResponse(null);
                        if (isOrderedLengthProgression && !isLevelCompletedBefore) {
                          saveProgress(config.minLength, 0);
                          setSequenceLength(config.minLength);
                          startNewRound(config.minLength);
                        } else {
                          startNewRound(sequenceLength);
                        }
                        initSession();
                      }}
                      className="flex-1 py-2.5 rounded-xl font-bold bg-white/10 hover:bg-white/15 text-white flex items-center justify-center gap-1.5 transition-all text-xs cursor-pointer"
                    >
                      Retry
                    </button>
                    {completionResponse?.pass && onNext && (
                      <button
                        onClick={() => {
                          setScore(0);
                          setAttempts(0);
                          setSessionId(null);
                          setSessionStartTime(null);
                          setSessionFinished(false);
                          setCompletionResponse(null);
                          onNext();
                        }}
                        className="flex-1 py-2.5 rounded-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white flex items-center justify-center gap-1.5 transition-all text-xs cursor-pointer shadow-md shadow-primary-600/20"
                      >
                        Next Level
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
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

      {/* Premium Floating XP Pop-up Badge */}
      {showXPGlow && (
        <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[80] pointer-events-none animate-xp-badge-pop">
          <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500 text-white font-extrabold text-sm px-6 py-3 rounded-full border border-emerald-400/30 shadow-2xl shadow-emerald-500/40 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin-slow fill-amber-300/20" />
            <span className="tracking-wide text-xs uppercase font-mono">Mastery XP</span>
            <span className="font-mono text-base font-black bg-white/20 px-2.5 py-0.5 rounded-lg border border-white/20 shadow-inner">
              +10 XP
            </span>
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse animate-spin-slow" />
          </div>
        </div>
      )}

      {/* Length Completion Modal */}
      {lengthCompletedThisRound && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-md p-6 text-center space-y-6 shadow-2xl animate-fade-in-up">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 mx-auto shadow-inner animate-bounce">
              <Award className="w-8 h-8 text-emerald-400" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-white">🎉 Length {sequenceLength} Mastered!</h3>
              <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
                You have successfully gained 100 XP and demonstrated pitch perfect recall on {sequenceLength}-note patterns.
              </p>
            </div>

            <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex justify-between items-center">
              <span className="text-xs text-gray-400 font-mono uppercase tracking-wider">Mastery Bonus</span>
              <span className="text-sm font-mono font-bold text-emerald-400">+100 XP</span>
            </div>

            <button
              onClick={() => {
                setLengthCompletedThisRound(false);
                const nextLen = sequenceLength + 1;
                saveProgress(nextLen, 0);
                setSequenceLength(nextLen);
                startNewRound(nextLen);
              }}
              className="w-full py-3.5 rounded-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white flex items-center justify-center gap-1.5 transition-all text-sm cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              Unlock & Proceed to Length {sequenceLength + 1}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
