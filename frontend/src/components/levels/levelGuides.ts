export interface LevelGuide {
  icon: string;
  badge: string;
  objective: string;
  howToPlay: string[];
  earTrainingBenefits: string;
  proTip: string;
}

export const getLevelGuide = (stage: number, level: number, isReconstruction = false): LevelGuide => {
  if (isReconstruction) {
    if (stage === 4) {
      return {
        icon: "📝",
        badge: "Melodic Dictation",
        objective: "Listen to a sequence of random swaras played sequentially, and reconstruct the exact melody by selecting the correct swaras in order.",
        howToPlay: [
          "Click the play button to listen to the target melody sequence.",
          "Use the Swara keyboard buttons to input the notes in the exact order you heard them.",
          "You can click on the keys to double-check their pitches if needed.",
          "Succeeding unlocks longer and more challenging sequences."
        ],
        earTrainingBenefits: "This tests your ultimate musical memory and relative pitch recall in a fun, gamified format, training your brain to translate sound sequences directly into musical notes.",
        proTip: "Try singing or humming the melody in your head. Hum the starting note (Sa) to anchor your pitch before choosing the next notes."
      };
    }
    // Stage 5 Level 7
    return {
      icon: "🎼",
      badge: "Advanced Dictation",
      objective: "Listen to an advanced melodic phrase containing mixed swarasthanas (semitones) and recreate it note-by-note.",
      howToPlay: [
        "Play the target melodic sequence.",
        "Identify the active swaras (taking into account the raga's specific microtones/semitones).",
        "Reconstruct the sequence note-by-note using the Swara buttons."
      ],
      earTrainingBenefits: "Hones Raga-specific relative pitch, helping you grasp complex classical phrases (Sancharas) instantly in a live performance or transcription setting.",
      proTip: "Focus on the gaps (intervals) between notes. In classical ragas, notes often glide; listen for the destination pitch of each glide."
    };
  }

  // Stage 1 (Basic Ear Training)
  if (stage === 1) {
    if (level === 1) {
      return {
        icon: "👂",
        badge: "Pitch Acuity",
        objective: "Identify if two consecutively played notes are identical (Same) or different in pitch.",
        howToPlay: [
          "Click 'Play Mystery Note' to hear two notes played back-to-back.",
          "Compare the pitch of the second note to the first note.",
          "Select 'Same' if they match exactly, or 'Different' if they differ."
        ],
        earTrainingBenefits: "Develops the baseline pitch discrimination required to detect microtonal variances (Shrutis) and fine-tune your musical ear.",
        proTip: "Close your eyes while listening to remove visual distractions and fully concentrate on the audio resonance."
      };
    }
    // Level 2
    return {
      icon: "📈",
      badge: "Pitch Direction",
      objective: "Identify if the second note is higher or lower in pitch compared to the first.",
      howToPlay: [
        "Click 'Play Mystery Note' to hear two distinct notes played sequentially.",
        "Determine if the second note rises (higher) or falls (lower) relative to the first.",
        "Select 'Higher' or 'Lower' accordingly."
      ],
      earTrainingBenefits: "Teaches pitch direction tracking, which is fundamental for understanding melodic motion, intervals, and scales.",
      proTip: "Higher notes feel more tense and bright, while lower notes feel more relaxed and warm."
    };
  }

  // Stage 2 (Swara Identification - White Keys)
  if (stage === 2) {
    switch (level) {
      case 1:
        return {
          icon: "⚓",
          badge: "Tonic & Fifth",
          objective: "Identify if the randomized mystery note is Sa (fundamental/C4) or Pa (fifth/G4).",
          howToPlay: [
            "Click 'Play Mystery Note' to hear the active note.",
            "Compare it to the root Sa (lowest note) or Pa (the stable fifth).",
            "Choose 'Sa' or 'Pa' from the options."
          ],
          earTrainingBenefits: "Establishes Sa and Pa as the stable anchors of your ear training. In Indian classical music, these two notes form the frame of the drone.",
          proTip: "Sa is the low, grounded starting note. Pa sounds very stable, open, and consonant against Sa."
        };
      case 2:
        return {
          icon: "🎹",
          badge: "Tonic, Fourth & Fifth",
          objective: "Identify if the randomized mystery note is Sa (fundamental), Ma (fourth/F4), or Pa (fifth/G4).",
          howToPlay: [
            "Play the mystery note.",
            "Compare it with the keyboard reference notes: Sa, Ma, or Pa.",
            "Choose 'Sa', 'Ma', or 'Pa' from the options."
          ],
          earTrainingBenefits: "Introduces Ma (the fourth), adding vertical distance tracking between the tonic and the surrounding intervals.",
          proTip: "Ma is a perfect fourth; it has a clear, hollow, unresolved quality that naturally wants to flow into Pa or resolve down to Sa."
        };
      case 3:
        return {
          icon: "🎼",
          badge: "Lower Tetrachord",
          objective: "Identify the mystery note from the five-note range: Sa, Ri (D4), Ga (E4), Ma, or Pa.",
          howToPlay: [
            "Play the mystery note.",
            "Use the Reference Keyboard to hear Sa, Ri, Ga, Ma, or Pa if needed.",
            "Select the correct swara: Sa, Ri, Ga, Ma, or Pa."
          ],
          earTrainingBenefits: "Maps the first half (Purvanga) of the major scale, building standard stepwise relative pitch recognition.",
          proTip: "Ri sounds close to Sa and carries rising tension. Ga sounds bright, happy, and sweet."
        };
      case 4:
        return {
          icon: "📐",
          badge: "Upper Tetrachord",
          objective: "Identify if the mystery note is Dha (sixth/A4) or Ni (seventh/B4).",
          howToPlay: [
            "Play the mystery note.",
            "Determine if it is the sixth (Dha) or the leading tone (Ni).",
            "Choose 'Dha' or 'Ni' from the options."
          ],
          earTrainingBenefits: "Isolates the upper notes of the scale, training you to identify high-register intervals.",
          proTip: "Ni is the leading tone; it is extremely close to the upper tonic (Sa') and wants to resolve upwards. Dha has a softer, melancholic tension."
        };
      default:
        // Level 5
        return {
          icon: "🌟",
          badge: "Full Octave White Keys",
          objective: "Identify the randomized mystery note from the entire octave (Sa, Ri, Ga, Ma, Pa, Dha, Ni, or Sa').",
          howToPlay: [
            "Play the mystery note.",
            "Match its pitch against any of the 8 notes of the full octave.",
            "Select the correct swara option."
          ],
          earTrainingBenefits: "Synthesizes all your relative pitch training into full-scale recognition across a complete octave.",
          proTip: "Anchor yourself to the low Sa. Try to feel the distance of the mystery note relative to Sa."
        };
    }
  }

  // Stage 3 (Sequence Dictation)
  if (stage === 3) {
    switch (level) {
      case 1:
        return {
          icon: "🎵",
          badge: "2-Note Dictation",
          objective: "Listen to a sequence of 2 notes played consecutively and identify the notes in the correct order.",
          howToPlay: [
            "Click 'Play Mystery Note' to hear the 2-note sequence.",
            "Tap/select the two swaras in the order they were played.",
            "Calibrate your ear using the reference keys."
          ],
          earTrainingBenefits: "Transitions your ear training from static, single-note identification to dynamic melodic movements.",
          proTip: "Focus on the transition. Did the second note go up or down? By how much?"
        };
      case 2:
        return {
          icon: "🎶",
          badge: "3-Note Dictation",
          objective: "Listen to a sequence of 3 notes played consecutively and identify the notes in the correct order.",
          howToPlay: [
            "Listen carefully to the 3-note phrase.",
            "Select the three swaras in sequential order.",
            "Calibrate your ear using the reference keys."
          ],
          earTrainingBenefits: "Expands your auditory short-term memory, which is essential for learning and reproducing musical lines.",
          proTip: "Try to sing or hum the 3 notes immediately after hearing them to lock them in your memory before answering."
        };
      default:
        // Level 3
        return {
          icon: "🎼",
          badge: "4-Note Dictation",
          objective: "Listen to a sequence of 4 notes played consecutively and identify the notes in the correct order.",
          howToPlay: [
            "Listen to the 4-note melodic phrase.",
            "Tap the four swara options in order.",
            "Calibrate your ear using the reference keys."
          ],
          earTrainingBenefits: "Strengthens complex melodic pattern recall, paving the way for full transcription by ear.",
          proTip: "Break the sequence into two pairs. Match the first two notes, then focus on the final two."
        };
    }
  }

  // Stage 5 (Swarasthanas / Carnatic Semitones)
  if (stage === 5) {
    switch (level) {
      case 1:
        return {
          icon: "🎚️",
          badge: "Rishabha (R1 vs R2)",
          objective: "Listen to the mystery note and classify it as Shuddha Rishabham (R1) or Chatusruti Rishabham (R2).",
          howToPlay: [
            "Play the mystery note relative to the Tanpura drone.",
            "Compare it to the R1 (semitone above Sa) and R2 (whole tone above Sa) pitches.",
            "Choose 'R1' or 'R2' from the options."
          ],
          earTrainingBenefits: "Begins microtonal/semitonal discrimination by identifying Rishabha variations against the drone.",
          proTip: "R1 (C#4) is extremely close to Sa (C4) and sounds dark/heavy. R2 (D4) is a whole step up and sounds open and bright."
        };
      case 2:
        return {
          icon: "🎚️",
          badge: "Gandhara (G2 vs G3)",
          objective: "Listen to the mystery note and classify it as Sadharana Gandharam (G2) or Antara Gandharam (G3).",
          howToPlay: [
            "Play the mystery note relative to the Tanpura drone.",
            "Compare it to the G2 (minor third) and G3 (major third) reference notes.",
            "Choose 'G2' or 'G3' from the options."
          ],
          earTrainingBenefits: "Teaches you to differentiate between the minor and major third intervals, which define the emotional quality of a scale.",
          proTip: "G2 (D#4) sounds soft and soulful, while G3 (E4) is very bright, sweet, and happy."
        };
      case 3:
        return {
          icon: "🎚️",
          badge: "Madhyama (M1 vs M2)",
          objective: "Listen to the mystery note and classify it as Shuddha Madhyamam (M1) or Prati Madhyamam (M2).",
          howToPlay: [
            "Play the mystery note relative to the Tanpura drone.",
            "Compare it to the M1 (perfect fourth) and M2 (tritone/augmented fourth) reference notes.",
            "Choose 'M1' or 'M2' from the options."
          ],
          earTrainingBenefits: "Helps you identify the central pivoting note of the scale, differentiating between the bright M1 and the tense M2.",
          proTip: "M1 (F4) is stable and consonant. M2 (F#4) is highly unstable, tense, and mysterious."
        };
      case 4:
        return {
          icon: "🎚️",
          badge: "Dhaivata (D1 vs D2)",
          objective: "Listen to the mystery note and classify it as Shuddha Dhaivatam (D1) or Chatusruti Dhaivatam (D2).",
          howToPlay: [
            "Play the mystery note relative to the Tanpura drone.",
            "Compare it to the D1 (minor sixth) and D2 (major sixth) reference notes.",
            "Choose 'D1' or 'D2' from the options."
          ],
          earTrainingBenefits: "Expands your microtonal/semitonal relative pitch recognition to the upper register.",
          proTip: "D1 (G#4) has a pleading, melancholic quality. D2 (A4) is bright, stable, and uplifting."
        };
      case 5:
        return {
          icon: "🎚️",
          badge: "Nishada (N2 vs N3)",
          objective: "Listen to the mystery note and classify it as Kaisiki Nishadam (N2) or Kakali Nishadam (N3).",
          howToPlay: [
            "Play the mystery note relative to the Tanpura drone.",
            "Compare it to the N2 (minor seventh) and N3 (major seventh) reference notes.",
            "Choose 'N2' or 'N3' from the options."
          ],
          earTrainingBenefits: "Teaches you to distinguish the leading tone variations before returning to the tonic.",
          proTip: "N3 (B4) is very close to Sa' (C5) and creates an intense pull to resolve upward. N2 (A#4) is softer and more relaxed."
        };
      default:
        // Level 6
        return {
          icon: "🕉️",
          badge: "10-Swara Recognition",
          objective: "Identify a mystery note from all 10 active Swarasthana variations.",
          howToPlay: [
            "Play the mystery note relative to the Tanpura drone.",
            "Use the Reference Keyboard to check any of the 10 swarasthanas.",
            "Choose the correct swarasthana among all 10 options."
          ],
          earTrainingBenefits: "The ultimate swara discrimination test, verifying full mastery over all classical semitones.",
          proTip: "Listen to the note's distance from the tonic Sa or the stable Pa. Check if it falls in the lower half (R/G/M) or upper half (D/N)."
        };
    }
  }

  // Fallback
  return {
    icon: "🎵",
    badge: `Stage ${stage} Level ${level}`,
    objective: "Listen to the target melody and select the correct option.",
    howToPlay: [
      "Click play to hear the mystery audio.",
      "Compare it to the reference keys.",
      "Select your choice."
    ],
    earTrainingBenefits: "Trains relative pitch and musical memory.",
    proTip: "Take your time and use the reference keyboard to calibrate."
  };
};
