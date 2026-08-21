import test from 'node:test';
import assert from 'node:assert/strict';
import { AppState } from '../src/application/AppState.js';
import { ScheduleController } from '../src/application/ScheduleController.js';

function makeController(state, filters = {}) {
  return new ScheduleController({
    state,
    getFilterState: () => filters
  });
}

test('ScheduleController.filter owns filtered schedule state', () => {
  const state = new AppState();
  const schedules = [
    { score: 90, metrics: { daysOffCount: 2, totalGapHours: 1 } },
    { score: 70, metrics: { daysOffCount: 0, totalGapHours: 4 } }
  ];
  state.setGeneratedSchedules(schedules);

  const controller = makeController(state);
  const result = controller.filter({ daysOff: '2_off' });

  assert.deepEqual(result, [schedules[0]]);
  assert.deepEqual(state.get('filteredSchedules'), [schedules[0]]);
  assert.equal(state.get('currentScheduleIndex'), 0);
});
