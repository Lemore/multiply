import { useState } from 'react';
import { BottomNav } from '../components/BottomNav/BottomNav.tsx';
import type { PracticeMode, Screen } from '../game/types.ts';
import { AboutScreen } from '../screens/AboutScreen/AboutScreen.tsx';
import { HomeScreen } from '../screens/HomeScreen/HomeScreen.tsx';
import { LearnScreen } from '../screens/LearnScreen/LearnScreen.tsx';
import styles from './App.module.css';

// App Shell: holds the current screen and the mode picked on the home screen (no router).
export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedMode, setSelectedMode] = useState<PracticeMode>('all');

  const navigate = (screen: Screen) => {
    setCurrentScreen(screen);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <main className={styles.content}>
        {currentScreen === 'home' && (
          <HomeScreen selectedMode={selectedMode} onModeChange={setSelectedMode} onStart={() => navigate('learn')} />
        )}
        {currentScreen === 'learn' && <LearnScreen />}
        {currentScreen === 'about' && <AboutScreen />}
      </main>
      <BottomNav current={currentScreen} onNavigate={navigate} />
    </>
  );
}
