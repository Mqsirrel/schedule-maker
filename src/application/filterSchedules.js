import { normalizeArabic } from '../engine/scheduleUtils.js';

/**
 * Pure schedule filtering/sorting functions.
 * No DOM access and no application state mutation.
 */
export function filterSchedules(schedules, filters = {}) {
  if (!Array.isArray(schedules) || schedules.length === 0) return [];

  let result = [...schedules];

  if (filters.daysOff === 'any_off') {
    result = result.filter(s => s.metrics.daysOffCount > 0);
  } else if (filters.daysOff === '1_off') {
    result = result.filter(s => s.metrics.daysOffCount >= 1);
  } else if (filters.daysOff === '2_off') {
    result = result.filter(s => s.metrics.daysOffCount >= 2);
  } else if (filters.daysOff === '3_off') {
    result = result.filter(s => s.metrics.daysOffCount >= 3);
  }

  if (filters.query) {
    const q = normalizeArabic(filters.query);
    result = result.filter(schedule => schedule.sections.some(section => {
      const instructorNorm = normalizeArabic(section.instructor);
      const sectionNorm = normalizeArabic(section.section);
      const courseNameNorm = normalizeArabic(section.courseName);
      const codeNorm = normalizeArabic(section.courseKey);

      return instructorNorm.includes(q)
        || sectionNorm.includes(q)
        || courseNameNorm.includes(q)
        || codeNorm.includes(q);
    }));
  }

  if (filters.sortBy === 'most_days_off') {
    result.sort((a, b) => b.metrics.daysOffCount - a.metrics.daysOffCount);
  } else if (filters.sortBy === 'least_gaps') {
    result.sort((a, b) => a.metrics.totalGapMinutes - b.metrics.totalGapMinutes);
  } else if (filters.sortBy === 'earliest_finish') {
    result.sort((a, b) => a.metrics.latestEndMinutes - b.metrics.latestEndMinutes);
  } else if (filters.sortBy === 'latest_start') {
    result.sort((a, b) => b.metrics.earliestStartMinutes - a.metrics.earliestStartMinutes);
  }

  return result;
}
