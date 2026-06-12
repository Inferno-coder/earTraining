import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Lock, CheckCircle2, ChevronRight, Music } from 'lucide-react';
import { useAuth } from '../../auth/useAuth';

interface LevelSelectorProps {
  currentStage: number;
  currentLevel: number;
  onChangeLevel?: (stage: number, level: number) => void;
}

const STAGES = [
  {
    id: 1,
    name: "Stage 1: Pitch Basics",
    levels: [
      { stage: 1, level: 0, label: "Level 0: Sandbox Exploration" },
      { stage: 1, level: 1, label: "Level 1: Same or Different?" },
      { stage: 1, level: 2, label: "Level 2: Higher or Lower?" },
    ]
  },
  {
    id: 2,
    name: "Stage 2: Saptaswaras",
    levels: [
      { stage: 2, level: 1, label: "Level 1: Anchor Notes (Sa - Pa)" },
      { stage: 2, level: 2, label: "Level 2: Perfect Fourth (Sa - Ma - Pa)" },
      { stage: 2, level: 3, label: "Level 3: Lower Register (Sa - Pa)" },
      { stage: 2, level: 4, label: "Level 4: Upper Register (Dha - Ni)" },
      { stage: 2, level: 5, label: "Level 5: Full Octave Swara Board" },
    ]
  },
  {
    id: 3,
    name: "Stage 3: Relative Pitch",
    levels: [
      { stage: 3, level: 1, label: "Level 1: 2-Note Dictation" },
      { stage: 3, level: 2, label: "Level 2: 3-Note Dictation" },
      { stage: 3, level: 3, label: "Level 3: 4-Note Dictation" },
    ]
  },
  {
    id: 4,
    name: "Stage 4: Melodic Memory",
    levels: [
      { stage: 4, level: 1, label: "Level 1: Sequence Reconstruction" },
    ]
  },
  {
    id: 5,
    name: "Stage 5: Swarasthanas",
    levels: [
      { stage: 5, level: 1, label: "Level 1: Rishabha (R1 vs R2)" },
      { stage: 5, level: 2, label: "Level 2: Gandhara (G2 vs G3)" },
      { stage: 5, level: 3, label: "Level 3: Madhyama (M1 vs M2)" },
      { stage: 5, level: 4, label: "Level 4: Dhaivata (D1 vs D2)" },
      { stage: 5, level: 5, label: "Level 5: Nishada (N2 vs N3)" },
      { stage: 5, level: 6, label: "Level 6: Mixed Swarasthana Identification" },
      { stage: 5, level: 7, label: "Level 7: Advanced Swarasthana Dictation" },
    ]
  }
];

export default function LevelSelector({ currentStage, currentLevel, onChangeLevel }: LevelSelectorProps) {
  const { progress } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Determine if a level is unlocked
  const isLevelUnlocked = (stage: number, level: number): boolean => {
    // If progress is not loaded yet or unavailable, allow Stage 1 Level 0 and 1 by default
    if (!progress) {
      return stage === 1 && level <= 1;
    }
    const { highest_unlocked_stage, highest_unlocked_level } = progress;
    if (highest_unlocked_stage > stage) return true;
    if (highest_unlocked_stage === stage && highest_unlocked_level >= level) return true;
    return false;
  };

  // Find current level title
  const currentLevelLabel = STAGES.find(s => s.id === currentStage)
    ?.levels.find(l => l.level === currentLevel)
    ?.label || `Level ${currentLevel}`;

  const handleSelectLevel = (stage: number, level: number) => {
    if (!isLevelUnlocked(stage, level)) return;
    setIsOpen(false);
    if (onChangeLevel) {
      onChangeLevel(stage, level);
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Dropdown Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 active:scale-98 transition-all cursor-pointer shadow-lg backdrop-blur-md"
      >
        <span className="flex items-center gap-1.5">
          <span className="text-[10px] md:text-xs font-mono text-primary-400 font-bold uppercase tracking-wider">
            Stage {currentStage}
          </span>
          <span className="w-1 h-1 rounded-full bg-white/20"></span>
          <span className="text-xs md:text-sm font-semibold tracking-wide truncate max-w-[140px] sm:max-w-none">
            {currentLevelLabel}
          </span>
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-white' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-[300px] sm:w-[460px] max-h-[80vh] overflow-y-auto bg-slate-950/95 border border-white/10 rounded-2xl p-4 shadow-2xl z-[100] backdrop-blur-xl animate-scale-up text-left scrollbar-thin">
          <div className="pb-3 mb-3 border-b border-white/5 flex justify-between items-center">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-widest font-bold flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5 text-primary-400" />
              Sadhana Curriculum
            </span>
            <span className="text-[10px] font-mono text-accent-amber font-semibold">
              Select Unlocked Level
            </span>
          </div>

          <div className="space-y-4">
            {STAGES.map((stage) => {
              // Check if any level in this stage is unlocked
              const hasAnyUnlocked = stage.levels.some(l => isLevelUnlocked(stage.id, l.level));
              
              return (
                <div key={stage.id} className="space-y-1.5">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">
                      {stage.name}
                    </span>
                    {!hasAnyUnlocked && (
                      <Lock className="w-2.5 h-2.5 text-gray-600" />
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {stage.levels.map((lvl) => {
                      const unlocked = isLevelUnlocked(stage.id, lvl.level);
                      const isCurrent = currentStage === stage.id && currentLevel === lvl.level;

                      return (
                        <button
                          key={lvl.level}
                          disabled={!unlocked}
                          onClick={() => handleSelectLevel(stage.id, lvl.level)}
                          className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between group ${
                            isCurrent
                              ? 'bg-gradient-to-r from-primary-600/30 to-primary-700/20 border-primary-500/50 text-white font-bold'
                              : unlocked
                                ? 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10 hover:border-white/10 cursor-pointer'
                                : 'bg-slate-950/40 border-white/5 text-gray-600 cursor-not-allowed opacity-40'
                          }`}
                        >
                          <span className="text-xs truncate mr-1.5 flex items-center gap-1">
                            {isCurrent && (
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                            )}
                            {lvl.label.replace(/^Level \d+: /, '')}
                          </span>
                          
                          <span className="shrink-0">
                            {isCurrent ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            ) : unlocked ? (
                              <ChevronRight className="w-3 h-3 text-gray-500 group-hover:translate-x-0.5 group-hover:text-white transition-all" />
                            ) : (
                              <Lock className="w-3 h-3 text-gray-600" />
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
