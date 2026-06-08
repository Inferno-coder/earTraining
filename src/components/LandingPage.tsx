import { useState } from 'react';
import { 
  Music, 
  ArrowRight,
  ChevronRight,
  Shield,
  Sliders,
  Zap
} from 'lucide-react';

type RagaName = 'Mayamalavagowla' | 'Shankarabharanam' | 'Kharaharapriya' | 'Kalyani';

interface SwaraMock {
  name: string;
  fullName: string;
  semitones: number;
}

const RAGA_PREVIEWS: Record<RagaName, { scale: string; desc: string; swaras: SwaraMock[] }> = {
  'Mayamalavagowla': {
    scale: 'S R1 G3 M1 P D1 N3 S\'',
    desc: 'The traditional scale for beginners, characterized by its symmetric, emotive, and close-interval semitones.',
    swaras: [
      { name: 'Sa', fullName: 'Shadjam', semitones: 0 },
      { name: 'Ri', fullName: 'Shuddha Rishabham', semitones: 1 },
      { name: 'Ga', fullName: 'Antara Gandharam', semitones: 4 },
      { name: 'Ma', fullName: 'Shuddha Madhyamam', semitones: 5 },
      { name: 'Pa', fullName: 'Panchamam', semitones: 7 },
      { name: 'Dha', fullName: 'Shuddha Dhaivatam', semitones: 8 },
      { name: 'Ni', fullName: 'Kakali Nishadam', semitones: 11 },
      { name: 'Sa\'', fullName: 'Shadjam (Tarastayi)', semitones: 12 },
    ]
  },
  'Shankarabharanam': {
    scale: 'S R2 G3 M1 P D2 N3 S\'',
    desc: 'Equivalent to the Western Major scale. Bright, majestic, and fundamental to classical melody composition.',
    swaras: [
      { name: 'Sa', fullName: 'Shadjam', semitones: 0 },
      { name: 'Ri', fullName: 'Chatushruti Rishabham', semitones: 2 },
      { name: 'Ga', fullName: 'Antara Gandharam', semitones: 4 },
      { name: 'Ma', fullName: 'Shuddha Madhyamam', semitones: 5 },
      { name: 'Pa', fullName: 'Panchamam', semitones: 7 },
      { name: 'Dha', fullName: 'Chatushruti Dhaivatam', semitones: 9 },
      { name: 'Ni', fullName: 'Kakali Nishadam', semitones: 11 },
      { name: 'Sa\'', fullName: 'Shadjam (Tarastayi)', semitones: 12 },
    ]
  },
  'Kharaharapriya': {
    scale: 'S R2 G2 M1 P D2 N2 S\'',
    desc: 'A symmetric scale matching the Dorian mode. Expresses deep, meditative, and classical devotion.',
    swaras: [
      { name: 'Sa', fullName: 'Shadjam', semitones: 0 },
      { name: 'Ri', fullName: 'Chatushruti Rishabham', semitones: 2 },
      { name: 'Ga', fullName: 'Sadharana Gandharam', semitones: 3 },
      { name: 'Ma', fullName: 'Shuddha Madhyamam', semitones: 5 },
      { name: 'Pa', fullName: 'Panchamam', semitones: 7 },
      { name: 'Dha', fullName: 'Chatushruti Dhaivatam', semitones: 9 },
      { name: 'Ni', fullName: 'Kaisiki Nishadam', semitones: 10 },
      { name: 'Sa\'', fullName: 'Shadjam (Tarastayi)', semitones: 12 },
    ]
  },
  'Kalyani': {
    scale: 'S R2 G3 M2 P D2 N3 S\'',
    desc: 'Features the sharp Madhyamam (M2), creating a bright, expansive Lydian atmosphere filled with light.',
    swaras: [
      { name: 'Sa', fullName: 'Shadjam', semitones: 0 },
      { name: 'Ri', fullName: 'Chatushruti Rishabham', semitones: 2 },
      { name: 'Ga', fullName: 'Antara Gandharam', semitones: 4 },
      { name: 'Ma', fullName: 'Prati Madhyamam', semitones: 6 },
      { name: 'Pa', fullName: 'Panchamam', semitones: 7 },
      { name: 'Dha', fullName: 'Chatushruti Dhaivatam', semitones: 9 },
      { name: 'Ni', fullName: 'Kakali Nishadam', semitones: 11 },
      { name: 'Sa\'', fullName: 'Shadjam (Tarastayi)', semitones: 12 },
    ]
  }
};

interface LandingPageProps {
  onLaunch: () => void;
}

export default function LandingPage({ onLaunch }: LandingPageProps) {
  const [selectedRaga, setSelectedRaga] = useState<RagaName>('Mayamalavagowla');

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-primary-500 selection:text-white">
      
      {/* Background Decorative Blur Blobs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-primary-600 filter blur-3xl opacity-10 animate-pulse-slow"></div>
      <div className="absolute top-2/3 right-1/4 w-96 h-96 rounded-full bg-accent-rose filter blur-3xl opacity-10 animate-pulse-slow"></div>

      {/* Header Navigation */}
      <header className="sticky top-0 z-50 glass border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-primary-600 to-accent-amber p-2.5 rounded-xl shadow-lg shadow-primary-700/20">
            <Music className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <span className="text-xl font-bold bg-gradient-to-r from-white via-primary-100 to-accent-amber bg-clip-text text-transparent tracking-wide">
              SvaraSadhana
            </span>
            <span className="block text-[10px] text-gray-400 font-mono tracking-widest uppercase">Carnatic Music Lab</span>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#raga-explorer" className="hover:text-white transition-colors">Raga Scales</a>
          <a href="#methodology" className="hover:text-white transition-colors">How it Works</a>
        </nav>

        <div>
          <button 
            onClick={onLaunch}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 border border-white/10 text-white transition-all shadow-md shadow-black/20 cursor-pointer"
          >
            Launch Academy
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-12 md:py-20 relative z-10 space-y-24 md:space-y-32">
        
        {/* Hero Section */}
        <section className="flex flex-col lg:flex-row gap-12 items-center text-left">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-accent-amber text-xs font-semibold">
              <Zap className="w-3.5 h-3.5 animate-pulse text-amber-500" />
              Revolutionizing Swara Ear Training
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Master the Geometry of <br />
              <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-accent-amber bg-clip-text text-transparent text-primary-glow">
                Carnatic Swarasthanas
              </span>
            </h1>
            
            <p className="text-gray-300 text-base md:text-lg max-w-2xl leading-relaxed">
              SvaraSadhana is a dedicated ear training and vocal pitch recognition laboratory designed for South Indian classical music. Train your mind to identify microtonal intervals, refine your vocal swara precision, and align with the pure resonance of the Tanpura.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={onLaunch}
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-600/30 transition-all scale-100 hover:scale-[1.02] cursor-pointer"
              >
                Launch Learning Sandbox
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <a
                href="#raga-explorer"
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all cursor-pointer"
              >
                Browse Ragas
              </a>
            </div>
          </div>

          {/* Interactive CSS Dashboard Visual Mockup */}
          <div className="w-full lg:w-[480px] p-6 bg-slate-900/40 border border-white/10 rounded-3xl relative overflow-hidden shadow-2xl backdrop-blur-md">
            
            {/* Visualizer Header Mockup */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">Active Sadhana Session</span>
              </div>
              <span className="text-[10px] font-mono bg-primary-500/20 text-primary-300 border border-primary-500/30 px-2.5 py-0.5 rounded-full">
                Sruti: C# (1.5 Kattai)
              </span>
            </div>

            {/* Vocal Tuner Ring Mockup */}
            <div className="h-48 rounded-2xl bg-black/40 border border-white/5 relative flex flex-col items-center justify-center mb-6 overflow-hidden">
              {/* Radial gradient background */}
              <div className="absolute inset-0 bg-radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)"></div>
              
              {/* Animated wave lines */}
              <div className="absolute inset-x-0 bottom-0 h-16 flex items-end justify-center gap-1 opacity-20 px-8">
                {[40, 60, 45, 90, 80, 55, 75, 60, 45, 80, 100, 70, 50, 65, 85, 40].map((h, i) => (
                  <div 
                    key={i} 
                    className="w-1 bg-primary-400 rounded-t" 
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>

              <div className="z-10 space-y-1.5 text-center">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Sung Pitch detected</span>
                <div className="text-4xl font-extrabold font-mono text-white tracking-tight">
                  277.2 <span className="text-lg font-light text-gray-400">Hz</span>
                </div>
                <div className="text-lg font-bold text-accent-amber flex items-center justify-center gap-1.5 font-serif">
                  <span className="w-2 h-2 rounded-full bg-accent-rose animate-pulse"></span>
                  Ri <span className="text-xs font-sans text-gray-400">(Shuddha Rishabham)</span>
                </div>
                <span className="text-[10px] text-green-400 font-mono font-semibold bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">
                  Perfect Pitch (+2 Cents)
                </span>
              </div>
            </div>

            {/* Keypad Mockup */}
            <div className="grid grid-cols-4 gap-2.5 text-left">
              {[
                { name: 'Sa', active: false },
                { name: 'Ri', active: true },
                { name: 'Ga', active: false },
                { name: 'Ma', active: false },
                { name: 'Pa', active: false },
                { name: 'Dha', active: false },
                { name: 'Ni', active: false },
                { name: 'Sa\'', active: false }
              ].map((swara) => (
                <div 
                  key={swara.name}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    swara.active 
                      ? 'bg-gradient-to-br from-primary-700/50 to-primary-900/50 border-primary-500 shadow-md shadow-primary-700/20 scale-[1.03]' 
                      : 'bg-slate-950/60 border-white/5 opacity-85'
                  }`}
                >
                  <span className={`block text-lg font-extrabold font-serif ${swara.active ? 'text-white' : 'text-primary-300'}`}>
                    {swara.name}
                  </span>
                  <span className="text-[9px] font-mono text-gray-500">
                    {swara.active ? 'Active' : 'Idle'}
                  </span>
                </div>
              ))}
            </div>

            {/* Static Stats Footer */}
            <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-gray-400">
              <span className="flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5 text-amber-500" />
                Score: 14 / 15 (93%)
              </span>
              <span>Raga: Mayamalavagowla</span>
            </div>

          </div>
        </section>

        {/* Feature Grid Section */}
        <section id="features" className="space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl md:text-4xl font-extrabold">
              Engineered for Classical Rigor
            </h2>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
              We translate centuries-old melodic structures of Carnatic classical music into visual, interactive training systems suitable for modern mobile devices and web browsers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Feature 1 */}
            <div className="glass rounded-2xl p-6 text-left border-white/5 glass-hover">
              <div className="w-12 h-12 rounded-xl bg-primary-500/10 border border-primary-500/25 flex items-center justify-center text-primary-400 mb-6 shadow-inner">
                <Music className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Interactive Swara Board</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Interact with the full chromatic range of saptaswaras. Shift base pitch (Sruti) and ragas seamlessly, hearing intervals adapt instantly.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass rounded-2xl p-6 text-left border-white/5 glass-hover">
              <div className="w-12 h-12 rounded-xl bg-accent-rose/10 border border-accent-rose/25 flex items-center justify-center text-accent-rose mb-6 shadow-inner">
                <Sliders className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Vocal Sadhana Tuner</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Sing directly into your browser. Our algorithm translates frequency inputs into Swarasthanas, tracking pitch offsets in real-time.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass rounded-2xl p-6 text-left border-white/5 glass-hover">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-accent-amber mb-6 shadow-inner">
                <Sliders className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Synthesized Tanpura</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Practice against a rich, continuous acoustic-model tanpura drone with adjustable harmonics (Panchamam, Madhyamam, or Nishadam).
              </p>
            </div>

            {/* Feature 4 */}
            <div className="glass rounded-2xl p-6 text-left border-white/5 glass-hover">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/25 flex items-center justify-center text-green-400 mb-6 shadow-inner">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Gamified Ear Training</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Challenge yourself with ascending/descending pitch identifier quizzes, melodic contour games, and adaptive difficulty levels.
              </p>
            </div>

          </div>
        </section>

        {/* Dynamic Static Preview: Raga Explorer */}
        <section id="raga-explorer" className="glass rounded-3xl p-8 md:p-12 border-white/5 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row gap-8 items-start text-left">
            <div className="w-full lg:w-1/3 space-y-6">
              <span className="text-xs font-mono text-primary-400 uppercase tracking-widest font-bold block">Melodic Scale Reference</span>
              <h2 className="text-3xl font-extrabold tracking-tight">Raga Scales</h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                Carnatic ragas use specific combinations of the 12 swarasthanas. Select a raga below to view its scale structure, notes, and interval offsets.
              </p>

              {/* Raga selector buttons */}
              <div className="flex flex-col gap-2 pt-2">
                {(Object.keys(RAGA_PREVIEWS) as RagaName[]).map((raga) => (
                  <button
                    key={raga}
                    onClick={() => setSelectedRaga(raga)}
                    className={`w-full py-3.5 px-4 rounded-xl font-semibold text-sm text-left flex justify-between items-center transition-all cursor-pointer ${
                      selectedRaga === raga
                        ? 'bg-primary-600 text-white font-bold shadow-md shadow-primary-700/20'
                        : 'bg-white/5 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <span>{raga}</span>
                    <ChevronRight className="w-4 h-4 opacity-70" />
                  </button>
                ))}
              </div>
            </div>

            {/* Raga Detail Board Card */}
            <div className="flex-1 w-full bg-slate-950/60 border border-white/5 p-6 md:p-8 rounded-2xl space-y-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 pb-4 border-b border-white/5">
                <div>
                  <h3 className="text-2xl font-bold text-white font-serif">{selectedRaga}</h3>
                  <span className="text-xs font-mono text-gray-400 mt-1 block">Aarohanam Structure</span>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-xl text-center md:text-right shrink-0">
                  <span className="text-[10px] font-mono text-accent-amber uppercase tracking-wider block">Scale Formula</span>
                  <span className="text-sm font-mono text-white font-bold">{RAGA_PREVIEWS[selectedRaga].scale}</span>
                </div>
              </div>

              <p className="text-gray-300 text-sm leading-relaxed italic">
                "{RAGA_PREVIEWS[selectedRaga].desc}"
              </p>

              {/* Swara Row */}
              <div className="space-y-3">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block">Swaras in Scale</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {RAGA_PREVIEWS[selectedRaga].swaras.map((swara) => (
                    <div 
                      key={swara.name} 
                      className="p-3 bg-white/5 border border-white/5 rounded-xl hover:border-primary-500/30 transition-all text-left"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-lg font-extrabold font-serif text-primary-300">{swara.name}</span>
                        <span className="text-[9px] font-mono text-gray-500">+{swara.semitones} ST</span>
                      </div>
                      <span className="block text-[11px] font-semibold text-white/90 truncate">{swara.fullName}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Methodology / How it Works */}
        <section id="methodology" className="space-y-12 text-left">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-mono text-primary-400 uppercase tracking-widest font-bold block">Scientific & Systematic Training</span>
            <h2 className="text-3xl md:text-4xl font-extrabold">The Training Journey</h2>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
              Classical ear training takes dedicated structure. SvaraSadhana is built to guide you from foundational pitch matching to advanced melodic contour recognition.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            {/* Step 1 */}
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-primary-600/10 border border-primary-500/20 flex items-center justify-center font-mono font-bold text-primary-400">
                01
              </div>
              <h3 className="text-lg font-bold">Drone Alignment</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Establish your baseline. Anchor your senses with the continuous Tanpura drone, accustoming your ear to the fundamental cosmic pitch (Shadjam).
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-accent-rose/10 border border-accent-rose/20 flex items-center justify-center font-mono font-bold text-accent-rose">
                02
              </div>
              <h3 className="text-lg font-bold">Interactive Sound Map</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Map the raga coordinates. Click through swara buttons to hear their relative intervals and read their historical placements and descriptions.
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center font-mono font-bold text-accent-amber">
                03
              </div>
              <h3 className="text-lg font-bold">Active Singing Calibration</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Sing and confirm. Use the real-time pitch feedback engine to check if your vocals are sharp, flat, or aligning perfectly with the target Swara.
              </p>
            </div>

          </div>
        </section>

        {/* CTA Launch Section */}
        <section id="launch" className="glass rounded-3xl p-8 md:p-16 text-center border-white/5 relative overflow-hidden bg-gradient-to-tr from-slate-950 via-slate-900/60 to-slate-950 shadow-2xl">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-primary-600 filter blur-3xl opacity-10 -z-10"></div>
          
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="inline-flex p-3 rounded-2xl bg-primary-600/15 border border-primary-500/30 text-primary-400 mb-2">
              <Zap className="w-6 h-6 animate-pulse" />
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">Ready to Train Your Ears?</h2>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
              Start building your swara recognition today. Perfect for classical students, amateur singers, and seasoned musicians aiming for absolute pitch perfection.
            </p>
            <div className="pt-4">
              <button 
                onClick={onLaunch}
                className="px-8 py-4 rounded-xl font-bold bg-primary-600 hover:bg-primary-500 text-white shadow-xl shadow-primary-700/20 transition-all scale-100 hover:scale-[1.02] cursor-pointer"
              >
                Launch Learning Sandbox
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="glass border-t border-white/5 py-12 text-center text-xs text-gray-400 space-y-4 px-6 mt-12">
        <div className="flex justify-center gap-8">
          <a href="#features" className="hover:text-primary-400 transition-colors">Features</a>
          <a href="#raga-explorer" className="hover:text-primary-400 transition-colors">Scales</a>
          <a href="#methodology" className="hover:text-primary-400 transition-colors">Methodology</a>
          <a href="#" className="hover:text-primary-400 transition-colors flex items-center gap-1 font-sans"><Shield className="w-3.5 h-3.5" /> Privacy</a>
        </div>
        <p>© 2026 SvaraSadhana. Empowering Indian Classical Music Ear Training.</p>
        <p className="text-[10px] text-gray-600">Built using React, Vite, and Tailwind CSS v4.</p>
      </footer>

    </div>
  );
}
