// Web Worker for DFS Backtracking Schedule Generator
import { DAYS, doSlotsOverlap, calculateDayGaps } from './time.js';
import { deduplicateSchedules, rankSchedules, sectionIdentity } from './scheduleUtils.js';

let cancelled = false;

if (typeof self !== 'undefined' && typeof self.postMessage === 'function') {
  self.onmessage = function (e) {
    if (e.data?.type === 'cancel') {
      cancelled = true;
      return;
    }

    const { courseGroups, options } = e.data;
    cancelled = false;
    try {
      const results = generateSchedulesDFS(courseGroups, options);
      if (!cancelled) self.postMessage({ success: true, schedules: results });
    } catch (err) {
      if (!cancelled) self.postMessage({ success: false, error: err.message });
    }
  };
}

/**
 * Exhaustively explores valid combinations while retaining only the best K
 * candidates. This avoids the old correctness bug where the first K DFS hits
 * were ranked and presented as if they were globally the best schedules.
 */
export function generateSchedulesDFS(courseGroups, options = {}) {
  const {
    allowFullSeats = false,
    maxResults = 1000,
    lockedSections = [],
    excludedSections = [],
    rankingWeights
  } = options;

  if (!courseGroups || courseGroups.length === 0) return [];

  const locked = new Set(lockedSections.map(sectionIdentity));
  const excluded = new Set(excludedSections.map(sectionIdentity));

  // A lock is a hard constraint: every locked section must exist in the input
  // and its course group must contain that exact section.
  for (const lockedSection of lockedSections) {
    if (!courseGroups.some(group => group.some(section => sectionIdentity(section) === sectionIdentity(lockedSection)))) {
      return [];
    }
  }

  const filteredGroups = courseGroups.map(group => {
    let candidates = group.filter(section => !excluded.has(sectionIdentity(section)));

    const lockedForGroup = candidates.filter(section => locked.has(sectionIdentity(section)));
    if (lockedForGroup.length > 0) candidates = lockedForGroup;

    if (!allowFullSeats) {
      const availableOnly = candidates.filter(sec => !sec.isFull);
      // Keep full sections as a fallback when they are the only options.
      if (availableOnly.length > 0) candidates = availableOnly;
    }

    return candidates;
  });

  if (filteredGroups.some(group => group.length === 0)) return [];

  const orderedGroups = filteredGroups
    .map((group, originalIndex) => ({ group, originalIndex }))
    .sort((a, b) => a.group.length - b.group.length);

  const candidates = [];
  const currentAssignment = [];

  function consider(schedule) {
    candidates.push(schedule);
    // Avoid unbounded memory while still exploring every valid combination.
    // Absolute ranking makes it possible to safely discard the current worst.
    candidates.sort((a, b) => b.score - a.score);
    if (candidates.length > maxResults) candidates.pop();
  }

  function backtrack(groupIndex) {
    if (cancelled) return;

    if (groupIndex === orderedGroups.length) {
      const schedule = {
        sections: [...currentAssignment],
        metrics: computeScheduleMetrics(currentAssignment)
      };
      // Rank once here using deterministic absolute metrics. Final rank is
      // recalculated after deduplication.
      schedule.score = calculateAbsoluteScore(schedule.metrics, rankingWeights);
      consider(schedule);
      return;
    }

    const currentGroup = orderedGroups[groupIndex].group;
    for (const section of currentGroup) {
      if (cancelled) return;
      if (hasConflictWithAssignment(section, currentAssignment)) continue;

      currentAssignment.push(section);
      backtrack(groupIndex + 1);
      currentAssignment.pop();
    }
  }

  backtrack(0);
  if (cancelled) return [];

  return rankSchedules(deduplicateSchedules(candidates), rankingWeights);
}

/**
 * Absolute score: unlike relative min/max normalization, this score remains
 * meaningful even when only a bounded top-K set is retained during search.
 */
export function calculateAbsoluteScore(metrics, weights = {}) {
  const {
    daysOff = 0.35,
    gaps = 0.30,
    latestStart = 0.10,
    earliestFinish = 0.10,
    seats = 0.15
  } = weights;

  const daysScore = Math.min(metrics.daysOffCount / 5, 1);
  const gapsScore = 1 - Math.min(metrics.totalGapMinutes / 600, 1);
  const latestStartScore = Math.min(metrics.earliestStartMinutes / (12 * 60), 1);
  const earliestFinishScore = 1 - Math.min(metrics.latestEndMinutes / (22 * 60), 1);
  const seatsScore = Math.min(metrics.availableSeats / 30, 1);

  return (
    daysScore * daysOff +
    gapsScore * gaps +
    latestStartScore * latestStart +
    earliestFinishScore * earliestFinish +
    seatsScore * seats
  ) * 100;
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

  for (const sec of sections) {
    if (sec.instructor) instructors.add(sec.instructor);
    if (Number.isFinite(sec.availableSeats)) availableSeats += Math.max(0, sec.availableSeats);
    if (sec.isFull) hasFullSection = true;
  }

  for (const day of DAYS) {
    const daySlots = [];
    for (const sec of sections) {
      const slots = sec.days[day] || [];
      for (const slot of slots) {
        daySlots.push(slot);
        if (slot.startMinutes < earliestStart) earliestStart = slot.startMinutes;
        if (slot.endMinutes > latestEnd) latestEnd = slot.endMinutes;
        totalStudyMinutes += slot.endMinutes - slot.startMinutes;
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
