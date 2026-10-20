import { MultiplicationTable } from '../../components/MultiplicationTable/MultiplicationTable.tsx';
import { strings } from '../../strings/he.ts';
import styles from './AboutScreen.module.css';

export function AboutScreen() {
  const { title, howToTitle, steps } = strings.about;
  return (
    <div className={styles.screen}>
      <h1 className={styles.title}>{title}</h1>

      <MultiplicationTable />

      <section className={styles.howTo}>
        <h2 className={styles.subtitle}>{howToTitle}</h2>
        <ol className={styles.steps}>
          {steps.map((step) => (
            <li key={step.bold}>
              <strong>{step.bold}</strong>
              {step.text}
              {'sub' in step && (
                <ul className={styles.subSteps}>
                  {step.sub.map((item) => (
                    <li key={item.bold}>
                      <strong>{item.bold}</strong>
                      {item.text}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
