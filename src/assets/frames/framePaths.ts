// Pre-drawn "hand-drawn chalk" rectangle outlines in a 0–100 viewBox.
// The SVG is stretched to the element size (preserveAspectRatio="none"),
// so wobble offsets are kept small to avoid visible distortion on wide/narrow boxes.
export const framePaths = {
  1: 'M1.2 0.8 Q25 0.2 50 0.9 T98.8 0.6 Q99.6 0.9 99.4 2 Q99.8 30 99.3 50 T99.5 98.4 Q99.3 99.4 98.2 99.3 Q70 99.8 50 99.1 T1.6 99.5 Q0.6 99.3 0.7 98 Q0.2 70 0.8 50 T0.5 2 Q0.6 0.9 1.2 0.8 Z',
  2: 'M0.9 1.1 Q30 0.5 55 1 T99.1 0.7 Q99.5 1.2 99.3 2.4 Q99.7 35 99.4 60 T99.2 98.6 Q99.1 99.5 97.9 99.4 Q65 99 45 99.6 T1.3 99.2 Q0.4 99.1 0.6 97.6 Q0.3 65 0.7 40 T0.7 2.2 Q0.4 1.3 0.9 1.1 Z',
  3: 'M1.5 0.6 Q20 1.1 45 0.6 T98.5 1 Q99.4 0.7 99.6 1.8 Q99.2 25 99.6 45 T99.3 97.9 Q99.6 99.6 98.4 99.5 Q75 99.1 55 99.6 T1.1 99.3 Q0.5 99.5 0.5 98.3 Q0.8 75 0.4 55 T0.8 1.7 Q0.8 0.5 1.5 0.6 Z',
} as const;

export type FrameShape = keyof typeof framePaths;
