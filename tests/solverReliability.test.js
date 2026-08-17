import assert from 'node:assert/strict';
import test from 'node:test';
import { generateSchedulesDFS } from '../src/engine/solver.worker.js';

const section = (courseKey, id, day, start, end, extra = {}) => ({
  courseKey,
  section: id,
  days: { su: [], mo: [], tu: [], we: [], th: [], [day]: [{ startMinutes: start, endMinutes: end }] },
  availableSeats: extra.availableSeats ?? 5,
  isFull: extra.isFull ?? false,
  ...extra
});

test('locked section is mandatory', () => {
  const a = section('A', '01', 'su', 480, 540);
  const a2 = section('A', '02', 'su', 600, 660);
  const b = section('B', '01', 'su', 540, 600);
  const result = generateSchedulesDFS([[a, a2], [b]], { lockedSections: [a] });
  assert.equal(result.length, 1);
  assert.equal(result[0].sections[0].section, '01');
});

test('invalid lock produces no schedule', () => {
  const a = section('A', '01', 'su', 480, 540);
  const b = section('B', '01', 'mo', 540, 600);
  const result = generateSchedulesDFS([[a], [b]], { lockedSections: [section('A', '99', 'su', 480, 540)] });
  assert.equal(result.length, 0);
});

test('excluded section is never returned', () => {
  const a = section('A', '01', 'su', 480, 540);
  const a2 = section('A', '02', 'su', 600, 660);
  const b = section('B', '01', 'mo', 540, 600);
  const result = generateSchedulesDFS([[a, a2], [b]], { excludedSections: [a] });
  assert.equal(result.length, 1);
  assert.equal(result[0].sections[0].section, '02');
});
