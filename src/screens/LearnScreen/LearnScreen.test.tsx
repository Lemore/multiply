import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { initialGameState } from '../../game/game.ts';
import type { Feedback, GameState } from '../../game/types.ts';
import { LearnScreen } from './LearnScreen.tsx';

function game(overrides: Partial<GameState> = {}): GameState {
  return { ...initialGameState, status: 'playing', current: { a: 7, b: 8 }, exerciseNumber: 3, ...overrides };
}

type HarnessProps = { state: GameState; onSubmit?: (v: number) => void; onPlayAgain?: () => void };

function Harness({ state, onSubmit = () => {}, onPlayAgain = () => {} }: HarnessProps) {
  const [answer, setAnswer] = useState('');
  return (
    <LearnScreen game={state} answer={answer} onAnswerChange={setAnswer} onSubmit={onSubmit} onPlayAgain={onPlayAgain} />
  );
}

const input = () => screen.getByLabelText('7 כפול 8') as HTMLInputElement;
const checkButton = () => screen.getByRole('button', { name: 'בדיקה' });

describe('LearnScreen', () => {
  it('shows the counter and the exercise left-to-right with ×', () => {
    render(<Harness state={game()} />);
    expect(screen.getByText(/תרגיל/).textContent).toBe('תרגיל 3 מתוך 10');
    const exercise = screen.getByText('×').parentElement!;
    expect(exercise.getAttribute('dir')).toBe('ltr');
    expect(exercise.textContent).toBe('7 × 8');
  });

  it('labels the answer box with the exercise and opens a numeric keyboard', () => {
    render(<Harness state={game()} />);
    expect(input().getAttribute('inputmode')).toBe('numeric');
    expect(document.activeElement).toBe(input());
  });

  it('accepts digits only, up to 3', () => {
    render(<Harness state={game()} />);
    fireEvent.change(input(), { target: { value: 'a7b1234' } });
    expect(input().value).toBe('712');
    fireEvent.change(input(), { target: { value: 'abc' } });
    expect(input().value).toBe('');
  });

  it('disables "בדיקה" while the box is empty and submits a typed answer', () => {
    const onSubmit = vi.fn();
    render(<Harness state={game()} onSubmit={onSubmit} />);
    expect(checkButton().getAttribute('aria-disabled')).toBe('true');
    fireEvent.click(checkButton());
    expect(onSubmit).not.toHaveBeenCalled();

    fireEvent.change(input(), { target: { value: '56' } });
    expect(checkButton().hasAttribute('aria-disabled')).toBe(false);
    fireEvent.click(checkButton());
    expect(onSubmit).toHaveBeenCalledWith(56);
    expect(document.activeElement).toBe(input());
  });

  it('blocks submitting and makes the box read-only while feedback is showing', () => {
    const onSubmit = vi.fn();
    render(
      <LearnScreen
        game={game({ phase: 'showingFeedback', feedback: { kind: 'wrong', attemptsLeft: 2 } })}
        answer="5"
        onAnswerChange={() => {}}
        onSubmit={onSubmit}
        onPlayAgain={() => {}}
      />,
    );
    expect(input().readOnly).toBe(true);
    fireEvent.click(checkButton());
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('has a polite live region for feedback', () => {
    render(<Harness state={game()} />);
    expect(screen.getByRole('status').getAttribute('aria-live')).toBe('polite');
  });

  it.each<[Feedback, string]>([
    [{ kind: 'correct', messageIndex: 2 }, 'מעולה!'],
    [{ kind: 'wrong', attemptsLeft: 1 }, 'אופס! נסו שוב'],
    [{ kind: 'revealAnswer', answer: 56 }, 'לא נורא! התשובה: 56'],
  ])('shows the message for %o', (feedback, text) => {
    render(<Harness state={game({ phase: 'showingFeedback', feedback })} />);
    expect(screen.getByRole('status').textContent).toBe(text);
  });

  it('shows the summary with the score when the game is finished', () => {
    render(<Harness state={game({ status: 'finished', firstTryCorrect: 7 })} />);
    expect(screen.getByRole('heading', { level: 1, name: 'סוף המשחק' })).toBeTruthy();
    expect(screen.getByText('תשובות נכונות')).toBeTruthy();
    expect(screen.getByText('מתוך').parentElement!.textContent).toBe('7 מתוך 10');
    expect(screen.queryByRole('button', { name: 'בדיקה' })).toBeNull();
  });

  it('"שחק שוב" calls onPlayAgain', () => {
    const onPlayAgain = vi.fn();
    render(<Harness state={game({ status: 'finished' })} onPlayAgain={onPlayAgain} />);
    fireEvent.click(screen.getByRole('button', { name: 'שחק שוב' }));
    expect(onPlayAgain).toHaveBeenCalledOnce();
  });
});
