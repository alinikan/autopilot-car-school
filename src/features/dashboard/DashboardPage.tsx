import type { Progress } from '../../domain/learning.mjs';
import type { Lesson } from '../../content/types';
import type { View } from '../../app/navigation';
import { shiftDay, studyMinutes, today } from '../../domain/learning.mjs';
import { brandCourses, courseLessons } from '../../content/courses/lesson-builder';
import { lessons, units } from '../../content/index';
import { photoFor } from '../../content/photos/photos';
import { SectionHeading } from '../../components/layout/SectionHeading';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Clock3,
  RotateCcw,
  Target,
  Zap,
} from 'lucide-react';
import { CarPhoto } from '../../components/media/CarPhoto';
import { CarShape } from '../../components/illustrations/CarShape';
import { classNames } from '../../lib/class-names';

export default function DashboardPage({
  progress,
  next,
  due,
  start,
  navigate,
  review,
  openLesson,
}: {
  progress: Progress;
  next: Lesson;
  due: number;
  start: () => void;
  navigate: (v: View) => void;
  review: () => void;
  openLesson: (l: Lesson) => void;
}) {
  const completed = progress.completed.length;
  const doneToday = studyMinutes(progress, today());
  const unit = next.trackId
    ? {
        title: brandCourses.find((c) => c.id === next.trackId)!.name,
        subtitle: 'Manufacturer course',
      }
    : units[next.unit];
  const goalSessions = progress.dailyGoal;
  const image =
    next.image ||
    next.pages.find((p) => p.image)?.image ||
    (next.trackId ? brandCourses.find((c) => c.id === next.trackId)?.models[0]?.image : undefined);
  const reference = image ? photoFor(image) : undefined;
  return (
    <>
      <SectionHeading
        eyebrow="YOUR PERSONAL CAR SCHOOL"
        title={completed ? 'Pick up where you left off.' : 'Start with the basics.'}
        text="Build the foundations, then explore detailed brand and model courses at your own pace."
      >
        <span className="date-pill">
          {new Intl.DateTimeFormat('en-CA', {
            weekday: 'long',
            month: 'short',
            day: 'numeric',
            timeZone: 'America/Vancouver',
          }).format(new Date())}
        </span>
      </SectionHeading>
      <div className="dashboard-grid">
        <div className="dashboard-main">
          <section className="lesson-feature">
            <div className="feature-copy">
              <div className="feature-kicker">
                <span className="chapter-label">
                  {String(lessons.findIndex((l) => l.id === next.id) + 1).padStart(2, '0')} /{' '}
                  {lessons.length}
                </span>
                <span>YOUR NEXT LESSON</span>
              </div>
              <div>
                <span className="feature-unit">
                  {next.trackId ? 'COURSE' : `UNIT ${String(next.unit + 1).padStart(2, '0')}`} /{' '}
                  {unit.title}
                </span>
                <h2>{next.title}</h2>
                <p>{next.subtitle}</p>
              </div>
              <div className="feature-bottom">
                <div className="hero-meta">
                  <span>
                    <Clock3 size={15} />
                    {next.minutes} min
                  </span>
                  <span>
                    <Zap size={15} />
                    30 XP
                  </span>
                  <span>Beginner</span>
                </div>
                <button className="btn primary" onClick={start}>
                  {completed ? 'Continue lesson' : 'Start lesson'}
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
            <figure className="feature-photo">
              {image ? (
                <CarPhoto photo={image} priority />
              ) : (
                <div className="feature-illustration">
                  <CarShape />
                  <span>BUILD YOUR CAR KNOWLEDGE</span>
                </div>
              )}
              <figcaption>
                <span>IN FOCUS</span>
                <b>{reference?.label || unit.title}</b>
                <span>{image ? 'Reference photograph' : 'Beginner foundations'}</span>
              </figcaption>
            </figure>
          </section>
          <section className="route-section">
            <div className="section-row">
              <div>
                <span className="eyebrow">THE CURRICULUM</span>
                <h2>Your learning path</h2>
              </div>
              <button className="text-button" onClick={() => navigate('learn')}>
                All courses <ArrowRight size={16} />
              </button>
            </div>
            <div className="unit-preview">
              <span className="unit-number">{String(next.unit + 1).padStart(2, '0')}</span>
              <div>
                <h3>{unit.title}</h3>
                <p>{unit.subtitle}</p>
              </div>
              <span className="unit-progress">
                {
                  lessons.filter(
                    (l) =>
                      (next.trackId
                        ? l.trackId === next.trackId
                        : !l.trackId && l.unit === next.unit) && progress.completed.includes(l.id),
                  ).length
                }{' '}
                of {next.trackId ? courseLessons(next.trackId).length : 4} complete
              </span>
            </div>
            <div className="lesson-list">
              {lessons
                .filter((l) =>
                  next.trackId ? l.trackId === next.trackId : !l.trackId && l.unit === next.unit,
                )
                .map((l, i) => {
                  const done = progress.completed.includes(l.id);
                  const active = l.id === next.id;
                  return (
                    <button
                      className={classNames('lesson-row', active && 'current')}
                      key={l.id}
                      onClick={() => openLesson(l)}
                    >
                      <span
                        className={classNames(
                          'lesson-node',
                          done && 'complete',
                          active && 'current',
                        )}
                      >
                        {done ? (
                          <Check size={16} />
                        ) : active ? (
                          <ArrowRight size={16} />
                        ) : (
                          String(i + 1).padStart(2, '0')
                        )}
                      </span>
                      <span className="lesson-description">
                        <b>{l.title}</b>
                        <small>{l.kind}</small>
                      </span>
                      <span className="lesson-duration">{l.minutes} min</span>
                      {done ? (
                        <CheckCircle2 size={17} className="completion-mark" />
                      ) : (
                        <ArrowUpRight size={17} className="row-arrow" />
                      )}
                    </button>
                  );
                })}
            </div>
          </section>
          <section className="explore-row">
            <div className="section-row">
              <div>
                <span className="eyebrow">EXPLORE AT YOUR PACE</span>
                <h2>Beyond the lesson</h2>
              </div>
            </div>
            <div className="discovery-grid">
              <button
                className="discovery-card library-discovery"
                onClick={() => navigate('learn')}
              >
                <div className="discovery-visual">
                  <CarPhoto photo="civic" />
                  <span>THE FIELD GUIDE</span>
                </div>
                <div className="discovery-copy">
                  <h3>Learn the model families.</h3>
                  <p>Guided brand courses, clear comparisons and model quizzes.</p>
                  <span>
                    Explore courses <ArrowUpRight size={16} />
                  </span>
                </div>
              </button>
              <button
                className="discovery-card engineering-discovery"
                onClick={() => openLesson(lessons.find((l) => l.id === 'cylinders')!)}
              >
                <div className="discovery-visual technical-visual">
                  <span className="technical-mark">04</span>
                  <div className="technical-caption">
                    <span>ENGINE FUNDAMENTALS</span>
                    <b>CYLINDERS</b>
                    <span>INTAKE / COMPRESSION / POWER / EXHAUST</span>
                  </div>
                </div>
                <div className="discovery-copy">
                  <h3>How an engine works.</h3>
                  <p>See how cylinders turn fuel into motion, step by step.</p>
                  <span>
                    Explore the engine <ArrowUpRight size={16} />
                  </span>
                </div>
              </button>
            </div>
          </section>
        </div>
        <aside className="dashboard-aside">
          <section className="daily-card">
            <div className="section-row">
              <h3>Today’s target</h3>
              <Target size={19} />
            </div>
            <div className="daily-count">
              <b>{doneToday}</b>
              <span>
                / {goalSessions}
                <small>minutes</small>
              </span>
            </div>
            <div className="daily-progress">
              <span style={{ width: `${Math.min(doneToday / goalSessions, 1) * 100}%` }} />
            </div>
            <p>
              {doneToday >= goalSessions
                ? 'Daily target complete. Keep going if you like.'
                : `Your target is ${progress.dailyGoal} minutes. Choose a lesson at your pace.`}
            </p>
            <div className="week-dots">
              {Array.from({ length: 7 }, (_, i) => {
                const date = shiftDay(today(), i - 6);
                const active = progress.activity.some((a) => a.date === date);
                return (
                  <div key={date}>
                    <span>
                      {new Intl.DateTimeFormat('en', { weekday: 'narrow', timeZone: 'UTC' }).format(
                        new Date(date + 'T12:00Z'),
                      )}
                    </span>
                    <b className={classNames(active && 'done', i === 6 && 'today')}>
                      {active ? <Check size={12} /> : <span />}
                    </b>
                  </div>
                );
              })}
            </div>
            <small className="goal-estimate">
              Lesson minutes use course estimates; review sessions count as 5 minutes.
            </small>
          </section>
          <section className="review-card">
            <div className="section-row">
              <span className="review-icon">
                <RotateCcw size={20} />
              </span>
              <span className="review-count">{due ? String(due).padStart(2, '0') : '—'}</span>
            </div>
            <h3>{due ? 'Ready for a refresh.' : 'Build your review deck.'}</h3>
            <p>
              {due
                ? `${due} questions are due. Review what you’ve learned in a short practice session.`
                : 'Finish a lesson and its questions join your personal review schedule.'}
            </p>
            <button className="btn outline" onClick={review}>
              {due ? 'Review questions' : 'Try beginner practice'}
              <ArrowRight size={16} />
            </button>
          </section>
          <button
            className="local-card"
            onClick={() => openLesson(lessons.find((l) => l.id === 'winter')!)}
          >
            <div className="local-card-head">
              <span className="bc-label">BC</span>
              <ArrowUpRight size={17} />
            </div>
            <h3>Ready for BC roads.</h3>
            <p>Winter tires, Canadian units, and everyday ownership basics.</p>
            <span className="local-card-link">Explore local essentials</span>
          </button>
          <div className="course-overview">
            <span className="eyebrow">YOUR COURSE</span>
            <div>
              <b>
                {completed}
                <span> / {lessons.length}</span>
              </b>
              <span>lessons completed</span>
            </div>
            <div className="progress-track">
              <span style={{ width: `${(completed / lessons.length) * 100}%` }} />
            </div>
            <p>Foundations plus manufacturer courses. Learn at your own pace.</p>
          </div>
        </aside>
      </div>
    </>
  );
}
