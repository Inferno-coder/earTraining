import type { QuizConfig } from './types';
import { playNote } from '../../../utils/audio';

const swaraDetails: Record<string, { swara: string; name: string }> = {
  'D#4': { swara: 'G2', name: 'Sadharana Gandharam / D#4' },
  'E4': { swara: 'G3', name: 'Antara Gandharam / E4' }
};

export const s5l2Config: QuizConfig = {
  stage: 5,
  level: 2,
  title: 'Gandhara Recognition (G2 vs G3)',
  subtitle: 'Listen to the mystery note and classify it. Only Sadharana Gandharam (G2) and Antara Gandharam (G3) are active. Goal: 80%+ accuracy.',
  enabledNotesLabel: 'G2, G3',
  choices: ['G2', 'G3'],
  referenceNotes: ['D#4', 'E4'],
  generateDeck: () => {
    const deck: string[] = [];
    for (let i = 0; i < 5; i++) {
      deck.push('D#4');
      deck.push('E4');
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
      console.error('Audio playback failed in s5l2 playTarget:', err);
    }
  },
  checkAnswer: (target: string, guess: string) => {
    const correctSwara = target === 'D#4' ? 'G2' : 'G3';
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
