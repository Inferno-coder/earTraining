import type { QuizConfig } from './types';
import { playNote } from '../../../utils/audio';

const whiteKeysList = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];
const noteToSwara: Record<string, string> = {
  'C4': 'Sa',
  'D4': 'Ri',
  'E4': 'Ga',
  'F4': 'Ma',
  'G4': 'Pa',
  'A4': 'Dha',
  'B4': 'Ni',
  'C5': "Sa'"
};

export const s1l1Config: QuizConfig = {
  stage: 1,
  level: 1,
  title: 'Same or Different?',
  subtitle: 'Listen to two notes played sequentially. Identify if they are identical or different.',
  enabledNotesLabel: 'All White Keys (Sa to Sa\')',
  choices: ['Same', 'Different'],
  referenceNotes: whiteKeysList,
  generateDeck: () => {
    const deck: [string, string][] = [];
    
    // 5 Same pairs
    for (let i = 0; i < 5; i++) {
      const note = whiteKeysList[Math.floor(Math.random() * whiteKeysList.length)];
      deck.push([note, note]);
    }
    
    // 5 Different pairs
    for (let i = 0; i < 5; i++) {
      let idx1 = Math.floor(Math.random() * whiteKeysList.length);
      let idx2 = Math.floor(Math.random() * whiteKeysList.length);
      while (idx1 === idx2) {
        idx2 = Math.floor(Math.random() * whiteKeysList.length);
      }
      deck.push([whiteKeysList[idx1], whiteKeysList[idx2]]);
    }
    
    // Shuffle the deck using Fisher-Yates
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    
    return deck;
  },
  playTarget: async (target: [string, string]) => {
    try {
      await playNote(target[0], '0.5s');
      await new Promise((resolve) => setTimeout(resolve, 650));
      await playNote(target[1], '0.5s');
    } catch (err) {
      console.error('Audio playback failed in s1l1 playTarget:', err);
    }
  },
  checkAnswer: (target: [string, string], guess: string) => {
    const isSame = target[0] === target[1];
    const correctChoice = isSame ? 'Same' : 'Different';
    const isCorrect = guess === correctChoice;
    
    const swara1 = noteToSwara[target[0]];
    const swara2 = noteToSwara[target[1]];
    
    let message = '';
    if (isCorrect) {
      message = `Correct! Both notes were indeed ${isSame ? 'the same' : 'different'} (first: ${swara1}, second: ${swara2}).`;
    } else {
      message = `Incorrect. The notes were ${isSame ? 'the same' : 'different'} (first: ${swara1}, second: ${swara2}).`;
    }
    
    return { isCorrect, message };
  },
  choicesGridCols: 2
};
