import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { HomeScreen } from './HomeScreen.tsx';

describe('HomeScreen', () => {
  it('shows a labelled mode menu with "הכול" and 1–10, defaulting to "הכול"', () => {
    render(<HomeScreen selectedMode="all" onModeChange={() => {}} onStart={() => {}} />);
    const select = screen.getByLabelText('מצב משחק') as HTMLSelectElement;
    const labels = Array.from(select.options).map((o) => o.textContent);
    expect(labels).toEqual(['הכול', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
    expect(select.selectedOptions[0].textContent).toBe('הכול');
  });

  it('reports the chosen mode as a number', () => {
    const onModeChange = vi.fn();
    render(<HomeScreen selectedMode="all" onModeChange={onModeChange} onStart={() => {}} />);
    fireEvent.change(screen.getByLabelText('מצב משחק'), { target: { value: '7' } });
    expect(onModeChange).toHaveBeenCalledWith(7);
  });

  it('calls onStart when "התחל משחק" is pressed', () => {
    const onStart = vi.fn();
    render(<HomeScreen selectedMode="all" onModeChange={() => {}} onStart={onStart} />);
    fireEvent.click(screen.getByRole('button', { name: 'התחל משחק' }));
    expect(onStart).toHaveBeenCalledOnce();
  });

  it('shows "המשך משחק" with an enabled menu when a game can be continued', () => {
    const onStart = vi.fn();
    render(<HomeScreen selectedMode={7} onModeChange={() => {}} canContinue onStart={onStart} />);
    expect(screen.queryByRole('button', { name: 'התחל משחק' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'המשך משחק' }));
    expect(onStart).toHaveBeenCalledOnce();
    expect((screen.getByLabelText('מצב משחק') as HTMLSelectElement).disabled).toBe(false);
  });
});
