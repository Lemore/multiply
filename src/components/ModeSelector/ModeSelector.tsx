import { PRACTICE_MODES, type PracticeMode } from '../../game/types.ts';
import { strings } from '../../strings/he.ts';
import { SketchFrame } from '../SketchFrame/SketchFrame.tsx';
import { ChevronDownIcon } from '../icons/Icons.tsx';
import styles from './ModeSelector.module.css';

type ModeSelectorProps = {
  id: string;
  value: PracticeMode;
  onChange: (mode: PracticeMode) => void;
};

function toMode(value: string): PracticeMode {
  return value === 'all' ? 'all' : (Number(value) as PracticeMode);
}

// Native <select>: only the closed state is styled; the phone shows its own picker when opened.
export function ModeSelector({ id, value, onChange }: ModeSelectorProps) {
  return (
    <SketchFrame shape={2} className={styles.frame}>
      <select id={id} className={styles.select} value={String(value)} onChange={(e) => onChange(toMode(e.target.value))}>
        {PRACTICE_MODES.map((mode) => (
          <option key={mode} value={String(mode)}>
            {mode === 'all' ? strings.home.modeAll : mode}
          </option>
        ))}
      </select>
      <ChevronDownIcon className={styles.chevron} width="22" height="22" />
    </SketchFrame>
  );
}
