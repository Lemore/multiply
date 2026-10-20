# תוכנית – Milestone 3: פתרון תרגילים

מבוסס על: `MILESTONES.md` (Milestone 3), `PRD.md` (F1, F2, 4ב), `ARCHITECTURE.md` (2.2–2.5, 2.7), `DESIGN.md` (סעיפים 1.2, 2.3, 2.5) והתמונות `mockups.png` ו-`style-guide.png`.

**מצב קיים (מ-Milestone 2):** ב-`App.tsx` יש `currentScreen` ו-`selectedMode` ב-`useState`. `LearnScreen` הוא מסך זמני ריק עם H1 מוסתר. קיימים: `Button` (Primary / Secondary, בלי מצב Disabled), `SketchFrame`, `Icons.tsx` (בית, עיפרון, i, חץ), `game/types.ts` (רק `Screen`, `PracticeMode`, `PRACTICE_MODES`), `strings/he.ts`.

---

## 0. החלטות של המשתמש (מהשיחה בזמן התכנון)

| נושא | החלטה |
|---|---|
| הודעת הצלחה | נבחרת **באקראי** בכל תשובה נכונה מתוך הרשימה: "כל הכבוד!", "נכון! כל הכבוד!", "מעולה!", "תשובה נכונה!", "נכון!" |
| הודעת כישלון | "אופס! נסו שוב" |
| חשיפת התשובה | "לא נורא! התשובה: X" (X בגופן Numbers) |
| "בדיקה" עם תיבה ריקה | **הלחצן לא לחיץ כשהתיבה ריקה** (מוצג בסגנון Disabled). אין הודעת "הקלידו תשובה". |

> ההחלטות האלה עודכנו ב-PRD (F2, 4ב), ב-ARCHITECTURE (2.3, 2.4, 2.5), ב-DESIGN (1.2) וב-MILESTONES (Milestone 3) לפי בקשת המשתמש.

---

## 1. מה נכנס ומה לא נכנס

**נכנס:**
- Game Logic טהור + Unit Tests.
- `useReducer` ב-App Shell, טיימר משוב של שנייה.
- "התחל משחק" מתחיל משחק במצב שנבחר ופותח את מסך הלימוד.
- מסך לימוד מלא: מונה, תרגיל, תיבת תשובה, אזור משוב, לחצן "בדיקה".
- מצבי תיבת התשובה ומצבי המשוב לפי DESIGN.md.
- שמירה על המקלדת פתוחה, ופריסה שנשארת גלויה כשהמקלדת פתוחה.
- נגישות: `aria-live`, `aria-label` לתיבה.

**לא נכנס (Milestone 4):**
- מסך הסיכום המלא ("תשובות נכונות", "X מתוך 10", "שחק שוב"). ב-M3, אחרי תרגיל 10 המשחק עובר ל-`finished`, ומסך הלימוד מציג **זמנית** רק את הכותרת "סוף המשחק".
- הצגת הניקוד ו-Unit Tests לניקוד. (השדה `firstTryCorrect` כבר מתעדכן ב-Reducer, כי זה חלק טבעי מבדיקת התשובה, אבל הוא לא מוצג.)
- נעילת התפריט והלחצן במסך הבית בזמן משחק. ב-M3, "התחל משחק" באמצע משחק פשוט מתחיל משחק חדש.
- התחלה אוטומטית של משחק בכניסה ל"לימוד" כשאין משחק. ב-M3, כניסה ל"לימוד" ב-`idle` מציגה את המסך הריק הקיים.

---

## 2. קבצים ליצירה ולשינוי

```
index.html                                   ← שינוי: interactive-widget ב-meta viewport
src/
├── game/
│   ├── types.ts                             ← שינוי: Exercise, GameStatus, Phase, Feedback, GameState
│   ├── game.ts                              ← חדש: לוגיקת המשחק הטהורה
│   └── game.test.ts                         ← חדש: Unit Tests
├── app/
│   ├── App.tsx                              ← שינוי: useReducer, טיימר, טיוטת תשובה, הסתרת סרגל כשהמקלדת פתוחה
│   ├── useKeyboardOpen.ts                   ← חדש: זיהוי מקלדת פתוחה (visualViewport)
│   └── App.test.tsx                         ← שינוי: בדיקות זרימת משחק עם fake timers
├── screens/LearnScreen/
│   ├── LearnScreen.tsx                      ← שינוי: המסך המלא
│   ├── LearnScreen.module.css               ← חדש
│   └── LearnScreen.test.tsx                 ← חדש
├── components/
│   ├── AnswerInput/AnswerInput.tsx + .module.css      ← חדש
│   ├── FeedbackMessage/FeedbackMessage.tsx + .module.css ← חדש
│   ├── Button/Button.tsx + .module.css      ← שינוי: מצב disabled, שמירת פוקוס
│   ├── BottomNav/BottomNav.tsx + .module.css ← שינוי: prop `hidden`
│   └── icons/Icons.tsx                      ← שינוי: CheckIcon (V), CrossIcon (X), BulbIcon (נורה)
└── strings/he.ts                            ← שינוי: טקסטי הלימוד והמשוב
```

---

## 3. טיפוסים (`src/game/types.ts`)

לפי ARCHITECTURE.md 2.4, עם שני שינויים (יתועדו ב-ADR):
- אין `{ kind: 'empty' }` – תיבה ריקה לא נשלחת בכלל.
- ל-`correct` נוסף `messageIndex`, כדי שההודעה האקראית תיבחר פעם אחת ולא תשתנה בכל רינדור.

```ts
export type Exercise = { a: number; b: number };
export type GameStatus = 'idle' | 'playing' | 'finished';
export type Phase = 'answering' | 'showingFeedback';
export type Feedback =
  | { kind: 'none' }
  | { kind: 'correct'; messageIndex: number }
  | { kind: 'wrong'; attemptsLeft: number }
  | { kind: 'revealAnswer'; answer: number };

export type GameState = {
  status: GameStatus;
  mode: PracticeMode;
  exerciseNumber: number;   // 1–10
  current: Exercise | null;
  previous: Exercise | null;
  attemptsUsed: number;     // 0–3
  firstTryCorrect: number;
  phase: Phase;
  feedback: Feedback;
};
```

---

## 4. Game Logic (`src/game/game.ts`)

קוד טהור, בלי React ובלי DOM. כל פונקציה שצריכה אקראיות מקבלת `random: () => number` (ברירת מחדל `Math.random`).

**קבועים:** `GAME_LENGTH = 10`, `MAX_ATTEMPTS = 3`, `FEEDBACK_DURATION_MS = 1000`, `SUCCESS_MESSAGE_COUNT` (מספר ההודעות ברשימה, נגזר מ-strings או מועבר כפרמטר – ראו למטה).

**פונקציות:**
- `randomFactor(random)` → מספר שלם 1–10.
- `createExercise(mode, previous, random)`:
  - `'all'`: `a`, `b` אקראיים.
  - מספר N: גורם אחד N, השני אקראי, וסדר הגורמים אקראי.
  - אם יצא תרגיל זהה ל-`previous` (אותם גורמים באותו סדר) – מגרילים שוב (לולאה).
- `initialGameState`: `status: 'idle'`, `current: null`, שאר השדות מאופסים, `mode: 'all'`.
- `startGame(mode, random)` → `playing`, תרגיל 1, 0 ניסיונות, ניקוד 0, `answering`, `feedback: none`, תרגיל ראשון חדש.
- `submitAnswer(state, value: number, random)`:
  - מתעלמת (מחזירה את אותו state) אם `status !== 'playing'` או `phase !== 'answering'` – זו החסימה של לחיצות כפולות בזמן משוב.
  - `attemptsUsed + 1`, `phase = showingFeedback`.
  - נכון → `correct` עם `messageIndex` אקראי; אם זה הניסיון הראשון, `firstTryCorrect + 1`.
  - שגוי ופחות מ-3 → `wrong` עם `attemptsLeft`.
  - שגוי בניסיון השלישי → `revealAnswer` עם `a * b`.
- `finishFeedback(state, random)`:
  - מתעלמת אם `phase !== 'showingFeedback'`.
  - אחרי `wrong` → אותו תרגיל, `answering`, `feedback: none`.
  - אחרי `correct` / `revealAnswer` → אם זה תרגיל 10: `status = finished`. אחרת: `exerciseNumber + 1`, `previous = current`, תרגיל חדש, 0 ניסיונות.

**הודעת ההצלחה האקראית:** הלוגיקה בוחרת רק אינדקס (`Math.floor(random() * count)`); הטקסט עצמו נמצא ב-`strings`. `count` מועבר מה-Reducer (`strings.learn.feedback.correct.length`), כדי שהלוגיקה לא תלויה בקובץ הטקסטים.

---

## 5. Unit Tests (`src/game/game.test.ts`)

עם פונקציית אקראיות קבועה (למשל רצף ערכים מוגדר מראש):
- מצב N: ב-200 תרגילים שנוצרו, בכל אחד `a === N || b === N`, וכל הגורמים בטווח 1–10.
- מצב `'all'`: כל הגורמים בטווח 1–10.
- אין חזרה: `random` שמחזירה קודם את אותו תרגיל כמו `previous` – הפונקציה מגרילה שוב ומחזירה תרגיל אחר. בנוסף: רצף של 200 תרגילים בלי שני זהים צמודים.
- סדר הגורמים במצב N משתנה (גם 7×3 וגם 3×7 אפשריים).
- `startGame` מאפס את כל השדות.
- תשובה נכונה → `correct`, `showingFeedback`, ו-`finishFeedback` עובר לתרגיל הבא עם 0 ניסיונות.
- תשובה שגויה → `wrong` עם `attemptsLeft` נכון, ואחרי `finishFeedback` אותו תרגיל.
- 3 תשובות שגויות → `revealAnswer` עם התשובה הנכונה, ואחרי `finishFeedback` תרגיל הבא.
- `submitAnswer` בזמן `showingFeedback` לא משנה את המצב (לא נספר ניסיון).
- אחרי תרגיל 10 → `finished`.
- `messageIndex` בטווח הרשימה.

---

## 6. App Shell (`src/app/App.tsx`)

- `const [game, dispatch] = useReducer(gameReducer, initialGameState)`.
- `gameReducer` מוגדר ב-`App.tsx` (או בקובץ קטן לידו) ומטפל ב-3 Actions, שקוראים ל-Game Logic:
  - `{ type: 'startGame', mode }`
  - `{ type: 'submitAnswer', value }`
  - `{ type: 'feedbackDone' }`
- **טיוטת התשובה** (`answer: string`) נשמרת ב-App Shell ב-`useState`, ולא במסך הלימוד, כדי שתוצג נכון גם אחרי מעבר מסך. היא מתרוקנת כשהמשוב מסתיים (`feedbackDone`) ובתחילת משחק.
- **טיימר המשוב:** `useEffect` על `game.phase`. כש-`phase === 'showingFeedback'`: `setTimeout(() => dispatch(feedbackDone), FEEDBACK_DURATION_MS)` + ניקוי ב-cleanup. הטיימר ב-App ולכן ממשיך לרוץ גם כשהמסך המוצג אינו "לימוד".
- **"התחל משחק":** `dispatch(startGame(selectedMode))`, איפוס הטיוטה, מעבר ל-`learn`.
- **הסתרת הסרגל כשהמקלדת פתוחה:** `useKeyboardOpen()` → מעביר `hidden` ל-`BottomNav` (ראו סעיף 9).

---

## 7. מסך הלימוד (`LearnScreen`)

**Props:** `game`, `answer`, `onAnswerChange`, `onSubmit`.

**לפי `game.status`:**
- `idle` → כמו היום (H1 מוסתר "לימוד"). יוחלף ב-M4.
- `finished` → זמנית: כותרת "סוף המשחק" במסגרת מקווקוות. יוחלף ב-M4.
- `playing` → המסך המלא, מלמעלה למטה:
  1. **מונה:** "תרגיל X מתוך 10" במסגרת `SketchFrame variant="dashed"` ב-Dust Grey; המספרים ב-Chalk Amber בגופן Numbers. H1 מוסתר "לימוד" נשאר לנגישות.
  2. **תרגיל:** `<p dir="ltr">` עם `a`, `×` ב-Chalk Pink, `b`. גופן Numbers, גודל גמיש (`clamp`, עד 96px; קטן יותר במצב מקלדת – ראו סעיף 9). `aria-hidden`, כי התרגיל מוקרא דרך התווית של התיבה.
  3. **תיבת תשובה** (`AnswerInput`).
  4. **אזור משוב** (`FeedbackMessage`), בגובה קבוע 52px.
  5. **לחצן "בדיקה"** (Primary).

**שליחה:** `onSubmit` נקרא מלחיצה על "בדיקה" או מ-Enter בתיבה (`<form onSubmit>`). שולחים רק אם התיבה לא ריקה ו-`phase === 'answering'`. אחרי שליחה – `inputRef.current.focus()`.

---

## 8. רכיבים

**`AnswerInput`**
- `<input type="text" inputMode="numeric" pattern="[0-9]*" maxLength={3} autoComplete="off" dir="ltr">`.
- `onChange` מסנן לספרות בלבד (`value.replace(/\D/g, '').slice(0, 3)`) – כך גם הדבקה של טקסט לא עוברת.
- `placeholder="?"` ב-Dust Grey.
- `readOnly` בזמן `showingFeedback` (לא `disabled`, כדי לא לסגור את המקלדת).
- `aria-label`: "7 כפול 8" (מ-strings, פונקציה `answerLabel(a, b)`).
- `autoFocus` כשהמסך נפתח עם משחק פעיל.
- **מצב (state) → צבע**, לפי DESIGN.md 1.2: `default` (White / "?" ב-Dust Grey), `:focus` (Blue, ספרות White), `correct` (Green), `wrong` (Orange). `correct` בזמן משוב `correct`; `wrong` בזמן משוב `wrong` ו-`revealAnswer`.
- עטוף ב-`SketchFrame`, כ-220×80px, ספרות בגופן Numbers.

**`FeedbackMessage`**
- מיכל קבוע עם `aria-live="polite"` ו-`role="status"`, שתמיד קיים ב-DOM (כדי שקורא המסך יזהה שינויים).
- `none` → מסגרת מקווקוות עדינה ריקה.
- `correct` → קו Chalk Green + `CheckIcon` + ההודעה האקראית.
- `wrong` → קו Chalk Orange + `CrossIcon` + "אופס! נסו שוב".
- `revealAnswer` → קו Chalk Yellow + `BulbIcon` + "לא נורא! התשובה: " + המספר בגופן Numbers.
- האייקון מימין והטקסט לידו (RTL).

**`Button`** – תוספות:
- `disabled?: boolean` → `aria-disabled="true"` + סגנון Disabled (קו וטקסט בירוק-אפרפר עמום) + הלחיצה לא קוראת ל-`onClick`. משתמשים ב-`aria-disabled` ולא ב-`disabled` אמיתי, כדי שהפוקוס יישאר בתיבה והמקלדת לא תיסגר.
- `keepFocus?: boolean` → `onPointerDown={e => e.preventDefault()}`, כדי שהלחיצה על הלחצן לא תוציא את הפוקוס מהתיבה (חשוב ב-iPhone).
- "בדיקה" מקבל `disabled` כשהתיבה ריקה. בזמן הצגת משוב הוא נראה רגיל, אבל הלחיצה נחסמת (כדי שלא יהבהב לסגנון Disabled בכל שנייה).
- סגנון ה-Disabled ישמש גם ב-M4 למסך הבית.

**אייקונים חדשים** ב-`Icons.tsx`, באותו סגנון קווי "רועד": `CheckIcon` (V), `CrossIcon` (X), `BulbIcon` (נורה).

**טקסטים** ב-`strings/he.ts`, תחת `learn`:
```ts
counter: (n) => ...           // "תרגיל" n "מתוך" 10 – מבנה שמאפשר לצבוע את המספרים
answerLabel: (a, b) => `${a} כפול ${b}`,
check: 'בדיקה',
gameOver: 'סוף המשחק',        // זמני ב-M3, ישמש גם ב-M4
feedback: {
  correct: ['כל הכבוד!', 'נכון! כל הכבוד!', 'מעולה!', 'תשובה נכונה!', 'נכון!'],
  wrong: 'אופס! נסו שוב',
  reveal: 'לא נורא! התשובה:',
},
```

---

## 9. מקלדת בטלפון ופריסה

**הבעיה:** כשהמקלדת נפתחת, החלק הנראה של המסך קטן מאוד (בטלפון קטן כ-360px). צריך שהתרגיל, התיבה, המשוב ו"בדיקה" יישארו גלויים, ושהסרגל התחתון לא יקפוץ מעל המקלדת.

**הפתרון:**
1. **`index.html`:** הוספת `interactive-widget=resizes-visual` ל-meta viewport. כך Chrome ב-Android מתנהג כמו Safari: המקלדת מכסה את הדף ולא מקצרת אותו, והסרגל הקבוע נשאר מאחורי המקלדת.
2. **`useKeyboardOpen`:** Hook שמאזין ל-`window.visualViewport` (`resize`) ומחזיר `true` כשהגובה הנראה קטן מ-`window.innerHeight` ביותר מ-150px. כשהמקלדת פתוחה:
   - `BottomNav` מקבל `hidden` ולא מוצג – כגיבוי, למקרה שהוא בכל זאת קופץ מעל המקלדת.
   - מסך הלימוד מקבל מחלקת `compact`: מרווחים קטנים יותר ותרגיל קטן יותר (כ-56px), כך שכל הבלוק נכנס בגובה של כ-340px.
   - גלילה לראש הדף (`window.scrollTo(0, 0)`), כדי שהמונה והתרגיל לא ייעלמו למעלה כש-Safari גולל אל התיבה.
3. **שמירת המקלדת פתוחה:** `keepFocus` על "בדיקה", `focus()` אחרי כל שליחה, `readOnly` ולא `disabled` בזמן משוב, ו-`aria-disabled` ולא `disabled` על הלחצן כשהתיבה ריקה.

**סדר הגובה במצב רגיל:** מונה, תרגיל, תיבה, משוב ולחצן בעמודה אחת, עם מרווחים של 16–24px; ללא גלילה אופקית ב-360–430px.

> הבדיקה הסופית של הסעיף הזה חייבת להיעשות על iPhone ועל Android אמיתיים (אצל המשתמש, אחרי פריסה). בסביבה המקומית אפשר לבדוק רק סימולציה של רוחב מובייל.

---

## 10. בדיקות ממשק (Vitest + Testing Library)

**`LearnScreen.test.tsx`:**
- מציג "תרגיל 1 מתוך 10" ואת התרגיל עם ×, בכיוון LTR.
- לתיבה יש `aria-label` "a כפול b".
- הקלדת "a7b1234" משאירה "712" (ספרות בלבד, עד 3).
- "בדיקה" מסומן `aria-disabled` כשהתיבה ריקה, ולחיצה עליו לא קוראת ל-`onSubmit`.
- אזור המשוב קיים עם `aria-live="polite"`.
- כל אחד ממצבי המשוב מציג את הטקסט הנכון.

**`App.test.tsx`** (עם `vi.useFakeTimers` ו-`Math.random` מדומה):
- בחירת 7 + "התחל משחק" → כל התרגילים לאורך משחק שלם כוללים 7.
- תשובה נכונה → הודעת הצלחה מהרשימה; אחרי 999ms עדיין אותו תרגיל; אחרי 1000ms "תרגיל 2 מתוך 10".
- תשובה שגויה → "אופס! נסו שוב"; אחרי שנייה התיבה ריקה והתרגיל זהה.
- 3 טעויות → "לא נורא! התשובה: X" עם התשובה הנכונה; אחרי שנייה תרגיל 2.
- לחיצה על "בדיקה" בזמן משוב לא משנה את מספר הניסיונות.
- מעבר ל"אודות" בזמן משוב, המתנה של שנייה וחזרה ל"לימוד" → מוצג המצב העדכני.
- התיבה `readOnly` בזמן משוב.
- אחרי 10 תרגילים → "סוף המשחק".
- עדכון הבדיקה הקיימת "'התחל משחק' moves to the learn screen" למבנה החדש.

---

## 11. בדיקה עצמית בסיום הבנייה

1. `npm test` ו-`npm run build` עוברים.
2. `npm run dev` + דפדפן ברוחב 375px: זרימה של הצלחה, כישלון, חשיפה, 10 תרגילים, מעבר מסך בזמן משוב, חסימת קלט לא מספרי, לחצן "בדיקה" לא פעיל כשהתיבה ריקה.
3. בדיקה ויזואלית מול ה-Mockups וה-Style Guide (צבעי המשוב והתיבה).
4. סגירת השרת בסיום.
5. סימון 🟡 ליד Milestone 3 ב-MILESTONES.md, והוספת ADR על שינוי `Feedback` (ללא `empty`, עם `messageIndex`) ועל ההחלטה לנטרל את "בדיקה" כשהתיבה ריקה.

**תנאי DoD שנבדקים רק אצל המשתמש** (במכשירים אמיתיים, אחרי פריסה): מקלדת מספרית במובייל, נראות כשהמקלדת פתוחה ב-iPhone וב-Android, המקלדת נשארת פתוחה, קורא מסך מקריא את המשוב, והגרסה פרוסה ב-GitHub Pages.
