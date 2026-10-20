import { fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
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
