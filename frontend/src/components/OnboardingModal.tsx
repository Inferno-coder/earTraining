import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Music,
  Sliders,
  Smile,
  Compass,
  ArrowRight,
  HelpCircle,
  TrendingUp,
  Clock
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [fade, setFade] = useState(true);

  // Reset steps when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setFade(true);
    }
  }, [isOpen]);

  console.log('[OnboardingModal] render, isOpen:', isOpen);
  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < 6) {
      setFade(false);
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setFade(true);
      }, 200);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setFade(false);
      setTimeout(() => {
        setCurrentStep(prev => prev - 1);
        setFade(true);
      }, 200);
    }
  };

  const handleComplete = () => {
    // Save completion state to local storage
    localStorage.setItem('hasSeenOnboarding', 'true');
    if (dontShowAgain) {
      localStorage.setItem('hasSeenOnboarding', 'true');
    }
    onClose();
  };

  const handleSkip = () => {
    if (dontShowAgain) {
      localStorage.setItem('hasSeenOnboarding', 'true');
    }
    onClose();
  };

  const stepsData = [
    {
      title: "Welcome to ClearEar Studio",
      emoji: "🎵",
      description: "Learn to hear. Learn to play.",
      body: "Develop strong Carnatic music listening skills through interactive relative-pitch exercises and melodic dictations.",
      icon: <Music className="w-12 h-12 text-primary-400" />
    },
    {
      title: "Why ClearEar Studio Exists",
      emoji: "🌱",
      description: "Bridging the gap for beginners",
      body: "I personally struggled to find structured resources for ear training. That experience inspired me to create ClearEar Studio—a platform dedicated to helping learners develop their listening skills through interactive and structured practice.",
      icon: <Compass className="w-12 h-12 text-emerald-400" />
    },
    {
      title: "How Ear Training Works",
      emoji: "🎧",
      description: "Interactive auditory memory reinforcement",
      body: "Listen to swaras, directions, and melodic patterns, then identify or reconstruct them. Build deep auditory memory step-by-step.",
      icon: <HelpCircle className="w-12 h-12 text-blue-400" />
    },
    {
      title: "Practice Just 15–30 Minutes a Day",
      emoji: "⏱️",
      description: "Consistency leads to mastery",
      body: "Consistency beats long sessions. Just 15–30 minutes of daily practice steadily sharpens your ear calibration.",
      features: [
        { label: "Swara Recognition", desc: "Isolate and identify single swarasthanas." },
        { label: "Melody Practice", desc: "Dictate continuous note directions and scales." },
        { label: "Custom Loop Practice", desc: "Listen repeatedly at your preferred speed." },
        { label: "Progressive Learning", desc: "5 progressive stages tailored to your skill level." }
      ],
      icon: <Clock className="w-12 h-12 text-accent-rose" />
    },
    {
      title: "Custom Practice Mode",
      emoji: "🎹",
      description: "Tailored to your current obstacles",
      body: "Isolate and repeat challenging swaras. Select notes on the keyboard, adjust speed, and loop them continuously to practice at your own pace.",
      features: [
        "Select your own notes",
        "Loop them continuously",
        "Practice at your own pace",
        "Reinforce difficult listening patterns",
        "Build confidence through repetition"
      ],
      icon: <Sliders className="w-12 h-12 text-amber-400" />
    },
    {
      title: "Track Your Progress",
      emoji: "📈",
      description: "Watch your listening accuracy grow",
      body: "View your score accuracy, unlock progressive stages, and save your training progress directly to your profile database.",
      features: [
        "Unlock progressive stages",
        "Track scores & accuracy",
        "Save progress to your profile",
        "Visualize correct/incorrect answers",
        "Structured path of increasing difficulty",
        "Build stronger listening skills over time"
      ],
      icon: <TrendingUp className="w-12 h-12 text-primary-400" />
    },
    {
      title: "Built for the Community",
      emoji: "💬",
      description: "Continuous evolution based on your voice",
      body: "We evolve based on your voice. Send bug reports, suggestions, or feedback directly to the developer to help improve the studio using the Contact tab.",
      icon: <Smile className="w-12 h-12 text-accent-amber animate-bounce" />
    }
  ];

  const step = stepsData[currentStep];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[120] flex items-center justify-center p-4"
    >
      {/* Background click to close unless it is the first mandatory visit */}
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={handleSkip}
      />

      {/* Main Glassmorphic Onboarding Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotate: 0 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        exit={{
          scale: [1, 0.95, 0.8, 0.6, 0.3],
          rotate: [0, 8, -10, 15],
          opacity: [1, 0.9, 0.7, 0.4, 0]
        }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="bg-[#0b0f19]/95 border border-white/10 rounded-3xl w-full max-w-xl p-6 md:p-8 flex flex-col justify-between relative shadow-2xl z-10 min-h-[460px] max-h-[90vh] overflow-y-auto font-sans"
      >

        {/* Header Options */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-1">
            <span className="text-xs font-mono font-bold bg-primary-600/20 text-primary-300 border border-primary-500/20 px-2.5 py-1 rounded-full">
              Academy Tour
            </span>
          </div>

          <button
            onClick={handleSkip}
            className="text-xs font-bold text-gray-400 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-all cursor-pointer"
          >
            Skip Tour
          </button>
        </div>

        {/* Dynamic Transition Step Content */}
        <div className={`flex-1 flex flex-col justify-center transition-all duration-200 ${fade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}>
          <div className="flex flex-col md:flex-row gap-6 items-start text-left">
            {/* Visual Icon */}
            <div className="p-3 bg-white/5 border border-white/5 rounded-2xl shrink-0 self-center md:self-start">
              {step.icon}
            </div>

            <div className="space-y-3 flex-1 w-full">
              {/* Title */}
              <h2 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2">
                <span>{step.emoji}</span>
                <span>{step.title}</span>
              </h2>

              {/* Sub-description subtitle */}
              <p className="text-xs font-mono font-semibold text-accent-amber uppercase tracking-wider">
                {step.description}
              </p>

              {/* Main descriptive body paragraph */}
              <p className="text-gray-300 text-xs md:text-sm leading-relaxed whitespace-pre-line">
                {step.body}
              </p>

              {/* Step specific feature lists */}
              {currentStep === 3 && step.features && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                  {(step.features as any[]).map((feat, idx) => (
                    <div key={idx} className="p-2.5 bg-white/5 border border-white/5 rounded-xl text-left">
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span className="text-emerald-400">✓</span>
                        {feat.label}
                      </h4>
                      <p className="text-[10px] text-gray-400 mt-0.5 leading-normal">{feat.desc}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* List for Screen 5 and Screen 6 */}
              {(currentStep === 4 || currentStep === 5) && step.features && (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 list-none pl-0">
                  {(step.features as string[]).map((feat, idx) => (
                    <li key={idx} className="text-xs text-gray-300 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Footer controls & Progress Dots */}
        <div className="mt-8 pt-5 border-t border-white/5 flex flex-col gap-4">

          {/* Progress Indicators & Don't Show Again Toggle */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">

            {/* Step text and indicator dots */}
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-gray-500 font-bold uppercase shrink-0">
                Step {currentStep + 1} of 7
              </span>

              {/* Animated Progress Dots */}
              <div className="flex gap-1.5">
                {Array.from({ length: 7 }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setFade(false);
                      setTimeout(() => {
                        setCurrentStep(idx);
                        setFade(true);
                      }, 200);
                    }}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${idx === currentStep
                      ? 'w-4 bg-primary-500'
                      : idx < currentStep
                        ? 'w-1.5 bg-primary-400/50'
                        : 'w-1.5 bg-white/10 hover:bg-white/30'
                      }`}
                  />
                ))}
              </div>
            </div>

            {/* Checkbox: Don't show this again */}
            <label className="flex items-center gap-2 text-[10px] font-mono text-gray-400 hover:text-white cursor-pointer select-none">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-white/10 bg-slate-950/80 text-primary-500 focus:ring-0 cursor-pointer accent-primary-500"
              />
              <span>Don't show this again</span>
            </label>
          </div>

          {/* Action buttons */}
          <div className="flex justify-between items-center gap-3">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className="px-4 py-2.5 rounded-xl text-xs font-bold border border-white/5 text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>

            {currentStep < 6 ? (
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-primary-600 hover:bg-primary-500 text-white transition-all shadow-md shadow-primary-600/15 flex items-center gap-1 cursor-pointer"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                className="px-6 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-primary-600 to-accent-amber text-white transition-all shadow-lg shadow-primary-700/25 flex items-center gap-1.5 hover:scale-[1.03] cursor-pointer animate-pulse"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>

      </motion.div>
    </motion.div>
  );
}
