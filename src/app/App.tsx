import { useEffect, useReducer, useState } from 'react';
import { BottomNav } from '../components/BottomNav/BottomNav.tsx';
import { canContinue, FEEDBACK_DURATION_MS, finishFeedback, initialGameState, startGame, submitAnswer } from '../game/game.ts';
import type { GameState, PracticeMode, Screen } from '../game/types.ts';
import { AboutScreen } from '../screens/AboutScreen/AboutScreen.tsx';
import { HomeScreen } from '../screens/HomeScreen/HomeScreen.tsx';
import { LearnScreen } from '../screens/LearnScreen/LearnScreen.tsx';
import { strings } from '../strings/he.ts';
import styles from './App.module.css';
import { useKeyboardOpen } from './useKeyboardOpen.ts';

type GameAction =
  | { type: 'startGame'; mode: PracticeMode }
  | { type: 'submitAnswer'; value: number }
  | { type: 'feedbackDone' };

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'startGame':
      return startGame(action.mode);
    case 'submitAnswer':
      return submitAnswer(state, action.value, strings.learn.feedback.correct.length);
    case 'feedbackDone':
      return finishFeedback(state);
  }
}

// App Shell: holds the current screen, the mode picked on the home screen and the game state (no router).
export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedMode, setSelectedMode] = useState<PracticeMode>('all');
  const [game, dispatch] = useReducer(gameReducer, initialGameState);
  // Draft answer lives here (not in the learn screen) so it survives screen switches.
  const [answer, setAnswer] = useState('');
  const keyboardOpen = useKeyboardOpen();

  // Feedback timer lives in the shell, so it keeps running when another screen is shown.
  useEffect(() => {
    if (game.phase !== 'showingFeedback') return;
    const timer = setTimeout(() => {
      dispatch({ type: 'feedbackDone' });
      setAnswer('');
    }, FEEDBACK_DURATION_MS);
    return () => clearTimeout(timer);
  }, [game.phase]);

  const startNewGame = (mode: PracticeMode) => {
    dispatch({ type: 'startGame', mode });
    setAnswer('');
  };

  const navigate = (screen: Screen) => {
    // Opening the learn tab with no game yet starts one in the mode picked on the home screen.
    if (screen === 'learn' && game.status === 'idle') startNewGame(selectedMode);
    setCurrentScreen(screen);
    window.scrollTo(0, 0);
  };

  const continueGame = canContinue(game, selectedMode);

  const handleStart = () => {
    if (!continueGame) startNewGame(selectedMode);
    setCurrentScreen('learn');
    window.scrollTo(0, 0);
  };

  // Keep the exercise in view when Safari scrolls toward the focused answer box.
  useEffect(() => {
    if (keyboardOpen && currentScreen === 'learn') window.scrollTo(0, 0);
  }, [keyboardOpen, currentScreen]);

  const compact = keyboardOpen && currentScreen === 'learn';

  return (
    <>
      <main className={[styles.content, compact ? styles.compact : ''].join(' ')}>
        {currentScreen === 'home' && (
          <HomeScreen
            selectedMode={selectedMode}
            onModeChange={setSelectedMode}
            canContinue={continueGame}
            onStart={handleStart}
          />
        )}
        {currentScreen === 'learn' && (
          <LearnScreen
            game={game}
            answer={answer}
            onAnswerChange={setAnswer}
            onSubmit={(value) => dispatch({ type: 'submitAnswer', value })}
            onPlayAgain={() => startNewGame(game.mode)}
            compact={compact}
          />
        )}
        {currentScreen === 'about' && <AboutScreen />}
      </main>
      <BottomNav current={currentScreen} onNavigate={navigate} hidden={keyboardOpen} />
    </>
  );
}
