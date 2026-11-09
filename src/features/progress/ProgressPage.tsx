import type { Progress } from '../../domain/learning.mjs';
import { SectionHeading } from '../../components/layout/SectionHeading';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Flame,
  LockKeyhole,
  ShieldCheck,
  Star,
  Trophy,
  Zap,
} from 'lucide-react';
import { streakDays } from '../../domain/learning.mjs';
import type { LucideIcon } from 'lucide-react';
import { Suspense, lazy } from 'react';
import { foundationLessons, lessons, units } from '../../content/index';
import { classNames } from '../../lib/class-names';
import { brandCourses, courseLessons } from '../../content/courses/lesson-builder';

const ActivityChart = lazy(() => import('./ActivityChart'));
export default function ProgressPage({
  progress,
  status,
  retry,
  account,
}: {
  progress: Progress;
  status: string;
  retry: () => void;
  account: () => void;
}) {
  const level = Math.floor(progress.xp / 150) + 1;
  const days = new Set(progress.activity.map((a) => a.date)).size;
  return (
    <>
      <SectionHeading
        eyebrow="YOUR PROGRESS"
        title="Your learning, in view."
        text="Track completed lessons, activity, and the concepts you’re building on."
      />
      <div className="stat-grid">
        {[
          [Flame, streakDays(progress), 'day streak'],
          [Zap, progress.xp, 'total XP'],
          [CheckCircle2, progress.completed.length, 'lessons complete'],
          [Trophy, level, 'explorer level'],
        ].map(([Icon, value, label]) => {
          const I = Icon as LucideIcon;
          return (
            <div className="stat-card" key={String(label)}>
              <I size={23} />
              <b>{String(value)}</b>
              <span>{String(label)}</span>
            </div>
          );
        })}
      </div>
      <Suspense fallback={<div className="chart-loading">Loading learning activity…</div>}>
        <ActivityChart progress={progress} />
      </Suspense>
      <div className="progress-columns">
        <section className="progress-panel">
          <div className="section-row">
            <h2>Your learning map</h2>
            <span className="soft-badge">
              {progress.completed.length}/{lessons.length}
            </span>
          </div>
          {units.map((u, i) => {
            const count = foundationLessons.filter(
              (l) => l.unit === i && progress.completed.includes(l.id),
            ).length;
            return (
              <div className="unit-stat" key={u.title}>
                <div>
                  <b>{u.title}</b>
                  <span>{count}/4</span>
                </div>
                <div className="progress-track">
                  <span style={{ width: `${(count / 4) * 100}%` }} />
                </div>
              </div>
            );
          })}
        </section>
        <section className="progress-panel">
          <h2>Milestones worth noticing</h2>
          {[
            [progress.completed.length >= 1, 'First ignition', 'Finish your first lesson'],
            [days >= 3, 'Building a habit', 'Learn on three different days'],
            [progress.completed.length >= 4, 'Foundations first', 'Complete four lessons'],
            [progress.xp >= 300, 'Finding your rhythm', 'Earn 300 XP'],
            [
              foundationLessons.every((l) => progress.completed.includes(l.id)),
              'Full circle',
              'Finish the full starter course',
            ],
          ].map(([unlocked, title, text]) => (
            <div className={classNames('milestone', !!unlocked && 'unlocked')} key={String(title)}>
              <span>{unlocked ? <Star size={21} /> : <LockKeyhole size={20} />}</span>
              <div>
                <b>{String(title)}</b>
                <small>{String(text)}</small>
              </div>
              {!!unlocked && <Check size={17} />}
            </div>
          ))}
        </section>
      </div>
      <section className="progress-panel brand-progress-panel">
        <h2>Manufacturer courses</h2>
        <div className="brand-progress-grid">
          {brandCourses.map((c) => {
            const ls = courseLessons(c.id);
            const n = ls.filter((l) => progress.completed.includes(l.id)).length;
            return (
              <div className="unit-stat" key={c.id}>
                <div>
                  <b>{c.name}</b>
                  <span>
                    {n}/{ls.length}
                  </span>
                </div>
                <div className="progress-track">
                  <span style={{ width: `${(n / ls.length) * 100}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <div className="sync-panel">
        <ShieldCheck size={24} />
        <div>
          <h3>{status}</h3>
          <p>
            Accounts sync your learning state with Supabase. Export a backup any time in learning
            preferences.
          </p>
        </div>
        <button className="btn outline" onClick={status.includes('unavailable') ? retry : account}>
          {status.includes('unavailable') ? 'Retry sync' : 'Manage account'}
          <ArrowRight size={15} />
        </button>
      </div>
    </>
  );
}
