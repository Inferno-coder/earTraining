import React, { useState } from 'react';
import type { QuizConfig } from './types';
import { playNote } from '../../../utils/audio';
import { Play } from 'lucide-react';

const whiteKeysList = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];
const noteToSwara: Record<string, string> = {
  'C4': 'Sa',
  'D4': 'Ri',
  'E4': 'Ga',
  'F4': 'Ma',
  'G4': 'Pa',
  'A4': 'Dha',
  'B4': 'Ni',
  'C5': "Sa'"
};

// Index value helper for height comparison
const noteIndex = (note: string) => whiteKeysList.indexOf(note);

// Custom Staircase Diagram Component
const StaircaseDiagram: React.FC = () => {
  const [activeStep, setActiveStep] = useState<{ idx: number; dir: 'asc' | 'desc' } | null>(null);
  const [isMelodyPlaying, setIsMelodyPlaying] = useState(false);
  const [exampleActivePair, setExampleActivePair] = useState<[number, number] | null>(null);
  const [exampleCurrentStepIndex, setExampleCurrentStepIndex] = useState<number | null>(null);
  const [exampleAnswer, setExampleAnswer] = useState<string | null>(null);

  const playScale = async (direction: 'asc' | 'desc') => {
    if (isMelodyPlaying) return;
    setIsMelodyPlaying(true);
    setExampleActivePair(null);
    setExampleAnswer(null);

    const notes = direction === 'asc' 
      ? ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5']
      : ['C5', 'B4', 'A4', 'G4', 'F4', 'E4', 'D4', 'C4'];

    for (let i = 0; i < notes.length; i++) {
      setActiveStep({ idx: i, dir: direction });
      try {
        await playNote(notes[i], '0.35s');
      } catch (err) {
        console.error('Scale demo playback failed:', err);
      }
      await new Promise((resolve) => setTimeout(resolve, 380));
    }

    setActiveStep(null);
    setIsMelodyPlaying(false);
  };

  const playExample = async (direction: 'higher' | 'lower') => {
    if (isMelodyPlaying) return;
    setIsMelodyPlaying(true);
    setExampleAnswer(null);
    setActiveStep(null);

    let idx1: number;
    let idx2: number;

    if (direction === 'higher') {
      // Pick random starting index from 0 to 6
      idx1 = Math.floor(Math.random() * (whiteKeysList.length - 1));
      idx2 = idx1 + 1;
    } else {
      // Pick random starting index from 1 to 7
      idx1 = 1 + Math.floor(Math.random() * (whiteKeysList.length - 1));
      idx2 = idx1 - 1;
    }

    const n1 = whiteKeysList[idx1];
    const n2 = whiteKeysList[idx2];
    setExampleActivePair([idx1, idx2]);

    // Play Note 1
    setExampleCurrentStepIndex(idx1);
    try {
      await playNote(n1, '0.5s');
    } catch (err) {
      console.error('Example playback failed for note 1:', err);
    }
    await new Promise((resolve) => setTimeout(resolve, 650));

    // Play Note 2
    setExampleCurrentStepIndex(idx2);
    try {
      await playNote(n2, '0.5s');
    } catch (err) {
      console.error('Example playback failed for note 2:', err);
    }
    await new Promise((resolve) => setTimeout(resolve, 650));

    // Evaluate answer and construct message
    const isHigher = idx2 > idx1;
    const directionStr = isHigher ? 'Higher (ascending ↗)' : 'Lower (descending ↘)';
    const swara1 = noteToSwara[n1];
    const swara2 = noteToSwara[n2];
    
    setExampleAnswer(`Note 1 is "${swara1}" and Note 2 is "${swara2}". Since "${swara2}" is ${isHigher ? 'higher' : 'lower'} than "${swara1}", the correct answer is "${directionStr}".`);
    
    setExampleCurrentStepIndex(null);
    setIsMelodyPlaying(false);
  };

  const ascSteps = [
    { name: 'Sa', x: 35, y: 160 },
    { name: 'Ri', x: 65, y: 140 },
    { name: 'Ga', x: 95, y: 120 },
    { name: 'Ma', x: 125, y: 100 },
    { name: 'Pa', x: 155, y: 80 },
    { name: 'Dha', x: 185, y: 60 },
    { name: 'Ni', x: 215, y: 40 },
    { name: "Sa'", x: 245, y: 20 }
  ];

  const descSteps = [
    { name: "Sa'", x: 275, y: 20 },
    { name: 'Ni', x: 305, y: 40 },
    { name: 'Dha', x: 335, y: 60 },
    { name: 'Pa', x: 365, y: 80 },
    { name: 'Ma', x: 395, y: 100 },
    { name: 'Ga', x: 425, y: 120 },
    { name: 'Ri', x: 455, y: 140 },
    { name: 'Sa', x: 485, y: 160 }
  ];

  return (
    <div className="w-full bg-slate-950/40 border border-white/5 rounded-2xl p-4 flex flex-col items-center space-y-3">
      <div className="flex justify-between w-full px-4 text-[10px] font-mono tracking-wider uppercase">
        <span className="text-primary-400 font-bold">Aarohanam (Ascending)</span>
        <span className="text-accent-rose font-bold">Avarohanam (Descending)</span>
      </div>
      
      <svg viewBox="0 0 520 190" className="w-full h-auto max-w-lg select-none">
        {/* Ascending staircase path */}
        {ascSteps.map((step, idx) => (
          <g key={`asc-step-${idx}`}>
            {/* Tread */}
            <line 
              x1={step.x - 15} 
              y1={step.y + 12} 
              x2={step.x + 15} 
              y2={step.y + 12} 
              stroke="rgba(139, 92, 246, 0.3)" 
              strokeWidth="2.5" 
            />
            {/* Riser */}
            {idx < ascSteps.length - 1 && (
              <line 
                x1={step.x + 15} 
                y1={step.y + 12} 
                x2={step.x + 15} 
                y2={step.y - 8} 
                stroke="rgba(139, 92, 246, 0.3)" 
                strokeWidth="2.5" 
              />
            )}
          </g>
        ))}

        {/* Descending staircase path */}
        {descSteps.map((step, idx) => (
          <g key={`desc-step-${idx}`}>
            {/* Tread */}
            <line 
              x1={step.x - 15} 
              y1={step.y + 12} 
              x2={step.x + 15} 
              y2={step.y + 12} 
              stroke="rgba(244, 63, 94, 0.3)" 
              strokeWidth="2.5" 
            />
            {/* Riser */}
            {idx < descSteps.length - 1 && (
              <line 
                x1={step.x + 15} 
                y1={step.y + 12} 
                x2={step.x + 15} 
                y2={step.y + 32} 
                stroke="rgba(244, 63, 94, 0.3)" 
                strokeWidth="2.5" 
              />
            )}
          </g>
        ))}

        {/* Ascending Swara Nodes */}
        {ascSteps.map((step, idx) => {
          const isScaleHighlighted = activeStep && activeStep.dir === 'asc' && activeStep.idx === idx;
          const isExampleHighlighted = 
            exampleActivePair && 
            (exampleActivePair[1] > exampleActivePair[0]) &&
            (exampleCurrentStepIndex === idx);
          
          const isHighlighted = isScaleHighlighted || isExampleHighlighted;
          return (
            <g key={`asc-node-${idx}`}>
              <circle 
                cx={step.x} 
                cy={step.y} 
                r={isHighlighted ? "14" : "10"} 
                className={`transition-all duration-150 ${
                  isHighlighted 
                    ? 'fill-primary-400 stroke-white filter drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]' 
                    : 'fill-slate-900 stroke-primary-500'
                }`}
                strokeWidth="2" 
              />
              <text 
                x={step.x} 
                y={step.y + 3} 
                textAnchor="middle" 
                className="text-[9px] font-sans font-bold fill-white leading-none"
              >
                {step.name}
              </text>
            </g>
          );
        })}

        {/* Descending Swara Nodes */}
        {descSteps.map((step, idx) => {
          const isScaleHighlighted = activeStep && activeStep.dir === 'desc' && activeStep.idx === idx;
          const isExampleHighlighted = 
            exampleActivePair && 
            (exampleActivePair[1] < exampleActivePair[0]) &&
            (exampleCurrentStepIndex === (7 - idx));
          
          const isHighlighted = isScaleHighlighted || isExampleHighlighted;
          return (
            <g key={`desc-node-${idx}`}>
              <circle 
                cx={step.x} 
                cy={step.y} 
                r={isHighlighted ? "14" : "10"} 
                className={`transition-all duration-150 ${
                  isHighlighted 
                    ? 'fill-accent-rose stroke-white filter drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]' 
                    : 'fill-slate-900 stroke-accent-rose'
                }`}
                strokeWidth="2" 
              />
              <text 
                x={step.x} 
                y={step.y + 3} 
                textAnchor="middle" 
                className="text-[9px] font-sans font-bold fill-white leading-none"
              >
                {step.name}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Interactive listening buttons */}
      <div className="flex flex-col gap-3.5 w-full max-w-sm pt-2">
        <div className="flex gap-2 w-full justify-center">
          <button
            disabled={isMelodyPlaying}
            onClick={() => playScale('asc')}
            className="flex-1 py-2 px-2.5 text-[10px] font-bold rounded-xl bg-primary-600/20 hover:bg-primary-600/35 border border-primary-500/30 text-primary-300 transition-colors flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="w-3.5 h-3.5 fill-current animate-pulse" />
            Scale: Up ↗
          </button>
          <button
            disabled={isMelodyPlaying}
            onClick={() => playScale('desc')}
            className="flex-1 py-2 px-2.5 text-[10px] font-bold rounded-xl bg-accent-rose/20 hover:bg-accent-rose/35 border border-accent-rose/40 text-accent-rose transition-colors flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="w-3.5 h-3.5 fill-current animate-pulse" />
            Scale: Down ↘
          </button>
        </div>
        <div className="flex gap-2 w-full justify-center">
          <button
            disabled={isMelodyPlaying}
            onClick={() => playExample('higher')}
            className="flex-1 py-2 px-2.5 text-[10px] font-bold rounded-xl bg-amber-500/20 hover:bg-amber-500/35 border border-amber-500/40 text-accent-amber transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="w-3.5 h-3.5 fill-current animate-pulse" />
            Higher Example ↗
          </button>
          <button
            disabled={isMelodyPlaying}
            onClick={() => playExample('lower')}
            className="flex-1 py-2 px-2.5 text-[10px] font-bold rounded-xl bg-amber-500/20 hover:bg-amber-500/35 border border-amber-500/40 text-accent-amber transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="w-3.5 h-3.5 fill-current animate-pulse" />
            Lower Example ↘
          </button>
        </div>

        {exampleAnswer && (
          <div className="p-3 bg-slate-900/90 border border-white/5 rounded-xl text-center text-xs text-accent-amber font-serif leading-relaxed animate-fade-in-up">
            <span className="font-sans text-[9px] text-gray-500 font-mono uppercase tracking-wider block mb-1">Example Result</span>
            {exampleAnswer}
          </div>
        )}
      </div>
    </div>
  );
};

// Fullscreen Tutorial Modal Component
const StaircaseTutorialModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in select-none">
      <div className="relative max-w-xl w-full glass rounded-3xl p-6 md:p-8 border-white/5 shadow-2xl flex flex-col items-center text-center space-y-4 md:space-y-6 animate-scale-up">
        
        {/* Tutorial Indicator */}
        <div className="bg-primary-500/10 border border-primary-500/30 text-primary-400 px-3.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase flex items-center gap-1.5">
          <Play className="w-3 h-3 fill-current" />
          Ear Calibration Guide
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <h2 className="text-xl md:text-2xl font-extrabold text-white">How to Hear Higher vs. Lower</h2>
          <p className="text-gray-300 text-xs leading-relaxed max-w-md mx-auto">
            In this level, you will hear a sequence of two notes. Tap the listeners below to learn how notes going <strong>Higher (ascending ↗)</strong> and <strong>Lower (descending ↘)</strong> sound.
          </p>
        </div>

        {/* The Staircase Diagram */}
        <div className="w-full">
          <StaircaseDiagram />
        </div>

        {/* Note */}
        <p className="text-[10px] text-gray-500 font-mono">
          💡 Click the buttons to play the scales. Keep this layout in mind when guessing!
        </p>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full max-w-xs py-3.5 rounded-xl font-bold bg-primary-600 hover:bg-primary-500 text-white transition-all text-xs tracking-wider uppercase shadow-md cursor-pointer"
        >
          Start Level 2 Quiz
        </button>

      </div>
    </div>
  );
};

export const s1l2Config: QuizConfig = {
  stage: 1,
  level: 2,
  title: 'Higher or Lower?',
  subtitle: 'Listen to two different notes played sequentially. Identify if the second note is higher or lower in pitch compared to the first.',
  enabledNotesLabel: 'All White Keys (Sa to Sa\')',
  choices: ['Lower', 'Higher'],
  referenceNotes: whiteKeysList,
  generateDeck: () => {
    const deck: [string, string][] = [];
    
    // 5 Higher consecutive pairs (note 2 is 1 step higher than note 1)
    for (let i = 0; i < 5; i++) {
      const idx1 = Math.floor(Math.random() * (whiteKeysList.length - 1));
      const idx2 = idx1 + 1;
      deck.push([whiteKeysList[idx1], whiteKeysList[idx2]]);
    }
    
    // 5 Lower consecutive pairs (note 2 is 1 step lower than note 1)
    for (let i = 0; i < 5; i++) {
      const idx1 = 1 + Math.floor(Math.random() * (whiteKeysList.length - 1));
      const idx2 = idx1 - 1;
      deck.push([whiteKeysList[idx1], whiteKeysList[idx2]]);
    }
    
    // Shuffle the deck using Fisher-Yates
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    
    return deck;
  },
  playTarget: async (target: [string, string]) => {
    try {
      await playNote(target[0], '0.5s');
      await new Promise((resolve) => setTimeout(resolve, 650));
      await playNote(target[1], '0.5s');
    } catch (err) {
      console.error('Audio playback failed in s1l2 playTarget:', err);
    }
  },
  checkAnswer: (target: [string, string], guess: string) => {
    const idx1 = noteIndex(target[0]);
    const idx2 = noteIndex(target[1]);
    const correctChoice = idx2 > idx1 ? 'Higher' : 'Lower';
    const isCorrect = guess === correctChoice;
    
    const swara1 = noteToSwara[target[0]];
    const swara2 = noteToSwara[target[1]];
    
    let message = '';
    if (isCorrect) {
      message = `Correct! The second note (${swara2}) was indeed ${correctChoice.toLowerCase()} than the first (${swara1}).`;
    } else {
      message = `Incorrect. The second note (${swara2}) was ${correctChoice.toLowerCase()} than the first (${swara1}).`;
    }
    
    return { isCorrect, message };
  },
  choicesGridCols: 2,
  tutorialPopup: (onClose) => <StaircaseTutorialModal onClose={onClose} />
};
