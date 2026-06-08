import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Volume2, RefreshCw, CheckCircle, AlertCircle, Play } from 'lucide-react';
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

interface Level1Props {
  onBack: () => void;
}

export default function Level1({ onBack }: Level1Props) {
  // Sound states
  const [activeNote, setActiveNote] = useState<string | null>(null);
  
  // Game states
  const [targetNote, setTargetNote] = useState<string | null>(null);
  const [selectedGuess, setSelectedGuess] = useState<'Sa' | 'Pa' | null>(null);
  const [feedback, setFeedback] = useState<{ status: 'correct' | 'incorrect' | 'idle'; message: string }>({ status: 'idle', message: '' });
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [quizDeck, setQuizDeck] = useState<string[]>([]);

  // Generate a deck containing exactly 5 Sa and 5 Pa notes, shuffled
  const generateShuffledDeck = () => {
    const deck = ['C4', 'C4', 'C4', 'C4', 'C4', 'G4', 'G4', 'G4', 'G4', 'G4'];
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  };

  // Initialize deck on mount
  useEffect(() => {
    setQuizDeck(generateShuffledDeck());
  }, []);

  // Play a keyboard reference note (only Sa or Pa are enabled)
  const handlePlayKey = async (key: KeyboardKey) => {
    // Only C4 (Sa) and G4 (Pa) are enabled
    const isEnabled = key.note === 'C4' || key.note === 'G4';
    if (!isEnabled) return;

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

  // Play a random mystery note (either Sa or Pa)
  const playRandomMysteryNote = async () => {
    setSelectedGuess(null);
    setFeedback({ status: 'idle', message: '' });
    
    // Pull the note from the pre-shuffled deck based on current attempts
    let currentDeck = quizDeck;
    if (currentDeck.length === 0) {
      currentDeck = generateShuffledDeck();
      setQuizDeck(currentDeck);
    }

    const chosen = currentDeck[attempts % 10];
    setTargetNote(chosen);

    // Play the chosen note
    try {
      await playNote(chosen, '0.7s');
    } catch (err) {
      console.error('Audio playback failed:', err);
    }
  };

  // Replay the current target note
  const replayMysteryNote = async () => {
    if (!targetNote) return;
    try {
      await playNote(targetNote, '0.7s');
    } catch (err) {
      console.error('Audio playback failed:', err);
    }
  };

  // Handle choice selection
  const handleSelectChoice = (guess: 'Sa' | 'Pa') => {
    if (!targetNote || feedback.status !== 'idle') return;
    
    setSelectedGuess(guess);
    setAttempts(prev => prev + 1);

    const correctSwara = targetNote === 'C4' ? 'Sa' : 'Pa';
    const isCorrect = guess === correctSwara;

    if (isCorrect) {
      setScore(prev => prev + 1);
      setFeedback({
        status: 'correct',
        message: `Correct! The mystery note was indeed "${correctSwara}" (${correctSwara === 'Sa' ? 'Shadjam / C4' : 'Panchamam / G4'}).`
      });
      // Play a short success chime
      setTimeout(() => {
        playNote(targetNote, '0.2s');
      }, 300);
    } else {
      setFeedback({
        status: 'incorrect',
        message: `Incorrect. Try listening to the mystery note again, then adjust your guess.`
      });
    }
  };

  const resetQuiz = () => {
    setScore(0);
    setAttempts(0);
    setTargetNote(null);
    setSelectedGuess(null);
    setFeedback({ status: 'idle', message: '' });
    setQuizDeck(generateShuffledDeck());
  };

  return (
    <div className="min-h-screen flex flex-col font-sans relative overflow-x-hidden selection:bg-primary-500 selection:text-white">
      
      {/* Background Decorative Blur Blobs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-primary-600 filter blur-3xl opacity-10 animate-pulse-slow"></div>
      <div className="absolute top-2/3 right-1/4 w-96 h-96 rounded-full bg-accent-rose filter blur-3xl opacity-10 animate-pulse-slow"></div>

      {/* Header */}
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
          <span className="w-1.5 h-1.5 rounded-full bg-accent-amber"></span>
          <span className="text-sm font-bold text-white tracking-wide">Level 1: Sa - Pa Ear Training</span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-gray-400 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
          <Volume2 className="w-3.5 h-3.5 text-primary-400" />
          Enabled Notes: Sa, Pa
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 pt-3 pb-8 md:pt-4 md:pb-12 flex flex-col relative z-10 space-y-4 md:space-y-6">
        
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono text-accent-amber uppercase tracking-widest font-bold block">First Training Level</span>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Identify Shadjam & Panchamam</h2>
          <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
            Listen to a randomized mystery note in the background, and classify it. Only **Sa** (fundamental) and **Pa** (perfect fifth) are active.
          </p>
        </div>

        {/* 2-Column Split: Keyboard on Left, Quiz Controls on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Keyboard Column (Left 7 Columns) */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            <div className="flex justify-between items-center text-xs font-mono text-gray-400 px-2">
              <span>🎹 Reference Keyboard</span>
              <span className="text-accent-amber">Only C4 (Sa) & G4 (Pa) are interactive</span>
            </div>

            <div className="relative select-none w-full bg-slate-950 p-4 border border-white/10 rounded-3xl shadow-2xl flex aspect-[16/7] md:aspect-[16/6]">
              
              {/* White Keys */}
              <div className="w-full h-full flex relative z-10 gap-1 md:gap-1.5">
                {whiteKeys.map((key) => {
                  const isEnabled = key.note === 'C4' || key.note === 'G4';
                  const isPressed = activeNote === key.note;
                  return (
                    <button
                      key={key.note}
                      disabled={!isEnabled}
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
                          {key.swara}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Black Keys (All disabled on Level 1) */}
              {blackKeys.map((key) => {
                const leftOffset = `calc(12.5% * (${key.leftIndex!} + 1) - 4.2%)`;
                return (
                  <button
                    key={key.note}
                    disabled={true}
                    style={{ left: leftOffset, width: '8.4%' }}
                    className="absolute h-[62%] rounded-b-xl flex flex-col justify-end items-center pb-3 border-b-4 border-black border-x border-slate-950/40 bg-slate-900/10 opacity-20 cursor-not-allowed text-gray-600 z-30"
                  >
                    <div className="text-center select-none pointer-events-none">
                      <span className="block text-sm md:text-base font-extrabold font-serif leading-none">
                        {key.label}
                      </span>
                      <span className="block text-[9px] md:text-xs font-bold font-sans mt-1.5">
                        {key.swara}
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
                  <p className="text-sm text-gray-400">Click the button to play a random note (Sa or Pa).</p>
                  <button
                    onClick={playRandomMysteryNote}
                    className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white flex items-center justify-center gap-2 shadow-lg shadow-primary-600/30 transition-all scale-100 hover:scale-[1.02] cursor-pointer"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    Play Mystery Note
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-950/80 border border-white/10 rounded-2xl text-center space-y-2">
                    <span className="inline-block w-3 h-3 rounded-full bg-accent-amber animate-pulse"></span>
                    <p className="text-xs text-gray-400 font-mono uppercase tracking-wider">Mystery Note Active</p>
                    <button
                      onClick={replayMysteryNote}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-400 hover:text-primary-300 transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Replay Sound
                    </button>
                  </div>

                  {/* Guessing Choices */}
                  <div className="space-y-3">
                    <span className="text-xs font-mono text-gray-400 uppercase tracking-widest block text-left">Which note did you hear?</span>
                    <div className="grid grid-cols-2 gap-4">
                      {['Sa', 'Pa'].map((swaraName) => {
                        const isSelected = selectedGuess === swaraName;
                        const isCorrectAnswer = (targetNote === 'C4' && swaraName === 'Sa') || (targetNote === 'G4' && swaraName === 'Pa');
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
                            key={swaraName}
                            disabled={feedback.status !== 'idle'}
                            onClick={() => handleSelectChoice(swaraName as 'Sa' | 'Pa')}
                            className={`py-6 rounded-2xl font-serif text-2xl font-extrabold border transition-all text-center cursor-pointer ${btnStyle}`}
                          >
                            {swaraName}
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

                  {attempts >= 10 ? (
                    <div className="p-4 bg-primary-950/40 border border-primary-500/30 rounded-xl space-y-3">
                      <p className="text-sm font-bold text-white text-center">🏁 Level 1 Complete!</p>
                      <p className="text-xs text-gray-300 text-center">
                        You scored <strong className="text-white text-sm">{score}</strong> out of 10 rounds.
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
                      onClick={playRandomMysteryNote}
                      className="w-full py-3 rounded-xl font-bold bg-white/10 hover:bg-white/15 border border-white/10 text-white flex items-center justify-center gap-1.5 transition-all text-sm cursor-pointer"
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
        <p>© 2026 SvaraSadhana • Stage 1 Sandbox</p>
      </footer>

    </div>
  );
}
