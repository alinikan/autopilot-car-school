import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  initialProgress,
  recordAnswer,
  dueCards,
  finishLesson,
  streakDays,
  validateProgress,
  today,
} from '../src/domain/learning.mjs';
test('a missed card returns in ten minutes, a correct card graduates to one then three days', () => {
  let p = initialProgress();
  p = recordAnswer(p, 'a', false, 0);
  assert.deepEqual(dueCards(p, 599999), []);
  assert.deepEqual(dueCards(p, 600000), ['a']);
  p = recordAnswer(p, 'a', true, 600000);
  assert.equal(p.cards.a.due, 87000000);
  p = recordAnswer(p, 'a', true, 87000000);
  assert.equal(p.cards.a.interval, 3);
});
test('repeat lessons do not duplicate completion or first-time XP', () => {
  let p = finishLesson(
    initialProgress(),
    'intro',
    [{ id: 'a', correct: true }],
    Date.parse('2026-11-08T22:00Z'),
  );
  p = finishLesson(p, 'intro', [], Date.parse('2026-11-08T22:01Z'));
  assert.equal(p.xp, 40);
  assert.deepEqual(p.completed, ['intro']);
  assert.equal(streakDays(p, new Date('2026-11-09T22:00Z')), 1);
  assert.equal(streakDays(p, new Date('2026-11-10T22:00Z')), 0);
});
test('BC date handles UTC rollover and daylight saving', () => {
  assert.equal(today(new Date('2026-11-09T01:00Z')), '2026-11-08');
  assert.equal(today(new Date('2026-07-02T06:59Z')), '2026-07-01');
});
test('invalid imports cannot replace progress', () => {
  assert.equal(validateProgress({ version: 1, xp: -1 }), false);
  assert.equal(validateProgress(initialProgress()), true);
  assert.equal(validateProgress({ ...initialProgress(), cards: { x: { due: 'bad' } } }), false);
});
