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

type ViewState = 'landing' | 't1' | 's1l0' | 's1l1' | 's1l2' | 't2' | 's2l1' | 's2l2' | 's2l3' | 's2l4' | 's2l5';

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
        />
      )}
    </>
  );
}

export default App;
