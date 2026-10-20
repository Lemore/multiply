import type { ReactNode } from 'react';
import { SketchFrame } from '../SketchFrame/SketchFrame.tsx';
import styles from './Button.module.css';

type ButtonProps = {
  variant?: 'primary' | 'secondary';
  onClick: () => void;
  // Uses aria-disabled (not the native attribute) so pressing it never steals focus.
  disabled?: boolean;
  // Keeps focus where it is (e.g. in the answer box) so the phone keyboard stays open.
  keepFocus?: boolean;
  children: ReactNode;
};

// Full-width action button with a hand-drawn chalk outline.
export function Button({ variant = 'primary', onClick, disabled = false, keepFocus = false, children }: ButtonProps) {
  return (
    <SketchFrame className={[styles.frame, disabled ? styles.disabled : styles[variant]].join(' ')}>
      <button
        type="button"
        className={styles.button}
        aria-disabled={disabled || undefined}
        onPointerDown={keepFocus ? (e) => e.preventDefault() : undefined}
        onMouseDown={keepFocus ? (e) => e.preventDefault() : undefined}
        onClick={() => {
          if (!disabled) onClick();
        }}
      >
        {children}
      </button>
    </SketchFrame>
  );
}
