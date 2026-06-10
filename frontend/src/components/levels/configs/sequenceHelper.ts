import { playNote } from '../../../utils/audio';

export const swarasList = ['Sa', 'Ri', 'Ga', 'Ma', 'Pa', 'Dha', 'Ni', "Sa'"];
export const notesList = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];
export const noteToSwara: Record<string, string> = {
  'C4': 'Sa',
  'D4': 'Ri',
  'E4': 'Ga',
  'F4': 'Ma',
  'G4': 'Pa',
  'A4': 'Dha',
  'B4': 'Ni',
  'C5': "Sa'"
};

export interface SequenceQuestion {
  notes: string[];
  swaras: string[];
  correctAnswer: string;
  choices: string[];
}

export function generateChoices(correctSwaras: string[], sequenceLength: number): string[] {
  const correctStr = correctSwaras.join(' - ');
  const distractorsSet = new Set<string>();
  
  let attempts = 0;
  while (distractorsSet.size < 3 && attempts < 150) {
    attempts++;
    let distSwaras: string[] = [];
    
    if (Math.random() < 0.6) {
      // Mutate correct sequence (change exactly one note)
      distSwaras = [...correctSwaras];
      const mutateIdx = Math.floor(Math.random() * sequenceLength);
      let newSwara = swarasList[Math.floor(Math.random() * swarasList.length)];
      while (newSwara === correctSwaras[mutateIdx]) {
        newSwara = swarasList[Math.floor(Math.random() * swarasList.length)];
      }
      distSwaras[mutateIdx] = newSwara;
    } else {
      // Completely random sequence
      for (let i = 0; i < sequenceLength; i++) {
        distSwaras.push(swarasList[Math.floor(Math.random() * swarasList.length)]);
      }
    }
    
    const distStr = distSwaras.join(' - ');
    if (distStr !== correctStr) {
      distractorsSet.add(distStr);
    }
  }
  
  // Fallback
  while (distractorsSet.size < 3) {
    const distSwaras: string[] = [];
    for (let i = 0; i < sequenceLength; i++) {
      distSwaras.push(swarasList[Math.floor(Math.random() * swarasList.length)]);
    }
    const distStr = distSwaras.join(' - ');
    if (distStr !== correctStr) {
      distractorsSet.add(distStr);
    }
  }
  
  const choices = [correctStr, ...Array.from(distractorsSet)];
  
  // Shuffle choices
  for (let i = choices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [choices[i], choices[j]] = [choices[j], choices[i]];
  }
  
  return choices;
}

export function generateSequenceDeck(sequenceLength: number, rounds: number = 10): SequenceQuestion[] {
  const deck: SequenceQuestion[] = [];
  
  for (let r = 0; r < rounds; r++) {
    const notes: string[] = [];
    const swaras: string[] = [];
    
    for (let i = 0; i < sequenceLength; i++) {
      const randomNote = notesList[Math.floor(Math.random() * notesList.length)];
      notes.push(randomNote);
      swaras.push(noteToSwara[randomNote]);
    }
    
    const correctAnswer = swaras.join(' - ');
    const choices = generateChoices(swaras, sequenceLength);
    
    deck.push({
      notes,
      swaras,
      correctAnswer,
      choices
    });
  }
  
  return deck;
}

export async function playSequenceTarget(target: SequenceQuestion) {
  try {
    for (let i = 0; i < target.notes.length; i++) {
      await playNote(target.notes[i], '0.45s');
      await new Promise((resolve) => setTimeout(resolve, 550));
    }
  } catch (err) {
    console.error('Sequence audio playback failed:', err);
  }
}
