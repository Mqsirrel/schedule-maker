export class AppState {
  constructor(initial = {}) {
    this._state = {
      timetableSections: [],
      wantedCourseGroups: [],
      allGeneratedSchedules: [],
      filteredSchedules: [],
      currentScheduleIndex: 0,
      currentView: 'calendar',
      ...initial
    };
  }

  get(key) { return this._state[key]; }

  set(key, value) {
    this._state[key] = value;
    if (key === 'filteredSchedules') this._state.currentScheduleIndex = 0;
    return value;
  }

  patch(values) { Object.assign(this._state, values); }
  snapshot() { return { ...this._state }; }

  resetResults() {
    this.patch({ allGeneratedSchedules: [], filteredSchedules: [], currentScheduleIndex: 0 });
  }

  setGeneratedSchedules(schedules) {
    this.patch({ allGeneratedSchedules: schedules, filteredSchedules: schedules, currentScheduleIndex: 0 });
  }

  setFilteredSchedules(schedules) {
    this.patch({ filteredSchedules: schedules, currentScheduleIndex: 0 });
  }

  navigateSchedule(delta) {
    const schedules = this.get('filteredSchedules');
    const next = this.get('currentScheduleIndex') + delta;
    if (next >= 0 && next < schedules.length) {
      this.set('currentScheduleIndex', next);
      return true;
    }
    return false;
  }

  getCurrentSchedule() {
    return this.get('filteredSchedules')[this.get('currentScheduleIndex')];
  }
}
