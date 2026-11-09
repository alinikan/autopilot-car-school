import type { Question } from '../../content/types';
import { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { ArrowRight, Check, CheckCircle2 } from 'lucide-react';
import { QuestionPicture } from '../learning/LessonActivities';
import { Badge } from '../../components/branding/Badge';
import { classNames } from '../../lib/class-names';

export function ReviewPlayer({
  questions,
  close,
  finish,
}: {
  questions: Question[];
  close: () => void;
  finish: (a: { id: string; correct: boolean }[]) => void;
}) {
  const [i, setI] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState<{ id: string; correct: boolean }[]>([]);
  const [done, setDone] = useState(false);
  const q = questions[i];
  if (!q) return null;
  const next = () => {
    const a = [...answers, { id: q.id, correct: choice === q.answer }];
    setAnswers(a);
    if (i === questions.length - 1) {
      finish(a);
      setDone(true);
    } else {
      setI(i + 1);
      setChoice(null);
      setChecked(false);
    }
  };
  return (
    <Modal title={done ? 'Review complete' : 'Make it stick'} close={close} wide>
      {done ? (
        <div className="completion">
          <div className="completion-icon">
            <CheckCircle2 size={49} />
          </div>
          <span className="eyebrow">MEMORY, STRENGTHENED</span>
          <h2>Review complete.</h2>
          <p>
            {answers.filter((a) => a.correct).length} of {answers.length} recalled correctly. +10 XP
            earned.
          </p>
          <p>Correct answers move farther out. Missed questions return in 10 minutes.</p>
          <button className="btn dark" onClick={close}>
            Done for now <Check size={17} />
          </button>
        </div>
      ) : (
        <>
          <div className="lesson-topline">
            <span>RECALL PRACTICE</span>
            <span>
              {i + 1} / {questions.length}
            </span>
          </div>
          <div className="lesson-progress">
            <span style={{ width: `${(i / questions.length) * 100}%` }} />
          </div>
          <div className="lesson-content">
            <span className="eyebrow">YOU’VE SEEN THIS IDEA BEFORE</span>
            <h2>{q.prompt}</h2>
            <QuestionPicture question={q} />
            {q.badge && (
              <div className="quiz-art">
                <Badge name={q.badge} size={100} />
              </div>
            )}
            <div className="quiz-answers">
              {q.options.map((o, n) => (
                <button
                  key={o}
                  disabled={checked}
                  className={classNames(
                    'quiz-option',
                    choice === n && 'selected',
                    checked && n === q.answer && 'correct',
                    checked && choice === n && n !== q.answer && 'incorrect',
                  )}
                  onClick={() => setChoice(n)}
                >
                  <span>{String.fromCharCode(65 + n)}</span>
                  {o}
                </button>
              ))}
            </div>
            {checked && (
              <div className="quiz-feedback" role="status">
                <b>{choice === q.answer ? 'Exactly.' : 'Let’s reinforce that.'}</b>
                <p>{q.why}</p>
              </div>
            )}
          </div>
          <div className="lesson-actions">
            <span>Recall is how knowledge sticks.</span>
            <button
              className="btn dark"
              disabled={!checked && choice === null}
              onClick={() => (checked ? next() : setChecked(true))}
            >
              {checked
                ? i === questions.length - 1
                  ? 'Finish review'
                  : 'Next question'
                : 'Check answer'}
              <ArrowRight size={17} />
            </button>
          </div>
        </>
      )}
    </Modal>
  );
}
