import type { Exercise, GameState, PracticeMode } from './types.ts';

// Pure game rules (no React, no DOM). Randomness is injected so tests are deterministic.
export type Random = () => number;

export const GAME_LENGTH = 10;
export const MAX_ATTEMPTS = 3;
export const FEEDBACK_DURATION_MS = 1000;

export function randomFactor(random: Random): number {
  return Math.floor(random() * 10) + 1;
}

function sameExercise(x: Exercise, y: Exercise | null): boolean {
  return y !== null && x.a === y.a && x.b === y.b;
}

// Same factors in the same order count as the same exercise (ARCHITECTURE.md 2.5).
export function createExercise(mode: PracticeMode, previous: Exercise | null, random: Random = Math.random): Exercise {
  for (;;) {
    let exercise: Exercise;
    if (mode === 'all') {
      exercise = { a: randomFactor(random), b: randomFactor(random) };
    } else {
      const other = randomFactor(random);
      exercise = random() < 0.5 ? { a: mode, b: other } : { a: other, b: mode };
    }
    if (!sameExercise(exercise, previous)) return exercise;
  }
}

export const initialGameState: GameState = {
  status: 'idle',
  mode: 'all',
  exerciseNumber: 1,
  current: null,
  previous: null,
  attemptsUsed: 0,
  firstTryCorrect: 0,
  phase: 'answering',
  feedback: { kind: 'none' },
};

export function startGame(mode: PracticeMode, random: Random = Math.random): GameState {
  return {
    ...initialGameState,
    status: 'playing',
    mode,
    current: createExercise(mode, null, random),
  };
}

// `messageCount` is the number of success messages to pick from (texts live in strings).
export function submitAnswer(state: GameState, value: number, messageCount: number, random: Random = Math.random): GameState {
  // Ignored while feedback is showing, so repeated presses never count as attempts.
  if (state.status !== 'playing' || state.phase !== 'answering' || state.current === null) return state;

  const attemptsUsed = state.attemptsUsed + 1;
  const answer = state.current.a * state.current.b;
  const base = { ...state, attemptsUsed, phase: 'showingFeedback' as const };

  if (value === answer) {
    return {
      ...base,
      firstTryCorrect: attemptsUsed === 1 ? state.firstTryCorrect + 1 : state.firstTryCorrect,
      feedback: { kind: 'correct', messageIndex: Math.floor(random() * messageCount) },
    };
  }
  if (attemptsUsed < MAX_ATTEMPTS) {
    return { ...base, feedback: { kind: 'wrong', attemptsLeft: MAX_ATTEMPTS - attemptsUsed } };
  }
  return { ...base, feedback: { kind: 'revealAnswer', answer } };
}

export function finishFeedback(state: GameState, random: Random = Math.random): GameState {
  if (state.phase !== 'showingFeedback') return state;

  const answering = { ...state, phase: 'answering' as const, feedback: { kind: 'none' as const } };
  if (state.feedback.kind === 'wrong') return answering;

  if (state.exerciseNumber >= GAME_LENGTH) return { ...answering, status: 'finished' };
  return {
    ...answering,
    exerciseNumber: state.exerciseNumber + 1,
    previous: state.current,
    current: createExercise(state.mode, state.current, random),
    attemptsUsed: 0,
  };
}
