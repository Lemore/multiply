import type { ReactNode } from 'react';
import { framePaths, type FrameShape } from '../../assets/frames/framePaths.ts';
import styles from './SketchFrame.module.css';

type SketchFrameProps = {
  variant?: 'solid' | 'dashed';
  shape?: FrameShape;
  // Outline color comes from the CSS `color` of this element (currentColor).
  className?: string;
  children: ReactNode;
};

// Wraps content with a pre-drawn chalk outline that stretches to the element size
// while keeping a constant stroke width (non-scaling-stroke).
export function SketchFrame({ variant = 'solid', shape = 1, className, children }: SketchFrameProps) {
  const outlineClass = [styles.outline, variant === 'dashed' ? styles.dashed : ''].join(' ');
  return (
    <div className={[styles.frame, className].filter(Boolean).join(' ')}>
      <svg className={outlineClass} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path d={framePaths[shape]} vectorEffect="non-scaling-stroke" />
      </svg>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
