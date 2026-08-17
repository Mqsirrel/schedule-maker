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
 * Depth-First Search with Early Conflict Pruning
 */
export function generateSchedulesDFS(courseGroups, options = {}) {
  const { allowFullSeats = false, maxResults = 1000 } = options;

  if (!courseGroups || courseGroups.length === 0) return [];

  // Filter full sections if required
  const filteredGroups = courseGroups.map(group => {
    if (allowFullSeats) return group;
    const availableOnly = group.filter(sec => !sec.isFull);
    return availableOnly.length > 0 ? availableOnly : group; // Fallback to group if all are full
  });

  const validSchedules = [];
  const currentAssignment = [];

  function backtrack(groupIndex) {
    if (validSchedules.length >= maxResults) return;

    if (groupIndex === filteredGroups.length) {
      // Complete valid schedule found!
      const scheduleMetrics = computeScheduleMetrics(currentAssignment);
      validSchedules.push({
        id: `sched_${validSchedules.length + 1}`,
        sections: [...currentAssignment],
        metrics: scheduleMetrics
      });
      return;
    }

    const currentGroup = filteredGroups[groupIndex];
    for (const section of currentGroup) {
      // Check if section conflicts with any currently assigned section
      if (hasConflictWithAssignment(section, currentAssignment)) {
        continue; // PRUNE BRANCH
      }

      currentAssignment.push(section);
      backtrack(groupIndex + 1);
      currentAssignment.pop();
    }
  }

  backtrack(0);
  return validSchedules;
}

/**
 * Checks if a candidate section has any time collisions with the currently selected sections
 */
function hasConflictWithAssignment(candidateSection, assignedSections) {
  for (const assigned of assignedSections) {
    for (const day of DAYS) {
      const candidateSlots = candidateSection.days[day] || [];
      const assignedSlots = assigned.days[day] || [];

      for (const slotC of candidateSlots) {
        for (const slotA of assignedSlots) {
          if (doSlotsOverlap(slotC, slotA)) {
            return true;
          }
        }
      }
    }
  }
  return false;
}

/**
 * Calculates days-off, gaps, earliest start, latest end for a valid schedule
 */
export function computeScheduleMetrics(sections) {
  let daysOffCount = 0;
  const activeDays = [];
  let totalGapMinutes = 0;
  let earliestStart = 24 * 60;
  let latestEnd = 0;
  let totalStudyMinutes = 0;
  const instructors = new Set();

  for (const day of DAYS) {
    const daySlots = [];
    for (const sec of sections) {
      if (sec.instructor) instructors.add(sec.instructor);
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
    instructorsCount: instructors.size
  };
}
