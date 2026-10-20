import type { ReactNode } from 'react';
import { SketchFrame } from '../SketchFrame/SketchFrame.tsx';
import styles from './Button.module.css';

type ButtonProps = {
  variant?: 'primary' | 'secondary';
  onClick: () => void;
  children: ReactNode;
};

// Full-width action button with a hand-drawn chalk outline.
export function Button({ variant = 'primary', onClick, children }: ButtonProps) {
  return (
    <SketchFrame className={[styles.frame, styles[variant]].join(' ')}>
      <button type="button" className={styles.button} onClick={onClick}>
        {children}
      </button>
    </SketchFrame>
  );
}
