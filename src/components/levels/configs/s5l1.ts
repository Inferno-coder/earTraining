import type { QuizConfig } from './types';
import { playNote } from '../../../utils/audio';

const swaraDetails: Record<string, { swara: string; name: string }> = {
  'C#4': { swara: 'R1', name: 'Shuddha Rishabham / C#4' },
  'D4': { swara: 'R2', name: 'Chatusruti Rishabham / D4' }
};

export const s5l1Config: QuizConfig = {
  stage: 5,
  level: 1,
  title: 'Rishabha Recognition (R1 vs R2)',
  subtitle: 'Listen to the mystery note and classify it. Only Shuddha Rishabham (R1) and Chatusruti Rishabham (R2) are active. Goal: 80%+ accuracy.',
  enabledNotesLabel: 'R1, R2',
  choices: ['R1', 'R2'],
  referenceNotes: ['C#4', 'D4'],
  generateDeck: () => {
    const deck: string[] = [];
    // 5 of each note
    for (let i = 0; i < 5; i++) {
      deck.push('C#4');
      deck.push('D4');
    }
    // Shuffle using Fisher-Yates
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  },
  playTarget: async (target: string) => {
    try {
      await playNote(target, '0.7s');
    } catch (err) {
      console.error('Audio playback failed in s5l1 playTarget:', err);
    }
  },
  checkAnswer: (target: string, guess: string) => {
    const correctSwara = target === 'C#4' ? 'R1' : 'R2';
    const isCorrect = guess === correctSwara;
    const details = swaraDetails[target];
    
    let message = '';
    if (isCorrect) {
      message = `Correct! The mystery note was indeed "${correctSwara}" (${details.name}).`;
    } else {
      message = `Incorrect. The note was "${correctSwara}" (${details.name}). Try listening and comparing them on the keyboard.`;
    }
    
    return { isCorrect, message };
  },
  choicesGridCols: 2
};
