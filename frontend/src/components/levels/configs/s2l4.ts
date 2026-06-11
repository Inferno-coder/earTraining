import type { QuizConfig } from './types';
import { playNote } from '../../../utils/audio';

const swaraDetails: Record<string, { swara: string; name: string }> = {
  'A4': { swara: 'Dha', name: 'Chatushruti Dhaivatam / A4' },
  'B4': { swara: 'Ni', name: 'Kakali Nishadam / B4' }
};

export const s2l4Config: QuizConfig = {
  stage: 2,
  level: 4,
  title: 'Dha - Ni Ear Training',
  subtitle: 'Listen to a randomized mystery note and classify it. Only Dha (sixth) and Ni (seventh) are active.',
  enabledNotesLabel: 'Dha, Ni',
  choices: ['Dha', 'Ni'],
  referenceNotes: ['A4', 'B4'],
  generateDeck: () => {
    // 15 rounds: 8 of one note, 7 of the other note
    const deck = ['A4', 'A4', 'A4', 'A4', 'A4', 'A4', 'A4', 'A4', 'B4', 'B4', 'B4', 'B4', 'B4', 'B4', 'B4'];
    
    // Shuffle the deck using Fisher-Yates
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
      console.error('Audio playback failed in s2l4 playTarget:', err);
    }
  },
  checkAnswer: (target: string, guess: string) => {
    const correctSwara = target === 'A4' ? 'Dha' : 'Ni';
    const isCorrect = guess === correctSwara;
    const details = swaraDetails[target];
    
    let message = '';
    if (isCorrect) {
      message = `Correct! The mystery note was indeed "${correctSwara}" (${details.name}).`;
    } else {
      message = `Incorrect. Try listening to the mystery note again, then adjust your guess.`;
    }
    
    return { isCorrect, message };
  },
  choicesGridCols: 2
};
