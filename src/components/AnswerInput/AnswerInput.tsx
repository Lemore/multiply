import type { Ref } from 'react';
import { SketchFrame } from '../SketchFrame/SketchFrame.tsx';
import styles from './AnswerInput.module.css';

export type AnswerState = 'default' | 'correct' | 'wrong';

type AnswerInputProps = {
  ref?: Ref<HTMLInputElement>;
  value: string;
  onChange: (value: string) => void;
  label: string;
  state: AnswerState;
  readOnly: boolean;
};

export const MAX_ANSWER_LENGTH = 3;

// Digits only, at most 3 (the largest answer is 100). Also cleans pasted text.
export function sanitizeAnswer(raw: string): string {
  return raw.replace(/\D/g, '').slice(0, MAX_ANSWER_LENGTH);
}

// Numeric answer box. readOnly (not disabled) during feedback keeps focus and the keyboard open.
export function AnswerInput({ ref, value, onChange, label, state, readOnly }: AnswerInputProps) {
  return (
    <SketchFrame shape={3} className={[styles.frame, styles[state]].join(' ')}>
      <input
        ref={ref}
        className={styles.input}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={MAX_ANSWER_LENGTH}
        autoComplete="off"
        dir="ltr"
        placeholder="?"
        aria-label={label}
        value={value}
        readOnly={readOnly}
        onChange={(e) => onChange(sanitizeAnswer(e.target.value))}
      />
    </SketchFrame>
  );
}
