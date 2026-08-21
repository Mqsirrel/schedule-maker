import { ScheduleSolver } from '../engine/solver.js';
import { diagnosePairwiseConflicts } from '../engine/scheduleUtils.js';
import { ScheduleModel } from './ScheduleModel.js';

/** Domain boundary for schedule generation. The solver implementation remains untouched. */
export async function generateSchedules(courseGroups, options = {}) {
  const raw = await ScheduleSolver.solve(courseGroups, options);
  return raw.map(schedule => ScheduleModel.from(schedule));
}

export function diagnoseScheduleConflicts(courseGroups) {
  return diagnosePairwiseConflicts(courseGroups);
}
