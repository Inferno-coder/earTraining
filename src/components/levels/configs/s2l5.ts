import type { QuizConfig } from './types';
import { playNote } from '../../../utils/audio';

const swaraDetails: Record<string, { swara: string; name: string }> = {
  'C4': { swara: 'Sa', name: 'Shadjam / C4' },
  'D4': { swara: 'Ri', name: 'Chatushruti Rishabham / D4' },
  'E4': { swara: 'Ga', name: 'Antara Gandharam / E4' },
  'F4': { swara: 'Ma', name: 'Shuddha Madhyamam / F4' },
  'G4': { swara: 'Pa', name: 'Panchamam / G4' },
  'A4': { swara: 'Dha', name: 'Chatushruti Dhaivatam / A4' },
  'B4': { swara: 'Ni', name: 'Kakali Nishadam / B4' },
  'C5': { swara: 'Sa\'', name: 'Shadjam (Tarastayi) / C5' }
};

export const s2l5Config: QuizConfig = {
  stage: 2,
  level: 5,
  title: 'Full Octave Ear Training',
  subtitle: 'The ultimate Swara challenge. Listen to a randomized mystery note from the entire octave and classify it. All white keys are interactive.',
  enabledNotesLabel: 'All Swaras (Sa to Sa\')',
  choices: ['Sa', 'Ri', 'Ga', 'Ma', 'Pa', 'Dha', 'Ni', 'Sa\''],
  referenceNotes: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'],
  generateDeck: () => {
    const swarasList = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];
    const deck = [...swarasList];
    // Add 2 random duplicates to make exactly 10 rounds
    deck.push(swarasList[Math.floor(Math.random() * swarasList.length)]);
    deck.push(swarasList[Math.floor(Math.random() * swarasList.length)]);
    
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
      console.error('Audio playback failed in s2l5 playTarget:', err);
    }
  },
  checkAnswer: (target: string, guess: string) => {
    const correctSwara = 
      target === 'C4' ? 'Sa' : 
      target === 'D4' ? 'Ri' : 
      target === 'E4' ? 'Ga' : 
      target === 'F4' ? 'Ma' : 
      target === 'G4' ? 'Pa' : 
      target === 'A4' ? 'Dha' : 
      target === 'B4' ? 'Ni' : 'Sa\'';
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
  choicesGridCols: 4
};
