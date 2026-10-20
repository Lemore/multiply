// All user-facing Hebrew UI text lives here.
export const strings = {
  appName: { first: 'רואים', second: 'כפול' },

  nav: {
    ariaLabel: 'ניווט ראשי',
    home: 'בית',
    learn: 'לימוד',
    about: 'אודות',
  },

  home: {
    imageAlt: 'חתול מצויר ליד לוח גיר עם תרגילי חשבון',
    modeLabel: 'מצב משחק',
    modeAll: 'הכול',
    start: 'התחל משחק',
  },

  learn: {
    title: 'לימוד',
  },

  about: {
    title: 'אודות',
    tableCaption: 'לוח הכפל',
    howToTitle: 'איך משחקים ב"רואים כפול"?',
    // Each step: a bold part followed by regular text; `sub` is a nested bullet list.
    steps: [
      {
        bold: 'בוחרים מצב משחק',
        text: ' במסך הבית:',
        sub: [
          { bold: '"הכול"', text: ': תרגילים מכל לוח הכפל.' },
          { bold: 'מספר מ-1 עד 10', text: ': תרגילים רק עם המספר שבחרתם.' },
        ],
      },
      { bold: 'לוחצים על "התחל משחק".', text: '' },
      { bold: 'בכל משחק יש 10 תרגילים.', text: ' מקלידים את התשובה ולוחצים על "בדיקה".' },
      {
        bold: 'טעיתם? לא נורא!',
        text: ' יש לכם עוד ניסיון. בכל תרגיל אפשר לנסות עד 3 פעמים. אם לא הצלחתם, נראה לכם את התשובה הנכונה ונמשיך לתרגיל הבא.',
      },
      { bold: 'נקודה מקבלים רק על תשובה נכונה בניסיון הראשון.', text: '' },
      {
        bold: 'בסוף המשחק',
        text: ' תראו כמה תשובות נכונות היו לכם מתוך 10. רוצים לנסות שוב? לחצו על "שחק שוב".',
      },
    ],
  },
} as const;
