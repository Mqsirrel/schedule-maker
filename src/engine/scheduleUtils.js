/** Shared schedule identity, deduplication and ranking helpers. */

export function sectionIdentity(section) {
  return `${section.courseKey || ''}::${section.section || ''}`;
}

export function scheduleIdentity(schedule) {
  return schedule.sections
    .map(sectionIdentity)
    .sort()
    .join('|');
}

export function deduplicateSchedules(schedules) {
  const seen = new Set();
  const unique = [];

  for (const schedule of schedules) {
    const key = scheduleIdentity(schedule);
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(schedule);
  }

  return unique;
}

export function scoreSchedule(metrics, weights = {}) {
  const {
    daysOff = 0.35,
    gaps = 0.30,
    latestStart = 0.10,
    earliestFinish = 0.10,
    seats = 0.15
  } = weights;

  return (
    metrics.daysOffScore * daysOff +
    metrics.gapsScore * gaps +
    metrics.latestStartScore * latestStart +
    metrics.earliestFinishScore * earliestFinish +
    metrics.seatsScore * seats
  );
}

export function rankSchedules(schedules, weights) {
  if (schedules.length <= 1) {
    if (schedules[0]) {
      schedules[0].score = 100;
      schedules[0].rank = 1;
    }
    return schedules;
  }

  const range = (getter, value, invert = false) => {
    const values = schedules.map(getter);
    const min = Math.min(...values);
    const max = Math.max(...values);
    if (max === min) return 1;
    const normalized = (value - min) / (max - min);
    return invert ? 1 - normalized : normalized;
  };

  for (const schedule of schedules) {
    const m = schedule.metrics;
    const normalized = {
      daysOffScore: range(s => s.metrics.daysOffCount, m.daysOffCount),
      gapsScore: range(s => s.metrics.totalGapMinutes, m.totalGapMinutes, true),
      latestStartScore: range(s => s.metrics.earliestStartMinutes, m.earliestStartMinutes),
      earliestFinishScore: range(s => s.metrics.latestEndMinutes, m.latestEndMinutes, true),
      seatsScore: range(s => s.metrics.availableSeats, m.availableSeats)
    };
    schedule.score = Math.round(scoreSchedule(normalized, weights) * 100);
  }

  schedules.sort((a, b) => b.score - a.score);
  schedules.forEach((schedule, index) => {
    schedule.rank = index + 1;
    schedule.id = `sched_${index + 1}`;
  });
  return schedules;
}
