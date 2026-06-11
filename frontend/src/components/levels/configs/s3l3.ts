import type { QuizConfig } from './types';
import { generateSequenceDeck, playSequenceTarget, notesList } from './sequenceHelper';

export const s3l3Config: QuizConfig = {
  stage: 3,
  level: 3,
  title: '4-Note Sequence Dictation',
  subtitle: 'Listen to a sequence of 4 notes played consecutively. Calibrate your ear using the reference keyboard.',
  enabledNotesLabel: 'All Swaras (Sa to Sa\')',
  choices: [],
  referenceNotes: notesList,
  generateDeck: () => generateSequenceDeck(4, 20),
  playTarget: playSequenceTarget,
  checkAnswer: (target, guess) => {
    const isCorrect = guess === target.correctAnswer;
    const message = isCorrect
      ? `Correct! The sequence was indeed "${target.correctAnswer}".`
      : `Incorrect. The correct sequence was "${target.correctAnswer}".`;
    return { isCorrect, message };
  },
  choicesGridCols: 2
};
