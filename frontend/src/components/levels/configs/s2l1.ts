import type { QuizConfig } from './types';
import { playNote } from '../../../utils/audio';

const swaraDetails: Record<string, { swara: string; name: string }> = {
  'C4': { swara: 'Sa', name: 'Shadjam / C4' },
  'G4': { swara: 'Pa', name: 'Panchamam / G4' }
};

export const s2l1Config: QuizConfig = {
  stage: 2,
  level: 1,
  title: 'Sa - Pa Ear Training',
  subtitle: 'Listen to a randomized mystery note and classify it. Only Sa (fundamental) and Pa (fifth) are active.',
  enabledNotesLabel: 'Sa, Pa',
  choices: ['Sa', 'Pa'],
  referenceNotes: ['C4', 'G4'],
  generateDeck: () => {
    const deck = ['C4', 'C4', 'C4', 'C4', 'C4', 'G4', 'G4', 'G4', 'G4', 'G4'];
    
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
      console.error('Audio playback failed in s2l1 playTarget:', err);
    }
  },
  checkAnswer: (target: string, guess: string) => {
    const correctSwara = target === 'C4' ? 'Sa' : 'Pa';
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
