import React from 'react';

export interface QuizConfig {
  stage: number;
  level: number;
  title: string;
  subtitle: string;
  enabledNotesLabel: string;
  choices: string[];
  // White keys on the keyboard that are clickable for audio reference (e.g., ['C4', 'G4'])
  referenceNotes: string[];
  // Generates the 10-round deck of question targets (can be strings, pairs, etc.)
  generateDeck: () => any[];
  // Triggers the synthesizer sound sequence for the target
  playTarget: (target: any) => Promise<void>;
  // Validates if the selected choice is correct
  checkAnswer: (target: any, guess: string) => { isCorrect: boolean; message: string };
  // Tailwind grid column count for choices (e.g. 2, 3, 5)
  choicesGridCols: number;
  // Optional custom illustration element (e.g., the ascending/descending staircase)
  customIllustration?: React.ReactNode;
  // Optional custom tutorial modal overlay to show before the quiz begins
  tutorialPopup?: (onClose: () => void) => React.ReactNode;
}

export interface ReconstructionConfig {
  stage: number;
  level: number;
  title: string;
  subtitle: string;
  enabledNotesLabel: string;
  notesList: string[]; // List of note pitches to choose from (e.g. ['C4', 'C#4', 'D4'...])
  swaraButtons: string[]; // List of swara button labels to show (e.g. ['Sa', 'R1', 'R2'...])
  noteToSwara: Record<string, string>;
  swaraToNote: Record<string, string>;
  minLength: number;
  maxLength: number;
  defaultLength: number;
}
