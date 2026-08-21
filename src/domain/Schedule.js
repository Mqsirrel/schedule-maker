export class Schedule {
  constructor(data = {}) {
    Object.assign(this, data);
  }

  static from(data) {
    return data instanceof Schedule ? data : new Schedule(data);
  }

  get id() {
    return this._id ?? this.scheduleId ?? this.key;
  }

  get sections() {
    return this._sections ?? this.courses ?? [];
  }

  get metrics() {
    return this._metrics ?? { daysOffCount: 0, totalGapHours: 0 };
  }

  toJSON() {
    return { ...this };
  }
}
