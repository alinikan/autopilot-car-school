import { useState } from 'react';
import { Badge } from '../../components/branding/Badge';
import { classNames } from '../../lib/class-names';
import { ArrowRight, Check } from 'lucide-react';
import { brands } from '../../content/index';

export function BadgeGame() {
  const options = ['Toyota', 'Honda', 'Mercedes-Benz', 'Audi', 'BMW', 'Volkswagen'];
  const [i, setI] = useState(0);
  const [a, setA] = useState('');
  const correct = options[i % options.length];
  return (
    <section className="badge-game">
      <span className="eyebrow">BADGE CHALLENGE</span>
      <h2>Which make does this emblem represent?</h2>
      <div className="badge-stage">
        <Badge name={correct} size={150} />
      </div>
      <div className="answer-grid">
        {options.map((o) => (
          <button
            key={o}
            disabled={!!a}
            className={classNames(
              'answer',
              !!a && o === correct && 'correct',
              a === o && o !== correct && 'incorrect',
            )}
            onClick={() => setA(o)}
          >
            {o}
            {!!a && o === correct && <Check size={18} />}
          </button>
        ))}
      </div>
      {a && (
        <div className="explanation">
          <b>{a === correct ? 'Exactly.' : `That is ${correct}.`}</b>
          <p>
            {brands.find((b) => b[0] === correct)?.[2]}. Brand origin:{' '}
            {brands.find((b) => b[0] === correct)?.[1]}.
          </p>
          <button
            className="btn dark"
            onClick={() => {
              setA('');
              setI(i + 1);
            }}
          >
            Next badge <ArrowRight size={17} />
          </button>
        </div>
      )}
      <p className="muted small">
        Emblem references from Cardog Icons. Badge designs can vary by year and model.
      </p>
    </section>
  );
}
