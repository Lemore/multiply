import { SketchFrame } from '../components/SketchFrame/SketchFrame.tsx';
import { strings } from '../strings/he.ts';
import styles from './App.module.css';

// Temporary page for Milestone 1: app name + SketchFrame showcase in several sizes.
export default function App() {
  return (
    <main className={styles.page}>
      <h1 className={styles.title}>
        {strings.appName.first} <span className={styles.accent}>{strings.appName.second}</span>
      </h1>

      <p className={styles.demoLabel}>דוגמאות מסגרת (זמני)</p>

      <SketchFrame variant="dashed" shape={2} className={styles.counter}>
        <span className={styles.label}>
          תרגיל <span className={styles.numbers}>3</span> מתוך <span className={styles.numbers}>10</span>
        </span>
      </SketchFrame>

      <SketchFrame shape={3} className={styles.input}>
        <span dir="ltr">56</span>
      </SketchFrame>

      <SketchFrame className={styles.button}>
        <span className={styles.label}>בדיקה</span>
      </SketchFrame>

      <SketchFrame shape={2} className={styles.picture}>
        <span className={styles.label}>מסגרת תמונה</span>
      </SketchFrame>
    </main>
  );
}
