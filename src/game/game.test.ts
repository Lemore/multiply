import { describe, expect, it } from 'vitest';
import { createExercise, finishFeedback, GAME_LENGTH, initialGameState, startGame, submitAnswer, type Random } from './game.ts';
import type { Exercise, GameState } from './types.ts';

// Deterministic pseudo-random generator (LCG) for repeatable tests.
function seeded(seed = 1): Random {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

// Returns the given values in order, then repeats the last one.
function sequence(...values: number[]): Random {
  let i = 0;
  return () => values[Math.min(i++, values.length - 1)];
}

const MESSAGES = 5;
const answerOf = (state: GameState) => state.current!.a * state.current!.b;

function playing(current: Exercise, overrides: Partial<GameState> = {}): GameState {
  return { ...initialGameState, status: 'playing', mode: 'all', current, ...overrides };
}

describe('createExercise', () => {
  it('in a chosen-number mode, every exercise includes that number and factors are 1–10', () => {
    const random = seeded(7);
    let previous: Exercise | null = null;
    for (let i = 0; i < 200; i++) {
      const ex = createExercise(7, previous, random);
      expect(ex.a === 7 || ex.b === 7).toBe(true);
      expect([ex.a, ex.b].every((n) => n >= 1 && n <= 10)).toBe(true);
      previous = ex;
    }
  });

  it('in "all" mode, factors are 1–10', () => {
    const random = seeded(3);
    for (let i = 0; i < 200; i++) {
      const ex = createExercise('all', null, random);
      expect([ex.a, ex.b].every((n) => Number.isInteger(n) && n >= 1 && n <= 10)).toBe(true);
    }
  });

  it('places the chosen number on either side', () => {
    const random = seeded(11);
    const exercises = Array.from({ length: 100 }, () => createExercise(3, null, random));
    expect(exercises.some((e) => e.a === 3 && e.b !== 3)).toBe(true);
    expect(exercises.some((e) => e.b === 3 && e.a !== 3)).toBe(true);
  });

  it('re-draws when the result equals the previous exercise', () => {
    // First draw: 7 × 8 (same as previous), second draw: 2 × 3.
    const random = sequence(0.6, 0.7, 0.1, 0.2);
    expect(createExercise('all', { a: 7, b: 8 }, random)).toEqual({ a: 2, b: 3 });
  });

  it('never shows the same exercise twice in a row', () => {
    for (const mode of ['all', 1, 10] as const) {
      const random = seeded(5);
      let previous: Exercise | null = null;
      for (let i = 0; i < 200; i++) {
        const ex = createExercise(mode, previous, random);
        expect(ex).not.toEqual(previous);
        previous = ex;
      }
    }
  });
});

describe('startGame', () => {
  it('starts a fresh game at exercise 1 in the given mode', () => {
    const state = startGame(4, seeded());
    expect(state).toMatchObject({
      status: 'playing',
      mode: 4,
      exerciseNumber: 1,
      previous: null,
      attemptsUsed: 0,
      firstTryCorrect: 0,
      phase: 'answering',
      feedback: { kind: 'none' },
    });
    expect(state.current!.a === 4 || state.current!.b === 4).toBe(true);
  });
});

describe('submitAnswer and finishFeedback', () => {
  it('a correct answer shows success, then moves to the next exercise', () => {
    const state = submitAnswer(playing({ a: 7, b: 8 }), 56, MESSAGES, sequence(0.5));
    expect(state.phase).toBe('showingFeedback');
    expect(state.feedback).toEqual({ kind: 'correct', messageIndex: 2 });
    expect(state.firstTryCorrect).toBe(1);

    const next = finishFeedback(state, seeded());
    expect(next).toMatchObject({ exerciseNumber: 2, attemptsUsed: 0, phase: 'answering', feedback: { kind: 'none' } });
    expect(next.previous).toEqual({ a: 7, b: 8 });
    expect(next.current).not.toEqual({ a: 7, b: 8 });
  });

  it('a wrong answer shows failure, then keeps the same exercise', () => {
    const state = submitAnswer(playing({ a: 7, b: 8 }), 54, MESSAGES);
    expect(state.feedback).toEqual({ kind: 'wrong', attemptsLeft: 2 });
    expect(state.attemptsUsed).toBe(1);

    const next = finishFeedback(state);
    expect(next).toMatchObject({ exerciseNumber: 1, attemptsUsed: 1, phase: 'answering', current: { a: 7, b: 8 } });
  });

  it('after 3 wrong answers reveals the answer, then moves to the next exercise', () => {
    let state = playing({ a: 6, b: 9 });
    for (let i = 0; i < 2; i++) state = finishFeedback(submitAnswer(state, 1, MESSAGES));
    state = submitAnswer(state, 1, MESSAGES);
    expect(state.feedback).toEqual({ kind: 'revealAnswer', answer: 54 });

    const next = finishFeedback(state, seeded());
    expect(next).toMatchObject({ exerciseNumber: 2, attemptsUsed: 0, phase: 'answering' });
  });

  it('a correct answer on a later attempt does not add to the score', () => {
    let state = finishFeedback(submitAnswer(playing({ a: 2, b: 3 }), 5, MESSAGES));
    state = submitAnswer(state, 6, MESSAGES);
    expect(state.feedback.kind).toBe('correct');
    expect(state.firstTryCorrect).toBe(0);
  });

  it('ignores answers while feedback is showing', () => {
    const state = submitAnswer(playing({ a: 7, b: 8 }), 1, MESSAGES);
    expect(submitAnswer(state, 56, MESSAGES)).toBe(state);
  });

  it('ignores answers when no game is playing', () => {
    expect(submitAnswer(initialGameState, 1, MESSAGES)).toBe(initialGameState);
  });

  it('finishes after exercise 10', () => {
    const random = seeded(9);
    let state = startGame('all', random);
    for (let i = 1; i < GAME_LENGTH; i++) {
      state = finishFeedback(submitAnswer(state, answerOf(state), MESSAGES, random), random);
      expect(state).toMatchObject({ status: 'playing', exerciseNumber: i + 1 });
    }
    state = finishFeedback(submitAnswer(state, answerOf(state), MESSAGES, random), random);
    expect(state.status).toBe('finished');
  });

  it('picks a success message index within the list', () => {
    for (const r of [0, 0.3, 0.999]) {
      const state = submitAnswer(playing({ a: 1, b: 1 }), 1, MESSAGES, () => r);
      const index = state.feedback.kind === 'correct' ? state.feedback.messageIndex : -1;
      expect(index).toBeGreaterThanOrEqual(0);
      expect(index).toBeLessThan(MESSAGES);
    }
  });
});
