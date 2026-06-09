import type { QuizConfig } from './types';
import { playNote } from '../../../utils/audio';

const swaraDetails: Record<string, { swara: string; name: string }> = {
  'F4': { swara: 'M1', name: 'Shuddha Madhyamam / F4' },
  'F#4': { swara: 'M2', name: 'Prati Madhyamam / F#4' }
};

export const s5l3Config: QuizConfig = {
  stage: 5,
  level: 3,
  title: 'Madhyama Recognition (M1 vs M2)',
  subtitle: 'Listen to the mystery note and classify it. Only Shuddha Madhyamam (M1) and Prati Madhyamam (M2) are active. Goal: 80%+ accuracy.',
  enabledNotesLabel: 'M1, M2',
  choices: ['M1', 'M2'],
  referenceNotes: ['F4', 'F#4'],
  generateDeck: () => {
    const deck: string[] = [];
    for (let i = 0; i < 5; i++) {
      deck.push('F4');
      deck.push('F#4');
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
      console.error('Audio playback failed in s5l3 playTarget:', err);
    }
  },
  checkAnswer: (target: string, guess: string) => {
    const correctSwara = target === 'F4' ? 'M1' : 'M2';
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
