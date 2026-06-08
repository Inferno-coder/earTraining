import * as Tone from 'tone';

// Absolute base frequency for C4 (Adhara Shadjam) is ~261.63 Hz
export const BASE_FREQS = {
  'C': 261.63,
  'C#': 277.18,
  'D': 293.66,
  'D#': 311.13,
  'E': 329.63,
  'F': 349.23,
  'F#': 369.99,
  'G': 392.00,
  'G#': 415.30,
  'A': 440.00,
  'A#': 466.16,
  'B': 493.88
};

export type RagaName = 'Mayamalavagowla' | 'Shankarabharanam' | 'Kharaharapriya' | 'Kalyani';

export interface Swara {
  name: string;      // S, R, G, M, P, D, N, S'
  fullName: string;  // Shadjam, Rishabham, etc.
  semitones: number; // offset from Sa
}

export const RAGA_SWARAS: Record<RagaName, Swara[]> = {
  'Mayamalavagowla': [
    { name: 'Sa', fullName: 'Shadjam', semitones: 0 },
    { name: 'Ri', fullName: 'Shuddha Rishabham', semitones: 1 },
    { name: 'Ga', fullName: 'Antara Gandharam', semitones: 4 },
    { name: 'Ma', fullName: 'Shuddha Madhyamam', semitones: 5 },
    { name: 'Pa', fullName: 'Panchamam', semitones: 7 },
    { name: 'Dha', fullName: 'Shuddha Dhaivatam', semitones: 8 },
    { name: 'Ni', fullName: 'Kakali Nishadam', semitones: 11 },
    { name: 'Sa\'', fullName: 'Shadjam (Tarastayi)', semitones: 12 },
  ],
  'Shankarabharanam': [
    { name: 'Sa', fullName: 'Shadjam', semitones: 0 },
    { name: 'Ri', fullName: 'Chatushruti Rishabham', semitones: 2 },
    { name: 'Ga', fullName: 'Antara Gandharam', semitones: 4 },
    { name: 'Ma', fullName: 'Shuddha Madhyamam', semitones: 5 },
    { name: 'Pa', fullName: 'Panchamam', semitones: 7 },
    { name: 'Dha', fullName: 'Chatushruti Dhaivatam', semitones: 9 },
    { name: 'Ni', fullName: 'Kakali Nishadam', semitones: 11 },
    { name: 'Sa\'', fullName: 'Shadjam (Tarastayi)', semitones: 12 },
  ],
  'Kharaharapriya': [
    { name: 'Sa', fullName: 'Shadjam', semitones: 0 },
    { name: 'Ri', fullName: 'Chatushruti Rishabham', semitones: 2 },
    { name: 'Ga', fullName: 'Sadharana Gandharam', semitones: 3 },
    { name: 'Ma', fullName: 'Shuddha Madhyamam', semitones: 5 },
    { name: 'Pa', fullName: 'Panchamam', semitones: 7 },
    { name: 'Dha', fullName: 'Chatushruti Dhaivatam', semitones: 9 },
    { name: 'Ni', fullName: 'Kaisiki Nishadam', semitones: 10 },
    { name: 'Sa\'', fullName: 'Shadjam (Tarastayi)', semitones: 12 },
  ],
  'Kalyani': [
    { name: 'Sa', fullName: 'Shadjam', semitones: 0 },
    { name: 'Ri', fullName: 'Chatushruti Rishabham', semitones: 2 },
    { name: 'Ga', fullName: 'Antara Gandharam', semitones: 4 },
    { name: 'Ma', fullName: 'Prati Madhyamam', semitones: 6 },
    { name: 'Pa', fullName: 'Panchamam', semitones: 7 },
    { name: 'Dha', fullName: 'Chatushruti Dhaivatam', semitones: 9 },
    { name: 'Ni', fullName: 'Kakali Nishadam', semitones: 11 },
    { name: 'Sa\'', fullName: 'Shadjam (Tarastayi)', semitones: 12 },
  ]
};

let synth: Tone.Synth | null = null;
let droneNodes: {
  oscillators: Tone.Oscillator[];
  gain: Tone.Gain;
} | null = null;

// Helper to calculate frequency based on base (Sa) and semitone offset
export const getFrequency = (baseFreq: number, semitones: number): number => {
  return baseFreq * Math.pow(2, semitones / 12);
};

export const initAudio = async () => {
  await Tone.start();
  if (!synth) {
    synth = new Tone.Synth({
      oscillator: {
        type: 'triangle' // warmer, woodwind-like sound closer to a bansuri (Indian flute)
      },
      envelope: {
        attack: 0.08,
        decay: 0.15,
        sustain: 0.75,
        release: 0.5
      }
    }).toDestination();
    
    // Add a subtle reverb for space and resonance
    const reverb = new Tone.Reverb({ decay: 1.5, wet: 0.25 }).toDestination();
    synth.connect(reverb);
  }
};

export const playSwara = async (baseFreq: number, semitones: number, duration: string = '0.6s') => {
  await initAudio();
  const freq = getFrequency(baseFreq, semitones);
  if (synth) {
    synth.triggerAttackRelease(freq, duration);
  }
};

// Tanpura Drone synthesis: creates a rich, continuous ambient drone.
// A traditional Tanpura pattern plays: Pa - Sa - Sa - Sa (or Ma - Sa - Sa - Sa)
export const startTanpura = async (baseFreq: number) => {
  await Tone.start();
  if (droneNodes) {
    stopTanpura();
  }

  const mainGain = new Tone.Gain(0.12).toDestination();
  const chorus = new Tone.Chorus(4, 2.5, 0.5).connect(mainGain).start();
  const filter = new Tone.Filter(800, "lowpass").connect(chorus);

  // Tanpura notes: Pa (0.75x base or 1.5x base), Sa (base), Sa (base), Sa_Low (0.5x base)
  const frequencies = [
    baseFreq * 0.75, // Pa (lower octave Panchamam)
    baseFreq,        // Sa (Shadjam)
    baseFreq,        // Sa (Shadjam - second string)
    baseFreq * 0.5   // Sa_Low (Kharaj / base octave Shadjam)
  ];

  const oscillators: Tone.Oscillator[] = [];

  frequencies.forEach((freq, idx) => {
    // Add subtle detuning for acoustic resonance simulation
    const detuneOffset = (idx === 0 ? -4 : idx === 1 ? 2 : idx === 2 ? -2 : 3);
    const osc = new Tone.Oscillator({
      frequency: freq,
      type: idx === 3 ? "sine" : "sawtooth", // sawtooth filtered gives string buzz, sine gives deep base
      detune: detuneOffset,
    }).connect(filter);

    // Give each string its own slow rhythmic volume swell (simulating plucking rotation)
    const stringGain = new Tone.Gain(0).connect(filter);
    osc.disconnect(filter);
    osc.connect(stringGain);

    osc.start();
    oscillators.push(osc);

    // Schedule periodic swelling for Tanpura plucks (spaced out)
    const pluckInterval = 1.2; // seconds between plucks

    const pluckAnimation = () => {
      if (!droneNodes) return;
      const now = Tone.now();
      stringGain.gain.setValueAtTime(0, now);
      // String pluck attack
      stringGain.gain.linearRampToValueAtTime(idx === 3 ? 0.35 : 0.18, now + 0.1);
      // Long string decay
      stringGain.gain.exponentialRampToValueAtTime(0.001, now + pluckInterval * 3.5);
    };

    // Trigger immediately
    pluckAnimation();

    // Set up recurring plucks using a JS interval (safe for simple drone)
    const intervalId = setInterval(() => {
      if (droneNodes) {
        pluckAnimation();
      } else {
        clearInterval(intervalId);
      }
    }, pluckInterval * 4 * 1000); // repeats every cycle
  });

  droneNodes = {
    oscillators,
    gain: mainGain
  };
};

export const stopTanpura = () => {
  if (droneNodes) {
    droneNodes.oscillators.forEach(osc => {
      try {
        osc.stop();
        osc.dispose();
      } catch (e) {
        // ignore
      }
    });
    try {
      droneNodes.gain.dispose();
    } catch (e) {
      // ignore
    }
    droneNodes = null;
  }
};
