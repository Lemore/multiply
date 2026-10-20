# תוכנית – Milestone 5: PWA, עבודה ללא אינטרנט ובדיקה סופית

מבוסס על: `MILESTONES.md` (Milestone 5), `PRD.md` (F5, סעיף 4 כולו, 5א), `ARCHITECTURE.md` (1.2, 2.9, 2.10, 2.11, נכסים).

**מצב קיים (מ-Milestone 4):**
- כל המשחק עובד ופרוס ב-GitHub Pages. אין Manifest, אין Service Worker ואין אייקונים.
- `index.html` כבר כולל `theme-color` = `#0C422C` (Board Green).
- התמונה היחידה ב-`public` היא `images/home-cat.jpg` (קובץ **jpg**). הגופנים נארזים כ-`woff2` דרך Fontsource. מסגרות ה-SVG והאייקונים של הסרגל הם קוד TS/TSX בתוך ה-JS (ADR-1).

**מידע מהמשתמש:** תמונת המקור לאייקון היא `Favicon.jpeg` בשורש הפרויקט (2048×2048, ראש חתול כתום על רקע לוח ירוק). זה סוגר את "המידע הנדרש" של ה-Milestone.

---

## 1. מה נכנס ומה לא נכנס

**נכנס:**
- התקנת `vite-plugin-pwa` (גרסה 2.x, שתומכת ב-Vite 8) והגדרתו ב-`vite.config.ts`.
- Web App Manifest: שם, `lang`, `dir`, `display`, `start_url`, `scope`, צבעים ואייקונים.
- אייקונים בגדלים הנדרשים, Apple Touch Icon ו-Favicon, שנוצרים מ-`Favicon.jpeg`.
- Service Worker עם Precache לכל קבצי ה-Build, כולל `jpg`.
- עדכון גרסה רק בפתיחה הבאה, בלי טעינה מחדש ובלי הודעה.
- בדיקה כוללת מול PRD סעיף 4 ורשימת בדיקה למשתמש.

**לא נכנס:** כפתור "התקן" בתוך האפליקציה, הודעת "גרסה חדשה זמינה", Splash Screens מותאמים ל-iOS, שינויי מסכים או התנהגות משחק.

---

## 2. אייקונים

**גישה:** יצירה חד-פעמית של קובצי PNG מתמונת המקור בעזרת `sips` (כלי מובנה ב-macOS), ושמירתם ב-`public/icons/`. אין תלות חדשה (לא `@vite-pwa/assets-generator`). תיעוד כ-ADR-4.

| קובץ | גודל | שימוש |
|---|---|---|
| `public/icons/icon-192.png` | 192×192 | Manifest, `purpose: any` |
| `public/icons/icon-512.png` | 512×512 | Manifest, `purpose: any` |
| `public/icons/icon-512-maskable.png` | 512×512 | Manifest, `purpose: maskable` (Android) |
| `public/icons/apple-touch-icon.png` | 180×180 | iOS – מסך הבית |
| `public/icons/favicon-32.png` | 32×32 | לשונית בדפדפן |

- התמונה כבר מלאה עד הקצוות ברקע ירוק, והחתול במרכז, בתוך "האזור הבטוח" (80% הפנימיים). לכן אותה תמונה מתאימה גם ל-`maskable` בלי עיבוד נוסף. קו המסגרת המצויר בקצוות ייחתך באנדרואיד, וזה תקין.
- ב-iOS, האייקון נשאר עם פינות שהמערכת מעגלת, בלי שקיפות (התמונה כבר JPEG ללא שקיפות).
- ייצוא כ-PNG. יש לוודא שגודל כל קובץ סביר (מטרה: ה-512 מתחת ל-~150KB), כדי לשמור על Precache קטן (ARCHITECTURE 1.2 – מחיקת Cache ב-iOS).
- `Favicon.jpeg` (1.5MB) **לא** עובר ל-`public`, כדי שלא ייכנס ל-Precache. הוא נשאר בשורש כקובץ מקור.

**שינויים ב-`index.html`:**
- `<link rel="icon" type="image/png" href="/multiply/icons/favicon-32.png">` (נכתב עם `%BASE_URL%` או נתיב יחסי, כך שיעבוד עם ה-Base Path).
- `<link rel="apple-touch-icon" href=".../icons/apple-touch-icon.png">`.
- `<meta name="apple-mobile-web-app-title" content="רואים כפול">`, כדי שהשם מתחת לאייקון ב-iOS יהיה נכון.
- קישור ל-Manifest מוזרק אוטומטית על ידי התוסף.

---

## 3. הגדרת vite-plugin-pwa

ב-`vite.config.ts`, ליד `react()`:

```ts
VitePWA({
  registerType: 'prompt',      // new SW waits; activates only when the app is reopened
  injectRegister: 'auto',      // plugin adds the registration script, no app code
  includeAssets: ['icons/*.png'],
  manifest: {
    name: 'רואים כפול',
    short_name: 'רואים כפול',
    lang: 'he',
    dir: 'rtl',
    display: 'standalone',
    start_url: '/multiply/',
    scope: '/multiply/',
    theme_color: '#0C422C',
    background_color: '#0C422C',
    icons: [ /* the three manifest icons from section 2 */ ],
  },
  workbox: {
    globPatterns: ['**/*.{js,css,html,woff2,svg,png,jpg,webp}'],
  },
})
```

- `description` ב-Manifest: לא נוסף, כי אין נוסח מאושר ב-PRD. (אופציונלי, אם המשתמש ירצה – ישתמש בנוסח שהוא נותן.)
- `orientation`: לא מוגדר. ה-PRD וה-DESIGN לא מחייבים כיוון מסך.
- **גופנים:** Fontsource כולל גם קובצי `woff` ישנים. ב-Build נכנס בפועל רק מה שה-CSS מפנה אליו. יש לבדוק אחרי ה-Build שה-Precache כולל את כל קובצי `woff2` שבשימוש, ולא קבצים מיותרים. אם `woff` נכנסים לתיקיית `dist` ומנפחים את ה-Precache – להשאיר אותם מחוץ ל-`globPatterns` (כמו בהגדרה למעלה).
- **`.gitignore`:** תיקיית `dev-dist` נוצרת רק אם מפעילים PWA במצב פיתוח. לא מפעילים (`devOptions` כבוי), ולכן אין צורך. אם בכל זאת תיווצר – להוסיף שורה.

**ARCHITECTURE 2.9** מזכיר `woff2, svg, png, webp`. התמונה בפועל היא `jpg`, ולכן `jpg` נוסף לרשימה. זו התאמה טכנית בלבד, בלי שינוי דרישה – תיעוד קצר ב-ADR-5.

---

## 4. אסטרטגיית עדכון (ADR-5)

- `registerType: 'prompt'` בלי שום רכיב UI: Service Worker חדש מותקן ברקע ו"ממתין". הוא נכנס לתוקף רק כשכל החלונות של האפליקציה נסגרים ונפתחים מחדש. אין `skipWaiting`, אין `clientsClaim`, אין טעינה מחדש אוטומטית. כך משחק פעיל לא נקטע.
- **הערה למשתמש:** בטלפון, "פתיחה הבאה" פירושה סגירה מלאה של האפליקציה (החלקה ממסך האפליקציות הפתוחות) ופתיחה מחדש. לפעמים צריך לסגור ולפתוח פעמיים: בפעם הראשונה הגרסה החדשה רק מורדת, ובשנייה היא מוצגת.
- אין צורך בקוד ב-`main.tsx`. אין `virtual:pwa-register`.

---

## 5. קבצים

| קובץ | שינוי |
|---|---|
| `package.json` | הוספת `vite-plugin-pwa` ל-devDependencies (וה-peer הנדרש `workbox-build` / `workbox-window` אם npm לא מתקין אוטומטית). |
| `vite.config.ts` | הגדרת `VitePWA` לפי סעיף 3. |
| `index.html` | Favicon, Apple Touch Icon, `apple-mobile-web-app-title`. |
| `public/icons/*.png` | חמשת האייקונים מסעיף 2. |
| `src/pwa.test.ts` (חדש) | בדיקה קטנה שכל קובצי האייקונים קיימים ב-`public/icons`. בדיקות ה-PWA העיקריות נעשות ידנית על ה-Build (סעיף 6). |
| `spec/ARCHITECTURE.md` | ADR-4 (אייקונים עם `sips`), ADR-5 (עדכון בפתיחה הבאה + `jpg` ב-Precache). |
| `CLAUDE.md` – פקודות הרצה | הוספת: בדיקת PWA – `npm run build && npm run preview` (כתובת `http://localhost:4173/multiply/`). |
| `spec/MILESTONES.md` | סימון 🟡 בסיום הבנייה. |

---

## 6. בדיקה עצמית (בזמן הבנייה)

1. `npm test` עובר, `npm run build` עובר בלי שגיאות.
2. ב-`dist`: קיימים `manifest.webmanifest`, `sw.js`, `registerSW.js`, ו-`icons/`. ב-`sw.js` מופיעים בקובצי ה-Precache: `index.html`, JS, CSS, כל ה-`woff2`, `home-cat.jpg`, האייקונים.
3. `npm run preview` ופתיחה בדפדפן המובנה:
   - ב-Console: אין שגיאות. ה-Service Worker רשום ופעיל (`navigator.serviceWorker`).
   - ה-Manifest נטען, עם השם, `dir: rtl`, `start_url`/`scope` = `/multiply/` והאייקונים (בלי 404).
   - Cache Storage מכיל את כל הקבצים.
   - **Offline:** עצירת שרת ה-preview, טעינה מחדש של הדף – האפליקציה נטענת מהמטמון, הגופנים והתמונות מוצגים, ומשחק שלם (10 תרגילים, סיכום, שחק שוב) עובד.
   - **עדכון:** שינוי קטן ובנייה מחדש, באמצע משחק – המשחק לא נטען מחדש. אחרי סגירת כל הלשוניות ופתיחה מחדש – הגרסה החדשה מוצגת. (השינוי הזמני מבוטל בסוף.)
4. מעבר על רשימת PRD סעיף 4 (סעיף 7 למטה) במצב Mobile (375×812), כולל מקרי הקצה.
5. סגירת השרת בסיום.

---

## 7. רשימת בדיקה מול PRD סעיף 4 (מוצגת למשתמש בסיום)

**F1 – בית:** שם האפליקציה · תמונה · תפריט "מצב משחק" (הכול, 1–10, ברירת מחדל "הכול") · "התחל משחק" · "המשך משחק" כשהמצב זהה · "התחל משחק" במצב אחר מוחק את הקודם · אחרי סיום – שוב "התחל משחק".
**F2 – לימוד:** מונה "תרגיל X מתוך 10" · פורמט "א × ב" · מצב "הכול" ומצב מספר · אין אותו תרגיל ברצף · 10 תרגילים · הודעות הצלחה/כישלון/חשיפה בנוסח המדויק · משוב שנייה אחת · עד 3 ניסיונות · ניקוד רק בניסיון ראשון · מסך סיכום "סוף המשחק", "תשובות נכונות", "X מתוך 10" · "שחק שוב" באותו מצב.
**F3 – אודות:** לוח הכפל 10×10 · טקסט הסבר.
**F4 – סרגל:** 3 כפתורים · בכל המסכים · סימון המסך הנוכחי · השהיה והמשך מאותה נקודה.
**F5 – PWA:** התקנה · עבודה ללא אינטרנט.
**4ב – מקרי קצה:** תיבה ריקה = כפתור מושבת · ספרות בלבד · עד 3 ספרות · חסימת לחיצות בזמן משוב · כניסה ל"לימוד" לפני משחק · יציאה וחזרה · סגירת האפליקציה מוחקת את המשחק.

---

## 8. מה נשאר למשתמש (אחרי הבנייה)

- **בדיקה על טלפונים אמיתיים** (Android Chrome ו-iPhone Safari) אפשרית רק אחרי פרסום ל-GitHub Pages, כי Service Worker דורש HTTPS. לכן תנאי ה-DoD של התקנה, מצב טיסה וכתובת GitHub Pages ייבדקו אחרי **דחיפה** – שתיעשה רק באישור המשתמש. אדריך צעד אחר צעד:
  - Android: פתיחת הכתובת ב-Chrome ← תפריט ⋮ ← "התקנת אפליקציה" ← פתיחה מהאייקון.
  - iPhone: פתיחת הכתובת ב-Safari ← כפתור השיתוף ← "הוספה למסך הבית" ← פתיחה מהאייקון.
  - מצב טיסה: אחרי פתיחה אחת עם אינטרנט, הפעלת מצב טיסה, סגירה מלאה ופתיחה מחדש.
- בדיקה מקומית לפני הדחיפה: `npm run build` ו-`npm run preview` במחשב (ההתקנה עובדת גם ב-Chrome במחשב, דרך `localhost`).

---

## 9. Definition of Done – איך כל תנאי נבדק

| תנאי | נבדק על ידי |
|---|---|
| התקנה ב-Chrome Android, Standalone, אייקון ושם | Claude: Manifest תקין ב-preview. המשתמש: טלפון, אחרי פרסום. |
| הוספה למסך הבית ב-iOS עם אייקון | Claude: `apple-touch-icon` נטען. המשתמש: iPhone, אחרי פרסום. |
| עבודה במצב טיסה, כולל גופנים ותמונות | Claude: preview עם שרת כבוי. המשתמש: טלפון במצב טיסה. |
| גרסה חדשה לא קוטעת משחק, מופיעה בפתיחה הבאה | Claude: בדיקת עדכון ב-preview (סעיף 6.3). |
| כל דרישות PRD סעיף 4 נבדקו | Claude: מעבר על סעיף 7, ורשימה מוצגת למשתמש. |
| הגרסה הסופית פרוסה ונבדקה ב-GitHub Pages | אחרי דחיפה באישור המשתמש. |
