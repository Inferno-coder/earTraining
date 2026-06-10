import type { QuizConfig } from './types';
import { playNote } from '../../../utils/audio';

const swaraDetails: Record<string, { swara: string; name: string }> = {
  'A#4': { swara: 'N2', name: 'Kaisiki Nishadam / A#4' },
  'B4': { swara: 'N3', name: 'Kakali Nishadam / B4' }
};

export const s5l5Config: QuizConfig = {
  stage: 5,
  level: 5,
  title: 'Nishada Recognition (N2 vs N3)',
  subtitle: 'Listen to the mystery note and classify it. Only Kaisiki Nishadam (N2) and Kakali Nishadam (N3) are active. Goal: 80%+ accuracy.',
  enabledNotesLabel: 'N2, N3',
  choices: ['N2', 'N3'],
  referenceNotes: ['A#4', 'B4'],
  generateDeck: () => {
    const deck: string[] = [];
    for (let i = 0; i < 5; i++) {
      deck.push('A#4');
      deck.push('B4');
    }
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
      console.error('Audio playback failed in s5l5 playTarget:', err);
    }
  },
  checkAnswer: (target: string, guess: string) => {
    const correctSwara = target === 'A#4' ? 'N2' : 'N3';
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
