import { useEffect, useState } from 'react';
import type { View } from './navigation';
import { useProgress } from '../features/progress/useProgress';
import type { Lesson, Question } from '../content/types';
import { supabase } from '../lib/supabase';
import { nav } from './navigation';
import { allQuestions, lessons } from '../content/index';
import { dueCards, finishLesson, recordAnswer, streakDays, today } from '../domain/learning.mjs';
import { Toaster, toast } from 'sonner';
import { AppShell } from '../components/layout/AppShell';
import DashboardPage from '../features/dashboard/DashboardPage';
import CoursesPage from '../features/learning/CoursesPage';
import PracticePage from '../features/practice/PracticePage';
import LibraryPage from '../features/library/LibraryPage';
import { brandCourses } from '../content/courses/lesson-builder';
import DictionaryPage from '../features/dictionary/DictionaryPage';
import ProgressPage from '../features/progress/ProgressPage';
import { LessonPlayer } from '../features/learning/LessonPlayer';
import { ReviewPlayer } from '../features/practice/ReviewPlayer';
import { AccountModal } from '../features/account/AccountModal';
import { Preferences } from '../features/preferences/PreferencesModal';
import { Sources } from '../features/sources/SourcesModal';

export default function App() {
  const [courseToOpen, setCourseToOpen] = useState<string | undefined>();
  const [view, setView] = useState<View>(
    () =>
      (['today', 'learn', 'practice', 'garage', 'dictionary', 'progress'].includes(
        location.hash.slice(1),
      )
        ? location.hash.slice(1)
        : 'today') as View,
  );
  const { progress, update, user, status, ready, retry } = useProgress();
  const [account, setAccount] = useState(() => location.hash === '#account');
  const [recovery, setRecovery] = useState(false);
  const [settings, setSettings] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [review, setReview] = useState<Question[] | null>(null);
  const [sources, setSources] = useState(false);
  useEffect(() => {
    if (!supabase) return;
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setRecovery(true);
        setAccount(true);
      }
    });
    return () => data.subscription.unsubscribe();
  }, []);
  const changeView = (v: View) => {
    setView(v);
    location.hash = v;
    setMobile(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  useEffect(() => {
    const onHash = () => {
      const v = location.hash.slice(1);
      if (v === 'account') {
        setAccount(true);
        return;
      }
      if (nav.some((n) => n.id === v)) setView(v as View);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  const next = lessons.find((l) => !progress.completed.includes(l.id)) || lessons[0];
  const due = dueCards(progress)
    .map((id) => allQuestions.find((q) => q.id === id))
    .filter((q): q is Question => !!q);
  const streak = streakDays(progress);
  const startReview = (questions?: Question[]) => {
    const seen = allQuestions.filter((q) => progress.cards[q.id]);
    setReview(
      questions || (due.length ? due : seen.length ? seen : lessons[0].questions).slice(0, 10),
    );
  };
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Toaster position="bottom-right" closeButton toastOptions={{ className: 'app-toast' }} />
      <AppShell
        progress={progress}
        userEmail={user?.email}
        view={view}
        dueCount={due.length}
        streak={streak}
        mobile={mobile}
        onNavigate={changeView}
        onCloseNavigation={() => setMobile(false)}
        onToggleNavigation={() => setMobile(!mobile)}
        onOpenPreferences={() => setSettings(true)}
        onOpenAccount={() => setAccount(true)}
        onOpenSources={() => setSources(true)}
      >
        {view === 'today' && (
          <DashboardPage
            progress={progress}
            next={next}
            due={due.length}
            start={() => setLesson(next)}
            navigate={changeView}
            review={() => startReview()}
            openLesson={setLesson}
          />
        )}
        {view === 'learn' && (
          <CoursesPage progress={progress} start={setLesson} initialCourse={courseToOpen} />
        )}
        {view === 'practice' && (
          <PracticePage progress={progress} due={due.length} start={startReview} />
        )}
        {view === 'garage' && (
          <LibraryPage
            progress={progress}
            update={update}
            openCourse={(name) => {
              setCourseToOpen(brandCourses.find((c) => c.name === name)?.id);
              changeView('learn');
            }}
          />
        )}
        {view === 'dictionary' && <DictionaryPage />}
        {view === 'progress' && (
          <ProgressPage
            progress={progress}
            status={status}
            retry={retry}
            account={() => setAccount(true)}
          />
        )}
      </AppShell>
      {lesson && (
        <LessonPlayer
          lesson={lesson}
          progress={progress}
          close={() => setLesson(null)}
          finish={(answers) => {
            update((p) => finishLesson(p, lesson.id, answers, Date.now(), lesson.minutes));
            toast.success('Lesson completed', {
              description: 'Progress saved. Your next lesson is ready.',
            });
          }}
        />
      )}
      {review && (
        <ReviewPlayer
          questions={review}
          close={() => setReview(null)}
          finish={(answers) =>
            update((p) => {
              let n = p;
              for (const a of answers) n = recordAnswer(n, a.id, a.correct);
              return {
                ...n,
                xp: n.xp + 10,
                activity: [...n.activity, { date: today(), xp: 10, lesson: 'review' }],
              };
            })
          }
        />
      )}
      {account && (
        <AccountModal
          userEmail={user?.email}
          close={() => {
            setAccount(false);
            setRecovery(false);
            if (location.hash === '#account') history.replaceState(null, '', '#' + view);
          }}
          ready={ready}
          recovery={recovery}
        />
      )}
      {settings && (
        <Preferences progress={progress} update={update} close={() => setSettings(false)} />
      )}
      {sources && <Sources close={() => setSources(false)} />}
    </>
  );
}
