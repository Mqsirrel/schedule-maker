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

/**
 * Normalizes Arabic text for tolerant search matching (Alef, Yaa, Taa Marbuta, diacritics).
 * @param {string} text
 * @returns {string}
 */
export function normalizeArabic(text) {
  if (!text) return '';
  return String(text)
    .replace(/[إأآا]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/[ىي]/g, 'ي')
    .replace(/[\u064B-\u065F\u0670]/g, '') // remove tashkeel
    .trim()
    .toLowerCase();
}

/**
 * Checks if two sections conflict temporally on any overlapping day.
 * @param {object} s1
 * @param {object} s2
 * @returns {boolean}
 */
export function doSectionsOverlap(s1, s2) {
  if (!s1.days || !s2.days || !s1.timeSlots || !s2.timeSlots) return false;
  const commonDays = s1.days.filter(d => s2.days.includes(d));
  if (commonDays.length === 0) return false;

  for (const slotA of s1.timeSlots) {
    for (const slotB of s2.timeSlots) {
      if (Math.max(slotA.startMinutes, slotB.startMinutes) < Math.min(slotA.endMinutes, slotB.endMinutes)) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Diagnoses root-cause pairwise bottlenecks when 0 schedules are found.
 * @param {Array<{ courseId: string, courseName: string, sections: Array }>} courseGroups
 * @returns {Array<{ courseA: string, courseB: string }>}
 */
export function diagnosePairwiseConflicts(courseGroups) {
  if (!courseGroups || courseGroups.length < 2) return [];
  const conflicts = [];

  for (let i = 0; i < courseGroups.length; i++) {
    for (let j = i + 1; j < courseGroups.length; j++) {
      const g1 = courseGroups[i];
      const g2 = courseGroups[j];
      if (!g1.sections || g1.sections.length === 0 || !g2.sections || g2.sections.length === 0) continue;

      let allOverlap = true;
      for (const s1 of g1.sections) {
        for (const s2 of g2.sections) {
          if (!doSectionsOverlap(s1, s2)) {
            allOverlap = false;
            break;
          }
        }
        if (!allOverlap) break;
      }

      if (allOverlap) {
        const name1 = g1.courseName || g1.courseId || `Course ${i + 1}`;
        const name2 = g2.courseName || g2.courseId || `Course ${j + 1}`;
        conflicts.push({ courseA: name1, courseB: name2 });
      }
    }
  }

  return conflicts;
}
