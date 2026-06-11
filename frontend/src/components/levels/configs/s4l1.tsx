import type { ReconstructionConfig } from './types';

export const s4l1Config: ReconstructionConfig = {
  stage: 4,
  level: 1,
  title: 'Simon Says: Melodic Dictation',
  subtitle: 'Listen to a sequence of random swaras played sequentially. Click the active swara buttons in the correct order to recreate the melody.',
  enabledNotesLabel: 'All Swaras (Sa to Sa\')',
  notesList: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'],
  swaraButtons: ['Sa', 'Ri', 'Ga', 'Ma', 'Pa', 'Dha', 'Ni', "Sa'"],
  noteToSwara: {
    'C4': 'Sa',
    'D4': 'Ri',
    'E4': 'Ga',
    'F4': 'Ma',
    'G4': 'Pa',
    'A4': 'Dha',
    'B4': 'Ni',
    'C5': "Sa'"
  },
  swaraToNote: {
    'Sa': 'C4',
    'Ri': 'D4',
    'Ga': 'E4',
    'Ma': 'F4',
    'Pa': 'G4',
    'Dha': 'A4',
    'Ni': 'B4',
    "Sa'": 'C5'
  },
  minLength: 3,
  maxLength: 7,
  defaultLength: 3
};
