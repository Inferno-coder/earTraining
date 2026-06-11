import type { ReconstructionConfig } from './types';

export const s5l7Config: ReconstructionConfig = {
  stage: 5,
  level: 7,
  title: 'Advanced Swarasthana Dictation',
  subtitle: 'Listen to an advanced melodic phrase containing mixed swarasthanas and recreate it note-by-note. Goal: 80%+ accuracy.',
  enabledNotesLabel: 'All 12 Swarasthanas',
  notesList: ['C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4', 'C5'],
  swaraButtons: ['Sa', 'R1', 'R2', 'G2', 'G3', 'M1', 'M2', 'Pa', 'D1', 'D2', 'N2', 'N3', "Sa'"],
  noteToSwara: {
    'C4': 'Sa',
    'C#4': 'R1',
    'D4': 'R2',
    'D#4': 'G2',
    'E4': 'G3',
    'F4': 'M1',
    'F#4': 'M2',
    'G4': 'Pa',
    'G#4': 'D1',
    'A4': 'D2',
    'A#4': 'N2',
    'B4': 'N3',
    'C5': "Sa'"
  },
  swaraToNote: {
    'Sa': 'C4',
    'R1': 'C#4',
    'R2': 'D4',
    'G2': 'D#4',
    'G3': 'E4',
    'M1': 'F4',
    'M2': 'F#4',
    'Pa': 'G4',
    'D1': 'G#4',
    'D2': 'A4',
    'N2': 'A#4',
    'N3': 'B4',
    "Sa'": 'C5'
  },
  minLength: 3,
  maxLength: 7,
  defaultLength: 3
};
