import { useState } from 'react';
import { spotCars } from '../../content/index';
import { PhotoGallery } from '../../components/media/PhotoGallery';
import { classNames } from '../../lib/class-names';
import { ArrowRight, Check } from 'lucide-react';

export function SpotGame() {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<string | null>(null);
  const c = spotCars[index % spotCars.length];
  return (
    <section className="spot-game">
      <div className="section-row">
        <span className="eyebrow">
          RECOGNITION PRACTICE · {(index % spotCars.length) + 1} / {spotCars.length}
        </span>
        <span className="soft-badge">Explore at your pace</span>
      </div>
      <h2>Which model is this?</h2>
      <PhotoGallery photos={[c.id]} blind={!answer} note={answer ? c.note : undefined} />
      <div className="answer-grid">
        {spotCars
          .filter(
            (_, i) =>
              i === index % spotCars.length ||
              i === (index + 1) % spotCars.length ||
              i === (index + 2) % spotCars.length ||
              i === (index + 3) % spotCars.length,
          )
          .map((o) => (
            <button
              key={o.id}
              disabled={answer !== null}
              className={classNames(
                'answer',
                answer === o.id && (o.id === c.id ? 'correct' : 'incorrect'),
                answer !== null && o.id === c.id && 'correct',
              )}
              onClick={() => setAnswer(o.id)}
            >
              {o.name}
              {answer && o.id === c.id && <Check size={18} />}
            </button>
          ))}
      </div>
      {answer && (
        <div className="explanation">
          <b>{answer === c.id ? 'You spotted it.' : `This is a ${c.name}.`}</b>
          <p>{c.clue}</p>
          <small>{c.note}</small>
          <button
            className="btn dark"
            onClick={() => {
              setIndex(index + 1);
              setAnswer(null);
            }}
          >
            Next car <ArrowRight size={17} />
          </button>
        </div>
      )}
    </section>
  );
}
