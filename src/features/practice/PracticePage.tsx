import type { Progress } from '../../domain/learning.mjs';
import type { Question } from '../../content/types';
import { useState } from 'react';
import { allQuestions } from '../../content/index';
import { SectionHeading } from '../../components/layout/SectionHeading';
import { ViewTabs } from '../../components/ui/ViewTabs';
import { ArrowRight, RotateCcw, ShieldCheck } from 'lucide-react';
import { SpotGame } from './SpotGame';
import { BadgeGame } from './BadgeGame';
import { ShapeLab } from './labs/ShapeLab';
import { CylinderLab } from './labs/CylinderLab';
import { FuelLab } from './labs/FuelLab';

export default function PracticePage({
  progress,
  due,
  start,
}: {
  progress: Progress;
  due: number;
  start: (qs?: Question[]) => void;
}) {
  const [tab, setTab] = useState<'review' | 'spot' | 'badge' | 'lab'>('review');
  const seen = allQuestions.filter((q) => progress.cards[q.id]);
  return (
    <>
      <SectionHeading
        eyebrow="PRACTICE"
        title="Put your knowledge to work."
        text="Review earlier lessons, identify a car, or explore an interactive diagram."
      />
      <ViewTabs
        value={tab}
        onChange={(v) => setTab(v as typeof tab)}
        label="Practice activity"
        options={[
          { id: 'review', label: 'Spaced review' },
          { id: 'spot', label: 'Identify a car' },
          { id: 'badge', label: 'Badge challenge' },
          { id: 'lab', label: 'Learning labs' },
        ]}
      >
        {tab === 'review' ? (
          <div className="practice-grid">
            <section className="practice-feature">
              <span className="large-icon">
                <RotateCcw size={36} />
              </span>
              <span className="eyebrow">SPACED REVIEW</span>
              <h2>{due ? `${due} questions are due.` : 'Review what you’ve learned.'}</h2>
              <p>
                {due
                  ? 'We’ll focus on concepts that need a refresh. Mistakes are useful: they tell us what to bring back sooner.'
                  : seen.length
                    ? 'You’re up to date. You can still practice the concepts you’ve learned.'
                    : 'Complete a lesson to start building your personal review deck. Or try a beginner practice now.'}
              </p>
              <button className="btn dark" onClick={() => start()}>
                {due ? 'Review due questions' : 'Start a quick practice'}
                <ArrowRight size={18} />
              </button>
              <span className="small muted">Up to 10 questions · +10 XP per completed session</span>
            </section>
            <section className="memory-card">
              <h3>How your review works</h3>
              {[
                ['01', 'Learn it', 'Finish a lesson to add its questions.'],
                ['02', 'Recall it', 'A right answer returns in 1, 3, 7, 14, then 30 days.'],
                ['03', 'Revisit it', 'A missed answer returns in 10 minutes.'],
              ].map(([n, t, d]) => (
                <div key={n}>
                  <span>{n}</span>
                  <section>
                    <h4>{t}</h4>
                    <p>{d}</p>
                  </section>
                </div>
              ))}
              <div className="info-strip">
                <ShieldCheck size={19} />
                <p>Practice is unlimited. Missed questions return sooner.</p>
              </div>
            </section>
          </div>
        ) : tab === 'spot' ? (
          <SpotGame />
        ) : tab === 'badge' ? (
          <BadgeGame />
        ) : (
          <div className="labs-grid">
            <ShapeLab />
            <CylinderLab />
            <FuelLab />
          </div>
        )}
      </ViewTabs>
    </>
  );
}
