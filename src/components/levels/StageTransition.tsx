import { useEffect } from 'react';
import { Play, Sparkles, Award } from 'lucide-react';
import { playNote } from '../../utils/audio';

interface StageTransitionProps {
  stage: 1 | 2;
  onBegin: () => void;
}

export default function StageTransition({ stage, onBegin }: StageTransitionProps) {
  // Play transition melody on mount
  useEffect(() => {
    const playIntroMelody = async () => {
      try {
        if (stage === 1) {
          // Play ascending Sa - Ga - Pa arpeggio (C4 - E4 - G4)
          await playNote('C4', '0.4s');
          await new Promise((resolve) => setTimeout(resolve, 180));
          await playNote('E4', '0.4s');
          await new Promise((resolve) => setTimeout(resolve, 180));
          await playNote('G4', '0.6s');
        } else {
          // Play ascending Sa - Ga - Pa - Sa' arpeggio (C4 - E4 - G4 - C5)
          await playNote('C4', '0.3s');
          await new Promise((resolve) => setTimeout(resolve, 150));
          await playNote('E4', '0.3s');
          await new Promise((resolve) => setTimeout(resolve, 150));
          await playNote('G4', '0.3s');
          await new Promise((resolve) => setTimeout(resolve, 150));
          await playNote('C5', '0.6s');
        }
      } catch (err) {
        console.error('Failed to play stage intro melody:', err);
      }
    };

    // Delay slightly to let page transitions finish
    const timer = setTimeout(playIntroMelody, 300);
    return () => clearTimeout(timer);
  }, [stage]);

  const stageData = {
    1: {
      number: 'STAGE 1',
      title: 'Pitch Fundamentals',
      subtitle: 'Build the baseline coordinates of your auditory senses.',
      desc: 'In this stage, you will focus on training your ear to align with the sruti (fundamental pitch), detect identical tones, and recognize ascending and descending intervals.',
      accent: 'from-primary-500 to-purple-500',
      glow: 'bg-primary-600/10',
      badgeBg: 'bg-primary-500/10 border-primary-500/30 text-primary-400',
      levels: [
        { name: 'Level 0', title: 'Pitch Exploration', desc: 'A sandbox chromatic/diatonic keyboard to play notes and see swara names.' },
        { name: 'Level 1', title: 'Same or Different?', desc: 'Compare two notes played in sequence to see if they are identical.' },
        { name: 'Level 2', title: 'Higher or Lower?', desc: 'Assess pitch direction with the help of the Aarohanam/Avarohanam staircase.' }
      ]
    },
    2: {
      number: 'STAGE 2',
      title: 'Swara Identification',
      subtitle: 'Identify and classify structural Carnatic swarasthanas.',
      desc: 'Now that your relative pitch senses are calibrated, enter the world of Raga Swaras. You will train to identify active swaras against the continuous drone of the Tanpura.',
      accent: 'from-accent-amber via-primary-500 to-accent-rose',
      glow: 'bg-accent-amber/10',
      badgeBg: 'bg-amber-500/10 border-amber-500/30 text-accent-amber',
      levels: [
        { name: 'Level 1', title: 'Sa - Pa Ear Training', desc: 'Identify the fundamental (Sa) and the fifth (Pa) intervals.' },
        { name: 'Level 2', title: 'Sa - Ma - Pa Ear Training', desc: 'Introduce Shuddha Madhyamam (Ma) into the selection matrix.' },
        { name: 'Level 3', title: 'Sa - Ri - Ga - Ma - Pa', desc: 'Train across five consecutive diatonic swaras.' },
        { name: 'Level 4', title: 'Dha - Ni Practice', desc: 'Calibrate your ear to the higher register swaras: Dhaivatam and Nishadam.' },
        { name: 'Level 5', title: 'Full Octave Ear Training', desc: 'Identify any swara from the entire octave (Sa to Sa\') with all keys active.' }
      ]
    }
  }[stage];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#05070c] p-4 md:p-6 overflow-hidden animate-fade-in select-none">

      {/* Animated Blur Blobs */}
      <div className={`absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full filter blur-3xl opacity-15 animate-pulse-slow ${stageData.glow}`}></div>
      <div className={`absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full filter blur-3xl opacity-10 animate-pulse-slow ${stageData.glow}`}></div>

      {/* Main Card */}
      <div className="relative max-w-2xl w-full glass rounded-3xl p-6 md:p-10 border-white/5 shadow-2xl flex flex-col items-center text-center space-y-6 md:space-y-8 animate-scale-up max-h-[90vh] overflow-y-auto">

        {/* Celebration / Icon Badge */}
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-mono font-bold tracking-widest ${stageData.badgeBg} animate-bounce`}>
          {stage === 1 ? <Sparkles className="w-4 h-4" /> : <Award className="w-4 h-4" />}
          {stageData.number}
        </div>

        {/* Stage Title */}
        <div className="space-y-2">
          <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r ${stageData.accent} bg-clip-text text-transparent pb-1`}>
            {stageData.title}
          </h1>
          <p className="text-gray-300 text-sm md:text-base max-w-lg mx-auto leading-relaxed">
            {stageData.subtitle}
          </p>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

        {/* Stage Description & Levels List */}
        <div className="w-full text-left space-y-4">
          <p className="text-xs md:text-sm text-gray-400 leading-relaxed italic text-center">
            "{stageData.desc}"
          </p>

          <div className="space-y-3 pt-2">
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block border-b border-white/5 pb-1">
              Curriculum Checklist
            </span>
            <div className="space-y-2">
              {stageData.levels.map((lvl, index) => (
                <div
                  key={lvl.name}
                  className="flex items-start gap-3 p-3 bg-white/5 border border-white/5 rounded-xl animate-fade-in-up"
                  style={{ animationDelay: `${200 + index * 100}ms` }}
                >
                  <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-mono font-bold text-primary-400">
                    0{index}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                      {lvl.name}: {lvl.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{lvl.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="w-full pt-4">
          <button
            onClick={onBegin}
            className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white flex items-center justify-center gap-2.5 shadow-lg shadow-primary-600/25 transition-all scale-100 hover:scale-[1.02] cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            Begin Stage {stage === 1 ? 'I' : 'II'}
          </button>
        </div>

      </div>

    </div>
  );
}
