/**
 * Stable domain facade for generated schedules.
 * Keeps the solver's mutable score/rank/id contract intact.
 */
export class ScheduleModel {
  constructor(data = {}) {
    Object.assign(this, data);

    // Keep the existing public schedule shape writable. The previous
    // implementation exposed `sections` and `metrics` as getters, which made
    // Object.assign() fail as soon as a raw schedule contained those fields.
    if (this.sections === undefined) this.sections = this.courses ?? [];
    if (this.metrics === undefined) this.metrics = {};
  }

  static from(data) {
    return data instanceof ScheduleModel ? data : new ScheduleModel(data);
  }

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
