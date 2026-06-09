import { useState } from 'react';
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
import { s5l8Config } from './components/levels/configs/s5l8';
import ReconstructionEngine from './components/levels/ReconstructionEngine';

type ViewState = 'landing' | 't1' | 's1l0' | 's1l1' | 's1l2' | 't2' | 's2l1' | 's2l2' | 's2l3' | 's2l4' | 's2l5' | 't3' | 's3l1' | 's3l2' | 's3l3' | 't4' | 's4l1' | 't5' | 's5l1' | 's5l2' | 's5l3' | 's5l4' | 's5l5' | 's5l6' | 's5l7' | 's5l8';

function App() {
  const [view, setView] = useState<ViewState>('landing');

  return (
    <>
      {view === 'landing' && (
        <LandingPage onLaunch={() => setView('t1')} />
      )}
      {view === 't1' && (
        <StageTransition stage={1} onBegin={() => setView('s1l0')} />
      )}
      {view === 's1l0' && (
        <Stage1Level0 onBack={() => setView('landing')} onNext={() => setView('s1l1')} />
      )}
      {view === 's1l1' && (
        <QuizEngine
          config={s1l1Config}
          onBack={() => setView('s1l0')}
          onNext={() => setView('s1l2')}
        />
      )}
      {view === 's1l2' && (
        <QuizEngine
          config={s1l2Config}
          onBack={() => setView('s1l1')}
          onNext={() => setView('t2')}
        />
      )}
      {view === 't2' && (
        <StageTransition stage={2} onBegin={() => setView('s2l1')} />
      )}
      {view === 's2l1' && (
        <QuizEngine
          config={s2l1Config}
          onBack={() => setView('s1l2')}
          onNext={() => setView('s2l2')}
        />
      )}
      {view === 's2l2' && (
        <QuizEngine
          config={s2l2Config}
          onBack={() => setView('s2l1')}
          onNext={() => setView('s2l3')}
        />
      )}
      {view === 's2l3' && (
        <QuizEngine
          config={s2l3Config}
          onBack={() => setView('s2l2')}
          onNext={() => setView('s2l4')}
        />
      )}
      {view === 's2l4' && (
        <QuizEngine
          config={s2l4Config}
          onBack={() => setView('s2l3')}
          onNext={() => setView('s2l5')}
        />
      )}
      {view === 's2l5' && (
        <QuizEngine
          config={s2l5Config}
          onBack={() => setView('s2l4')}
          onNext={() => setView('t3')}
        />
      )}
      {view === 't3' && (
        <StageTransition stage={3} onBegin={() => setView('s3l1')} />
      )}
      {view === 's3l1' && (
        <QuizEngine
          config={s3l1Config}
          onBack={() => setView('s2l5')}
          onNext={() => setView('s3l2')}
        />
      )}
      {view === 's3l2' && (
        <QuizEngine
          config={s3l2Config}
          onBack={() => setView('s3l1')}
          onNext={() => setView('s3l3')}
        />
      )}
      {view === 's3l3' && (
        <QuizEngine
          config={s3l3Config}
          onBack={() => setView('s3l2')}
          onNext={() => setView('t4')}
        />
      )}
      {view === 't4' && (
        <StageTransition stage={4} onBegin={() => setView('s4l1')} />
      )}
      {view === 's4l1' && (
        <ReconstructionEngine
          config={s4l1Config}
          onBack={() => setView('s3l3')}
          onNext={() => setView('t5')}
        />
      )}
      {view === 't5' && (
        <StageTransition stage={5} onBegin={() => setView('s5l1')} />
      )}
      {view === 's5l1' && (
        <QuizEngine
          config={s5l1Config}
          onBack={() => setView('s4l1')}
          onNext={() => setView('s5l2')}
        />
      )}
      {view === 's5l2' && (
        <QuizEngine
          config={s5l2Config}
          onBack={() => setView('s5l1')}
          onNext={() => setView('s5l3')}
        />
      )}
      {view === 's5l3' && (
        <QuizEngine
          config={s5l3Config}
          onBack={() => setView('s5l2')}
          onNext={() => setView('s5l4')}
        />
      )}
      {view === 's5l4' && (
        <QuizEngine
          config={s5l4Config}
          onBack={() => setView('s5l3')}
          onNext={() => setView('s5l5')}
        />
      )}
      {view === 's5l5' && (
        <QuizEngine
          config={s5l5Config}
          onBack={() => setView('s5l4')}
          onNext={() => setView('s5l6')}
        />
      )}
      {view === 's5l6' && (
        <QuizEngine
          config={s5l6Config}
          onBack={() => setView('s5l5')}
          onNext={() => setView('s5l7')}
        />
      )}
      {view === 's5l7' && (
        <ReconstructionEngine
          config={s5l7Config}
          onBack={() => setView('s5l6')}
          onNext={() => setView('s5l8')}
        />
      )}
      {view === 's5l8' && (
        <ReconstructionEngine
          config={s5l8Config}
          onBack={() => setView('s5l7')}
        />
      )}
    </>
  );
}

export default App;
