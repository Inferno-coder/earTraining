import type { QuizConfig } from './types';
import { playNote } from '../../../utils/audio';

const swaraDetails: Record<string, { swara: string; name: string }> = {
  'G#4': { swara: 'D1', name: 'Shuddha Dhaivatam / G#4' },
  'A4': { swara: 'D2', name: 'Chatusruti Dhaivatam / A4' }
};

export const s5l4Config: QuizConfig = {
  stage: 5,
  level: 4,
  title: 'Dhaivata Recognition (D1 vs D2)',
  subtitle: 'Listen to the mystery note and classify it. Only Shuddha Dhaivatam (D1) and Chatusruti Dhaivatam (D2) are active. Goal: 80%+ accuracy.',
  enabledNotesLabel: 'D1, D2',
  choices: ['D1', 'D2'],
  referenceNotes: ['G#4', 'A4'],
  generateDeck: () => {
    const deck: string[] = [];
    const notes = ['G#4', 'A4'];
    for (let i = 0; i < 7; i++) {
      deck.push(...notes);
    }
    deck.push(notes[Math.floor(Math.random() * notes.length)]); // 15 total
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
      console.error('Audio playback failed in s5l4 playTarget:', err);
    }
  },
  checkAnswer: (target: string, guess: string) => {
    const correctSwara = target === 'G#4' ? 'D1' : 'D2';
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
