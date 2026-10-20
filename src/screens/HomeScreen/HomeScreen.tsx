import { Button } from '../../components/Button/Button.tsx';
import { ModeSelector } from '../../components/ModeSelector/ModeSelector.tsx';
import { SketchFrame } from '../../components/SketchFrame/SketchFrame.tsx';
import type { PracticeMode } from '../../game/types.ts';
import { strings } from '../../strings/he.ts';
import styles from './HomeScreen.module.css';

type HomeScreenProps = {
  selectedMode: PracticeMode;
  onModeChange: (mode: PracticeMode) => void;
  // A game in the selected mode is in progress: the button continues it instead of starting anew.
  canContinue?: boolean;
  onStart: () => void;
};

const MODE_SELECT_ID = 'mode-select';

export function HomeScreen({ selectedMode, onModeChange, canContinue = false, onStart }: HomeScreenProps) {
  return (
    <div className={styles.screen}>
      <h1 className={styles.title}>
        {strings.appName.first} <span className={styles.accent}>{strings.appName.second}</span>
      </h1>

      <SketchFrame shape={2} className={styles.picture}>
        <img
          className={styles.image}
          src={`${import.meta.env.BASE_URL}images/home-cat.jpg`}
          alt={strings.home.imageAlt}
          width="900"
          height="900"
        />
      </SketchFrame>

      <div className={styles.mode}>
        <label htmlFor={MODE_SELECT_ID} className={styles.modeLabel}>
          {strings.home.modeLabel}
        </label>
        <ModeSelector id={MODE_SELECT_ID} value={selectedMode} onChange={onModeChange} />
      </div>

      <div className={styles.action}>
        <Button onClick={onStart}>{canContinue ? strings.home.continue : strings.home.start}</Button>
      </div>
    </div>
  );
}
