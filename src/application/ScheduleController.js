import { generateScheduleResults, getScheduleConflicts } from './scheduleActions.js';
import { filterSchedules } from './filterSchedules.js';

/**
 * Application-level orchestration for schedule generation/filtering.
 * It knows about state and application policy, but not about DOM rendering.
 */
export class ScheduleController {
  constructor({ state, getFilterState }) {
    this.state = state;
    this.getFilterState = getFilterState;
  }

  async generate(courseGroups) {
    if (!courseGroups.length) return [];

    const filters = this.getFilterState();
    const schedules = await generateScheduleResults(this.state, courseGroups, {
      allowFullSeats: filters.allowFullSeats,
      maxResults: 2000
    });

    return { schedules, filters };
  }

  filter(filters) {
    const schedules = this.state.get('allGeneratedSchedules');
    const result = filterSchedules(schedules, filters);
    this.state.setFilteredSchedules(result);
    return result;
  }

  diagnoseConflicts(courseGroups) {
    return getScheduleConflicts(courseGroups);
  }
}
