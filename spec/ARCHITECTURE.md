# ARCHITECTURE – רואים כפול

מסמך זה מתרגם את דרישות ה-PRD לתכנון טכני. הוא מבוסס על PRD.md, ואינו מוסיף פיצ'רים או משנה דרישות מוצר.

---

## 1. Technology Stack שנבחר

### 1.1 טבלת רכיבים

| רכיב | טכנולוגיה | תפקיד |
|---|---|---|
| שפת פיתוח | TypeScript | קוד עם בדיקת טיפוסים. מפחית שגיאות בלוגיקת המשחק ומקל על פיתוח בעזרת AI. |
| UI Library | React (גרסה 19.x) | בניית שלושת המסכים, הסרגל התחתון וניהול מצב המשחק בזיכרון. |
| Build Tool | Vite (גרסה 8.x) | שרת פיתוח ו-Build של אתר סטטי לתיקיית `dist`. |
| PWA | vite-plugin-pwa (מבוסס Workbox) | יצירת Web App Manifest ו-Service Worker, ושמירה מראש (Precache) של כל קבצי האתר לצורך עבודה ללא אינטרנט. |
| עיצוב | CSS Modules (מובנה ב-Vite) | עיצוב לכל רכיב בנפרד, עם CSS Logical Properties לתמיכה ב-RTL. |
| גופנים | Fontsource: `@fontsource/amatic-sc`, `@fontsource/varela-round`, `@fontsource/fredoka` | שלושת הגופנים של DESIGN.md, כקבצי `woff2` שנארזים בתוך האתר. אין טעינה משרתים חיצוניים. |
| קווי מתאר "מצוירים ביד" | מסגרות SVG מצוירות מראש | קו מתאר בסגנון גיר לכל הרכיבים, בלי ספרייה חיצונית (ראו 2.3). |
| בדיקות | Vitest | Unit Tests ללוגיקת המשחק: בחירת תרגילים, ניסיונות וניקוד. |
| ניהול קוד | Git + GitHub | Repository יחיד לכל הקוד והנכסים. |
| Hosting | GitHub Pages | אחסון האתר הסטטי. |
| CI/CD | GitHub Actions | Build ופריסה אוטומטית בכל Push ל-`main`. |

**רכיבים שאינם נדרשים ולכן לא נכללים:** Backend, Database (כולל Supabase), Authentication, אחסון קבצים בענן, APIs חיצוניים, שירותי AI, Analytics ו-Router.

### 1.2 נימוקים להחלטות המרכזיות

- **Frontend בלבד, ללא Backend.** לפי ה-PRD, המוצר אינו שומר נתונים, אין בו חשבונות משתמש ואין בו אינטגרציות. כל הלוגיקה רצה בדפדפן, ולכן אין צורך בשרת או ב-Database.
- **React עם Vite, במקום JavaScript ללא Framework או Preact.** נבחנו שלוש חלופות. JavaScript נקי קטן יותר, אבל בלעדיו ניהול המצב, המשותף לכמה מסכים, הופך לידני ונוטה לשגיאות. Preact קל יותר, אבל קהילתו ומספר הדוגמאות שלו קטנים בהרבה. React עם Vite הוא שילוב Mainstream ובשל, עם תיעוד נרחב ודוגמאות רבות, ולכן מתאים במיוחד לפיתוח בעזרת AI. תיעוד React מציג את Vite כאחד מכלי ה-Build המומלצים לבניית אפליקציה מאפס, ומספק פקודת יצירה עם תבנית `react-ts`. [מקור](https://react.dev/learn/build-a-react-app-from-scratch)
- **Next.js וכדומה נדחו.** Framework עם Server Side Rendering מוסיף מורכבות שאין בה צורך באפליקציה סטטית של שלושה מסכים.
- **vite-plugin-pwa.** התוסף מזריק Web App Manifest ומייצר Service Worker עם תמיכה ב-Offline באמצעות Workbox, בהגדרות ברירת מחדל סבירות. [מקור](https://npmjs.com/package/vite-plugin-pwa) זה פותר את דרישות ההתקנה כ-PWA והעבודה ללא אינטרנט בלי לכתוב Service Worker ידנית. תמיכה רשמית ב-Vite 8 נוספה בגרסה 1.3.0 של התוסף. [מקור](https://github.com/vite-pwa/vite-plugin-pwa/releases)
- **ללא Router.** שלושת המסכים מתחלפים על ידי משתנה מצב (State) באפליקציה, ולא על ידי כתובות URL. כך נמנעות בעיות מוכרות של SPA ב-GitHub Pages (שגיאת 404 ברענון כתובת פנימית), והמבנה פשוט יותר. ה-PRD לא דורש כתובות נפרדות למסכים.
- **CSS Modules, במקום Tailwind או ספריית רכיבים.** האפליקציה קטנה, וההגדרה מובנית ב-Vite בלי תלויות נוספות. CSS Logical Properties, כמו `margin-inline-start` במקום `margin-left`, מבטיחים פריסה נכונה ב-RTL.
- **גופנים מקומיים דרך Fontsource.** DESIGN.md מגדיר שלושה גופנים: Amatic SC, Varela Round ו-Fredoka. Fontsource מספק אותם כחבילות npm עם קובצי הגופן עצמם, כך ש-Vite אורז אותם בתוך האתר. האפליקציה לא פונה ל-Google Fonts, הגופנים נכנסים ל-Precache ועובדים ללא אינטרנט. כל הגופנים ברישיון OFL, שמתיר שימוש חופשי.
- **מסגרות SVG מצוירות מראש, במקום פילטר SVG או rough.js.** נבחנו שלוש חלופות לקו "מצויר ביד". פילטר SVG שמעוות מסגרת CSS רגילה נותן "רעד" אחיד ומלאכותי יותר, ותמיכת Safari בפילטרים כאלה על אלמנטי HTML פחות אמינה. rough.js מוסיף תלות ומצייר קווים אחרים בכל רינדור. מסגרת SVG שמצוירת מראש נראית הכי קרוב ל-Mockups, ומוצגת זהה בכל הדפדפנים.
- **GitHub Pages.** זה פתרון ה-Hosting שהועדף בהנחיות לאתר Frontend בלבד. הוא חינמי, מתחבר ישירות ל-GitHub ותומך בפריסה אוטומטית דרך GitHub Actions. תיעוד Vite כולל Workflow רשמי לכך. [מקור](https://vite.dev/guide/static-deploy.html)

### 1.3 סיכונים, מגבלות והסתייגויות

- **Repository ציבורי.** בתוכנית החינמית של GitHub, Pages זמין רק ל-Repository ציבורי. ל-Repository פרטי נדרשת תוכנית בתשלום, כמו GitHub Pro. [מקור](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits) ה-Repository של הפרויקט, `Lemore/multiply`, ציבורי, ולכן הקוד גלוי לכולם. זה לא מהווה בעיה, כי אין בו סודות.
- **שימוש מסחרי.** תנאי השימוש של GitHub Pages אוסרים שימוש באתר חינמי בעיקר לצורכי עסק או מסחר. [מקור](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits) אפליקציה חינמית ללימוד מתאימה לשימוש. אם בעתיד יוחלט לגבות תשלום או למכור את האפליקציה, יש לבחון Hosting אחר.
- **מגבלות שימוש.** ל-GitHub Pages יש מגבלה רכה של 100GB תעבורה בחודש, ואתר מפורסם מוגבל ל-1GB. [מקור](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits) אלה מגבלות רחבות מאוד ביחס לאפליקציה מהסוג הזה.
- **התקנה ב-iPhone.** ב-iOS אין חלון התקנה אוטומטי. המשתמש מתקין את האפליקציה ידנית: תפריט השיתוף ב-Safari ← "הוסף למסך הבית". [מקור](https://www.magicbell.com/blog/pwa-ios-limitations-safari-support-complete-guide) זה תואם את Flow 3 ב-PRD, שבו ההתקנה נעשית במנגנון הדפדפן. כפתור התקנה בתוך האפליקציה לא הוגדר ב-PRD, ולכן לא נכלל.
- **מחיקת Cache ב-iOS.** לפי מקור משני, iOS עלול למחוק נתוני Cache של PWA שלא נפתחה זמן מה, או כשהמכשיר מתמלא. [מקור](https://www.magicbell.com/blog/pwa-ios-limitations-safari-support-complete-guide) במקרה כזה, האפליקציה תצטרך חיבור לאינטרנט כדי להיטען שוב בפעם הבאה. אין דרך מלאה למנוע זאת. הקבצים יישמרו קטנים ככל האפשר, כדי שההורדה החוזרת תהיה מהירה.
- **גרסת vite-plugin-pwa.** הגרסה העדכנית ביותר היא 2.0.0, אבל דף ה-Releases לא מפרט את השינויים שוברי התאימות שלה. [מקור](https://github.com/vite-pwa/vite-plugin-pwa/releases) בזמן ההתקנה יש להשתמש בגרסה העדכנית שתואמת ל-Vite 8, ולבדוק את הוראות המעבר בתיעוד התוסף.
- **Node.js.** Vite דורש Node.js בגרסה 20.19 ומעלה, או 22.12 ומעלה, בסביבת הפיתוח. [מקור](https://vite.dev/guide/) בסביבת ה-Build של GitHub Actions תוגדר גרסת LTS.

---

## 2. ארכיטקטורת המערכת

### 2.1 מבנה כללי

```
┌───────────────────────────────── דפדפן (מכשיר הילד) ─────────────────────────────────┐
│                                                                                       │
│   ┌──────────────── React App (SPA) ────────────────┐      ┌──── Service Worker ────┐ │
│   │                                                  │      │ (vite-plugin-pwa /     │ │
│   │  App Shell: מצב מסך נוכחי + מצב משחק (בזיכרון)   │      │  Workbox)              │ │
│   │     │                                            │      │ Precache של כל קבצי   │ │
│   │     ├── Home Screen                              │◄────►│ האתר → עבודה ללא      │ │
│   │     ├── Learn Screen ◄── Game Logic (pure TS)    │      │ אינטרנט                │ │
│   │     ├── About Screen                             │      └────────────────────────┘ │
│   │     └── Bottom Nav                               │                                 │
│   └──────────────────────────────────────────────────┘                                 │
└───────────────────────────────────────────────────────────────────────────────────────┘
                 ▲ טעינה ראשונה ועדכוני גרסה בלבד
                 │
        GitHub Pages (קבצים סטטיים)  ◄── GitHub Actions (Build + Deploy) ◄── GitHub Repository
```

האפליקציה היא Single Page Application סטטית. אחרי הטעינה הראשונה, כל הקבצים נשמרים במכשיר על ידי ה-Service Worker, ואין יותר תקשורת עם שרת, מלבד בדיקה לגרסה חדשה כשיש חיבור לאינטרנט.

### 2.2 Modules ושכבות לוגיות

האפליקציה מחולקת לארבע שכבות. כל שכבה תלויה רק בשכבות שמתחתיה:

| שכבה | אחריות | תלויה ב- |
|---|---|---|
| **App Shell** | מחזיקה את המסך הנוכחי (`home` / `learn` / `about`), את המצב שנבחר בתפריט במסך הבית ואת מצב המשחק. מציגה את המסך הפעיל ואת הסרגל התחתון, ומנהלת את טיימר המשוב. | Screens, Game Logic |
| **Screens** | שלושת המסכים: Home, Learn, About. מציגים מידע ומעבירים פעולות משתמש ל-App Shell. | Components, Game Logic (טיפוסים בלבד), Strings |
| **Components** | רכיבי UI משותפים: Bottom Nav, Mode Selector, Answer Input, Feedback Message, Game Summary, Multiplication Table, Sketch Frame. | Strings |
| **Game Logic** | לוגיקת המשחק כקוד TypeScript "טהור", ללא React וללא DOM: יצירת תרגילים, בדיקת תשובות, ספירת ניסיונות, ניקוד ומעברי מצב. | אין |

**Strings:** כל טקסטי הממשק בעברית מרוכזים בקובץ אחד. כך קל לעדכן נוסח בלי לגעת בקוד.

**מבנה תיקיות (ברמה גבוהה):**

```
/
├── .github/workflows/deploy.yml   ← Build ו-Deploy ל-GitHub Pages
├── public/                        ← תמונות (מתמטיקה, לוח הכפל) ואייקוני PWA
├── src/
│   ├── app/                       ← App Shell
│   ├── screens/                   ← Home, Learn, About
│   ├── components/                ← רכיבי UI משותפים
│   ├── assets/frames/             ← מסגרות SVG מצוירות ביד
│   ├── game/                      ← Game Logic + Unit Tests
│   ├── strings/                   ← טקסטי ממשק בעברית
│   └── styles/                    ← משתנים ועיצוב גלובלי (צבעים, RTL, ייבוא גופנים)
├── index.html                     ← lang="he" dir="rtl"
└── vite.config.ts                 ← הגדרות Vite, base path, vite-plugin-pwa
```

### 2.3 מבנה ה-Frontend

**ניווט בין מסכים**
- ה-App Shell מחזיק משתנה `currentScreen`. לחיצה על כפתור בסרגל התחתון מעדכנת אותו.
- הסרגל התחתון מוצג תמיד ומסמן את המסך הנוכחי (F4).
- מעבר מסך לא משנה את מצב המשחק. מצב המשחק נשמר ב-App Shell, ולא במסך הלימוד עצמו, ולכן ההשהיה וההמשך (Flow 1א) מתקבלים בלי לוגיקה מיוחדת: מסך הלימוד פשוט מוצג שוב עם אותו מצב.

**התחלת משחק ובחירת מצב**
- בחירת המצב נעשית **רק במסך הבית**. הערך שנבחר בתפריט נשמר ב-App Shell במשתנה `selectedMode` (ברירת מחדל: `'all'`).
- **"התחל משחק"** מתחיל משחק חדש במצב `selectedMode`, ומעביר למסך הלימוד.
- **"שחק שוב"** במסך הסיכום מתחיל משחק חדש **באותו מצב** של המשחק שהסתיים (`game.mode`), ולא לפי התפריט.
- כדי לשחק במצב אחר, הילד חוזר למסך הבית, בוחר מצב חדש ולוחץ על "התחל משחק".
- בזמן משחק פעיל (`playing`), התפריט ולחצן "התחל משחק" במסך הבית מושבתים (PRD F1). ב-`idle` וב-`finished` הם פעילים.
- **כניסה ללשונית "לימוד" כשאין משחק** (`idle`) מתחילה משחק במצב `selectedMode` (PRD F2). כניסה ללשונית כשהמשחק הסתיים (`finished`) מציגה את מסך הסיכום.

**ניהול מצב המשחק**
- המצב מנוהל ב-`useReducer` ב-App Shell. ה-Reducer קורא לפונקציות של שכבת Game Logic.
- כל שינוי במשחק מתבצע דרך Action מוגדר: `startGame(mode)`, `submitAnswer(value)`, `feedbackDone` (סוף הצגת המשוב). "שחק שוב" שולח `startGame(game.mode)`.
- **אין Global State Library**, כמו Redux או Zustand. מצב אחד ב-App Shell מספיק לשלושה מסכים.

**RTL ועברית**
- ב-`index.html` מוגדרים `lang="he"` ו-`dir="rtl"`.
- בעיצוב נעשה שימוש ב-CSS Logical Properties.
- תרגיל מוצג כ-"א × ב". כדי שהתרגיל לא יתהפך בתוך טקסט RTL, אזור התרגיל מוצג בכיוון LTR מבודד (`dir="ltr"`).

**גופנים**
- שלושת הגופנים של DESIGN.md: **Amatic SC Bold** (Display), **Varela Round Regular** (UI & Body) ו-**Fredoka SemiBold** (Numbers).
- הגופנים מותקנים כחבילות Fontsource ומיובאים בקובץ העיצוב הגלובלי, במשקלים שבשימוש בלבד (Amatic SC 700, Varela Round 400, Fredoka 600). Vite אורז את קובצי ה-`woff2` בתוך האתר.
- אין בקשות ל-Google Fonts או לשרת חיצוני אחר. הגופנים נכללים ב-Precache של ה-Service Worker, ועובדים ללא אינטרנט.
- `font-display: swap`, כדי שהטקסט יוצג מיד בגופן גיבוי עד שהגופן נטען.
- הגופנים מוגדרים כ-CSS Variables (`--font-display`, `--font-ui`, `--font-numbers`), עם גופן מערכת כגיבוי.

**קווי מתאר "מצוירים ביד" (Sketch Frame)**
- רכיב `SketchFrame` עוטף לחצנים, תיבת התשובה, התפריט, אזור המשוב ומסגרות התוכן.
- המסגרת היא קובץ SVG עם קו שצויר מראש ב"רעד" קל. היא מונחת כשכבה מאחורי התוכן, ונמתחת לגודל הרכיב (`preserveAspectRatio="none"`).
- `vector-effect: non-scaling-stroke` שומר על עובי קו קבוע של 3px בכל גודל, גם כשהמסגרת נמתחת.
- צבע הקו נקבע ב-`currentColor`, כך שאותה מסגרת משמשת לכל צבעי הגיר ולכל המצבים (Focus, Correct, Wrong, Disabled).
- כמה וריאציות של מסגרת (רציפה, מקווקוות דרך `stroke-dasharray`), כדי שרכיבים סמוכים לא ייראו זהים לחלוטין.
- הטקסט עצמו לא עובר עיבוד, ולכן נשאר חד וקריא.

**תפריט "מצב משחק"**
- אלמנט `<select>` רגיל של הדפדפן, שמעוצב במצב סגור לפי DESIGN.md.
- כשהוא נפתח, הטלפון מציג את הבוחר המובנה שלו. זה נוח לילדים ונגיש, ואין צורך לעצב מצב פתוח.

**תיבת התשובה**
- `inputMode="numeric"` לפתיחת מקלדת מספרית במובייל.
- סינון קלט לספרות בלבד והגבלה ל-3 תווים (PRD 4ב).
- לחיצה על לחצן הבדיקה כשהתיבה ריקה מציגה בקשה להקליד תשובה, ולא מעבירה Action של ניסיון ל-Reducer.
- **אין מקש Enter במקלדת המספרית של iPhone.** לכן לחצן "בדיקה" הוא הדרך העיקרית לשלוח תשובה, והוא חייב להיות גלוי ונגיש גם כשהמקלדת פתוחה. Enter במקלדות שיש בהן מקש כזה שולח גם הוא תשובה.
- **פריסה כשהמקלדת פתוחה:** כשהמקלדת נפתחת, החלק הנראה של המסך קטן. הפריסה של מסך הלימוד צריכה להשאיר את התרגיל, התיבה, אזור המשוב ולחצן "בדיקה" גלויים, בלי שהסרגל התחתון יקפוץ מעל המקלדת ויסתיר אותם. יש לבדוק זאת על iPhone ועל Android.
- **שמירה על המקלדת פתוחה:** אחרי לחיצה על "בדיקה", הפוקוס חוזר לתיבה, כדי שהמקלדת לא תיסגר בין ניסיונות ובין תרגילים. בזמן הצגת משוב, התיבה מוגדרת `readOnly` ולא `disabled`, כי `disabled` מוציא את הפוקוס וסוגר את המקלדת.

**נגישות**
- אזור המשוב מוגדר `aria-live="polite"`, כך שקורא מסך מקריא אוטומטית כל הודעה חדשה: הצלחה, כישלון, חשיפת התשובה ובקשה להקליד תשובה.
- לתיבת התשובה יש תווית נגישה (`aria-label`) שכוללת את התרגיל, לדוגמה "7 כפול 8".
- כפתורי הסרגל התחתון הם `<button>` עם תווית טקסט, והכפתור הפעיל מסומן ב-`aria-current="page"`.
- לוח הכפל במסך האודות הוא טבלת HTML אמיתית (ראו 2.12), עם תאי כותרת (`<th>`), כך שקורא מסך יכול לנווט בה.

**Mobile-first**
- העיצוב מתחיל ממסך צר ומתרחב למסכים גדולים יותר.
- אזורי לחיצה גדולים, בהתאם לדרישות ה-UX.

### 2.4 Data Model

אין Database ואין אחסון מקומי (LocalStorage / IndexedDB). כל הנתונים נשמרים בזיכרון (Memory) בלבד, ונמחקים כשהאפליקציה נסגרת, בהתאם לאילוץ "ללא שמירת נתונים".

**ישויות (TypeScript types):**

```ts
type Screen = 'home' | 'learn' | 'about';

type PracticeMode = 'all' | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

type Exercise = { a: number; b: number };          // a × b, ערכים 1–10

type GameStatus = 'idle' | 'playing' | 'finished';

type Phase = 'answering' | 'showingFeedback';      // מחכים לתשובה / מציגים משוב לשנייה

type Feedback =
  | { kind: 'none' }
  | { kind: 'empty' }                               // תיבה ריקה
  | { kind: 'correct' }
  | { kind: 'wrong'; attemptsLeft: number }
  | { kind: 'revealAnswer'; answer: number };       // אחרי 3 ניסיונות שגויים

type GameState = {
  status: GameStatus;
  mode: PracticeMode;          // מצב המשחק הנוכחי. נקבע ב-startGame ולא משתנה עד סוף המשחק
  exerciseNumber: number;      // 1–10
  current: Exercise | null;    // null כשאין משחק (idle)
  previous: Exercise | null;   // למניעת חזרה מיידית
  attemptsUsed: number;        // 0–3 בתרגיל הנוכחי
  firstTryCorrect: number;     // ניקוד: 0–10
  phase: Phase;
  feedback: Feedback;
};
```

**ב-App Shell יש שלושה משתנים נפרדים:**
- `currentScreen: Screen`: המסך המוצג.
- `selectedMode: PracticeMode`: הערך שנבחר בתפריט במסך הבית. ברירת מחדל: `'all'`.
- `game: GameState`: מצב המשחק.

`selectedMode` ו-`game.mode` נפרדים בכוונה. התפריט קובע את המצב של המשחק **הבא** שיתחיל ב"התחל משחק", ו-`game.mode` הוא המצב של המשחק **הנוכחי**, שבו משתמש "שחק שוב".

### 2.5 לוגיקת המשחק

**יצירת תרגיל**
- **מצב `'all'`:** `a` ו-`b` נבחרים באקראי מ-1 עד 10.
- **מצב מספר N:** אחד הגורמים הוא N, והשני נבחר באקראי מ-1 עד 10. סדר הגורמים נקבע באקראי (בהתאם להנחה ב-PRD F2).
- **מניעת חזרה מיידית:** אם התרגיל שנוצר זהה לתרגיל הקודם, נוצר תרגיל חדש. ב-PRD לא הוגדר האם 3×7 ו-7×3 הם אותו תרגיל. ההחלטה הטכנית: תרגיל זהה הוא תרגיל עם אותם גורמים באותו סדר.

**מעברי מצב (State Machine)**

```
idle     ──("התחל משחק", או כניסה ללשונית "לימוד")──► playing  (במצב selectedMode)
playing  ──(תרגיל 10 הסתיים)──────────────────────► finished
finished ──("שחק שוב")──────────────────────────────► playing  (באותו מצב: game.mode)
finished ──("התחל משחק" במסך הבית)──────────────────► playing  (במצב selectedMode)
```

- **`idle`:** אין משחק. התפריט ולחצן "התחל משחק" במסך הבית פעילים.
- **`playing`:** התפריט ולחצן "התחל משחק" מושבתים (PRD F1). אי אפשר להחליף מצב באמצע משחק.
- **`finished`:** מוצג סיכום. התפריט ולחצן "התחל משחק" פעילים שוב.
- `startGame(mode)` מאפס את המשחק: תרגיל 1, ניקוד 0, 0 ניסיונות, ותרגיל ראשון חדש במצב `mode`.

**בדיקת תשובה ומשוב**

כל משוב (חוץ מבקשה להקליד תשובה) מוצג **שנייה אחת**, ורק אחריה מוצג התרגיל הבא, או אותו תרגיל לניסיון נוסף.

1. **תשובה ריקה:** `feedback = empty`. המשחק נשאר ב-`answering`, ומונה הניסיונות לא משתנה. ההודעה נשארת עד שהילד שולח תשובה.
2. **אחרת:** `attemptsUsed` עולה ב-1, והמשחק עובר ל-`phase = showingFeedback`:
   - **תשובה נכונה:** `feedback = correct`. אם זה הניסיון הראשון, `firstTryCorrect` עולה ב-1.
   - **תשובה שגויה, ופחות מ-3 ניסיונות:** `feedback = wrong`.
   - **תשובה שגויה בניסיון השלישי:** `feedback = revealAnswer`, עם התשובה הנכונה.
3. **אחרי שנייה** ה-App Shell שולח `feedbackDone`, וה-Reducer מחזיר את המשחק ל-`answering` עם `feedback = none`:
   - **אחרי `correct` או `revealAnswer`:** מעבר לתרגיל הבא, עם 0 ניסיונות. אחרי תרגיל 10, המשחק עובר ל-`finished`.
   - **אחרי `wrong`:** אותו תרגיל נשאר, והתיבה מתרוקנת לניסיון הבא.

**תזמון המשוב**
- משך ההצגה מוגדר כקבוע יחיד בקוד: `FEEDBACK_DURATION_MS = 1000`.
- **הטיימר נמצא ב-App Shell, ולא במסך הלימוד.** הוא מופעל כש-`phase` הופך ל-`showingFeedback`, ובסופו שולח `feedbackDone`.
- כך התרגיל שעליו ניתן המשוב נשאר על המסך כל זמן שהמשוב מוצג, והמעבר קורה בדיוק פעם אחת.
- **מעבר מסך בזמן הצגת משוב:** הטיימר ממשיך לרוץ גם כשמסך הלימוד לא מוצג. אם הילד יוצא וחוזר, הוא רואה את המצב העדכני: התרגיל הבא, או אותו תרגיל לניסיון נוסף.
- בזמן `showingFeedback`, לחיצות על "בדיקה" נחסמות (PRD 4ב), והתיבה במצב `readOnly` (ראו 2.3).

**בדיקות**
- כל כללי המשחק (יצירת תרגילים, מניעת חזרה, ניסיונות, ניקוד, משוב ומעברי מצב) מכוסים ב-Unit Tests עם Vitest. הלוגיקה טהורה ולכן קלה לבדיקה.
- **אקראיות שניתנת לשליטה:** פונקציות יצירת התרגילים מקבלות את פונקציית האקראיות כפרמטר (ברירת מחדל: `Math.random`). בבדיקות מעבירים פונקציה עם תוצאות קבועות, כך שהבדיקות נותנות תמיד אותה תוצאה.
- את טיימר המשוב בודקים עם הטיימרים המדומים של Vitest (`vi.useFakeTimers`).

### 2.6 APIs ואינטגרציות

אין APIs, ואין אינטגרציות עם שירותים חיצוניים. האפליקציה לא שולחת או מקבלת נתונים מלבד הורדת הקבצים הסטטיים שלה.

### 2.7 Data Flow

```
הילד מקליד תשובה ולוחץ "בדיקה"
        │
        ▼
Learn Screen ──dispatch(submitAnswer)──► Reducer ב-App Shell
                                            │
                                            ▼
                                Game Logic (בדיקה וניקוד)
                                            │
                                            ▼
                        GameState חדש: phase = showingFeedback
                                            │
                                            ▼
                        React מציג את המשוב על אותו תרגיל
                                            │
                              (שנייה אחת, טיימר ב-App Shell)
                                            ▼
App Shell ──dispatch(feedbackDone)──► Reducer ──► Game Logic (תרגיל הבא / ניסיון נוסף / סיום)
                                            │
                                            ▼
                        React מציג מחדש: תרגיל / סיכום
```

**מעבר מסך:** הסרגל התחתון מעדכן את `currentScreen`. `GameState` לא משתנה, ולכן המשחק "מושהה" וממשיך כשחוזרים.

### 2.8 Authentication, אבטחה ופרטיות

- **Authentication / Authorization:** לא נדרשים. אין משתמשים ואין הרשאות.
- **פרטיות:** האפליקציה לא אוספת מידע אישי, ואין בה Cookies, Analytics או קריאות לשירותים חיצוניים. הגופנים והתמונות נטענים מאותו אתר בלבד.
- **אבטחה:** האתר מוגש ב-HTTPS על ידי GitHub Pages. HTTPS הוא גם דרישה של דפדפנים להפעלת Service Worker. אין סודות, מפתחות API או פרטי גישה בקוד.

### 2.9 PWA ועבודה ללא אינטרנט

- **Web App Manifest** (נוצר על ידי vite-plugin-pwa):
  - `name` / `short_name`: "רואים כפול".
  - `lang`: `he`, `dir`: `rtl`.
  - `display`: `standalone`.
  - `start_url` ו-`scope`: תואמים ל-Base Path של האתר ב-GitHub Pages (ראו 2.10).
  - אייקונים בגדלים הנדרשים להתקנה, כולל Apple Touch Icon ל-iOS.
- **Service Worker:** מצב `generateSW` של Workbox. מבצע Precache לכל קבצי ה-Build: HTML, JS, CSS, גופנים, תמונות, מסגרות SVG ואייקונים. אחרי הטעינה הראשונה, האפליקציה נטענת מהמכשיר גם בלי אינטרנט.
  - ברירת המחדל של vite-plugin-pwa שומרת רק קובצי JS, CSS ו-HTML. לכן יש להגדיר במפורש `workbox.globPatterns` שכולל גם `woff2`, `svg`, `png` ו-`webp`.
- **עדכון גרסה:** גרסה חדשה מורדת ברקע כשיש חיבור, ומופעלת **רק בפתיחה הבאה של האפליקציה**, ולא בטעינה מחדש אוטומטית. כך עדכון לא יקטע משחק פעיל וימחק אותו. ב-PRD אין הודעת "גרסה חדשה זמינה", ולכן לא תוצג הודעה כזו.

### 2.10 Hosting, Build ו-Deployment

**ניהול הקוד**
- Repository יחיד ב-GitHub, ציבורי: [`Lemore/multiply`](https://github.com/Lemore/multiply) (ראו 1.3). הענף הראשי הוא `main`.

**הגדרת Base Path**
- האתר מתפרסם כ-Project Site בכתובת `https://lemore.github.io/multiply/`.
- לכן ב-`vite.config.ts` מוגדר `base: '/multiply/'`. [מקור](https://vite.dev/guide/static-deploy.html)
- `start_url` ו-`scope` של ה-Manifest מוגדרים לאותו Base Path: `/multiply/`.

**פריסה אוטומטית**
1. ב-Repository: Settings ← Pages ← Build and deployment ← Source: **GitHub Actions**. [מקור](https://vite.dev/guide/static-deploy.html)
2. קובץ Workflow ב-`.github/workflows/deploy.yml`, המבוסס על הדוגמה הרשמית בתיעוד Vite, רץ בכל Push ל-`main`:
   - התקנת Node.js (LTS) ותלויות (`npm ci`).
   - הרצת Unit Tests. אם בדיקה נכשלת, הפריסה נעצרת.
   - Build (`npm run build`) לתיקיית `dist`.
   - העלאה ופריסה ל-GitHub Pages באמצעות `actions/upload-pages-artifact` ו-`actions/deploy-pages`.
3. כל עדכון שנדחף ל-`main` מתפרסם אוטומטית, בלי פעולה ידנית.

**סביבות**
- **Development:** הרצה מקומית עם `npm run dev`. לבדיקת התנהגות PWA ו-Offline: `npm run build` ואז `npm run preview`, כי ה-Service Worker פעיל רק ב-Build.
- **Production:** האתר ב-GitHub Pages.
- אין Database ואין סודות, ולכן אין צורך בהפרדת פרטי גישה או ב-Environment Variables בין הסביבות.

### 2.11 תמיכה בדפדפנים

- Build של Vite מכוון כברירת מחדל לגרסאות דפדפנים שמוגדרות "Baseline Widely Available". בגרסה הנוכחית מדובר בדפדפנים מאמצע 2023 בערך. [מקור](https://vite.dev/guide/) זה מכסה את הגרסאות העדכניות של Chrome ל-Android ו-Safari ל-iOS (PRD 5א). אין צורך בתמיכה בדפדפנים ישנים, ולכן לא נדרש `@vitejs/plugin-legacy`.

### 2.12 נכסים (Assets)

- **תמונות:** תמונה בנושא מתמטיקה למסך הבית (איור החתול מה-Mockups). היא נשמרת כקובץ סטטי בתיקיית `public`, ונכללת ב-Precache. את הקובץ מספק המשתמש.
- **לוח הכפל במסך האודות:** נבנה כטבלת HTML (רכיב `MultiplicationTable`), ולא כקובץ תמונה. הערכים מחושבים בקוד. כך הלוח חד בכל גודל מסך, נגיש לקוראי מסך, ולא מוסיף קובץ תמונה להורדה. העיצוב לפי DESIGN.md, בכיוון LTR.
- **גופנים:** קובצי `woff2` מחבילות Fontsource, שנארזים ב-Build (ראו 2.3).
- **מסגרות "מצוירות ביד":** קובצי SVG קטנים בתיקיית `src/assets/frames` (ראו 2.3).
- **אייקוני PWA:** נשמרים בתיקיית `public` ומוגדרים ב-Manifest.
- **גודל:** יש לשמור על תמונות דחוסות, כדי שהטעינה הראשונה והשמירה במכשיר יהיו מהירות.

---

## מקורות

- [React – Build a React app from Scratch](https://react.dev/learn/build-a-react-app-from-scratch)
- [Vite – Getting Started](https://vite.dev/guide/)
- [Vite – Deploying a Static Site (GitHub Pages)](https://vite.dev/guide/static-deploy.html)
- [vite-plugin-pwa – npm](https://npmjs.com/package/vite-plugin-pwa)
- [vite-plugin-pwa – GitHub Releases](https://github.com/vite-pwa/vite-plugin-pwa/releases)
- [GitHub Docs – GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)
- [MagicBell – PWA iOS Limitations and Safari Support](https://www.magicbell.com/blog/pwa-ios-limitations-safari-support-complete-guide)

---

## החלטות מרכזיות (ADRs)

### ADR-1: קווי המסגרת של SketchFrame נשמרים כנתונים בקובץ TypeScript
**הקשר:** סעיף 2.3 מתאר את המסגרות ה"מצוירות ביד" כקובצי SVG בתיקיית `src/assets/frames`. כדי להשתמש בקובץ SVG כרכיב React (ולצבוע אותו ב-`currentColor` עם `vector-effect`) נדרש תוסף נוסף ל-Vite, או הזרקת HTML גולמי.
**החלטה:** מחרוזות הקו (`d`) של שלוש וריאציות המסגרת נשמרות בקובץ `src/assets/frames/framePaths.ts`, והרכיב `SketchFrame` מצייר אותן ישירות כ-SVG בתוך ה-HTML (inline). המקווקו מתקבל מאותו קו עם `stroke-dasharray`.
**השלכות:** אין תלות נוספת, ו-`currentColor` ועובי קו קבוע עובדים בלי הגדרות מיוחדות. הוספת צורת מסגרת חדשה פירושה הוספת מחרוזת לקובץ, ולא קובץ SVG. הקווים נכללים בקובץ ה-JS, ולכן גם בעבודה ללא אינטרנט.
