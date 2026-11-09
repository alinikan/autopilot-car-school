export const initialProgress = () => ({
  version: 1,
  xp: 0,
  completed: [],
  cards: {},
  activity: [],
  dailyGoal: 5,
  bookmarks: [],
});
export const today = (date = new Date()) =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Vancouver',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
export function dueCards(progress, now = Date.now()) {
  return Object.entries(progress.cards)
    .filter(([, c]) => c.due <= now)
    .map(([id]) => id);
}
export function recordAnswer(progress, id, correct, now = Date.now()) {
  const previous = progress.cards[id] || { interval: 0, streak: 0, lapses: 0 };
  const streak = correct ? previous.streak + 1 : 0;
  const interval = correct ? [1, 3, 7, 14, 30][Math.min(streak - 1, 4)] : 0;
  return {
    ...progress,
    cards: {
      ...progress.cards,
      [id]: {
        interval,
        streak,
        lapses: previous.lapses + (correct ? 0 : 1),
        due: now + (correct ? interval * 86400000 : 600000),
        last: now,
      },
    },
  };
}
export function finishLesson(progress, id, answers, now = Date.now(), minutes = 5) {
  let next = { ...progress };
  for (const a of answers) next = recordAnswer(next, a.id, a.correct, now);
  const first = !next.completed.includes(id);
  const date = today(new Date(now));
  const amount = first ? 30 : 10;
  return {
    ...next,
    xp: next.xp + amount,
    completed: first ? [...next.completed, id] : next.completed,
    activity: [
      ...next.activity,
      {
        date,
        xp: amount,
        lesson: id,
        minutes: Number.isFinite(minutes) ? Math.max(1, Math.round(minutes)) : 5,
      },
    ],
  };
}
export function streakDays(progress, now = new Date()) {
  const dates = new Set(progress.activity.map((a) => a.date));
  let day = today(now),
    count = 0;
  // Yesterday still counts until today's session is finished.
  if (!dates.has(day)) day = shiftDay(day, -1);
  while (dates.has(day)) {
    count++;
    day = shiftDay(day, -1);
  }
  return count;
}
export function shiftDay(day, delta) {
  const d = new Date(day + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() + delta);
  return d.toISOString().slice(0, 10);
}
export function validateProgress(p) {
  return (
    !!p &&
    p.version === 1 &&
    Number.isFinite(p.xp) &&
    p.xp >= 0 &&
    Array.isArray(p.completed) &&
    p.completed.every((x) => typeof x === 'string') &&
    p.cards &&
    typeof p.cards === 'object' &&
    !Array.isArray(p.cards) &&
    Object.values(p.cards).every(
      (c) => c && Number.isFinite(c.due) && Number.isFinite(c.streak) && Number.isFinite(c.lapses),
    ) &&
    Array.isArray(p.activity) &&
    p.activity.every(
      (a) =>
        typeof a.date === 'string' &&
        Number.isFinite(a.xp) &&
        (a.minutes === undefined || (Number.isFinite(a.minutes) && a.minutes >= 0)),
    ) &&
    [5, 10, 15].includes(p.dailyGoal) &&
    Array.isArray(p.bookmarks)
  );
}

export function studyMinutes(progress, date) {
  return progress.activity
    .filter((a) => !date || a.date === date)
    .reduce((sum, a) => sum + (a.minutes ?? 5), 0);
}
