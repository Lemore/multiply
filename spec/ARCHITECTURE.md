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
- **GitHub Pages.** זה פתרון ה-Hosting שהועדף בהנחיות לאתר Frontend בלבד. הוא חינמי, מתחבר ישירות ל-GitHub ותומך בפריסה אוטומטית דרך GitHub Actions. תיעוד Vite כולל Workflow רשמי לכך. [מקור](https://vite.dev/guide/static-deploy.html)

### 1.3 סיכונים, מגבלות והסתייגויות

- **Repository ציבורי.** בתוכנית החינמית של GitHub, Pages זמין רק ל-Repository ציבורי. ל-Repository פרטי נדרשת תוכנית בתשלום, כמו GitHub Pro. [מקור](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits) כלומר, הקוד יהיה גלוי לכולם. זה לא מהווה בעיה, כי אין בו סודות.
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
| **App Shell** | מחזיקה את המסך הנוכחי (`home` / `learn` / `about`) ואת מצב המשחק. מציגה את המסך הפעיל ואת הסרגל התחתון. | Screens, Game Logic |
| **Screens** | שלושת המסכים: Home, Learn, About. מציגים מידע ומעבירים פעולות משתמש ל-App Shell. | Components, Game Logic (טיפוסים בלבד), Strings |
| **Components** | רכיבי UI משותפים: Bottom Nav, Mode Selector, Answer Input, Feedback Message, Game Summary. | Strings |
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
│   ├── game/                      ← Game Logic + Unit Tests
│   ├── strings/                   ← טקסטי ממשק בעברית
│   └── styles/                    ← משתנים ועיצוב גלובלי (RTL, גופנים)
├── index.html                     ← lang="he" dir="rtl"
└── vite.config.ts                 ← הגדרות Vite, base path, vite-plugin-pwa
```

### 2.3 מבנה ה-Frontend

**ניווט בין מסכים**
- ה-App Shell מחזיק משתנה `currentScreen`. לחיצה על כפתור בסרגל התחתון מעדכנת אותו.
- הסרגל התחתון מוצג תמיד ומסמן את המסך הנוכחי (F4).
- מעבר מסך לא משנה את מצב המשחק. מצב המשחק נשמר ב-App Shell, ולא במסך הלימוד עצמו, ולכן ההשהיה וההמשך (Flow 1א) מתקבלים בלי לוגיקה מיוחדת: מסך הלימוד פשוט מוצג שוב עם אותו מצב.

**ניהול מצב המשחק**
- המצב מנוהל ב-`useReducer` ב-App Shell. ה-Reducer קורא לפונקציות של שכבת Game Logic.
- כל שינוי במשחק מתבצע דרך Action מוגדר: בחירת מצב, שליחת תשובה, מעבר לתרגיל הבא, משחק חדש.
- **אין Global State Library**, כמו Redux או Zustand. מצב אחד ב-App Shell מספיק לשלושה מסכים.

**RTL ועברית**
- ב-`index.html` מוגדרים `lang="he"` ו-`dir="rtl"`.
- בעיצוב נעשה שימוש ב-CSS Logical Properties.
- הגופן הוא System Font Stack, כלומר הגופן המובנה במכשיר. כך אין טעינת גופנים חיצוניים, והאפליקציה עובדת ללא אינטרנט ואינה פונה לשרתים חיצוניים.
- תרגיל מוצג כ-"א × ב". כדי שהתרגיל לא יתהפך בתוך טקסט RTL, אזור התרגיל מוצג בכיוון LTR מבודד (`dir="ltr"`).

**תיבת התשובה**
- `inputMode="numeric"` לפתיחת מקלדת מספרית במובייל.
- סינון קלט לספרות בלבד והגבלה ל-3 תווים (PRD 4ב).
- לחיצה על לחצן הבדיקה כשהתיבה ריקה מציגה בקשה להקליד תשובה, ולא מעבירה Action של ניסיון ל-Reducer.

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

type Feedback =
  | { kind: 'none' }
  | { kind: 'empty' }                               // תיבה ריקה
  | { kind: 'correct' }
  | { kind: 'wrong'; attemptsLeft: number }
  | { kind: 'revealAnswer'; answer: number };       // אחרי 3 ניסיונות שגויים

type GameState = {
  mode: PracticeMode;          // ברירת מחדל: 'all'
  status: GameStatus;
  exerciseNumber: number;      // 1–10
  current: Exercise;
  previous: Exercise | null;   // למניעת חזרה מיידית
  attemptsUsed: number;        // 0–3 בתרגיל הנוכחי
  firstTryCorrect: number;     // ניקוד: 0–10
  feedback: Feedback;
  inputLocked: boolean;        // נעילת לחצן הבדיקה בזמן הצגת משוב
};
```

**מצב המסך** (`Screen`) **ומצב המשחק** (`GameState`) הם שני משתנים נפרדים ב-App Shell.

### 2.5 לוגיקת המשחק

**יצירת תרגיל**
- **מצב `'all'`:** `a` ו-`b` נבחרים באקראי מ-1 עד 10.
- **מצב מספר N:** אחד הגורמים הוא N, והשני נבחר באקראי מ-1 עד 10. סדר הגורמים נקבע באקראי (בהתאם להנחה ב-PRD F2).
- **מניעת חזרה מיידית:** אם התרגיל שנוצר זהה לתרגיל הקודם, נוצר תרגיל חדש. ב-PRD לא הוגדר האם 3×7 ו-7×3 הם אותו תרגיל. ההחלטה הטכנית: תרגיל זהה הוא תרגיל עם אותם גורמים באותו סדר.

**מעברי מצב (State Machine)**

```
idle ──(שליחת תשובה ראשונה, לא ריקה)──► playing
playing ──(תרגיל 10 הסתיים)──► finished
finished ──("שחק שוב")──► playing (משחק חדש, במצב שנבחר בבורר)
```

- **`idle`:** הבורר פעיל. שינוי מצב יוצר תרגיל ראשון חדש במצב שנבחר.
- **`playing`:** הבורר מושבת (PRD F2).
- **`finished`:** מוצג סיכום, והבורר פעיל שוב.

**בדיקת תשובה (בכל שליחה)**
1. תשובה ריקה: `feedback = empty`, ללא שינוי במונה הניסיונות.
2. אחרת, `attemptsUsed` עולה ב-1.
3. **תשובה נכונה:** אם זה הניסיון הראשון, `firstTryCorrect` עולה ב-1. מוצגת הודעת הצלחה, ואז מעבר לתרגיל הבא.
4. **תשובה שגויה, ופחות מ-3 ניסיונות:** מוצגת הודעת כישלון, והתיבה מתרוקנת.
5. **תשובה שגויה בניסיון השלישי:** מוצגת התשובה הנכונה, ואז מעבר לתרגיל הבא.
6. מעבר מתרגיל 10 מעביר את המשחק ל-`finished`.

**תזמון משוב**
- הודעת ההצלחה או התשובה הנכונה מוצגות לזמן קצר לפני המעבר לתרגיל הבא. ב-PRD לא הוגדר משך זמן, ולכן הוא יוגדר כקבוע יחיד בקוד, שקל לשנות.
- בזמן הצגת המשוב `inputLocked = true`, ולחיצות על לחצן הבדיקה נחסמות (PRD 4ב).
- **מעבר מסך בזמן הצגת משוב:** כדי שהמצב יישאר עקבי, החישוב של התרגיל הבא נעשה ב-Reducer מיד עם בדיקת התשובה. רק ההצגה מושהית. אם הילד עובר מסך באמצע הצגת המשוב, כשהוא חוזר הוא רואה ישירות את התרגיל הבא.

**בדיקות**
- כל כללי המשחק (יצירת תרגילים, מניעת חזרה, ניסיונות, ניקוד, מעברי מצב) מכוסים ב-Unit Tests עם Vitest. הלוגיקה טהורה ולכן קלה לבדיקה.

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
                                Game Logic (בדיקה, ניקוד, תרגיל הבא)
                                            │
                                            ▼
                                    GameState חדש בזיכרון
                                            │
                                            ▼
                        React מציג מחדש: משוב / תרגיל / סיכום
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
- **Service Worker:** מצב `generateSW` של Workbox. מבצע Precache לכל קבצי ה-Build: HTML, JS, CSS, תמונות ואייקונים. אחרי הטעינה הראשונה, האפליקציה נטענת מהמכשיר גם בלי אינטרנט.
- **עדכון גרסה:** גרסה חדשה מורדת ברקע כשיש חיבור, ומופעלת **רק בפתיחה הבאה של האפליקציה**, ולא בטעינה מחדש אוטומטית. כך עדכון לא יקטע משחק פעיל וימחק אותו. ב-PRD אין הודעת "גרסה חדשה זמינה", ולכן לא תוצג הודעה כזו.

### 2.10 Hosting, Build ו-Deployment

**ניהול הקוד**
- Repository יחיד ב-GitHub, ציבורי (ראו 1.3). הענף הראשי הוא `main`.

**הגדרת Base Path**
- אם האתר מתפרסם כ-Project Site, בכתובת `https://<USERNAME>.github.io/<REPO>/`, יש להגדיר ב-`vite.config.ts` את `base` כ-`'/<REPO>/'`. [מקור](https://vite.dev/guide/static-deploy.html)
- `start_url` ו-`scope` של ה-Manifest מוגדרים לאותו Base Path.

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

- **תמונות:** תמונה בנושא מתמטיקה (מסך הבית) ותמונה של לוח הכפל (מסך אודות). הן נשמרות כקבצים סטטיים בתיקיית `public`, ונכללות ב-Precache. מקור התמונות לא הוגדר ב-PRD, והן יסופקו בשלב העיצוב.
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
