import { generateSchedules, diagnoseScheduleConflicts } from '../domain/scheduleService.js';

export async function generateScheduleResults(state, courseGroups, options = {}) {
  const schedules = await generateSchedules(courseGroups, options);
  state.setGeneratedSchedules(schedules);
  return schedules;
}

export function getScheduleConflicts(courseGroups) {
  return diagnoseScheduleConflicts(courseGroups);
}

export function updateScheduleFilters(state, filterFn) {
  const filtered = filterFn(state.get('allGeneratedSchedules'));
  state.setFilteredSchedules(filtered);
  return filtered;
}
