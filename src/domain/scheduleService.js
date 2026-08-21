import { ScheduleSolver } from '../engine/solver.js';
import { diagnosePairwiseConflicts } from '../engine/scheduleUtils.js';
import { Schedule } from './Schedule.js';

export async function generateSchedules(courseGroups, options = {}) {
  const raw = await ScheduleSolver.solve(courseGroups, options);
  return raw.map(schedule => Schedule.from(schedule));
}

export function diagnoseScheduleConflicts(courseGroups) {
  return diagnosePairwiseConflicts(courseGroups);
}
