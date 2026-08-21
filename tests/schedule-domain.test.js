import test from 'node:test';
import assert from 'node:assert/strict';
import { Schedule } from '../src/domain/Schedule.js';
import { normalizeArabic, scheduleIdentity, deduplicateSchedules } from '../src/engine/scheduleUtils.js';

function schedule(id, sections, metrics = {}) {
  return { id, sections, metrics };
}

test('Schedule.from preserves the existing schedule shape', () => {
  const raw = schedule('sched_1', [{ courseKey: 'CS181', section: '01' }], { daysOffCount: 2 });
  const model = Schedule.from(raw);

  assert.deepEqual(model.sections, raw.sections);
  assert.deepEqual(model.metrics, raw.metrics);
  assert.equal(model.id, 'sched_1');
  assert.deepEqual(model.toJSON(), raw);
});

test('Schedule.from is idempotent', () => {
  const raw = schedule('sched_1', []);
  const model = Schedule.from(raw);
  assert.equal(Schedule.from(model), model);
});

test('schedule identity remains based on course and section', () => {
  const a = schedule('a', [
    { courseKey: 'CS181', section: '01' },
    { courseKey: 'MATH101', section: '02' }
  ]);
  const b = schedule('b', [
    { courseKey: 'MATH101', section: '02' },
    { courseKey: 'CS181', section: '01' }
  ]);

  assert.equal(scheduleIdentity(a), scheduleIdentity(b));
  assert.equal(deduplicateSchedules([a, b]).length, 1);
});

test('Arabic normalization keeps tolerant search behavior', () => {
  assert.equal(normalizeArabic('إختبارٌ'), 'اختبار');
  assert.equal(normalizeArabic('الرياضيات'), 'الرياضيات');
});
