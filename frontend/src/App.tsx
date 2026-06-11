import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { useAuth } from './auth/useAuth';
import LandingPage from './components/LandingPage';
import Stage1Level0 from './components/levels/configs/s1l0';
import QuizEngine from './components/levels/QuizEngine';
import StageTransition from './components/levels/StageTransition';

// Import level configurations
import { s1l1Config } from './components/levels/configs/s1l1';
import { s1l2Config } from './components/levels/configs/s1l2';
import { s2l1Config } from './components/levels/configs/s2l1';
import { s2l2Config } from './components/levels/configs/s2l2';
import { s2l3Config } from './components/levels/configs/s2l3';
import { s2l4Config } from './components/levels/configs/s2l4';
import { s2l5Config } from './components/levels/configs/s2l5';
import { s3l1Config } from './components/levels/configs/s3l1';
import { s3l2Config } from './components/levels/configs/s3l2';
import { s3l3Config } from './components/levels/configs/s3l3';
import { s4l1Config } from './components/levels/configs/s4l1';
import { s5l1Config } from './components/levels/configs/s5l1';
import { s5l2Config } from './components/levels/configs/s5l2';
import { s5l3Config } from './components/levels/configs/s5l3';
import { s5l4Config } from './components/levels/configs/s5l4';
import { s5l5Config } from './components/levels/configs/s5l5';
import { s5l6Config } from './components/levels/configs/s5l6';
import { s5l7Config } from './components/levels/configs/s5l7';
import ReconstructionEngine from './components/levels/ReconstructionEngine';

type ViewState = 'landing' | 't1' | 's1l0' | 's1l1' | 's1l2' | 't2' | 's2l1' | 's2l2' | 's2l3' | 's2l4' | 's2l5' | 't3' | 's3l1' | 's3l2' | 's3l3' | 't4' | 's4l1' | 't5' | 's5l1' | 's5l2' | 's5l3' | 's5l4' | 's5l5' | 's5l6' | 's5l7';

function getViewStateForProgress(stage: number, level: number): ViewState {
  if (stage === 1) {
    if (level === 2) return 's1l2';
    // Stage 1 Level 1 (or 0/default) starts from Stage 1 Intro Transition
    return 't1';
  }
  if (stage === 2) {
    if (level === 1) return 's2l1';
    if (level === 2) return 's2l2';
    if (level === 3) return 's2l3';
    if (level === 4) return 's2l4';
    if (level === 5) return 's2l5';
  }
  if (stage === 3) {
    if (level === 1) return 's3l1';
    if (level === 2) return 's3l2';
    if (level === 3) return 's3l3';
  }
  if (stage === 4) {
    if (level === 1) return 's4l1';
  }
  if (stage === 5) {
    if (level === 1) return 's5l1';
    if (level === 2) return 's5l2';
    if (level === 3) return 's5l3';
    if (level === 4) return 's5l4';
    if (level === 5) return 's5l5';
    if (level === 6) return 's5l6';
    if (level === 7) return 's5l7';
  }
  return 't1';
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/*" element={<AppContent />} />
    </Routes>
  );
}

function AppContent() {
  const { session, loading, progress } = useAuth();
  const [view, setView] = useState<ViewState>('landing');

  if (loading && view !== 'landing') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#05070c] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary-500/20 border-t-primary-500 animate-spin"></div>
          <p className="text-sm font-mono text-gray-400 uppercase tracking-widest animate-pulse">Loading Academy...</p>
        </div>
      </div>
    );
  }

  if (!session && view !== 'landing') {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      {view === 'landing' && (
        <LandingPage onLaunch={() => {
          if (progress) {
            setView(getViewStateForProgress(progress.highest_unlocked_stage, progress.highest_unlocked_level));
          } else {
            setView('t1');
          }
        }} />
      )}
      {view === 't1' && (
        <StageTransition stage={1} onBegin={() => setView('s1l0')} onHome={() => setView('landing')} />
      )}
      {view === 's1l0' && (
        <Stage1Level0 onBack={() => setView('landing')} onNext={() => setView('s1l1')} />
      )}
      {view === 's1l1' && (
        <QuizEngine
          config={s1l1Config}
          onBack={() => setView('s1l0')}
          onNext={() => setView('s1l2')}
          onHome={() => setView('landing')}
        />
      )}
      {view === 's1l2' && (
        <QuizEngine
          config={s1l2Config}
          onBack={() => setView('s1l1')}
          onNext={() => setView('t2')}
          onHome={() => setView('landing')}
        />
      )}
      {view === 't2' && (
        <StageTransition stage={2} onBegin={() => setView('s2l1')} onHome={() => setView('landing')} />
      )}
      {view === 's2l1' && (
        <QuizEngine
          config={s2l1Config}
          onBack={() => setView('s1l2')}
          onNext={() => setView('s2l2')}
          onHome={() => setView('landing')}
        />
      )}
      {view === 's2l2' && (
        <QuizEngine
          config={s2l2Config}
          onBack={() => setView('s2l1')}
          onNext={() => setView('s2l3')}
          onHome={() => setView('landing')}
        />
      )}
      {view === 's2l3' && (
        <QuizEngine
          config={s2l3Config}
          onBack={() => setView('s2l2')}
          onNext={() => setView('s2l4')}
          onHome={() => setView('landing')}
        />
      )}
      {view === 's2l4' && (
        <QuizEngine
          config={s2l4Config}
          onBack={() => setView('s2l3')}
          onNext={() => setView('s2l5')}
          onHome={() => setView('landing')}
        />
      )}
      {view === 's2l5' && (
        <QuizEngine
          config={s2l5Config}
          onBack={() => setView('s2l4')}
          onNext={() => setView('t3')}
          onHome={() => setView('landing')}
        />
      )}
      {view === 't3' && (
        <StageTransition stage={3} onBegin={() => setView('s3l1')} onHome={() => setView('landing')} />
      )}
      {view === 's3l1' && (
        <QuizEngine
          config={s3l1Config}
          onBack={() => setView('s2l5')}
          onNext={() => setView('s3l2')}
          onHome={() => setView('landing')}
        />
      )}
      {view === 's3l2' && (
        <QuizEngine
          config={s3l2Config}
          onBack={() => setView('s3l1')}
          onNext={() => setView('s3l3')}
          onHome={() => setView('landing')}
        />
      )}
      {view === 's3l3' && (
        <QuizEngine
          config={s3l3Config}
          onBack={() => setView('s3l2')}
          onNext={() => setView('t4')}
          onHome={() => setView('landing')}
        />
      )}
      {view === 't4' && (
        <StageTransition stage={4} onBegin={() => setView('s4l1')} onHome={() => setView('landing')} />
      )}
      {view === 's4l1' && (
        <ReconstructionEngine
          config={s4l1Config}
          onBack={() => setView('s3l3')}
          onNext={() => setView('t5')}
          onHome={() => setView('landing')}
        />
      )}
      {view === 't5' && (
        <StageTransition stage={5} onBegin={() => setView('s5l1')} onHome={() => setView('landing')} />
      )}
      {view === 's5l1' && (
        <QuizEngine
          config={s5l1Config}
          onBack={() => setView('s4l1')}
          onNext={() => setView('s5l2')}
          onHome={() => setView('landing')}
        />
      )}
      {view === 's5l2' && (
        <QuizEngine
          config={s5l2Config}
          onBack={() => setView('s5l1')}
          onNext={() => setView('s5l3')}
          onHome={() => setView('landing')}
        />
      )}
      {view === 's5l3' && (
        <QuizEngine
          config={s5l3Config}
          onBack={() => setView('s5l2')}
          onNext={() => setView('s5l4')}
          onHome={() => setView('landing')}
        />
      )}
      {view === 's5l4' && (
        <QuizEngine
          config={s5l4Config}
          onBack={() => setView('s5l3')}
          onNext={() => setView('s5l5')}
          onHome={() => setView('landing')}
        />
      )}
      {view === 's5l5' && (
        <QuizEngine
          config={s5l5Config}
          onBack={() => setView('s5l4')}
          onNext={() => setView('s5l6')}
          onHome={() => setView('landing')}
        />
      )}
      {view === 's5l6' && (
        <QuizEngine
          config={s5l6Config}
          onBack={() => setView('s5l5')}
          onNext={() => setView('s5l7')}
          onHome={() => setView('landing')}
        />
      )}
      {view === 's5l7' && (
        <ReconstructionEngine
          config={s5l7Config}
          onBack={() => setView('s5l6')}
          onHome={() => setView('landing')}
        />
      )}
    </>
  );
}

export default App;
