import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  CheckCircle2,
  Clock3,
  Search,
  GraduationCap,
  Globe2,
  Flag,
} from 'lucide-react';
import {
  brandCourses,
  courseLessons,
  manufacturerLessons,
  checkedOn,
  featuredCourses,
  detailedCourses,
} from '../../content/courses/lesson-builder';
import { foundationLessons, units } from '../../content';
import type { Lesson } from '../../content';
import type { Progress } from '../../domain/learning.mjs';
import { Badge } from '../../components/branding/Badge';
import { ViewTabs } from '../../components/ui/ViewTabs';
export default function CoursesPage({
  progress,
  start,
  initialCourse,
}: {
  progress: Progress;
  start: (l: Lesson) => void;
  initialCourse?: string;
}) {
  const [tab, setTab] = useState('brands');
  const [selected, setSelected] = useState<string | null>(initialCourse || null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('popular');
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [selected]);
  const course = brandCourses.find((c) => c.id === selected);
  const list = course ? courseLessons(course.id) : [];
  const familyLessons = list.slice(1, -2).filter((l) => l.kind !== 'Workshop');
  const workshopLessons = list.filter((l) => l.kind === 'Workshop');
  const completed = (ls: Lesson[]) => ls.filter((l) => progress.completed.includes(l.id)).length;
  const row = (l: Lesson, i: number) => (
    <button key={l.id} className="path-lesson" onClick={() => start(l)}>
      <span className={`lesson-node ${progress.completed.includes(l.id) ? 'complete' : ''}`}>
        {progress.completed.includes(l.id) ? <Check size={18} /> : String(i + 1).padStart(2, '0')}
      </span>
      <span>
        <b>{l.title}</b>
        <small>{l.subtitle}</small>
      </span>
      <span className="path-time">{l.minutes} min</span>
      <ArrowRight size={17} />
    </button>
  );
  if (course)
    return (
      <div className="academy-course">
        <button className="text-button back-to-courses" onClick={() => setSelected(null)}>
          <ArrowLeft size={16} /> All manufacturer courses
        </button>
        <div className="course-masthead">
          <div className="course-brand-mark">
            <Badge name={course.name} size={96} />
          </div>
          <div>
            <span className="eyebrow">
              {course.deep ? 'DETAILED MANUFACTURER COURSE' : 'CORE MODEL COURSE'} /{' '}
              {course.country}
            </span>
            <h1>Understand {course.name}.</h1>
            <p>{course.intro}</p>
            <div className="course-metadata">
              <span>
                <BookOpen size={15} />
                {list.length} lessons
              </span>
              <span>
                <Clock3 size={15} />
                {list.reduce((s, l) => s + l.minutes, 0)} min total, at your pace
              </span>
              <span>
                <Globe2 size={15} />
                Canadian context
              </span>
            </div>
          </div>
        </div>
        <div className="course-startbar">
          <div>
            <b>
              {completed(list)} of {list.length} complete
            </b>
            <span>Every lesson is open. Take them in order or choose a family.</span>
          </div>
          <button
            className="btn dark"
            onClick={() => start(list.find((l) => !progress.completed.includes(l.id)) || list[0])}
          >
            {completed(list) ? 'Continue course' : 'Start the course'}
            <ArrowRight size={17} />
          </button>
        </div>
        <div className="course-roadmap">
          <section className="curriculum-unit">
            <div className="curriculum-head">
              <span className="unit-icon green">
                <Flag size={23} />
              </span>
              <div>
                <span className="eyebrow">01 / GET YOUR BEARINGS</span>
                <h2>The brand and its names</h2>
                <p>Start with the badge, then learn the naming system.</p>
              </div>
            </div>
            {row(list[0], 0)}
          </section>
          <section className="curriculum-unit">
            <div className="curriculum-head">
              <span className="unit-icon blue">
                <BookOpen size={23} />
              </span>
              <div>
                <span className="eyebrow">02 / FAMILY BY FAMILY</span>
                <h2>Meet the models</h2>
                <p>Each family gets a lesson, practical examples and its own quiz.</p>
              </div>
            </div>
            {familyLessons.map((l, i) => row(l, i + 1))}
          </section>
          {workshopLessons.length > 0 && (
            <section className="curriculum-unit">
              <div className="curriculum-head">
                <span className="unit-icon blue">
                  <GraduationCap size={23} />
                </span>
                <div>
                  <span className="eyebrow">03 / REAL CONVERSATIONS</span>
                  <h2>Work through the confusing parts</h2>
                  <p>Brand-specific situations, naming and mechanical choices.</p>
                </div>
              </div>
              {workshopLessons.map((l) =>
                row(
                  l,
                  list.findIndex((x) => x.id === l.id),
                ),
              )}
            </section>
          )}
          <section className="curriculum-unit">
            <div className="curriculum-head">
              <span className="unit-icon orange">
                <GraduationCap size={23} />
              </span>
              <div>
                <span className="eyebrow">
                  {workshopLessons.length ? '04' : '03'} / PUT IT TOGETHER
                </span>
                <h2>Compare, choose and remember</h2>
                <p>Matching activities, costs and decisions with a reason.</p>
              </div>
            </div>
            {list.slice(-2).map((l, i) => row(l, list.length - 2 + i))}
          </section>
        </div>
        <div className="course-source-note">
          <p>
            <b>Coverage and freshness.</b> Selected current and recognition families, not every
            model worldwide. Current, outgoing and used-car examples are labelled in the lessons.
            Price snapshots keep their year and exclusions; a live configurator supplies a current
            quote.
          </p>
          <a href={course.source} target="_blank" rel="noreferrer">
            Official {course.name} range <ArrowUpRight size={14} />
          </a>
          <small>
            Editorial snapshot checked {checkedOn}. Lessons are curated; the live fuel-data library
            updates separately.
          </small>
        </div>
      </div>
    );
  const visible = brandCourses.filter(
    (c) =>
      (filter === 'all' ||
        (filter === 'popular' ? c.popular : filter === 'deep' ? c.deep : !c.deep)) &&
      [c.name, c.country, ...c.models.map((m) => m.name)]
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  return (
    <>
      <div className="section-heading">
        <div>
          <span className="eyebrow">YOUR CAR SCHOOL</span>
          <h1>Learn the cars. Understand the differences.</h1>
          <p>Start from zero, then go deeper with guided manufacturer courses.</p>
        </div>
      </div>
      <ViewTabs
        value={tab}
        onChange={setTab}
        options={[
          { id: 'brands', label: 'Manufacturer courses' },
          { id: 'foundations', label: 'Car fundamentals' },
        ]}
        label="Choose curriculum"
      >
        {tab === 'brands' ? (
          <>
            <div className="academy-intro">
              <div>
                <span className="eyebrow">FROM BADGE TO CONFIDENT CONVERSATION</span>
                <h2>One brand. A complete learning path.</h2>
                <p>
                  Learn its model families, translate the badges, compare real needs, and practise
                  what you remember. Lessons take as long as the subject needs.
                </p>
              </div>
              <div className="academy-totals">
                <span>
                  <b>{brandCourses.length}</b>brands
                </span>
                <span>
                  <b>{manufacturerLessons.length}</b>lessons
                </span>
                <span>
                  <b>{brandCourses.reduce((s, c) => s + c.models.length, 0)}</b>family guides
                </span>
              </div>
            </div>
            <div className="school-selection-note">
              <p>
                Detailed tracks for {detailedCourses.length} brands familiar on Canadian roads,
                including Tesla, Toyota, Honda, Hyundai and Ford. Older road-recognition examples
                are labelled in the lessons.
              </p>
              <a
                href="https://canadianautodealer.ca/2026/01/f-series-stays-on-top-as-2025-model-race-reshuffles/"
                target="_blank"
                rel="noreferrer"
              >
                Canadian market context <ArrowUpRight size={13} />
              </a>
            </div>
            <div className="section-row academy-feature-label">
              <h2>Start with familiar street cars</h2>
              <span>{detailedCourses.length} DETAILED COURSES</span>
            </div>
            <div className="featured-courses">
              {featuredCourses.map((c) => {
                const ls = courseLessons(c.id);
                return (
                  <button className="featured-course" key={c.id} onClick={() => setSelected(c.id)}>
                    <div className="featured-course-top">
                      <Badge name={c.name} size={60} />
                      <span className="course-count">{ls.length} lessons</span>
                    </div>
                    <span className="eyebrow">{c.country} / DEEP DIVE</span>
                    <h3>{c.name}</h3>
                    <p>
                      {c.models
                        .filter((m) => c.id !== 'tesla' || m.id !== 'models')
                        .slice(0, 4)
                        .map((m) => m.name)
                        .join(' · ')}
                      <br />
                      Models, mechanical choices and fair comparisons.
                    </p>
                    <div className="progress-track">
                      <span style={{ width: `${(completed(ls) / ls.length) * 100}%` }} />
                    </div>
                    <div className="featured-course-bottom">
                      <span>
                        {completed(ls)} of {ls.length} complete
                      </span>
                      <ArrowRight size={18} />
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="section-row all-courses-heading">
              <div>
                <span className="eyebrow">EXPLORE THE SCHOOL</span>
                <h2>All manufacturer courses</h2>
              </div>
              <span className="muted">Your completed lessons stay saved.</span>
            </div>
            <div className="academy-tools">
              <label className="search-box">
                <Search size={18} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search a brand or model…"
                  aria-label="Search manufacturer courses"
                />
              </label>
              <select
                aria-label="Course depth"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="popular">Everyday & popular brands</option>
                <option value="all">All courses</option>
                <option value="deep">Detailed courses</option>
                <option value="core">Core model courses</option>
              </select>
            </div>
            <div className="course-grid">
              {visible.map((c) => {
                const ls = courseLessons(c.id);
                return (
                  <button className="course-card" key={c.id} onClick={() => setSelected(c.id)}>
                    <div className="course-card-head">
                      <Badge name={c.name} size={42} />
                      <span className="soft-badge">{c.deep ? 'Detailed' : 'Core models'}</span>
                    </div>
                    <h3>{c.name}</h3>
                    <small>
                      {c.country} · {ls.length} lessons
                    </small>
                    <p>{c.models.map((m) => m.name).join(' · ')}</p>
                    <div>
                      <span>
                        {completed(ls) ? `${completed(ls)} complete` : 'Beginner friendly'}
                      </span>
                      <ArrowUpRight size={17} />
                    </div>
                  </button>
                );
              })}
            </div>
            {!visible.length && (
              <div className="empty-state">
                <Search />
                <h3>No course matches that search.</h3>
                <button
                  className="text-button"
                  onClick={() => {
                    setSearch('');
                    setFilter('all');
                  }}
                >
                  Show all courses
                </button>
              </div>
            )}
            <div className="info-strip">
              <BookOpen size={22} />
              <p>
                Detailed courses teach the model families, mechanical choices and trade-offs of
                familiar Canadian-road brands. The selection includes current and labelled older
                examples; it is an editorial learning order, not a BC street-frequency ranking.
                Every model guide has labelled reference photography. Dated Canadian price coverage
                varies by family.
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="foundation-intro">
              <h2>Build your foundations.</h2>
              <p>
                Six units introduce shapes, badges, engines, fuel, comparisons and Canadian
                ownership. No previous knowledge needed.
              </p>
            </div>
            <div className="path-summary">
              <div>
                <CheckCircle2 size={21} />
                <b>
                  {completed(foundationLessons)} of {foundationLessons.length} lessons complete
                </b>
              </div>
              <div className="progress-track">
                <span
                  style={{
                    width: `${(completed(foundationLessons) / foundationLessons.length) * 100}%`,
                  }}
                />
              </div>
              <span>
                {Math.round((completed(foundationLessons) / foundationLessons.length) * 100)}%
              </span>
            </div>
            <div className="curriculum">
              {units.map((u, i) => (
                <section className="curriculum-unit" key={u.title}>
                  <div className="curriculum-head">
                    <span className={`unit-icon ${u.colour}`}>
                      <BookOpen size={25} />
                    </span>
                    <div>
                      <span className="eyebrow">UNIT {i + 1}</span>
                      <h2>{u.title}</h2>
                      <p>{u.subtitle}</p>
                    </div>
                    <span className="soft-badge">
                      {completed(foundationLessons.filter((l) => l.unit === i))} /{' '}
                      {foundationLessons.filter((l) => l.unit === i).length} complete
                    </span>
                  </div>
                  {foundationLessons.filter((l) => l.unit === i).map(row)}
                </section>
              ))}
            </div>
          </>
        )}
      </ViewTabs>
    </>
  );
}
