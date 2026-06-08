import { useState } from 'react';
import LandingPage from './components/LandingPage';
import Level0 from './components/levels/Level0';
import Level1 from './components/levels/Level1';

function App() {
  const [view, setView] = useState<'landing' | 'level0' | 'level1'>('landing');

  return (
    <>
      {view === 'landing' && (
        <LandingPage onLaunch={() => setView('level0')} />
      )}
      {view === 'level0' && (
        <Level0 onBack={() => setView('landing')} onNext={() => setView('level1')} />
      )}
      {view === 'level1' && (
        <Level1 onBack={() => setView('level0')} />
      )}
    </>
  );
}

export default App;
