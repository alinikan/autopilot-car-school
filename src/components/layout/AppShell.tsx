import type { Progress } from '../../domain/learning.mjs';
import type { View } from '../../app/navigation';
import type { ReactNode } from 'react';
import { classNames } from '../../lib/class-names';
import { Logo } from './Logo';
import { nav } from '../../app/navigation';
import { foundationLessons } from '../../content/index';
import { ArrowUpRight, ChevronRight, Flame, MapPin, Menu, Settings2, Zap } from 'lucide-react';
import { PageTransition } from '../ui/PageTransition';

type AppShellProps = {
  progress: Progress;
  userEmail?: string;
  view: View;
  dueCount: number;
  streak: number;
  mobile: boolean;
  onNavigate: (view: View) => void;
  onCloseNavigation: () => void;
  onToggleNavigation: () => void;
  onOpenPreferences: () => void;
  onOpenAccount: () => void;
  onOpenSources: () => void;
  children: ReactNode;
};
export function AppShell({
  progress,
  userEmail,
  view,
  dueCount,
  streak,
  mobile,
  onNavigate,
  onCloseNavigation,
  onToggleNavigation,
  onOpenPreferences,
  onOpenAccount,
  onOpenSources,
  children,
}: AppShellProps) {
  return (
    <div className="app-shell">
      {mobile && (
        <button
          className="mobile-scrim"
          aria-label="Close navigation"
          onClick={() => onCloseNavigation()}
        />
      )}
      <aside className={classNames('sidebar', mobile && 'open')}>
        <Logo />
        <div className="sidebar-label">LEARN / EXPLORE</div>
        <nav>
          {nav.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={classNames('nav-link', view === id && 'active')}
              onClick={() => onNavigate(id)}
            >
              <Icon size={20} />
              {label}
              {id === 'practice' && dueCount > 0 && <span className="nav-count">{dueCount}</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-course">
            <span className="sidebar-label">BEGINNER COURSE</span>
            <div>
              <b>Car fundamentals</b>
              <span>24 lessons · 6 units</span>
            </div>
            <div className="sidebar-course-track">
              <span
                style={{
                  width: `${(foundationLessons.filter((l) => progress.completed.includes(l.id)).length / foundationLessons.length) * 100}%`,
                }}
              />
            </div>
            <small>
              {foundationLessons.filter((l) => progress.completed.includes(l.id)).length} of{' '}
              {foundationLessons.length} completed
            </small>
          </div>
          <button
            className="sidebar-footer"
            onClick={() => {
              onOpenPreferences();
              onCloseNavigation();
            }}
          >
            <Settings2 size={18} /> Learning preferences
          </button>
          <button
            className="profile"
            onClick={() => {
              onOpenAccount();
              onCloseNavigation();
            }}
          >
            <span className="avatar">{userEmail?.[0].toUpperCase() || 'A'}</span>
            <span>
              <b>{userEmail ? 'Your account' : 'Your learning space'}</b>
              <small>{userEmail ? 'Cloud progress enabled' : 'Create an account to sync'}</small>
            </span>
            <ChevronRight size={16} />
          </button>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumb">
            <button
              className="menu-toggle"
              onClick={() => onToggleNavigation()}
              aria-label="Open navigation"
              aria-expanded={mobile}
            >
              <Menu />
            </button>
            <span className="topbar-brand">AUTOPILOT / SCHOOL</span>
            <ChevronRight size={14} />
            <b>{nav.find((n) => n.id === view)?.label}</b>
          </div>
          <div className="topbar-stats">
            <span className="location">
              <MapPin size={14} /> British Columbia, CA
            </span>
            <span className="streak">
              <Flame size={18} />
              <b>{streak}</b>
              <span>day streak</span>
            </span>
            <span className="xp">
              <Zap size={17} />
              <b>{progress.xp}</b> XP
            </span>
            <button
              className="header-avatar"
              onClick={() => onOpenAccount()}
              aria-label="Open account"
            >
              {userEmail?.[0].toUpperCase() || 'A'}
            </button>
          </div>
        </header>
        <PageTransition view={view}>{children}</PageTransition>
        <footer className="page-footer">
          <span>
            <span className="footer-dot" /> Autopilot · Car knowledge, from the ground up.
          </span>
          <button onClick={() => onOpenSources()}>
            Sources & image credits <ArrowUpRight size={13} />
          </button>
        </footer>
      </div>
    </div>
  );
}
