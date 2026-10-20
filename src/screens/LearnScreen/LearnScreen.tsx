import { useEffect, useRef, type FormEvent } from 'react';
import { AnswerInput, type AnswerState } from '../../components/AnswerInput/AnswerInput.tsx';
import { Button } from '../../components/Button/Button.tsx';
import { FeedbackMessage } from '../../components/FeedbackMessage/FeedbackMessage.tsx';
import { SketchFrame } from '../../components/SketchFrame/SketchFrame.tsx';
import { GAME_LENGTH } from '../../game/game.ts';
import type { Feedback, GameState } from '../../game/types.ts';
import { strings } from '../../strings/he.ts';
import styles from './LearnScreen.module.css';

type LearnScreenProps = {
  game: GameState;
  answer: string;
  onAnswerChange: (value: string) => void;
  onSubmit: (value: number) => void;
  // Starts a new game in the same mode from the summary.
  onPlayAgain: () => void;
  // Tighter layout while the phone keyboard is open.
  compact?: boolean;
};

function answerState(feedback: Feedback): AnswerState {
  if (feedback.kind === 'correct') return 'correct';
  if (feedback.kind === 'wrong' || feedback.kind === 'revealAnswer') return 'wrong';
  return 'default';
}

export function LearnScreen({ game, answer, onAnswerChange, onSubmit, onPlayAgain, compact = false }: LearnScreenProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isPlaying = game.status === 'playing' && game.current !== null;

  // Focus the answer box when an active game is shown, so the numeric keyboard opens.
  useEffect(() => {
    if (isPlaying) inputRef.current?.focus({ preventScroll: true });
  }, [isPlaying]);

  if (game.status === 'finished') {
    const { summary } = strings.learn;
    return (
      <div className={[styles.screen, styles.summary].join(' ')}>
        <SketchFrame variant="dashed" className={styles.counter}>
          <h1 className={styles.counterText}>{summary.title}</h1>
        </SketchFrame>

        <div className={styles.result}>
          <p className={styles.resultLabel}>{summary.correctLabel}</p>
          <p className={styles.score}>
            <span className={styles.scoreValue}>{game.firstTryCorrect}</span>{' '}
            <span className={styles.scoreOf}>{summary.of}</span> <span className={styles.scoreTotal}>{GAME_LENGTH}</span>
          </p>
        </div>

        <Button variant="secondary" onClick={onPlayAgain}>
          {summary.playAgain}
        </Button>
      </div>
    );
  }

  if (!isPlaying) return <h1 className="visually-hidden">{strings.learn.title}</h1>;

  const { a, b } = game.current!;
  const showingFeedback = game.phase === 'showingFeedback';
  const canSubmit = !showingFeedback && answer !== '';

  const submit = () => {
    if (canSubmit) onSubmit(Number(answer));
    inputRef.current?.focus({ preventScroll: true });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    submit();
  };

  return (
    <form className={[styles.screen, compact ? styles.compact : ''].join(' ')} onSubmit={handleSubmit} noValidate>
      <h1 className="visually-hidden">{strings.learn.title}</h1>

      <SketchFrame variant="dashed" className={styles.counter}>
        <p className={styles.counterText}>
          {strings.learn.counterExercise} <span className={styles.counterNumber}>{game.exerciseNumber}</span>{' '}
          {strings.learn.counterOf} <span className={styles.counterNumber}>{GAME_LENGTH}</span>
        </p>
      </SketchFrame>

      <p className={styles.exercise} dir="ltr" aria-hidden="true">
        {a} <span className={styles.times}>×</span> {b}
      </p>

      <AnswerInput
        ref={inputRef}
        value={answer}
        onChange={onAnswerChange}
        label={strings.learn.answerLabel(a, b)}
        state={answerState(game.feedback)}
        readOnly={showingFeedback}
      />

      <FeedbackMessage feedback={game.feedback} />

      {/* Feedback blocks presses silently; only an empty box shows the disabled style. */}
      <Button onClick={submit} disabled={!showingFeedback && answer === ''} keepFocus>
        {strings.learn.check}
      </Button>
    </form>
  );
}
