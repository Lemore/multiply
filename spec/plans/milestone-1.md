# תוכנית – Milestone 1: הקמת הפרויקט ופריסה אוטומטית

מבוסס על: `MILESTONES.md` (Milestone 1), `ARCHITECTURE.md` (סעיפים 1, 2.2, 2.3, 2.10), `DESIGN.md` (סעיף 2 – Style Guide).

**מטרה:** בסיס טכני עובד ופרוס: פרויקט Vite + React + TypeScript, Design Tokens, גופנים מקומיים, רכיב `SketchFrame`, Vitest, ו-Workflow שמפרסם ל-GitHub Pages. דף זמני עם שם האפליקציה.

**מחוץ לטווח של Milestone זה:** App Shell, ניווט, מסכים, לוגיקת משחק, PWA (vite-plugin-pwa נכנס רק ב-Milestone 5), תמונות ואייקונים.

---

## 1. מצב נוכחי

- בתיקייה יש רק `CLAUDE.md`, `.gitignore` ו-`spec/`. אין עדיין קוד.
- Git מחובר ל-`https://github.com/Lemore/multiply.git`, ענף `main`.
- Node.js 24.14 ו-npm 11.9 מותקנים – עומדים בדרישת Vite (20.19+ / 22.12+).
- `.gitignore` כבר מכסה `node_modules/` ו-`dist/`. אין צורך לשנות אותו.
- אין צורך ב-`.env` – אין סודות או מפתחות בפרויקט (ARCHITECTURE 2.10).

---

## 2. קבצים ליצירה

הפרויקט ייווצר **ידנית** (לא דרך `npm create vite`), כי התיקייה לא ריקה ורוב קובצי התבנית של Vite (לוגו, דוגמת מונה, CSS לדוגמה) ממילא היו נמחקים.

```
/
├── .github/workflows/deploy.yml
├── index.html
├── package.json
├── package-lock.json            ← נוצר ע"י npm install
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── src/
    ├── main.tsx
    ├── vite-env.d.ts
    ├── app/
    │   ├── App.tsx               ← דף זמני
    │   └── App.module.css
    ├── components/
    │   └── SketchFrame/
    │       ├── SketchFrame.tsx
    │       ├── SketchFrame.module.css
    │       └── SketchFrame.test.tsx   ← הבדיקה הבסיסית
    ├── assets/frames/
    │   └── framePaths.ts          ← נתוני הקווים של המסגרות
    ├── strings/
    │   └── he.ts                  ← טקסטי ממשק (כרגע: שם האפליקציה)
    └── styles/
        ├── tokens.css             ← צבעים, גופנים, מרווחים
        └── global.css             ← reset, רקע, RTL, ייבוא גופנים
```

תיקיות `screens/` ו-`game/` לא נוצרות עדיין – הן יתווספו ב-Milestones 2–3.

---

## 3. תלויות (package.json)

**dependencies**
- `react`, `react-dom` – גרסה 19.x.
- `@fontsource/amatic-sc`, `@fontsource/varela-round`, `@fontsource/fredoka`.

**devDependencies**
- `vite` 8.x, `@vitejs/plugin-react` (הגרסה התואמת ל-Vite 8).
- `typescript`, `@types/react`, `@types/react-dom`, `@types/node`.
- `vitest` (הגרסה התואמת ל-Vite 8), `jsdom`, `@testing-library/react` – לבדיקת רכיב React.

בזמן ההתקנה: לוודא שכל גרסה תואמת ל-Vite 8 (בעיקר `@vitejs/plugin-react` ו-`vitest`). אם יש התנגשות – לעצור ולדווח.

**scripts**
| פקודה | תוכן |
|---|---|
| `dev` | `vite` |
| `build` | `tsc -b && vite build` |
| `preview` | `vite preview` |
| `test` | `vitest run` |

---

## 4. פירוט לפי רכיב

### 4.1 `vite.config.ts`
- `plugins: [react()]`.
- `base: '/multiply/'` (ARCHITECTURE 2.10). השפעה: גם בפיתוח המקומי הכתובת תהיה `http://localhost:5173/multiply/`.
- הגדרות Vitest באותו קובץ: `test: { environment: 'jsdom' }`.

### 4.2 `index.html`
- `<html lang="he" dir="rtl">`.
- `<meta charset="UTF-8">`, `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`.
- `<meta name="theme-color" content="#0C422C">`.
- `<title>רואים כפול</title>`.
- **בלי** קישור ל-favicon של Vite (`vite.svg`) – כדי שלא תהיה שגיאת 404. אייקונים יתווספו ב-Milestone 5.
- אין שום `<link>` או `<script>` לשרת חיצוני.

### 4.3 Design Tokens – `src/styles/tokens.css`
CSS Variables על `:root`, לפי DESIGN.md סעיף 2:

- **צבעים:** `--color-board-green: #0C422C`, `--color-chalk-white: #FFFFFF`, `--color-dust-grey: #A8BFB2`, `--color-frame-grey: #454445`, `--color-chalk-green: #7CD95F`, `--color-chalk-orange: #EE7C4B`, `--color-chalk-amber: #EFBE40`, `--color-chalk-blue: #889CFC`, `--color-chalk-pink: #FB6AC3`, `--color-chalk-yellow: #FDF5A7`, `--color-chalk-mint: #ABE9D5`.
  - `--color-nav-bg: #0A3A27` (רקע הסרגל התחתון לפי DESIGN.md, לשימוש ב-Milestone 2).
- **גופנים:** `--font-display: 'Amatic SC', <גיבוי מערכת>`, `--font-ui: 'Varela Round', <גיבוי>`, `--font-numbers: 'Fredoka', <גיבוי>`. גיבוי: `system-ui, 'Arial Hebrew', Arial, sans-serif`.
- **מרווחים:** רשת 8px – `--space-1: 8px` … `--space-6: 48px`, ו-`--screen-gutter: 22px` (DESIGN 2.4).
- **קווי מתאר:** `--stroke-width: 3px`, `--radius: 5px`.

### 4.4 גופנים – `src/styles/global.css`
- ייבוא רק של המשקלים שבשימוש, ורק של תת-הקבוצות (subsets) עברית ולטינית, כדי לא לנפח את האתר:
  - Amatic SC 700, Varela Round 400, Fredoka 600.
  - Fontsource מאפשר לייבא קובץ לכל subset, למשל `@fontsource/amatic-sc/hebrew-700.css` ו-`latin-700.css`. **לבדוק בזמן ההתקנה** שקיים subset עברי בכל אחת משלוש החבילות. אם לאחד הגופנים אין עברית – לעצור ולדווח (DESIGN.md קובע ששלושתם תומכים בעברית).
- קובצי Fontsource מגדירים `font-display: swap` כברירת מחדל – לוודא.
- Vite אורז את קובצי ה-`woff2` לתוך `dist`, ולכן אין פנייה ל-Google Fonts.

`global.css` כולל גם:
- reset בסיסי (`box-sizing: border-box`, `margin: 0`).
- `body`: רקע `var(--color-board-green)`, צבע טקסט Chalk White, גופן `var(--font-ui)`, גודל 18px.
- `min-height: 100dvh`.

### 4.5 `SketchFrame` – קו מתאר "מצויר ביד"
לפי ARCHITECTURE 2.3.

**API של הרכיב:**
```ts
type SketchFrameProps = {
  variant?: 'solid' | 'dashed';      // ברירת מחדל: 'solid'
  shape?: 1 | 2 | 3;                 // איזה קו "רועד" מתוך המסגרות המצוירות מראש
  className?: string;                // הצבע נקבע ע"י color ב-CSS של ההורה (currentColor)
  children: React.ReactNode;
};
```

**מימוש:**
- `<div>` עם `position: relative`, ובתוכו:
  - `<svg aria-hidden="true">` ב-`position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; overflow: visible`.
  - `viewBox="0 0 100 100"`, `preserveAspectRatio="none"` – המסגרת נמתחת לגודל הרכיב.
  - `<path>` עם `fill="none"`, `stroke="currentColor"`, `stroke-width` לפי `--stroke-width`, `stroke-linecap/linejoin="round"`, `vector-effect="non-scaling-stroke"` – עובי 3px קבוע בכל גודל.
  - הילדים (התוכן) מעל ה-SVG, ולכן הטקסט לא עובר שום עיבוד ונשאר חד.
- **נתוני הקווים** ב-`src/assets/frames/framePaths.ts`: 3 מחרוזות `d` של מלבן עם "רעד" קל (נקודות ביניים שזזות מעט מהקו הישר) ופינות מעוגלות מעט (4–6px במראה). אלה נתונים קבועים שנכתבים פעם אחת – לא נוצרים באקראי בכל רינדור.
  - **סטייה קטנה מ-ARCHITECTURE:** שם כתוב "קובצי SVG". שמירת הקווים כנתונים בקובץ TS מאפשרת לצייר אותם ישירות בתוך הרכיב (inline), בלי תוסף נוסף לייבוא SVG כרכיב React, ועם `currentColor` שעובד אוטומטית. ההחלטה תתועד כ-ADR ב-ARCHITECTURE.md בזמן הבנייה.
- **מקווקו:** `stroke-dasharray` (למשל `8 6`) על אותו path.
  - **סיכון:** השילוב של `non-scaling-stroke` עם `stroke-dasharray` עלול להתנהג אחרת ב-Safari (אורך הקווקוו נמתח). יש לבדוק זאת. אם הבעיה מופיעה – לצייר את המסגרת המקווקוות ב-SVG שמחושב לפי הגודל בפועל (ResizeObserver), ולתעד ב-ADR.
- **פינות:** כיוון שהמסגרת נמתחת, בתיבה רחבה וצרה הפינות עלולות להיראות "מעוותות". הקו נכתב כך שהסטיות קטנות (בגבולות 1–2% מהגודל) כדי שזה כמעט לא ייראה. לבדוק בכמה יחסי רוחב/גובה.

### 4.6 דף זמני – `src/app/App.tsx`
- `<main>` ממורכז, עם שוליים צדדיים של `--screen-gutter`.
- כותרת `<h1>` עם הטקסט "רואים כפול" (מ-`strings/he.ts`), בגופן Display, בגודל כ-72px, "רואים" ב-Chalk White ו"כפול" ב-Chalk Amber (כמו ב-Mockups).
- **אזור הדגמה של `SketchFrame`** (זמני, לבדיקת ה-DoD): כמה מסגרות בגדלים שונים ובצבעי גיר שונים, למשל:
  - מסגרת רחבה ונמוכה (כמו לחצן) ב-Chalk Green.
  - מסגרת בינונית (כמו תיבת תשובה, 220×80) ב-Chalk White.
  - מסגרת גבוהה (כמו מסגרת תמונה) ב-Chalk Yellow.
  - מסגרת מקווקוות (כמו מונה ההתקדמות) ב-Dust Grey.
  - בתוך כל מסגרת טקסט קצר בעברית בגופן UI, ובאחת ספרות בגופן Numbers – כדי לבדוק את שלושת הגופנים.
- אזור ההדגמה יוסר ב-Milestone 2 כשהמסכים האמיתיים ייבנו.

### 4.7 `src/strings/he.ts`
```ts
export const strings = { appName: { first: 'רואים', second: 'כפול' } };
```
יתרחב בהמשך לכל טקסטי הממשק.

### 4.8 Vitest – הבדיקה הבסיסית
`SketchFrame.test.tsx`:
- מרנדר `SketchFrame` עם טקסט, ובודק שהטקסט מוצג ושיש `svg` עם `path` ש-`stroke="currentColor"`.
- במצב `dashed` בודק שיש `stroke-dasharray`.

### 4.9 GitHub Actions – `.github/workflows/deploy.yml`
מבוסס על הדוגמה הרשמית בתיעוד Vite (Static Deploy → GitHub Pages), עם תוספת שלב בדיקות:
- `on: push: branches: [main]` + `workflow_dispatch` (הפעלה ידנית).
- `permissions: contents: read, pages: write, id-token: write`.
- `concurrency: group: pages, cancel-in-progress: true`.
- **job build:** `actions/checkout` → `actions/setup-node` (`node-version: lts/*`, `cache: npm`) → `npm ci` → `npm test` → `npm run build` → `actions/configure-pages` → `actions/upload-pages-artifact` (`path: ./dist`).
- **job deploy:** `needs: build`, `environment: github-pages`, `actions/deploy-pages`.
- גרסאות ה-actions – הגרסאות העדכניות שמופיעות בתיעוד Vite בזמן הבנייה.

### 4.10 עדכון `CLAUDE.md`
מילוי "פקודות הרצה":
- **הרצה (dev):** `npm run dev` (כתובת: `http://localhost:5173/multiply/`)
- **בדיקות (test):** `npm test`

---

## 5. סדר הבנייה

1. יצירת `package.json`, קובצי tsconfig, `vite.config.ts`, `index.html` → `npm install` → בדיקת גרסאות ותאימות.
2. `tokens.css`, `global.css` וייבוא הגופנים → `main.tsx`.
3. `framePaths.ts` + `SketchFrame` + הבדיקה.
4. דף זמני `App.tsx`.
5. `npm test`, `npm run build`, `npm run dev` – וידוא שהכול עובר בלי שגיאות או אזהרות TypeScript.
6. בדיקה בדפדפן (ראו סעיף 6).
7. `deploy.yml`.
8. עדכון `CLAUDE.md` (פקודות הרצה), הוספת ADR ל-ARCHITECTURE.md, סימון 🟡 ב-MILESTONES.md.

---

## 6. בדיקות מול ה-Definition of Done

| תנאי | איך בודקים | מתי |
|---|---|---|
| `npm run dev` מציג את הדף בלי שגיאות | הרצה מקומית + קונסולת הדפדפן נקייה | בבנייה |
| `npm run build` ו-`npm test` עוברים | הרצה בטרמינל | בבנייה |
| RTL, Amatic SC, רקע `#0C422C` | בדפדפן: `dir="rtl"` על `html`, `getComputedStyle` לגופן ולרקע, ובדיקה שהגופן נטען בפועל (`document.fonts`) | בבנייה |
| `SketchFrame` נכון בכמה גדלים, עובי קבוע | צילום מסך של אזור ההדגמה ברוחב מובייל (375px) וברוחב רחב | בבנייה (Chrome). **Safari – בדיקה שלך** |
| אין בקשות לשרתים חיצוניים | לשונית Network: כל הבקשות ל-`localhost` בלבד | בבנייה, ושוב באתר הפרוס |
| Push ל-`main` מפעיל Workflow שמסתיים בהצלחה | לשונית Actions ב-GitHub | **אחרי ה-push** |
| הדף נגיש ב-GitHub Pages בלי 404 | פתיחת `https://lemore.github.io/multiply/` ובדיקת Network | **אחרי ה-push** |

---

## 7. מה צריך ממך (המשתמש)

1. **הגדרת GitHub Pages – פעם אחת, לפני ה-push הראשון:** ב-GitHub, בדף ה-Repository `Lemore/multiply`: Settings ← Pages ← Build and deployment ← Source: **GitHub Actions**. אדריך אותך צעד אחר צעד כשנגיע לזה.
2. **אישור push:** שלושת התנאים האחרונים ב-DoD (Workflow, אתר פרוס, Network באתר הפרוס) אפשר לבדוק רק אחרי push ל-`main`. לפי ההנחיות, אחרי הבנייה המקומית אעצור ואבקש את אישורך ל-push.
3. **בדיקה ב-Safari:** אין לי גישה ל-Safari. בבדיקה שלך – לפתוח את הדף ב-Safari (Mac או iPhone) ולוודא שהמסגרות נראות כמו ב-Chrome.

אין צורך בחשבונות, מפתחות או קובצי תמונה ב-Milestone זה.

---

## 8. סיכונים ונקודות לתשומת לב

- **תאימות גרסאות ל-Vite 8** (plugin-react, Vitest) – לוודא בהתקנה.
- **subset עברי בגופנים** – לוודא שקיים לכל שלושת הגופנים, אחרת עברית תוצג בגופן גיבוי.
- **מסגרת מקווקוות ב-Safari** – ראו 4.5.
- **`base: '/multiply/'`** – כל נתיב לנכס חייב להיות יחסי או לעבור דרך Vite (ייבוא), אחרת יתקבל 404 באתר הפרוס.
