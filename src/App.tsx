import { useState } from 'react';
import LandingPage from './components/LandingPage';
import Level0 from './components/levels/Level0';

function App() {
  const [view, setView] = useState<'landing' | 'level0'>('landing');

  return (
    <>
      {view === 'landing' ? (
        <LandingPage onLaunch={() => setView('level0')} />
      ) : (
        <Level0 onBack={() => setView('landing')} />
      )}
    </>
  );
}

export default App;
