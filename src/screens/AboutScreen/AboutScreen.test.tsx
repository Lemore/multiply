import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AboutScreen } from './AboutScreen.tsx';

// Exact wording from spec/DESIGN.md, section 1.3.
const EXPECTED_STEPS = [
  'בוחרים מצב משחק במסך הבית:"הכול": תרגילים מכל לוח הכפל.מספר מ-1 עד 10: תרגילים רק עם המספר שבחרתם.',
  'לוחצים על "התחל משחק".',
  'בכל משחק יש 10 תרגילים. מקלידים את התשובה ולוחצים על "בדיקה".',
  'טעיתם? לא נורא! יש לכם עוד ניסיון. בכל תרגיל אפשר לנסות עד 3 פעמים. אם לא הצלחתם, נראה לכם את התשובה הנכונה ונמשיך לתרגיל הבא.',
  'נקודה מקבלים רק על תשובה נכונה בניסיון הראשון.',
  'בסוף המשחק תראו כמה תשובות נכונות היו לכם מתוך 10. רוצים לנסות שוב? לחצו על "שחק שוב".',
];

describe('AboutScreen', () => {
  it('shows the title, the table and the how-to text word for word', () => {
    const { container } = render(<AboutScreen />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('אודות');
    expect(screen.getByRole('table', { name: 'לוח הכפל' })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('איך משחקים ב"רואים כפול"?');

    const steps = Array.from(container.querySelectorAll('ol > li')).map((li) => li.textContent);
    expect(steps).toEqual(EXPECTED_STEPS);
  });
});
