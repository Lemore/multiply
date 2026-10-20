import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App.tsx';

const navButtons = () => within(screen.getByRole('navigation', { name: 'ניווט ראשי' })).getAllByRole('button');
const activeLabel = () => navButtons().find((b) => b.getAttribute('aria-current') === 'page')?.textContent;

describe('App shell navigation', () => {
  beforeEach(() => {
    window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
  });

  it('starts on the home screen with "בית" active, and nav items in order', () => {
    render(<App />);
    expect(navButtons().map((b) => b.textContent)).toEqual(['בית', 'לימוד', 'אודות']);
    expect(activeLabel()).toBe('בית');
    expect(screen.getByRole('button', { name: 'התחל משחק' })).toBeTruthy();
  });

  it('opens each screen from the nav, keeps the nav, and marks only that item active', () => {
    render(<App />);
    const nav = (name: string) => fireEvent.click(navButtons().find((b) => b.textContent === name)!);

    nav('אודות');
    expect(screen.getByRole('heading', { level: 1, name: 'אודות' })).toBeTruthy();
    expect(activeLabel()).toBe('אודות');
    expect(navButtons().filter((b) => b.hasAttribute('aria-current'))).toHaveLength(1);

    nav('לימוד');
    expect(screen.getByRole('heading', { level: 1, name: 'לימוד' })).toBeTruthy();
    expect(activeLabel()).toBe('לימוד');

    nav('בית');
    expect(screen.getByLabelText('מצב משחק')).toBeTruthy();
    expect(activeLabel()).toBe('בית');
  });

  it('opening "לימוד" with no game starts one in the mode picked on home', () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText('מצב משחק'), { target: { value: '4' } });
    fireEvent.click(navButtons()[1]);
    expect(screen.getByText(/^תרגיל/).textContent).toBe('תרגיל 1 מתוך 10');
    const [a, b] = screen.getByLabelText(/^\d+ כפול \d+$/).getAttribute('aria-label')!.split(' כפול ').map(Number);
    expect(a === 4 || b === 4).toBe(true);
  });

  it('"התחל משחק" moves to the learn screen', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'התחל משחק' }));
    expect(activeLabel()).toBe('לימוד');
  });

  it('keeps the selected mode after leaving and returning to home', () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText('מצב משחק'), { target: { value: '7' } });
    fireEvent.click(navButtons()[2]);
    fireEvent.click(navButtons()[0]);
    expect((screen.getByLabelText('מצב משחק') as HTMLSelectElement).value).toBe('7');
  });
});

describe('App game flow', () => {
  beforeEach(() => {
    window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  const answerBox = () => screen.getByLabelText(/^\d+ כפול \d+$/) as HTMLInputElement;
  const factors = () => answerBox().getAttribute('aria-label')!.split(' כפול ').map(Number);
  const counter = () => screen.getByText(/^תרגיל/).textContent;
  const feedback = () => screen.getByRole('status').textContent;
  const answer = (value: number) => {
    fireEvent.change(answerBox(), { target: { value: String(value) } });
    fireEvent.click(screen.getByRole('button', { name: 'בדיקה' }));
  };
  const wait = (ms: number) => act(() => vi.advanceTimersByTime(ms));
  const start = (mode = 'all') => {
    render(<App />);
    fireEvent.change(screen.getByLabelText('מצב משחק'), { target: { value: mode } });
    fireEvent.click(screen.getByRole('button', { name: 'התחל משחק' }));
  };

  it('in mode 7, every exercise of a full game includes 7, and the game ends after 10', () => {
    start('7');
    for (let i = 1; i <= 10; i++) {
      expect(counter()).toBe(`תרגיל ${i} מתוך 10`);
      const [a, b] = factors();
      expect(a === 7 || b === 7).toBe(true);
      answer(a * b);
      wait(1000);
    }
    expect(screen.getByRole('heading', { name: 'סוף המשחק' })).toBeTruthy();
  });

  it('a correct answer shows success for one second, then the next exercise', () => {
    start();
    const [a, b] = factors();
    answer(a * b);
    expect(['כל הכבוד!', 'נכון! כל הכבוד!', 'מעולה!', 'תשובה נכונה!', 'נכון!']).toContain(feedback());
    wait(999);
    expect(counter()).toBe('תרגיל 1 מתוך 10');
    wait(1);
    expect(counter()).toBe('תרגיל 2 מתוך 10');
    expect(answerBox().value).toBe('');
    expect(feedback()).toBe('');
  });

  it('a wrong answer shows failure for one second, then clears the box on the same exercise', () => {
    start();
    const [a, b] = factors();
    answer(a * b + 1);
    expect(feedback()).toBe('אופס! נסו שוב');
    expect(answerBox().readOnly).toBe(true);
    wait(1000);
    expect(counter()).toBe('תרגיל 1 מתוך 10');
    expect(factors()).toEqual([a, b]);
    expect(answerBox().value).toBe('');
    expect(answerBox().readOnly).toBe(false);
  });

  it('after 3 wrong answers reveals the answer for one second, then moves on', () => {
    start();
    const [a, b] = factors();
    answer(a * b + 1);
    wait(1000);
    answer(a * b + 1);
    wait(1000);
    answer(a * b + 1);
    expect(feedback()).toBe(`לא נורא! התשובה: ${a * b}`);
    wait(1000);
    expect(counter()).toBe('תרגיל 2 מתוך 10');
  });

  it('presses during feedback do not count as attempts', () => {
    start();
    const [a, b] = factors();
    answer(a * b + 1);
    fireEvent.click(screen.getByRole('button', { name: 'בדיקה' }));
    fireEvent.click(screen.getByRole('button', { name: 'בדיקה' }));
    wait(1000);
    // Two more wrong answers are still needed before the answer is revealed.
    answer(a * b + 1);
    expect(feedback()).toBe('אופס! נסו שוב');
  });

  it('leaving during feedback and coming back shows the up-to-date state', () => {
    start();
    const [a, b] = factors();
    answer(a * b);
    fireEvent.click(navButtons()[2]);
    wait(1000);
    fireEvent.click(navButtons()[1]);
    expect(counter()).toBe('תרגיל 2 מתוך 10');

    const [c, d] = factors();
    answer(c * d + 1);
    fireEvent.click(navButtons()[0]);
    wait(1000);
    fireEvent.click(navButtons()[1]);
    expect(counter()).toBe('תרגיל 2 מתוך 10');
    expect(factors()).toEqual([c, d]);
    expect(feedback()).toBe('');
  });

  // Answers the current exercise right on the first try, or wrong `wrongTries` times then right (3 = revealed).
  const solve = (right: boolean, wrongTries = 1) => {
    const [a, b] = factors();
    if (!right) {
      for (let i = 0; i < wrongTries; i++) {
        answer(a * b + 1);
        wait(1000);
      }
      if (wrongTries >= 3) return;
    }
    answer(a * b);
    wait(1000);
  };
  const score = () => screen.getByText('מתוך', { selector: 'span' }).parentElement!.textContent;
  const homeButton = () => screen.getByRole('button', { name: /^(התחל משחק|המשך משחק)$/ });

  it('7 right on the first try → "7 מתוך 10"; later-attempt answers do not count', () => {
    start();
    const plan = [true, false, true, true, false, true, true, false, true, true];
    plan.forEach((right, i) => solve(right, (i % 3) + 1));
    expect(screen.getByRole('heading', { name: 'סוף המשחק' })).toBeTruthy();
    expect(screen.getByText('תשובות נכונות')).toBeTruthy();
    expect(score()).toBe('7 מתוך 10');
  });

  it('"שחק שוב" starts a new game from exercise 1 in the same mode, even if the menu changed', () => {
    start('7');
    for (let i = 0; i < 10; i++) solve(false, 3);
    expect(score()).toBe('0 מתוך 10');

    fireEvent.click(navButtons()[0]);
    fireEvent.change(screen.getByLabelText('מצב משחק'), { target: { value: '2' } });
    fireEvent.click(navButtons()[1]);
    expect(score()).toBe('0 מתוך 10');

    fireEvent.click(screen.getByRole('button', { name: 'שחק שוב' }));
    for (let i = 1; i <= 10; i++) {
      expect(counter()).toBe(`תרגיל ${i} מתוך 10`);
      const [a, b] = factors();
      expect(a === 7 || b === 7).toBe(true);
      solve(true);
    }
    expect(score()).toBe('10 מתוך 10');
  });

  it('leaving mid-game and returning keeps the exercise, attempts and score', () => {
    start();
    solve(true);
    const [a, b] = factors();
    answer(a * b + 1);
    wait(1000);
    fireEvent.click(navButtons()[0]);
    fireEvent.click(navButtons()[2]);
    fireEvent.click(navButtons()[1]);
    expect(counter()).toBe('תרגיל 2 מתוך 10');
    expect(factors()).toEqual([a, b]);
    // Two more wrong answers reveal the answer: the first attempt was kept.
    answer(a * b + 1);
    wait(1000);
    answer(a * b + 1);
    expect(feedback()).toBe(`לא נורא! התשובה: ${a * b}`);
    wait(1000);
    for (let i = 3; i <= 10; i++) solve(true);
    expect(score()).toBe('9 מתוך 10');
  });

  it('home shows "המשך משחק" mid-game, which resumes the same exercise and attempts', () => {
    start('7');
    solve(true);
    const [a, b] = factors();
    answer(a * b + 1);
    wait(1000);
    fireEvent.click(navButtons()[0]);
    expect(homeButton().textContent).toBe('המשך משחק');
    expect((screen.getByLabelText('מצב משחק') as HTMLSelectElement).disabled).toBe(false);
    fireEvent.click(homeButton());
    expect(activeLabel()).toBe('לימוד');
    expect(counter()).toBe('תרגיל 2 מתוך 10');
    expect(factors()).toEqual([a, b]);
    answer(a * b + 1);
    wait(1000);
    answer(a * b + 1);
    expect(feedback()).toBe(`לא נורא! התשובה: ${a * b}`);
  });

  it('picking another mode mid-game turns the button into "התחל משחק", which starts a new game', () => {
    start('7');
    solve(true);
    solve(true);
    fireEvent.click(navButtons()[0]);
    const menu = () => screen.getByLabelText('מצב משחק');

    fireEvent.change(menu(), { target: { value: '3' } });
    expect(homeButton().textContent).toBe('התחל משחק');
    fireEvent.change(menu(), { target: { value: '7' } });
    expect(homeButton().textContent).toBe('המשך משחק');

    fireEvent.change(menu(), { target: { value: '3' } });
    fireEvent.click(homeButton());
    for (let i = 1; i <= 10; i++) {
      expect(counter()).toBe(`תרגיל ${i} מתוך 10`);
      const [a, b] = factors();
      expect(a === 3 || b === 3).toBe(true);
      solve(i <= 4);
    }
    expect(score()).toBe('4 מתוך 10');
  });

  it('after the summary, home shows "התחל משחק" and starts a game in the chosen mode', () => {
    start('7');
    for (let i = 0; i < 10; i++) solve(true);
    fireEvent.click(navButtons()[0]);
    expect(homeButton().textContent).toBe('התחל משחק');
    fireEvent.click(homeButton());
    expect(counter()).toBe('תרגיל 1 מתוך 10');
  });

  it('opening "לימוד" after the game ended shows the summary, not a new game', () => {
    start();
    for (let i = 0; i < 10; i++) solve(true);
    fireEvent.click(navButtons()[2]);
    fireEvent.click(navButtons()[1]);
    expect(score()).toBe('10 מתוך 10');
  });

  it('stores nothing in the browser', () => {
    localStorage.clear();
    sessionStorage.clear();
    start();
    for (let i = 0; i < 10; i++) solve(i % 2 === 0);
    expect(localStorage.length).toBe(0);
    expect(sessionStorage.length).toBe(0);
  });
});
