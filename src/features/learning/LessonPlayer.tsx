import type { Lesson } from '../../content/types';
import type { Progress } from '../../domain/learning.mjs';
import { allQuestions, spotCars, units } from '../../content/index';
import { useEffect, useState } from 'react';
import { brandCourses } from '../../content/courses/lesson-builder';
import { Modal } from '../../components/ui/Modal';
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ExternalLink,
  RotateCcw,
  Target,
  Trophy,
  Volume2,
  Zap,
} from 'lucide-react';
import { BudgetActivity, LessonPageBody, MatchActivity, QuestionPicture } from './LessonActivities';
import { PhotoGallery } from '../../components/media/PhotoGallery';
import { ShapeLab } from '../practice/labs/ShapeLab';
import { CylinderLab } from '../practice/labs/CylinderLab';
import { FuelLab } from '../practice/labs/FuelLab';
import { Badge } from '../../components/branding/Badge';
import { CarShape } from '../../components/illustrations/CarShape';
import { classNames } from '../../lib/class-names';

export function LessonPlayer({
  lesson,
  progress,
  close,
  finish,
}: {
  lesson: Lesson;
  progress: Progress;
  close: () => void;
  finish: (a: { id: string; correct: boolean }[]) => void;
}) {
  const prior = allQuestions
    .filter((q) => progress.cards[q.id] && !lesson.questions.some((lq) => lq.id === q.id))
    .sort((a, b) => progress.cards[a.id].due - progress.cards[b.id].due)
    .slice(0, 2);
  const [questions] = useState(() => [...lesson.questions, ...prior]);
  const [award] = useState(() => (progress.completed.includes(lesson.id) ? 10 : 30));
  const draftKey = `autopilot:reading:${lesson.id}`;
  const [step, setStep] = useState(() => {
    try {
      const n = Number(localStorage.getItem(draftKey));
      return !progress.completed.includes(lesson.id) &&
        Number.isInteger(n) &&
        n >= 0 &&
        n < lesson.pages.length
        ? n
        : 0;
    } catch {
      return 0;
    }
  });
  const [chosen, setChosen] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState<{ id: string; correct: boolean }[]>([]);
  const [done, setDone] = useState(false);
  const [muted, setMuted] = useState(true);
  const cardCount = lesson.pages.length + (lesson.activity ? 1 : 0);
  const total = cardCount + questions.length;
  const q = questions[step - cardCount];
  const page = lesson.pages[step];
  const course = brandCourses.find((c) => c.id === lesson.trackId);
  useEffect(() => () => speechSynthesis.cancel(), []);
  useEffect(() => {
    document.querySelector('.modal')?.scrollTo({ top: 0 });
    if (step < lesson.pages.length && !done)
      try {
        localStorage.setItem(draftKey, String(step));
      } catch {}
  }, [step, draftKey, lesson.pages.length, done]);
  const next = () => {
    speechSynthesis.cancel();
    setMuted(true);
    if (step >= cardCount) {
      const nextAnswers = [...answers, { id: q.id, correct: chosen === q.answer }];
      setAnswers(nextAnswers);
      if (step === total - 1) {
        finish(nextAnswers);
        try {
          localStorage.removeItem(draftKey);
        } catch {}
        setDone(true);
        return;
      }
    }
    setChosen(null);
    setChecked(false);
    setStep((s) => s + 1);
  };
  const go = (n: number) => {
    speechSynthesis.cancel();
    setMuted(true);
    setStep(n);
  };
  const speak = () => {
    if (!muted) {
      speechSynthesis.cancel();
      setMuted(true);
      return;
    }
    const text = page
      ? [
          page.title,
          page.text,
          ...(page.paragraphs || []),
          ...(page.bullets || []),
          page.example,
        ].join('. ')
      : q
        ? `${q.prompt}. ${q.options.join('. ')}`
        : lesson.title;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-CA';
    u.rate = 0.9;
    u.onend = () => setMuted(true);
    speechSynthesis.speak(u);
    setMuted(false);
  };
  return (
    <Modal title={done ? 'Lesson complete' : lesson.title} close={close} wide>
      {done ? (
        <div className="completion">
          <div className="completion-icon">
            <Trophy size={49} />
          </div>
          <span className="eyebrow">LESSON COMPLETE</span>
          <h2>You can explain more now.</h2>
          <p>
            {lesson.trackId
              ? `Another step in your ${course?.name} course.`
              : 'Another step in your car foundations.'}
          </p>
          <div className="completion-stats">
            <span>
              <Zap size={20} />
              <b>+{award} XP</b>
              <small>earned</small>
            </span>
            <span>
              <Target size={20} />
              <b>
                {answers.filter((a) => a.correct).length}/{answers.length}
              </b>
              <small>first-try recall</small>
            </span>
          </div>
          {lesson.recap && (
            <div className="lesson-recap">
              <h3>Keep these ideas</h3>
              <ul>
                {lesson.recap.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="info-strip">
            <RotateCcw size={20} />
            <p>
              {answers.some((a) => !a.correct)
                ? 'Missed questions return in 10 minutes. Correct answers return later in spaced review.'
                : 'These questions have joined your review deck. They’ll return after a delay to help them stick.'}
            </p>
          </div>
          <button className="btn dark" onClick={close}>
            Back to your journey <ArrowRight size={17} />
          </button>
        </div>
      ) : (
        <>
          <div className="lesson-topline">
            <span>
              {course
                ? `${course.name} / ${lesson.kind}`
                : `UNIT ${lesson.unit + 1} · ${units[lesson.unit].title}`}
            </span>
            <div>
              <button
                className="icon-button"
                onClick={speak}
                aria-label={muted ? 'Read lesson aloud' : 'Stop reading'}
              >
                <Volume2 size={18} className={!muted ? 'speaking' : ''} />
              </button>
              <span>
                {Math.min(step + 1, total)} / {total}
              </span>
            </div>
          </div>
          <div className="lesson-progress">
            <span style={{ width: `${(step / total) * 100}%` }} />
          </div>
          {lesson.trackId && step < cardCount && (
            <details className="lesson-outline">
              <summary>Lesson outline · about {lesson.minutes} min</summary>
              <ol>
                {lesson.pages.map((p, i) => (
                  <li key={p.title}>
                    <button aria-current={step === i ? 'step' : undefined} onClick={() => go(i)}>
                      {p.title}
                    </button>
                  </li>
                ))}
              </ol>
              <p>
                Your reading position saves on this device. Close and return any time; the final
                quiz starts fresh.
              </p>
            </details>
          )}
          <div className="lesson-content" key={step}>
            {page ? (
              <>
                <span className="eyebrow">
                  {step === 0 ? 'GET THE IDEA' : `UNDERSTAND IT / ${step + 1}`}
                </span>
                <h2>{page.title}</h2>
                {step === 0 && lesson.outcomes && (
                  <div className="learning-outcomes">
                    <b>By the end, you’ll be able to:</b>
                    <ul>
                      {lesson.outcomes.map((x) => (
                        <li key={x}>{x}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <LessonPageBody page={page} />
                {lesson.image && step === 0 && !page.image && (
                  <PhotoGallery
                    photos={[lesson.image]}
                    note={spotCars.find((c) => c.id === lesson.image)?.note}
                  />
                )}
                {(
                  lesson.sources ||
                  (lesson.source ? [{ label: 'Official source', url: lesson.source }] : [])
                ).map((s) => (
                  <a
                    className="source-link"
                    key={s.url}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {s.label} <ExternalLink size={13} />
                  </a>
                ))}
              </>
            ) : step < cardCount ? (
              <>
                <span className="eyebrow">LEARN BY DOING</span>
                <h2>Put the idea to work.</h2>
                {lesson.activity === 'shapes' ? (
                  <ShapeLab />
                ) : lesson.activity === 'cylinders' ? (
                  <CylinderLab />
                ) : lesson.activity === 'fuel' ? (
                  <FuelLab />
                ) : lesson.activity === 'match' && lesson.match ? (
                  <MatchActivity items={lesson.match} />
                ) : lesson.activity === 'budget' ? (
                  <BudgetActivity />
                ) : (
                  <div className="badge-study">
                    {['Toyota', 'Honda', 'BMW', 'Mercedes-Benz'].map((n) => (
                      <div key={n}>
                        <Badge name={n} />
                        <b>{n}</b>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                <span className="eyebrow">
                  {step - cardCount >= lesson.questions.length
                    ? 'A QUICK LOOK BACK'
                    : 'RETRIEVE WHAT YOU LEARNED'}
                </span>
                <h2>{q.prompt}</h2>
                <QuestionPicture question={q} />
                {q.badge && (
                  <div className="quiz-art">
                    <Badge name={q.badge} size={100} />
                  </div>
                )}
                {q.shape && (
                  <div className="quiz-art">
                    <CarShape type={q.shape} />
                  </div>
                )}
                <div className="quiz-answers">
                  {q.options.map((option, i) => (
                    <button
                      key={option}
                      className={classNames(
                        'quiz-option',
                        chosen === i && 'selected',
                        checked && i === q.answer && 'correct',
                        checked && chosen === i && i !== q.answer && 'incorrect',
                      )}
                      disabled={checked}
                      onClick={() => setChosen(i)}
                    >
                      <span>{String.fromCharCode(65 + i)}</span>
                      {option}
                      {checked && i === q.answer && <Check size={19} />}
                    </button>
                  ))}
                </div>
                {checked && (
                  <div
                    className={classNames('quiz-feedback', chosen === q.answer && 'right')}
                    role="status"
                  >
                    <b>{chosen === q.answer ? 'You’ve got it.' : 'Let’s review this one.'}</b>
                    <p>{q.why}</p>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="lesson-actions">
            <div>
              {step > 0 && step < cardCount && (
                <button className="text-button" onClick={() => go(step - 1)}>
                  <ChevronLeft size={16} />
                  Previous
                </button>
              )}
              <span>
                {step < cardCount
                  ? 'No timer. Read and explore at your pace.'
                  : checked
                    ? 'Every answer is part of learning.'
                    : 'Take your time. No pressure.'}
              </span>
            </div>
            {step >= cardCount && !checked ? (
              <button
                className="btn dark"
                disabled={chosen === null}
                onClick={() => setChecked(true)}
              >
                Check answer <Check size={17} />
              </button>
            ) : (
              <button className="btn dark" onClick={next}>
                {step === total - 1
                  ? 'Finish lesson'
                  : step === cardCount - 1
                    ? 'Start quiz'
                    : 'Continue'}
                <ArrowRight size={17} />
              </button>
            )}
          </div>
        </>
      )}
    </Modal>
  );
}
