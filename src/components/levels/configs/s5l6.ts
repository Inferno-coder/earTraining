import type { QuizConfig } from './types';
import { playNote } from '../../../utils/audio';

const noteToSwarasthana: Record<string, string> = {
  'C#4': 'R1',
  'D4': 'R2',
  'D#4': 'G2',
  'E4': 'G3',
  'F4': 'M1',
  'F#4': 'M2',
  'G#4': 'D1',
  'A4': 'D2',
  'A#4': 'N2',
  'B4': 'N3'
};

const swaraDetails: Record<string, string> = {
  'C#4': 'Shuddha Rishabham (R1) / C#4',
  'D4': 'Chatusruti Rishabham (R2) / D4',
  'D#4': 'Sadharana Gandharam (G2) / D#4',
  'E4': 'Antara Gandharam (G3) / E4',
  'F4': 'Shuddha Madhyamam (M1) / F4',
  'F#4': 'Prati Madhyamam (M2) / F#4',
  'G#4': 'Shuddha Dhaivatam (D1) / G#4',
  'A4': 'Chatusruti Dhaivatam (D2) / A4',
  'A#4': 'Kaisiki Nishadam (N2) / A#4',
  'B4': 'Kakali Nishadam (N3) / B4'
};

export const s5l6Config: QuizConfig = {
  stage: 5,
  level: 6,
  title: 'Mixed Swarasthana Recognition',
  subtitle: 'The ultimate classification test. Listen to a random note from the 10 swarasthana variations and identify it. Goal: 85%+ accuracy.',
  enabledNotesLabel: 'All 10 Swarasthana Variations',
  choices: ['R1', 'R2', 'G2', 'G3', 'M1', 'M2', 'D1', 'D2', 'N2', 'N3'],
  referenceNotes: ['C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4', 'C5'],
  generateDeck: () => {
    const list = Object.keys(noteToSwarasthana);
    const deck = [...list]; // 10 unique swarasthanas
    // Shuffle using Fisher-Yates
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  },
  playTarget: async (target: string) => {
    try {
      await playNote(target, '0.75s');
    } catch (err) {
      console.error('Audio playback failed in s5l6 playTarget:', err);
    }
  },
  checkAnswer: (target: string, guess: string) => {
    const correctSwara = noteToSwarasthana[target];
    const isCorrect = guess === correctSwara;
    const name = swaraDetails[target];
    
    let message = '';
    if (isCorrect) {
      message = `Correct! The mystery note was indeed "${correctSwara}" (${name}).`;
    } else {
      message = `Incorrect. The note was "${correctSwara}" (${name}). Compare the variations on the reference keyboard.`;
    }
    
    return { isCorrect, message };
  },
  choicesGridCols: 5
};
