/**
 * Stable domain facade for generated schedules.
 * Keeps the solver's mutable score/rank/id contract intact.
 */
export class ScheduleModel {
  constructor(data = {}) {
    Object.assign(this, data);
  }

  static from(data) {
    return data instanceof ScheduleModel ? data : new ScheduleModel(data);
  }

  get sections() { return this._sections ?? this.courses ?? []; }
  get metrics() { return this._metrics ?? {}; }
  get identity() {
    return this.sections
      .map(section => `${section.courseKey || ''}::${section.section || ''}`)
      .sort()
      .join('|');
  }

  hasSections() { return this.sections.length > 0; }
  toJSON() { return { ...this }; }
}

export function normalizeSchedules(schedules = []) {
  return schedules.map(ScheduleModel.from);
}
