import type { Progress } from '../../domain/learning.mjs';
import { useEffect, useState } from 'react';
import type { Catalogue, Vehicle } from './types';
import { SectionHeading } from '../../components/layout/SectionHeading';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Bookmark,
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Globe2,
  RefreshCw,
  Search,
  ShieldCheck,
  X,
} from 'lucide-react';
import { brands, spotCars } from '../../content/index';
import { CarPhoto } from '../../components/media/CarPhoto';
import { Badge } from '../../components/branding/Badge';
import { classNames } from '../../lib/class-names';
import { Modal } from '../../components/ui/Modal';

export default function LibraryPage({
  progress,
  update,
  openCourse,
}: {
  progress: Progress;
  openCourse: (name: string) => void;
  update: (v: Progress | ((p: Progress) => Progress)) => void;
}) {
  const [catalog, setCatalog] = useState<Catalogue | null>(null);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('models');
  const [query, setQuery] = useState('');
  const [make, setMake] = useState('');
  const [year, setYear] = useState('');
  const [fuel, setFuel] = useState('');
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Vehicle[]>([]);
  const [detail, setDetail] = useState<Vehicle | null>(null);
  const [brand, setBrand] = useState<string[] | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [live, setLive] = useState(false);
  const [history, setHistory] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const refresh = async (all = history) => {
    setRefreshing(true);
    try {
      const r = await fetch('/api/catalog' + (all ? '?history=1' : ''));
      if (!r.ok) throw Error();
      const d = await r.json();
      if (!d.vehicles?.length) throw Error();
      setCatalog(d);
      setLive(true);
      setHistory(all);
      setError('');
    } catch {
      setError('Live refresh unavailable. Showing the included official snapshot.');
    } finally {
      setRefreshing(false);
    }
  };
  useEffect(() => {
    fetch('/catalog.json')
      .then((r) => {
        if (!r.ok) throw Error();
        return r.json();
      })
      .then(setCatalog)
      .catch(() => setError('The catalogue could not load. Please retry.'));
    void refresh();
  }, []);
  useEffect(() => setPage(0), [query, make, year, fuel, bookmarked]);
  const vehicles = catalog?.vehicles || [];
  const filtered = vehicles.filter(
    (v) =>
      (!query || `${v.make} ${v.model} ${v.body}`.toLowerCase().includes(query.toLowerCase())) &&
      (!make || v.make === make) &&
      (!year || String(v.year) === year) &&
      (!fuel || v.fuel === fuel) &&
      (!bookmarked ||
        progress.bookmarks.includes(
          [
            v.year,
            v.make,
            v.model,
            v.fuel,
            v.transmission,
            v.engine,
            v.cylinders,
            v.combined,
            v.kwh,
            v.range,
            v.gasCombined,
          ].join(':'),
        )),
  );
  const id = (v: Vehicle) =>
    [
      v.year,
      v.make,
      v.model,
      v.fuel,
      v.transmission,
      v.engine,
      v.cylinders,
      v.combined,
      v.kwh,
      v.range,
      v.gasCombined,
    ].join(':');
  const compare = (v: Vehicle) =>
    setSelected((prev) =>
      prev.some((s) => id(s) === id(v))
        ? prev.filter((s) => id(s) !== id(v))
        : prev.length < 2
          ? [...prev, v]
          : [prev[1], v],
    );
  return (
    <>
      <SectionHeading
        eyebrow="THE FIELD GUIDE"
        title="Explore the car library."
        text="Identify a make, find a model, and compare the exact specifications."
      >
        <span className="soft-badge">
          <ShieldCheck size={14} /> Official Canadian data
        </span>
      </SectionHeading>
      <div className="library-intro">
        {spotCars.slice(0, 3).map((c) => (
          <button
            key={c.id}
            onClick={() => {
              setQuery(c.name);
              setTab('models');
              setMake('');
              setYear('');
              setFuel('');
            }}
          >
            <CarPhoto photo={c.id} />
            <span>
              <b>{c.name}</b>
              <small>
                Explore the model family <ArrowUpRight size={12} />
              </small>
            </span>
          </button>
        ))}
      </div>
      <div className="tabs">
        <button className={tab === 'models' ? 'active' : ''} onClick={() => setTab('models')}>
          Models & specifications
        </button>
        <button className={tab === 'brands' ? 'active' : ''} onClick={() => setTab('brands')}>
          Brand passports <span>{brands.length}</span>
        </button>
      </div>
      {tab === 'brands' ? (
        <>
          <div className="search-box">
            <Search size={18} />
            <input
              aria-label="Search brands"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search a brand, country, or model…"
            />
            {query && (
              <button onClick={() => setQuery('')} aria-label="Clear search">
                <X size={16} />
              </button>
            )}
          </div>
          <div className="brand-grid">
            {brands
              .filter((b) => b.join(' ').toLowerCase().includes(query.toLowerCase()))
              .map((b) => (
                <button className="brand-card" key={b[0]} onClick={() => setBrand(b)}>
                  <Badge name={b[0]} />
                  <h3>{b[0]}</h3>
                  <span>
                    <Globe2 size={13} />
                    {b[1]}
                  </span>
                  <small>{b[3]}</small>
                  <ArrowUpRight size={17} />
                </button>
              ))}
          </div>
          <p className="small muted">
            Brand origin refers to the brand’s roots, not the assembly location or current
            ownership. Emblems are reference assets from Cardog Icons; Peugeot is shown by name.
          </p>
        </>
      ) : (
        <>
          <div className="filters">
            <div className="search-box">
              <Search size={18} />
              <input
                aria-label="Search cars"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search make, model, or vehicle class…"
              />
              {query && (
                <button onClick={() => setQuery('')} aria-label="Clear search">
                  <X size={16} />
                </button>
              )}
            </div>
            <select
              aria-label="Filter by make"
              value={make}
              onChange={(e) => setMake(e.target.value)}
            >
              <option value="">All makes</option>
              {[...new Set(vehicles.map((v) => v.make))].sort().map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
            <select
              aria-label="Filter by year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="">All years</option>
              {[...new Set(vehicles.map((v) => v.year))]
                .sort()
                .reverse()
                .map((y) => (
                  <option key={y}>{y}</option>
                ))}
            </select>
            <select
              aria-label="Filter by fuel"
              value={fuel}
              onChange={(e) => setFuel(e.target.value)}
            >
              <option value="">All fuels</option>
              {[...new Set(vehicles.map((v) => v.fuel))].sort().map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
          </div>
          <div className="results-bar">
            <span>
              {catalog ? `${filtered.length.toLocaleString()} records` : 'Loading the catalogue…'}{' '}
              <span className="muted">· exact trims and powertrains</span>
            </span>
            <button
              className={classNames('text-button', bookmarked && 'bookmark-active')}
              onClick={() => setBookmarked(!bookmarked)}
            >
              <Bookmark size={15} />
              {bookmarked ? 'Saved only' : 'Saved cars'}
            </button>
          </div>
          <div className="vehicle-grid">
            {filtered.slice(page * 18, (page + 1) * 18).map((v) => (
              <article className="vehicle-card" key={v.id}>
                <div className="vehicle-top">
                  <span className="soft-badge">
                    {v.year} · {v.fuel}
                  </span>
                  <button
                    aria-label={`Save ${v.make} ${v.model}`}
                    className={classNames(
                      'icon-button',
                      progress.bookmarks.includes(id(v)) && 'bookmark-active',
                    )}
                    onClick={() =>
                      update((p) => ({
                        ...p,
                        bookmarks: p.bookmarks.includes(id(v))
                          ? p.bookmarks.filter((b) => b !== id(v))
                          : [...p.bookmarks, id(v)],
                      }))
                    }
                  >
                    <Bookmark
                      size={17}
                      fill={progress.bookmarks.includes(id(v)) ? 'currentColor' : 'none'}
                    />
                  </button>
                </div>
                <button className="vehicle-title" onClick={() => setDetail(v)}>
                  <small>{v.make}</small>
                  <h3>{v.model}</h3>
                  <span>{v.body}</span>
                </button>
                <div className="vehicle-stats">
                  <div>
                    <small>
                      {v.fuel === 'Electric'
                        ? 'Energy use'
                        : v.fuel === 'Plug-in hybrid'
                          ? 'Gas-only combined'
                          : 'Combined fuel use'}
                    </small>
                    <b>
                      {v.kwh || v.gasCombined || v.combined || '—'}{' '}
                      <span>{v.fuel === 'Electric' ? 'kWh/100 km' : 'L/100 km'}</span>
                    </b>
                  </div>
                  <div>
                    <small>{v.fuel === 'Electric' ? 'Rated range' : 'Engine'}</small>
                    <b>
                      {v.fuel === 'Electric'
                        ? `${v.range} km`
                        : `${v.engine} L · ${v.cylinders} cyl`}
                    </b>
                  </div>
                </div>
                <div className="vehicle-actions">
                  <button className="text-button" onClick={() => setDetail(v)}>
                    See the details <ArrowUpRight size={14} />
                  </button>
                  <button
                    className={classNames(
                      'compare-button',
                      selected.some((s) => id(s) === id(v)) && 'selected',
                    )}
                    onClick={() => compare(v)}
                  >
                    {selected.some((s) => id(s) === id(v)) ? <Check size={13} /> : '+'} Compare
                  </button>
                </div>
              </article>
            ))}
          </div>
          {catalog && !filtered.length && (
            <div className="empty-state">
              <Search size={30} />
              <h3>No matching records</h3>
              <p>
                Try a broader model name or remove a filter. The catalogue does not cover every
                vehicle.
              </p>
              <button
                className="btn outline"
                onClick={() => {
                  setQuery('');
                  setMake('');
                  setYear('');
                  setFuel('');
                  setBookmarked(false);
                }}
              >
                Clear filters
              </button>
            </div>
          )}
          {filtered.length > 18 && (
            <div className="pagination">
              <button
                className="btn outline"
                disabled={page === 0}
                onClick={() => {
                  setPage(page - 1);
                  window.scrollTo(0, 400);
                }}
              >
                <ChevronLeft size={16} />
                Previous
              </button>
              <span>
                Page {page + 1} of {Math.ceil(filtered.length / 18)}
              </span>
              <button
                className="btn outline"
                disabled={(page + 1) * 18 >= filtered.length}
                onClick={() => {
                  setPage(page + 1);
                  window.scrollTo(0, 400);
                }}
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          )}
          {!history && (
            <div className="history-callout">
              <div>
                <h3>Looking for something older?</h3>
                <p>Load the government’s available Canadian records back to 1995.</p>
              </div>
              <button
                className="btn outline"
                disabled={refreshing}
                onClick={() => void refresh(true)}
              >
                {refreshing ? 'Loading…' : 'Explore 1995 onward'}
                <ArrowRight size={15} />
              </button>
            </div>
          )}
          {selected.length > 0 && (
            <div className="compare-dock">
              <span>
                <b>{selected.length}/2 selected</b>{' '}
                {selected.map((s) => `${s.make} ${s.model}`).join(' ↔ ')}
              </span>
              <button
                className="btn lime"
                disabled={selected.length < 2}
                onClick={() =>
                  document.getElementById('comparison')?.scrollIntoView({ behavior: 'smooth' })
                }
              >
                Compare <ArrowRight size={15} />
              </button>
              <button aria-label="Clear comparison" onClick={() => setSelected([])}>
                <X size={18} />
              </button>
            </div>
          )}
          {selected.length === 2 && (
            <section id="comparison" className="comparison">
              <span className="eyebrow">SIDE BY SIDE</span>
              <h2>Compare the exact records.</h2>
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Specification</th>
                      {selected.map((v) => (
                        <th key={v.id}>
                          {v.year} {v.make}
                          <br />
                          {v.model}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Vehicle class', (v: Vehicle) => v.body],
                      ['Fuel / powertrain', (v: Vehicle) => v.fuel],
                      ['Transmission code', (v: Vehicle) => v.transmission],
                      [
                        'Engine displacement',
                        (v: Vehicle) => (v.engine ? `${v.engine} L` : 'No combustion engine'),
                      ],
                      ['Cylinders', (v: Vehicle) => v.cylinders || 'None'],
                      [
                        'Gas combined',
                        (v: Vehicle) =>
                          v.combined || v.gasCombined
                            ? `${v.combined || v.gasCombined} L/100 km`
                            : 'Not applicable',
                      ],
                      [
                        'Electric consumption',
                        (v: Vehicle) => (v.kwh ? `${v.kwh} kWh/100 km` : 'Not in this record'),
                      ],
                      [
                        'Rated electric range',
                        (v: Vehicle) => (v.range ? `${v.range} km` : 'Not in this record'),
                      ],
                    ].map(([label, fn]) => (
                      <tr key={label as string}>
                        <td>{label as string}</td>
                        {selected.map((v) => (
                          <td key={v.id}>{(fn as (v: Vehicle) => string)(v)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="small muted">
                Ratings use standardized tests; real-world results vary. Gasoline and electrical
                units are different. PHEV gas-only figures describe operation after usable electric
                range is depleted.
              </p>
            </section>
          )}
        </>
      )}
      <div className="catalogue-source">
        <ShieldCheck size={19} />
        <div>
          <b>Identify makes and models.</b>
          <p>{catalog?.coverage || 'Canadian government fuel-consumption records.'}</p>
          <small>
            {live ? 'Live catalogue checked' : 'Included official snapshot'} ·{' '}
            {catalog
              ? new Intl.DateTimeFormat('en-CA', {
                  dateStyle: 'medium',
                  timeZone: 'America/Vancouver',
                }).format(new Date(catalog.checked))
              : 'Loading'}{' '}
            ·{' '}
            <a
              href="https://open.canada.ca/data/en/dataset/98f1a129-f628-4ce4-b24d-6f16bf24dd64"
              target="_blank"
              rel="noreferrer"
            >
              Natural Resources Canada ↗
            </a>
          </small>
          {error && <p className="small">{error}</p>}
        </div>
        <button className="text-button" disabled={refreshing} onClick={() => void refresh()}>
          <RefreshCw size={15} className={refreshing ? 'spinning' : ''} />
          {refreshing ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>
      {detail && (
        <Modal close={() => setDetail(null)} title={`${detail.make} ${detail.model}`}>
          <span className="eyebrow">{detail.year} · CANADIAN RECORD</span>
          <p className="modal-intro">
            This is one specific government rating record. Equipment, appearance and ratings can
            differ between trims and years.
          </p>
          <dl className="spec-list">
            {[
              ['Vehicle class', detail.body],
              ['Fuel', detail.fuel],
              ['Engine', detail.engine ? `${detail.engine} L displacement` : 'Electric motor'],
              ['Cylinders', detail.cylinders || 'No combustion cylinders'],
              ['Transmission code', detail.transmission],
              [
                'Combined gasoline rating',
                detail.combined || detail.gasCombined
                  ? `${detail.combined || detail.gasCombined} L/100 km`
                  : 'Not applicable',
              ],
              [
                'Electrical consumption',
                detail.kwh ? `${detail.kwh} kWh/100 km` : 'Not in this record',
              ],
              ['Electric range', detail.range ? `${detail.range} km rated` : 'Not in this record'],
            ].map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <p className="small muted">
            Transmission codes: A = automatic; AM = automated manual; AS = automatic with select
            shift; AV = continuously variable; M = manual. Following digits describe speeds or
            manufacturer code.
          </p>
          <a className="btn dark" href={catalog?.source} target="_blank" rel="noreferrer">
            Read the source <ExternalLink size={15} />
          </a>
        </Modal>
      )}
      {brand && (
        <Modal close={() => setBrand(null)} title={brand[0]}>
          <div className="brand-detail">
            <Badge name={brand[0]} size={110} />
            <span className="soft-badge">
              <Globe2 size={14} />
              Brand origin: {brand[1]}
            </span>
          </div>
          <button
            className="btn dark brand-course-link"
            onClick={() => {
              setBrand(null);
              openCourse(brand[0]);
            }}
          >
            Take the {brand[0]} course <BookOpen size={17} />
          </button>
          <h3>Look for this clue</h3>
          <p>
            {brand[2]}. Badge designs vary by model year. Use this reference with other recognition
            clues.
          </p>
          <h3>Names to get familiar with</h3>
          <p>{brand[3]}</p>
          <p className="small muted">
            Origin is not current ownership or assembly location. These model families may include
            historical or non-Canadian versions.
          </p>
          <button
            className="btn dark"
            onClick={() => {
              setQuery(brand[0]);
              setTab('models');
              setMake('');
              setBrand(null);
            }}
          >
            Explore available records <ArrowRight size={17} />
          </button>
        </Modal>
      )}
    </>
  );
}
