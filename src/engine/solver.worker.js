// Web Worker for DFS Backtracking Schedule Generator
import { DAYS, doSlotsOverlap, calculateDayGaps } from './time.js';

if (typeof self !== 'undefined' && typeof self.postMessage === 'function') {
  self.onmessage = function (e) {
    const { courseGroups, options } = e.data;
    try {
      const results = generateSchedulesDFS(courseGroups, options);
      self.postMessage({ success: true, schedules: results });
    } catch (err) {
      self.postMessage({ success: false, error: err.message });
    }
  };
}

/**
 * Depth-First Search with early conflict pruning.
 * The groups with the fewest viable sections are explored first so impossible
 * branches fail earlier. Results are ranked after generation; UI filtering can
 * therefore remain purely local and instant.
 */
export function generateSchedulesDFS(courseGroups, options = {}) {
  const {
    allowFullSeats = false,
    maxResults = 1000,
    lockedSections = [],
    excludedSections = []
  } = options;

  if (!courseGroups || courseGroups.length === 0) return [];

  const locked = new Set(lockedSections.map(sectionIdentity));
  const excluded = new Set(excludedSections.map(sectionIdentity));

  const filteredGroups = courseGroups
    .map(group => {
      let candidates = group.filter(section => !excluded.has(sectionIdentity(section)));

      if (locked.size > 0) {
        const lockedForGroup = candidates.filter(section => locked.has(sectionIdentity(section)));
        if (lockedForGroup.length > 0) candidates = lockedForGroup;
      }

      if (!allowFullSeats) {
        const availableOnly = candidates.filter(sec => !sec.isFull);
        // Preserve the existing behavior: if every section is full, keep the
        // group usable rather than returning no schedules unexpectedly.
        if (availableOnly.length > 0) candidates = availableOnly;
      }

      return candidates;
    })
    .filter(group => group.length > 0)
    .sort((a, b) => a.length - b.length);

  if (filteredGroups.length !== courseGroups.length) return [];

  const validSchedules = [];
  const currentAssignment = [];

  function backtrack(groupIndex) {
    if (validSchedules.length >= maxResults) return;

    if (groupIndex === filteredGroups.length) {
      validSchedules.push({
        id: `sched_${validSchedules.length + 1}`,
        sections: [...currentAssignment],
        metrics: computeScheduleMetrics(currentAssignment)
      });
      return;
    }

    const currentGroup = filteredGroups[groupIndex];
    for (const section of currentGroup) {
      if (hasConflictWithAssignment(section, currentAssignment)) continue;

      currentAssignment.push(section);
      backtrack(groupIndex + 1);
      currentAssignment.pop();

      if (validSchedules.length >= maxResults) return;
    }
  }

  backtrack(0);
  return rankSchedules(validSchedules);
}

function sectionIdentity(section) {
  return `${section.courseKey || ''}::${section.section || ''}`;
}

/**
 * Rank schedules using practical student-facing criteria.
 * Score is relative to the generated result set, so it remains meaningful
 * across semesters with very different timetable shapes.
 */
function rankSchedules(schedules) {
  if (schedules.length <= 1) {
    if (schedules[0]) schedules[0].score = 100;
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
    const daysScore = range(s => s.metrics.daysOffCount, m.daysOffCount);
    const gapsScore = range(s => s.metrics.totalGapMinutes, m.totalGapMinutes, true);
    const startScore = range(s => s.metrics.earliestStartMinutes, m.earliestStartMinutes);
    const finishScore = range(s => s.metrics.latestEndMinutes, m.latestEndMinutes, true);
    const seatsScore = range(s => s.metrics.availableSeats, m.availableSeats);

    // Days and gaps dominate because they have the clearest day-to-day impact.
    const raw = (
      daysScore * 0.35 +
      gapsScore * 0.30 +
      startScore * 0.10 +
      finishScore * 0.10 +
      seatsScore * 0.15
    );

    schedule.score = Math.round(raw * 100);
    schedule.reasons = buildReasons(m, schedules);
  }

  schedules.sort((a, b) => b.score - a.score);
  schedules.forEach((schedule, index) => {
    schedule.rank = index + 1;
    schedule.id = `sched_${index + 1}`;
  });

  return schedules;
}

function buildReasons(metrics, schedules) {
  const reasons = ['no_conflicts'];
  const maxDaysOff = Math.max(...schedules.map(s => s.metrics.daysOffCount));
  const minGaps = Math.min(...schedules.map(s => s.metrics.totalGapMinutes));

  if (metrics.daysOffCount === maxDaysOff) reasons.push('more_days_off');
  if (metrics.totalGapMinutes === minGaps) reasons.push('least_gaps');
  if (metrics.availableSeats > 0) reasons.push('seats_available');
  return reasons;
}

function hasConflictWithAssignment(candidateSection, assignedSections) {
  for (const assigned of assignedSections) {
    for (const day of DAYS) {
      const candidateSlots = candidateSection.days[day] || [];
      const assignedSlots = assigned.days[day] || [];

      for (const slotC of candidateSlots) {
        for (const slotA of assignedSlots) {
          if (doSlotsOverlap(slotC, slotA)) return true;
        }
      }
    }
  }
  return false;
}

/**
 * Calculates useful, deterministic metrics for both UI and ranking.
 */
export function computeScheduleMetrics(sections) {
  let daysOffCount = 0;
  const activeDays = [];
  let totalGapMinutes = 0;
  let earliestStart = 24 * 60;
  let latestEnd = 0;
  let totalStudyMinutes = 0;
  let availableSeats = 0;
  let hasFullSection = false;
  const instructors = new Set();

  for (const day of DAYS) {
    const daySlots = [];
    for (const sec of sections) {
      if (sec.instructor) instructors.add(sec.instructor);
      if (Number.isFinite(sec.availableSeats)) availableSeats += Math.max(0, sec.availableSeats);
      if (sec.isFull) hasFullSection = true;

      const slots = sec.days[day] || [];
      for (const slot of slots) {
        daySlots.push(slot);
        if (slot.startMinutes < earliestStart) earliestStart = slot.startMinutes;
        if (slot.endMinutes > latestEnd) latestEnd = slot.endMinutes;
        totalStudyMinutes += (slot.endMinutes - slot.startMinutes);
      }
    }

    if (daySlots.length === 0) {
      daysOffCount++;
    } else {
      activeDays.push(day);
      totalGapMinutes += calculateDayGaps(daySlots);
    }
  }

  if (earliestStart === 24 * 60) earliestStart = 8 * 60;
  if (latestEnd === 0) latestEnd = 14 * 60;

  return {
    daysOffCount,
    activeDays,
    totalGapMinutes,
    totalGapHours: Math.round((totalGapMinutes / 60) * 10) / 10,
    earliestStartMinutes: earliestStart,
    latestEndMinutes: latestEnd,
    totalStudyMinutes,
    instructorsCount: instructors.size,
    availableSeats,
    hasFullSection
  };
}
