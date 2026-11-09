import { useState } from 'react';
import { glossary } from '../../content/index';
import { SectionHeading } from '../../components/layout/SectionHeading';
import { ArrowRight, BookOpen, ChevronDown, Search, X } from 'lucide-react';
import { classNames } from '../../lib/class-names';

export default function DictionaryPage() {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState<string | null>(null);
  const terms = glossary.filter((t) => t.join(' ').toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <SectionHeading
        eyebrow="REFERENCE"
        title="Car terms, explained."
        text="Clear definitions and practical examples. Search any term to get started."
      />
      <div className="search-box dictionary-search">
        <Search size={19} />
        <input
          aria-label="Search car dictionary"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Try “cylinder”, “hybrid”, or “L/100 km”…"
        />
        {q && (
          <button onClick={() => setQ('')} aria-label="Clear search">
            <X size={17} />
          </button>
        )}
      </div>
      <div className="popular-terms">
        <span>START WITH</span>
        {['Cylinder', 'Trim', 'Hybrid', 'L/100 km', 'AWD'].map((t) => (
          <button key={t} onClick={() => setQ(t)}>
            {t}
          </button>
        ))}
      </div>
      <p className="small muted">{terms.length} terms</p>
      <div className="dictionary-grid">
        {terms.map(([term, definition, example]) => (
          <button
            className={classNames('term-card', open === term && 'expanded')}
            key={term}
            onClick={() => setOpen(open === term ? null : term)}
            aria-expanded={open === term}
          >
            <div>
              <h3>{term}</h3>
              <ChevronDown size={18} />
            </div>
            <p>{definition}</p>
            {open === term && (
              <section>
                <span className="eyebrow">FOR EXAMPLE</span>
                <p>{example}</p>
              </section>
            )}
            <small>
              {open === term ? 'Close example' : 'See an example'} <ArrowRight size={12} />
            </small>
          </button>
        ))}
      </div>
      {!terms.length && (
        <div className="empty-state">
          <BookOpen size={30} />
          <h3>No term found yet</h3>
          <p>Try a shorter word, or explore a related term.</p>
          <button className="btn outline" onClick={() => setQ('')}>
            Show all terms
          </button>
        </div>
      )}
    </>
  );
}
