export type Screen = 'home' | 'learn' | 'about';

export type PracticeMode = 'all' | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export const PRACTICE_MODES: readonly PracticeMode[] = ['all', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export type Exercise = { a: number; b: number }; // a × b, values 1–10

export type GameStatus = 'idle' | 'playing' | 'finished';

export type Phase = 'answering' | 'showingFeedback';

export type Feedback =
  | { kind: 'none' }
  | { kind: 'correct'; messageIndex: number } // index into the success-message list
  | { kind: 'wrong'; attemptsLeft: number }
  | { kind: 'revealAnswer'; answer: number }; // after 3 wrong attempts

export type GameState = {
  status: GameStatus;
  mode: PracticeMode; // fixed by startGame until the game ends
  exerciseNumber: number; // 1–10
  current: Exercise | null; // null while idle
  previous: Exercise | null; // prevents an immediate repeat
  attemptsUsed: number; // 0–3 on the current exercise
  firstTryCorrect: number; // score: 0–10
  phase: Phase;
  feedback: Feedback;
};
