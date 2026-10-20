import { strings } from '../../strings/he.ts';
import { SketchFrame } from '../SketchFrame/SketchFrame.tsx';
import styles from './MultiplicationTable.module.css';

const NUMBERS = Array.from({ length: 10 }, (_, i) => i + 1);

// 10×10 multiplication table as a real HTML table (LTR), values computed in code.
export function MultiplicationTable() {
  return (
    <SketchFrame shape={3} className={styles.frame}>
      <table dir="ltr" className={styles.table}>
        <caption className="visually-hidden">{strings.about.tableCaption}</caption>
        <thead>
          <tr>
            <th scope="col" className={styles.corner}>
              ×
            </th>
            {NUMBERS.map((col) => (
              <th key={col} scope="col" className={styles.header}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {NUMBERS.map((row) => (
            <tr key={row}>
              <th scope="row" className={styles.header}>
                {row}
              </th>
              {NUMBERS.map((col) => (
                <td key={col} className={row === col ? styles.diagonal : undefined}>
                  {row * col}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </SketchFrame>
  );
}
