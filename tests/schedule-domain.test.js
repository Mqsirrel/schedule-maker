import test from 'node:test';
import assert from 'node:assert/strict';
import { ScheduleModel } from '../src/domain/ScheduleModel.js';
import { normalizeArabic, scheduleIdentity, deduplicateSchedules } from '../src/engine/scheduleUtils.js';

function schedule(id, sections, metrics = {}) {
  return { id, sections, metrics };
}

test('ScheduleModel preserves the existing schedule shape', () => {
  const raw = schedule('sched_1', [{ courseKey: 'CS181', section: '01' }], { daysOffCount: 2 });
  const model = ScheduleModel.from(raw);

  assert.deepEqual(model.sections, raw.sections);
  assert.deepEqual(model.metrics, raw.metrics);
  assert.equal(model.id, 'sched_1');
  assert.equal(model.identity, 'CS181::01');
  assert.deepEqual(model.toJSON(), raw);
});

test('ScheduleModel.from is idempotent', () => {
  const raw = schedule('sched_1', []);
  const model = ScheduleModel.from(raw);
  assert.equal(ScheduleModel.from(model), model);
});

test('ScheduleModel keeps ranking fields mutable for compatibility', () => {
  const model = ScheduleModel.from(schedule('a', []));
  model.score = 97;
  model.rank = 1;
  assert.equal(model.score, 97);
  assert.equal(model.rank, 1);
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
  assert.equal(ScheduleModel.from(a).identity, ScheduleModel.from(b).identity);
  assert.equal(deduplicateSchedules([a, b]).length, 1);
});

test('Arabic normalization keeps tolerant search behavior', () => {
  assert.equal(normalizeArabic('إختبارٌ'), 'اختبار');
  assert.equal(normalizeArabic('الرياضيات'), 'الرياضيات');
});
