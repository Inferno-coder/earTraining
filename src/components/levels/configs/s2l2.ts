import type { QuizConfig } from './types';
import { playNote } from '../../../utils/audio';

const swaraDetails: Record<string, { swara: string; name: string }> = {
  'C4': { swara: 'Sa', name: 'Shadjam / C4' },
  'F4': { swara: 'Ma', name: 'Shuddha Madhyamam / F4' },
  'G4': { swara: 'Pa', name: 'Panchamam / G4' }
};

export const s2l2Config: QuizConfig = {
  stage: 2,
  level: 2,
  title: 'Sa - Ma - Pa Ear Training',
  subtitle: 'Listen to a randomized mystery note and classify it. Sa (fundamental), Ma (fourth), and Pa (fifth) are active.',
  enabledNotesLabel: 'Sa, Ma, Pa',
  choices: ['Sa', 'Ma', 'Pa'],
  referenceNotes: ['C4', 'F4', 'G4'],
  generateDeck: () => {
    // 10 rounds: 4 Sa, 3 Ma, 3 Pa
    const deck = ['C4', 'C4', 'C4', 'C4', 'F4', 'F4', 'F4', 'G4', 'G4', 'G4'];
    
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
      console.error('Audio playback failed in s2l2 playTarget:', err);
    }
  },
  checkAnswer: (target: string, guess: string) => {
    const correctSwara = target === 'C4' ? 'Sa' : target === 'F4' ? 'Ma' : 'Pa';
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
  choicesGridCols: 3
};
