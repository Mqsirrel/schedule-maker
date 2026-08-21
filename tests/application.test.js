import test from 'node:test';
import assert from 'node:assert/strict';
import { AppState } from '../src/application/AppState.js';
import { filterSchedules } from '../src/application/filterSchedules.js';

const schedule = (id, daysOffCount, totalGapMinutes, latestEndMinutes, earliestStartMinutes, sections = []) => ({
  id,
  metrics: {
    daysOffCount,
    totalGapMinutes,
    latestEndMinutes,
    earliestStartMinutes,
    totalGapHours: totalGapMinutes / 60
  },
  sections
});

test('filterSchedules preserves all schedules when no filters are active', () => {
  const input = [schedule('a', 0, 60, 900, 480), schedule('b', 2, 30, 800, 600)];
  assert.deepEqual(filterSchedules(input, {}), input);
  assert.notStrictEqual(filterSchedules(input, {}), input);
});

test('filterSchedules keeps the existing days-off semantics', () => {
  const input = [
    schedule('zero', 0, 0, 900, 480),
    schedule('one', 1, 0, 900, 480),
    schedule('two', 2, 0, 900, 480),
    schedule('three', 3, 0, 900, 480)
  ];

  assert.deepEqual(filterSchedules(input, { daysOff: 'any_off' }).map(s => s.id), ['one', 'two', 'three']);
  assert.deepEqual(filterSchedules(input, { daysOff: '1_off' }).map(s => s.id), ['one', 'two', 'three']);
  assert.deepEqual(filterSchedules(input, { daysOff: '2_off' }).map(s => s.id), ['two', 'three']);
  assert.deepEqual(filterSchedules(input, { daysOff: '3_off' }).map(s => s.id), ['three']);
});

test('filterSchedules searches the same Arabic-normalized fields', () => {
  const input = [schedule('match', 0, 0, 900, 480, [{
    instructor: 'أحمد',
    section: '101',
    courseName: 'شبكات الحاسب',
    courseKey: 'CS101'
  }])];

  assert.equal(filterSchedules(input, { query: 'احمد' }).length, 1);
  assert.equal(filterSchedules(input, { query: 'شبكات' }).length, 1);
  assert.equal(filterSchedules(input, { query: '101' }).length, 1);
  assert.equal(filterSchedules(input, { query: 'NOT-FOUND' }).length, 0);
});

test('filterSchedules preserves all four sort modes', () => {
  const input = [
    schedule('a', 1, 120, 900, 480),
    schedule('b', 3, 30, 700, 600),
    schedule('c', 2, 60, 800, 540)
  ];

  assert.deepEqual(filterSchedules(input, { sortBy: 'most_days_off' }).map(s => s.id), ['b', 'c', 'a']);
  assert.deepEqual(filterSchedules(input, { sortBy: 'least_gaps' }).map(s => s.id), ['b', 'c', 'a']);
  assert.deepEqual(filterSchedules(input, { sortBy: 'earliest_finish' }).map(s => s.id), ['b', 'c', 'a']);
  assert.deepEqual(filterSchedules(input, { sortBy: 'latest_start' }).map(s => s.id), ['b', 'c', 'a']);
});

test('AppState owns mutable schedule state and navigation', () => {
  const state = new AppState();
  const schedules = [schedule('a', 0, 0, 900, 480), schedule('b', 0, 0, 900, 480)];

  state.set('allGeneratedSchedules', schedules);
  state.setFilteredSchedules(schedules);
  assert.equal(state.getCurrentSchedule().id, 'a');
  assert.equal(state.navigateSchedule(1), true);
  assert.equal(state.getCurrentSchedule().id, 'b');
  assert.equal(state.navigateSchedule(1), false);

  state.set('filteredSchedules', [schedules[0]]);
  assert.equal(state.get('currentScheduleIndex'), 0);
  assert.equal(state.getCurrentSchedule().id, 'a');
});
