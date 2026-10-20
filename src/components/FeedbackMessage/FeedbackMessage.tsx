import type { Feedback } from '../../game/types.ts';
import { strings } from '../../strings/he.ts';
import { SketchFrame } from '../SketchFrame/SketchFrame.tsx';
import { BulbIcon, CheckIcon, CrossIcon } from '../icons/Icons.tsx';
import styles from './FeedbackMessage.module.css';

type FeedbackMessageProps = {
  feedback: Feedback;
};

// Fixed-height feedback area. The live region always stays in the DOM so screen readers
// announce every new message.
export function FeedbackMessage({ feedback }: FeedbackMessageProps) {
  const { feedback: texts } = strings.learn;
  return (
    <SketchFrame variant={feedback.kind === 'none' ? 'dashed' : 'solid'} className={[styles.frame, styles[feedback.kind]].join(' ')}>
      <div className={styles.message} role="status" aria-live="polite">
        {feedback.kind === 'correct' && (
          <>
            <CheckIcon className={styles.icon} />
            <span>{texts.correct[feedback.messageIndex] ?? texts.correct[0]}</span>
          </>
        )}
        {feedback.kind === 'wrong' && (
          <>
            <CrossIcon className={styles.icon} />
            <span>{texts.wrong}</span>
          </>
        )}
        {feedback.kind === 'revealAnswer' && (
          <>
            <BulbIcon className={styles.icon} />
            <span>
              {texts.reveal} <span className={styles.number}>{feedback.answer}</span>
            </span>
          </>
        )}
      </div>
    </SketchFrame>
  );
}
