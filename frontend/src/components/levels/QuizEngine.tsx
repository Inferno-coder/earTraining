import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Volume2, RefreshCw, CheckCircle, AlertCircle, Play, Home } from 'lucide-react';
import { playNote } from '../../utils/audio';
import type { QuizConfig } from './configs/types';
import { useAuth } from '../../auth/useAuth';
import { startPracticeSession, logPracticeAttempt, finishPracticeSession } from '../../lib/api';

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

const stage5Swaras: Record<string, string> = {
  'C4': 'Sa',
  'C#4': 'R1',
  'D4': 'R2',
  'D#4': 'G2',
  'E4': 'G3',
  'F4': 'M1',
  'F#4': 'M2',
  'G4': 'Pa',
  'G#4': 'D1',
  'A4': 'D2',
  'A#4': 'N2',
  'B4': 'N3',
  'C5': "Sa'"
};

interface QuizEngineProps {
  config: QuizConfig;
  onBack: () => void;
  onNext?: () => void;
  onHome: () => void;
}

export default function QuizEngine({ config, onBack, onNext, onHome }: QuizEngineProps) {
  // Auth & API states
  const { session } = useAuth();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [attemptStartTime, setAttemptStartTime] = useState<number | null>(null);
  const [sessionFinished, setSessionFinished] = useState<boolean>(false);

  // Sound states
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Game states
  const [showTutorial, setShowTutorial] = useState(false);
  const [targetNote, setTargetNote] = useState<any | null>(null);
  const [selectedGuess, setSelectedGuess] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ status: 'correct' | 'incorrect' | 'idle'; message: string }>({ 
    status: 'idle', 
    message: '' 
  });
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [quizDeck, setQuizDeck] = useState<any[]>([]);

  const initSession = async () => {
    if (!session?.access_token) return;
    try {
      const sid = await startPracticeSession(session.access_token, config.stage, config.level);
      setSessionId(sid);
      setSessionStartTime(Date.now());
      setSessionFinished(false);
    } catch (err) {
      console.error('[QuizEngine] Failed to start practice session:', err);
    }
  };

  const endSession = async () => {
    if (session?.access_token && sessionId && sessionStartTime && !sessionFinished) {
      const durationMs = Date.now() - sessionStartTime;
      try {
        setSessionFinished(true);
        await finishPracticeSession(session.access_token, sessionId, durationMs);
        console.log('[QuizEngine] Practice session finished successfully');
      } catch (err) {
        console.error('[QuizEngine] Failed to finish practice session on navigation:', err);
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

  // Initialize deck on mount or when configuration config changes
  useEffect(() => {
    resetQuiz();
    if (config.tutorialPopup) {
      setShowTutorial(true);
    } else {
      setShowTutorial(false);
    }
  }, [config]);

  // Play a keyboard reference note
  const handlePlayKey = async (key: KeyboardKey) => {
    const isEnabled = config.referenceNotes.includes(key.note);
    if (!isEnabled || isPlaying) return;

    setActiveNote(key.note);
    try {
      await playNote(key.note, '0.5s');
    } catch (err) {
      console.error('Audio playback failed:', err);
    }
    setTimeout(() => {
      setActiveNote(prev => prev === key.note ? null : prev);
    }, 400);
  };

  // Play a random mystery note / pair from deck
  const playRandomMysteryNote = async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    setSelectedGuess(null);
    setFeedback({ status: 'idle', message: '' });
    
    let currentDeck = quizDeck;
    if (currentDeck.length === 0) {
      currentDeck = config.generateDeck();
      setQuizDeck(currentDeck);
    }

    const totalRounds = currentDeck.length || 10;
    const chosen = currentDeck[attempts % totalRounds];
    setTargetNote(chosen);
    setAttemptStartTime(Date.now());

    try {
      await config.playTarget(chosen);
    } catch (err) {
      console.error('Audio playback failed:', err);
    } finally {
      setIsPlaying(false);
    }
  };

  // Replay current note
  const replayMysteryNote = async () => {
    if (isPlaying || !targetNote) return;
    setIsPlaying(true);
    try {
      await config.playTarget(targetNote);
    } catch (err) {
      console.error('Audio playback failed:', err);
    } finally {
      setIsPlaying(false);
    }
  };

  // Handle choice selection
  const handleSelectChoice = async (guess: string) => {
    if (!targetNote || feedback.status !== 'idle' || isPlaying || !sessionId) return;
    
    setSelectedGuess(guess);
    const newAttemptsCount = attempts + 1;
    setAttempts(newAttemptsCount);

    const { isCorrect, message } = config.checkAnswer(targetNote, guess);

    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    setFeedback({
      status: isCorrect ? 'correct' : 'incorrect',
      message
    });

    const now = Date.now();
    const responseTimeMs = attemptStartTime ? now - attemptStartTime : null;

    if (session?.access_token) {
      try {
        await logPracticeAttempt(session.access_token, {
          sessionId,
          stage: config.stage,
          level: config.level,
          questionType: 'QUIZ_GUESS',
          playedData: targetNote,
          userAnswer: guess,
          isCorrect,
          responseTimeMs
        });
      } catch (err) {
        console.error('[QuizEngine] Failed to log practice attempt:', err);
      }
    }

    const totalRounds = quizDeck.length || 10;
    if (newAttemptsCount >= totalRounds && session?.access_token && !sessionFinished) {
      const durationMs = sessionStartTime ? now - sessionStartTime : 0;
      try {
        setSessionFinished(true);
        await finishPracticeSession(session.access_token, sessionId, durationMs);
        console.log('[QuizEngine] Practice session finished successfully');
      } catch (err) {
        console.error('[QuizEngine] Failed to finish practice session:', err);
      }
    }
  };

  const resetQuiz = () => {
    setScore(0);
    setAttempts(0);
    setTargetNote(null);
    setSelectedGuess(null);
    setFeedback({ status: 'idle', message: '' });
    setQuizDeck(config.generateDeck());
    setSessionId(null);
    setSessionStartTime(null);
    setAttemptStartTime(null);
    setSessionFinished(false);
    initSession();
  };

  // Determine standard grid column class
  const gridColClass = 
    config.choicesGridCols === 2 ? 'grid-cols-2' :
    config.choicesGridCols === 3 ? 'grid-cols-3' :
    config.choicesGridCols === 4 ? 'grid-cols-4' : 'grid-cols-5';

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
          <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"></span>
          <span className="text-sm font-bold text-white tracking-wide">Level {config.level}: {config.title}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-xs font-mono text-gray-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
            <Volume2 className="w-3.5 h-3.5 text-primary-400" />
            Enabled Notes: {config.enabledNotesLabel}
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
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 pt-3 pb-8 md:pt-4 md:pb-12 flex flex-col relative z-10 space-y-4 md:space-y-6">
        
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono text-primary-400 uppercase tracking-widest font-bold block">Training Session</span>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">{config.title}</h2>
          <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
            {config.subtitle}
          </p>
        </div>

        {/* 2-Column Split: Keyboard on Left, Quiz Controls on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Keyboard Column (Left 7 Columns) */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            <div className="flex justify-between items-center text-xs font-mono text-gray-400 px-2">
              <span>🎹 Reference Keyboard</span>
              <span className="text-primary-400">Interactive notes: {config.enabledNotesLabel}</span>
            </div>

            <div className="relative select-none w-full bg-slate-950 p-4 border border-white/10 rounded-3xl shadow-2xl flex aspect-[16/7] md:aspect-[16/6]">
              
              {/* White Keys */}
              <div className="w-full h-full flex relative z-10 gap-1 md:gap-1.5">
                {whiteKeys.map((key) => {
                  const isEnabled = config.referenceNotes.includes(key.note);
                  const isPressed = activeNote === key.note;
                  const displaySwara = (config.stage === 5 && isEnabled)
                    ? stage5Swaras[key.note] || key.swara
                    : key.swara;
                  return (
                    <button
                      key={key.note}
                      disabled={!isEnabled || isPlaying}
                      onClick={() => handlePlayKey(key)}
                      className={`flex-1 h-full rounded-b-2xl flex flex-col justify-end items-center pb-4 md:pb-6 transition-all duration-100 shadow-md ${
                        isEnabled
                          ? isPressed
                            ? 'bg-primary-100 border-t-[6px] border-primary-500 pt-0 translate-y-0.5 shadow-none cursor-pointer'
                            : 'bg-white hover:bg-slate-50 border-b-[6px] border-slate-300 cursor-pointer'
                          : 'bg-slate-800/20 border-b-[6px] border-slate-950/40 opacity-20 cursor-not-allowed text-gray-600'
                      }`}
                    >
                      <div className="text-center select-none pointer-events-none">
                        <span className={`block text-xl md:text-3xl font-extrabold font-serif leading-none ${
                          isEnabled ? 'text-slate-800' : 'text-slate-600'
                        }`}>
                          {key.label}
                        </span>
                        <span className={`block text-xs md:text-sm font-bold font-sans mt-2 ${
                          isEnabled ? 'text-primary-700' : 'text-slate-600'
                        }`}>
                          {displaySwara}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Black Keys (Disabled in current quiz engine configs) */}
              {blackKeys.map((key) => {
                const isEnabled = config.referenceNotes.includes(key.note);
                const isPressed = activeNote === key.note;
                const leftOffset = `calc(12.5% * (${key.leftIndex!} + 1) - 4.2%)`;
                const displaySwara = (config.stage === 5 && isEnabled)
                  ? stage5Swaras[key.note] || key.swara
                  : key.swara;
                return (
                  <button
                    key={key.note}
                    disabled={!isEnabled || isPlaying}
                    onClick={() => handlePlayKey(key)}
                    style={{ left: leftOffset, width: '8.4%' }}
                    className={`absolute h-[62%] rounded-b-xl flex flex-col justify-end items-center pb-3 border-b-4 border-black border-x border-slate-950/40 transition-all z-30 ${
                      isEnabled
                        ? config.stage === 5
                          ? isPressed
                            ? 'bg-gradient-to-b from-violet-900 to-indigo-950 border-t-4 border-violet-400 pt-0 translate-y-0.5 shadow-none cursor-pointer'
                            : 'bg-gradient-to-b from-indigo-900 to-violet-950 hover:from-indigo-800 hover:to-violet-900 border border-violet-500/55 hover:border-violet-400/80 shadow-[0_0_15px_rgba(139,92,246,0.45)] cursor-pointer'
                          : isPressed
                            ? 'bg-primary-900 border-t-4 border-primary-400 pt-0 translate-y-0.5 shadow-none cursor-pointer'
                            : 'bg-slate-900 hover:bg-slate-800 border-slate-850 cursor-pointer'
                        : 'bg-slate-900/10 opacity-20 cursor-not-allowed text-gray-600'
                    }`}
                  >
                    <div className="text-center select-none pointer-events-none">
                      <span className={`block text-sm md:text-base font-extrabold font-serif leading-none ${
                        isEnabled && config.stage === 5 ? 'text-violet-100' : ''
                      }`}>
                        {key.label}
                      </span>
                      <span className={`block text-[9px] md:text-xs font-bold font-sans mt-1.5 ${
                        isEnabled && config.stage === 5 ? 'text-violet-300' : ''
                      }`}>
                        {displaySwara}
                      </span>
                    </div>
                  </button>
                );
              })}

            </div>
          </div>

          {/* Quiz Controls Column (Right 5 Columns) */}
          <div className="lg:col-span-5 flex flex-col justify-between glass rounded-3xl p-6 border-white/5 shadow-xl space-y-6">
            
            {/* Header info / Score */}
            <div className="flex justify-between items-center pb-4 border-b border-white/5">
              <span className="text-sm font-bold text-white">Mystery Note Game</span>
              <div className="bg-white/5 border border-white/10 px-3 py-1 rounded-xl text-xs font-mono text-gray-300">
                Score: <strong className="text-white text-sm">{score}</strong> / {attempts}
              </div>
            </div>

            {/* Stage 1: Play trigger */}
            <div className="space-y-4">
              {!targetNote ? (
                <div className="text-center py-6 space-y-3">
                  <p className="text-sm text-gray-400">Click the button to hear the mystery audio.</p>
                  <button
                    disabled={isPlaying}
                    onClick={playRandomMysteryNote}
                    className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white flex items-center justify-center gap-2 shadow-lg shadow-primary-600/30 transition-all scale-100 hover:scale-[1.02] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    Play Mystery Note
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-5 bg-slate-950/80 border border-white/10 rounded-2xl flex flex-col items-center justify-center space-y-4 shadow-inner relative overflow-hidden">
                    {/* Background glow when playing */}
                    {isPlaying && (
                      <div className="absolute inset-0 bg-primary-500/5 filter blur-xl animate-pulse"></div>
                    )}
                    
                    {/* Audio wave animation container */}
                    <div className="flex items-center justify-center gap-1.5 h-8">
                      {[1, 2, 3, 4, 5, 6, 7].map((bar) => {
                        let delay = '0s';
                        let baseHeight = 'h-3';
                        if (bar === 1 || bar === 7) { delay = '0.15s'; baseHeight = 'h-2'; }
                        if (bar === 2 || bar === 6) { delay = '0.3s'; baseHeight = 'h-4'; }
                        if (bar === 3 || bar === 5) { delay = '0.45s'; baseHeight = 'h-6'; }
                        if (bar === 4) { delay = '0.2s'; baseHeight = 'h-8'; }
                        
                        return (
                          <div 
                            key={bar} 
                            style={{ animationDelay: delay }}
                            className={`w-1 bg-primary-400 rounded transition-all duration-300 ${baseHeight} ${
                              isPlaying ? 'animate-pulse scale-y-125' : 'opacity-40'
                            }`}
                          />
                        );
                      })}
                    </div>

                    <div className="text-center space-y-1 z-10">
                      <p className="text-[10px] text-primary-400 font-mono uppercase tracking-widest font-bold">Mystery Note Active</p>
                      <p className="text-xs text-gray-400 leading-none">Listen and choose your answer below</p>
                    </div>

                    <button
                      disabled={isPlaying}
                      onClick={replayMysteryNote}
                      className={`w-full py-3 rounded-xl font-bold text-xs tracking-wider uppercase border transition-all flex items-center justify-center gap-2 cursor-pointer z-10 ${
                        isPlaying
                          ? 'bg-slate-900 border-white/5 text-gray-500 cursor-not-allowed'
                          : 'bg-primary-600 hover:bg-primary-500 border-primary-500 text-white shadow-md shadow-primary-600/20 scale-100 hover:scale-[1.02]'
                      }`}
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isPlaying ? 'animate-spin' : ''}`} />
                      {isPlaying ? 'Playing...' : 'Replay Sound'}
                    </button>
                  </div>

                  {/* Optional Custom Illustration */}
                  {config.customIllustration && (
                    <div className="my-2">
                      {config.customIllustration}
                    </div>
                  )}

                  {/* Guessing Choices */}
                  <div className="space-y-3">
                    <span className="text-xs font-mono text-gray-400 uppercase tracking-widest block text-left">Which note did you hear?</span>
                    <div className={`grid ${gridColClass} gap-3`}>
                      {(((targetNote && targetNote.choices) || config.choices || []) as string[]).map((choiceName) => {
                        const isSelected = selectedGuess === choiceName;
                        const isCorrectAnswer = config.checkAnswer(targetNote, choiceName).isCorrect;
                        const showResult = feedback.status !== 'idle';
                        
                        let btnStyle = "bg-slate-900 border-white/10 text-white hover:border-primary-500 hover:bg-slate-900/80";
                        if (isSelected && !showResult) btnStyle = "bg-primary-600/30 border-primary-500 text-white";
                        if (showResult) {
                          if (isCorrectAnswer) {
                            btnStyle = "bg-green-500/20 border-green-500 text-green-300";
                          } else if (isSelected) {
                            btnStyle = "bg-red-500/20 border-red-500 text-red-300 opacity-60";
                          } else {
                            btnStyle = "bg-slate-900/50 border-white/5 opacity-40 text-gray-500";
                          }
                        }

                        return (
                          <button
                            key={choiceName}
                            disabled={feedback.status !== 'idle' || isPlaying}
                            onClick={() => handleSelectChoice(choiceName)}
                            className={`py-4 rounded-xl font-serif text-lg font-extrabold border transition-all text-center cursor-pointer disabled:cursor-not-allowed ${btnStyle}`}
                          >
                            {choiceName}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Feedback & Navigation */}
            <div className="pt-4 border-t border-white/5 min-h-[90px] flex flex-col justify-end">
              {feedback.status !== 'idle' && (
                <div className="space-y-4 text-left">
                  <div className={`p-4 rounded-xl text-xs flex gap-2 items-start ${
                    feedback.status === 'correct' 
                      ? 'bg-green-950/40 border border-green-500/30 text-green-300' 
                      : 'bg-red-950/40 border border-red-500/30 text-red-300'
                  }`}>
                    {feedback.status === 'correct' ? <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
                    <div>
                      <p className="font-semibold">{feedback.status === 'correct' ? 'Correct!' : 'Incorrect'}</p>
                      <p className="mt-0.5 text-gray-300">{feedback.message}</p>
                    </div>
                  </div>

                  {attempts >= (quizDeck.length || 10) ? (
                    <div className="p-4 bg-primary-950/40 border border-primary-500/30 rounded-xl space-y-3">
                      <p className="text-sm font-bold text-white text-center">🏁 Level {config.level} Complete!</p>
                      <p className="text-xs text-gray-300 text-center">
                        You scored <strong className="text-white text-sm">{score}</strong> out of {quizDeck.length || 10} rounds.
                      </p>
                      <button
                        onClick={resetQuiz}
                        className="w-full py-2.5 rounded-xl font-bold bg-primary-600 hover:bg-primary-500 text-white flex items-center justify-center gap-1.5 transition-all text-sm cursor-pointer"
                      >
                        Start New Quiz
                      </button>
                    </div>
                  ) : (
                    <button
                      disabled={isPlaying}
                      onClick={playRandomMysteryNote}
                      className="w-full py-3 rounded-xl font-bold bg-white/10 hover:bg-white/15 border border-white/10 text-white flex items-center justify-center gap-1.5 transition-all text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next Note <ArrowRight className="w-4 h-4" />
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
        <p>© 2026 ClearEar Studio • Stage {config.stage} Training</p>
      </footer>

      {showTutorial && config.tutorialPopup && (
        config.tutorialPopup(() => setShowTutorial(false))
      )}
    </div>
  );
}
