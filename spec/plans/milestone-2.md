# תוכנית – Milestone 2: מעטפת האפליקציה, ניווט ומסכי תוכן

מבוסס על: `MILESTONES.md` (Milestone 2), `PRD.md` (F1, F3, F4), `ARCHITECTURE.md` (2.2–2.4, 2.12), `DESIGN.md` (סעיפים 1, 1.1, 1.3, 2) והתמונות `wireframes.png`, `mockups.png`, `style-guide.png`.

**מצב קיים (מ-Milestone 1):** `App.tsx` מציג דף זמני עם שם האפליקציה ודוגמאות של `SketchFrame`. קיימים: `tokens.css` (כל הצבעים, הגופנים, המרווחים, `--color-nav-bg`), `global.css`, `SketchFrame` (וריאציות `solid` / `dashed`, צורות 1–3), `strings/he.ts`. עדיין אין תיקיית `public/`.

---

## 1. מה נכנס ומה לא נכנס

**נכנס:**
- App Shell עם `currentScreen` ו-`selectedMode` (בלי Router).
- סרגל ניווט תחתון: "בית", "לימוד", "אודות".
- מסך בית (תצוגה בלבד, והלחצן רק מעביר ללימוד).
- מסך אודות: כותרת, טבלת לוח הכפל, טקסט ההסבר.
- מסך לימוד זמני ריק.
- הסרת דף ההדגמה הזמני של Milestone 1.

**לא נכנס (יגיע בהמשך):**
- Game Logic, `useReducer`, `GameState`, טיימר משוב (Milestone 3).
- מצב Disabled של התפריט והלחצן בזמן משחק (Milestone 4). אין משחק עדיין, ולכן הם תמיד פעילים.
- PWA ואייקונים (Milestone 5).

---

## 2. קבצים ליצירה ולשינוי

```
public/
└── images/home-cat.webp              ← חדש: איור החתול (המשתמש מספק)
src/
├── app/
│   ├── App.tsx                       ← שינוי: App Shell
│   ├── App.module.css                ← שינוי: פריסת המעטפת (הסרת עיצוב ההדגמה)
│   └── App.test.tsx                  ← חדש: בדיקות ניווט
├── screens/
│   ├── HomeScreen/HomeScreen.tsx + .module.css + .test.tsx
│   ├── LearnScreen/LearnScreen.tsx + .module.css     ← זמני
│   └── AboutScreen/AboutScreen.tsx + .module.css
├── components/
│   ├── BottomNav/BottomNav.tsx + .module.css
│   ├── icons/Icons.tsx               ← אייקונים קוויים: בית, עיפרון, i, חץ למטה
│   ├── ModeSelector/ModeSelector.tsx + .module.css
│   ├── Button/Button.tsx + .module.css   ← לחצן Primary (ו-Secondary להמשך)
│   └── MultiplicationTable/MultiplicationTable.tsx + .module.css + .test.tsx
├── game/types.ts                     ← חדש: Screen, PracticeMode בלבד
└── strings/he.ts                     ← שינוי: כל הטקסטים החדשים
```

---

## 3. טיפוסים (`src/game/types.ts`)

רק מה שה-Milestone צריך, בדיוק לפי ARCHITECTURE.md 2.4:

```ts
export type Screen = 'home' | 'learn' | 'about';
export type PracticeMode = 'all' | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export const PRACTICE_MODES: PracticeMode[] = ['all', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
```

שאר הטיפוסים (`GameState` וכו') יתווספו ב-Milestone 3.

---

## 4. App Shell (`src/app/App.tsx`)

- `useState<Screen>('home')` עבור `currentScreen`.
- `useState<PracticeMode>('all')` עבור `selectedMode`. כבר עכשיו ב-App Shell, ולא בתוך מסך הבית, כדי שהבחירה לא תתאפס במעבר מסך, ושב-Milestone 3 "התחל משחק" ישתמש בה.
- מציג את המסך הפעיל לפי `currentScreen`, ומתחתיו `BottomNav` (תמיד).
- `HomeScreen` מקבל: `selectedMode`, `onModeChange`, `onStart` (בשלב זה: `setCurrentScreen('learn')`).
- **פריסה:**
  - `<main>` עם `max-width: 480px`, ממורכז, שוליים צדדיים `--screen-gutter`, ו-`padding-block-end` בגובה הסרגל (86px + `env(safe-area-inset-bottom)`), כדי שהתוכן לא יוסתר מאחורי הסרגל.
  - `min-height: 100dvh` לאזור התוכן, כדי שבמסך הבית הלחצן "התחל משחק" יישב בתחתית, מעל הסרגל.
  - הגלילה היא גלילה רגילה של הדף (מסך האודות). הסרגל `position: fixed`, ולכן נשאר במקום.
- מעבר מסך מגלגל את הדף חזרה למעלה (`window.scrollTo(0, 0)`), כדי שמסך שנפתח אחרי האודות לא ייפתח באמצע.

---

## 5. סרגל ניווט תחתון (`BottomNav`)

- `<nav aria-label="ניווט ראשי">` ובתוכו שלושה `<button type="button">`, בסדר הזה בקוד: בית, לימוד, אודות. בזכות `dir="rtl"` הם יוצגו מימין לשמאל ("בית" מימין), בלי לשנות סדר ידנית.
- כל כפתור: אייקון קווי (`aria-hidden`) ומתחתיו תווית טקסט.
- כפתור פעיל: `aria-current="page"`, צבע Chalk Amber, וקו תחתון קצר מצויר ביד (SVG קטן של קו עם "רעד", `stroke: currentColor`).
- כפתור לא פעיל: Dust Grey.
- עיצוב: `position: fixed; inset-inline: 0; inset-block-end: 0;` גובה 86px + `padding-block-end: env(safe-area-inset-bottom)`, רקע `--color-nav-bg`, קו עליון דק ב-Dust Grey שקוף למחצה. התוכן הפנימי ממורכז ומוגבל ל-480px כמו המסך.
- כל כפתור ממלא שליש מהרוחב, ואזור המגע לפחות 48px.
- תווית: Varela Round, 14px.

**אייקונים (`components/icons/Icons.tsx`):** רכיבי SVG קטנים, `fill: none`, `stroke: currentColor`, עובי 2–2.5px, קצוות מעוגלים (`stroke-linecap: round`), לפי ה-Style Guide: בית, עיפרון, עיגול עם i, וחץ למטה (Chevron) לתפריט. כתובים ידנית בקוד, בלי ספרייה.

---

## 6. מסך בית (`HomeScreen`)

מלמעלה למטה, לפי DESIGN 1.1 וה-Mockup:

1. **כותרת** `<h1>`: "רואים" (Chalk White) ו-"כפול" (Chalk Amber), Amatic SC 700, ‏72px, ממורכזת. מעבירים לכאן את העיצוב הקיים מ-`App.module.css` (`.title`, `.accent`).
2. **תמונה** בתוך `SketchFrame` מוצק בצבע Chalk Yellow:
   - `<img src={`${import.meta.env.BASE_URL}images/home-cat.webp`} alt="...">` כדי שהנתיב יעבוד גם תחת `/multiply/`.
   - `object-fit: cover`, ברוחב מלא, ביחס גובה-רוחב קבוע (כמו ב-Mockup, בערך 4:3) כדי שהעמוד לא "יקפוץ" בזמן טעינה.
   - טקסט `alt` מ-`strings`.
3. **תווית "מצב משחק"**: `<label htmlFor>` שמחוברת לתפריט, 14px, Chalk White, מיושרת לימין.
4. **תפריט (`ModeSelector`)**:
   - `<select>` רגיל של הדפדפן, נשלט (`value={selectedMode}`), עם 11 אפשרויות: "הכול" ו-1 עד 10. ערך ה-`option` הוא מחרוזת (`'all'`, `'1'`…), וההמרה חזרה ל-`PracticeMode` נעשית ב-`onChange`.
   - עיצוב המצב הסגור בלבד: `appearance: none`, רקע שקוף, טקסט Chalk White, גובה 60px, ברוחב מלא, עטוף ב-`SketchFrame` בצבע Chalk White. הערך מימין, ואייקון Chevron משמאל (שכבה עם `pointer-events: none`). צבע הרקע של ה-`option` מוגדר ל-Board Green, כדי שהרשימה תהיה קריאה בדפדפני מחשב.
   - גודל הגופן לפחות 16px, כדי ש-Safari ב-iPhone לא יעשה זום אוטומטי בלחיצה.
5. **שטח ריק** (`flex: 1`), שדוחף את הלחצן לתחתית.
6. **לחצן "התחל משחק"** (`Button` Primary): לחיצה קוראת ל-`onStart`.

**רכיב `Button`:** `<button>` עטוף ב-`SketchFrame`, ברוחב מלא, גובה 64px, טקסט Varela Round ‏22–24px ב-Chalk White. Primary: קו Chalk Green, מילוי Chalk Green שקוף 16%. Secondary (Chalk Pink) מוגדר כבר עכשיו כ-variant פשוט, כי ישמש ב-Milestone 4. אין עדיין מצב Disabled.

---

## 7. מסך אודות (`AboutScreen`)

1. **כותרת** `<h1>` "אודות": Amatic SC 700, ‏40px, מיושרת לימין.
2. **`MultiplicationTable`** בתוך `SketchFrame` מוצק בצבע Chalk Mint:
   - `<table dir="ltr">` עם `<caption>` נסתר ויזואלית (לקורא מסך: "לוח הכפל").
   - שורת כותרת: `<thead><tr>` עם תא פינה `×` (Chalk Pink) ו-10 תאי `<th scope="col">` 1–10 (Chalk Amber).
   - 10 שורות: כל אחת מתחילה ב-`<th scope="row">` (Chalk Amber), ואחריו 10 תאי `<td>` עם `row * col` שמחושב בלולאה.
   - האלכסון (`row === col`) ב-Chalk Yellow; שאר הערכים ב-Chalk White.
   - Fredoka 600, ‏13px, ממורכז. `table-layout: fixed`, `width: 100%`, קווי רשת דקים ב-Dust Grey שקוף. ברוחב 360px כל עמודה ≈ 28px, ו-"100" נכנס בלי לחרוג.
3. **טקסט ההסבר**, בדיוק בנוסח של DESIGN.md 1.3:
   - `<h2>` "איך משחקים ב"רואים כפול"?" (Varela Round 24px).
   - `<ol>` עם 6 השלבים, ובשלב 1 `<ul>` פנימית עם שני הפריטים. ההדגשות ב-`<strong>`, באותו צבע (Chalk White).
   - Body: ‏18px / 1.5, מיושר לימין.
   - הטקסט נשמר ב-`strings/he.ts` כמבנה נתונים (כותרת + רשימת שלבים, כל שלב עם חלק מודגש וחלק רגיל), כדי שאפשר יהיה לעדכן נוסח בלי לגעת ברכיב.
4. **גלילה:** גלילת דף רגילה. פס הגלילה של הדפדפן מופיע כשהתוכן ארוך. התחתית של הטקסט לא מוסתרת על ידי הסרגל (בזכות הריווח מסעיף 4).

---

## 8. מסך לימוד זמני (`LearnScreen`)

מסך ריק עם כותרת נסתרת ויזואלית ("לימוד") לנגישות בלבד. יוחלף ב-Milestone 3.

---

## 9. טקסטים (`src/strings/he.ts`)

להוסיף:
- `nav`: `ariaLabel` "ניווט ראשי", `home` "בית", `learn` "לימוד", `about` "אודות".
- `home`: `modeLabel` "מצב משחק", `modeAll` "הכול", `start` "התחל משחק", `imageAlt` (טקסט חלופי לאיור).
- `about`: `title` "אודות", `tableCaption` "לוח הכפל", `howToTitle`, ושלבי ההסבר.
- `learn`: `title` "לימוד".

> **טקסט חלופי לתמונה:** לא מוגדר ב-spec. ההצעה: "חתול מצויר ליד לוח גיר עם תרגילי חשבון" (טקסט נגישות לקורא מסך בלבד; לא מוצג על המסך). אם המשתמש מעדיף נוסח אחר, נעדכן.

---

## 10. בדיקות (Vitest + Testing Library)

- **`MultiplicationTable.test.tsx`**: 100 תאי `<td>` עם `row × col` הנכונים; 10 כותרות עמודה ו-10 כותרות שורה ב-`<th>`; לטבלה יש `dir="ltr"`.
- **`HomeScreen.test.tsx`**: התפריט מכיל 11 אפשרויות בסדר "הכול", 1…10; ערך ברירת מחדל "הכול"; התווית "מצב משחק" מחוברת לתפריט; לחיצה על "התחל משחק" קוראת ל-`onStart`.
- **`App.test.tsx`**: בהתחלה מוצג מסך הבית ו"בית" עם `aria-current="page"`; לחיצה על כל אחד משלושת הכפתורים מציגה את המסך המתאים ומעבירה את `aria-current`; הסרגל מופיע בכל המסכים בסדר בית, לימוד, אודות; "התחל משחק" עובר ללימוד; בחירה בתפריט נשמרת אחרי מעבר לאודות וחזרה לבית.
- **טקסט האודות**: בדיקה שהטקסט שמוצג זהה מילה במילה לנוסח (השוואה ל-`textContent` של כל שלב).
- בדיקת `SketchFrame` הקיימת ממשיכה לעבור.

---

## 11. בדיקה ידנית בזמן הבנייה

בדפדפן המובנה (`npm run dev`), ברוחבים 360, 390 ו-430px:
- מעבר בין שלושת המסכים, וסימון הפריט הפעיל.
- השוואה חזותית של מסך הבית ומסך האודות ל-Mockups.
- אין גלילה אופקית (`document.documentElement.scrollWidth <= innerWidth`).
- התמונה נטענת בלי 404, וגם `npm run build` + `npm run preview` (תחת `/multiply/`).
- אין שגיאות ב-Console.

---

## 12. Definition of Done ← איך כל סעיף נבדק

| סעיף | איך נבדק |
|---|---|
| לחיצה על פריט בסרגל פותחת את המסך ומסמנת אותו (`aria-current`) | `App.test.tsx` + בדיקה ידנית |
| הסרגל בכל המסכים, בסדר בית, לימוד, אודות מימין לשמאל | `App.test.tsx` (סדר ב-DOM) + צילום מסך (RTL) |
| מסך הבית תואם ל-Mockups: שם, תמונה, 11 אפשרויות, ברירת מחדל "הכול", לחצן | `HomeScreen.test.tsx` + השוואה ויזואלית |
| טבלה: 100 ערכים נכונים, LTR | `MultiplicationTable.test.tsx` |
| טקסט האודות זהה מילה במילה ל-DESIGN.md | בדיקת טקסט + השוואה ידנית |
| מובייל 360–430px בלי גלילה אופקית | בדיקה ידנית בשלושה רוחבים |
| פרוס ונבדק ב-GitHub Pages | אחרי "דחוף שינויים לגיטהאב" (דורש אישור המשתמש) |

---

## 13. מידע נדרש מהמשתמש לפני הבנייה

- **קובץ איור החתול למסך הבית.** אין אותו עדיין בפרויקט. המשתמש צריך לשים אותו בתיקיית הפרויקט (כל פורמט נפוץ: PNG / JPG / WebP). בבנייה הוא יישמר כ-`public/images/home-cat.webp`, דחוס ובגודל מתאים למובייל (בערך 900px רוחב), לפי ARCHITECTURE 2.12.
- **(לא חובה)** אישור לנוסח הטקסט החלופי של התמונה (סעיף 9).
