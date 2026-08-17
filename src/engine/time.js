// Robust Time Normalizer and Conflict Detection Engine

export const DAYS = ['su', 'mo', 'tu', 'we', 'th'];

export const DAY_LABELS = {
  ar: { su: 'الأحد', mo: 'الاثنين', tu: 'الثلاثاء', we: 'الأربعاء', th: 'الخميس' },
  en: { su: 'Sun', mo: 'Mon', tu: 'Tue', we: 'Wed', th: 'Thu' }
};

/**
 * Parses a time string (e.g., "08:00", "8:30 AM", "1:50 PM", "13:40")
 * and converts it to total minutes from 00:00 midnight.
 * @param {string} timeStr
 * @returns {number|null} Minutes from midnight or null if invalid
 */
export function timeStringToMinutes(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return null;
  const cleanStr = timeStr.trim().toUpperCase();

  const isPM = cleanStr.includes('PM') || cleanStr.includes('م') || cleanStr.includes('مساء');
  const isAM = cleanStr.includes('AM') || cleanStr.includes('ص') || cleanStr.includes('صباح');

  // Extract hours and minutes digits
  const match = cleanStr.match(/(\d{1,2}):(\d{2})/);
  if (!match) return null;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);

  if (isNaN(hours) || isNaN(minutes)) return null;

  if (isPM && hours < 12) {
    hours += 12;
  } else if (isAM && hours === 12) {
    hours = 0;
  } else if (!isPM && !isAM && hours >= 1 && hours <= 6) {
    // Implicit afternoon hours (e.g. 1:00 to 6:00 in university schedules are typically 13:00 to 18:00)
    hours += 12;
  }

  return hours * 60 + minutes;
}

/**
 * Parses a time range string (e.g. "08:00-09:50", "08:00 - 10:00", "08:00 – 09:50")
 * @param {string} rangeStr
 * @returns {{ startMinutes: number, endMinutes: number, formatted: string } | null}
 */
export function parseTimeRange(rangeStr) {
  if (!rangeStr || typeof rangeStr !== 'string') return null;
  // Support standard hyphen (-), en-dash (–), em-dash (—), and arabic dash (ـ)
  const parts = rangeStr.split(/[-–—ـ]/);
  if (parts.length < 2) return null;

  const startMinutes = timeStringToMinutes(parts[0]);
  const endMinutes = timeStringToMinutes(parts[1]);

  if (startMinutes === null || endMinutes === null || startMinutes >= endMinutes) {
    return null;
  }

  return {
    startMinutes,
    endMinutes,
    formatted: rangeStr.trim()
  };
}


/**
 * Checks if two time intervals overlap.
 * Overlap occurs if and only if max(A.start, B.start) < min(A.end, B.end)
 * @param {{ startMinutes: number, endMinutes: number }} slotA
 * @param {{ startMinutes: number, endMinutes: number }} slotB
 * @returns {boolean}
 */
export function doSlotsOverlap(slotA, slotB) {
  return Math.max(slotA.startMinutes, slotB.startMinutes) < Math.min(slotA.endMinutes, slotB.endMinutes);
}

/**
 * Formats minutes from midnight into 24-hour HH:MM string
 * @param {number} totalMinutes
 * @returns {string}
 */
export function minutesToTimeString(totalMinutes) {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/**
 * Computes the total gap (idle wait time) in minutes for a day's schedule.
 * @param {Array<{ startMinutes: number, endMinutes: number }>} daySlots
 * @returns {number} Gap in minutes
 */
export function calculateDayGaps(daySlots) {
  if (!daySlots || daySlots.length <= 1) return 0;
  // Sort slots chronologically
  const sorted = [...daySlots].sort((a, b) => a.startMinutes - b.startMinutes);
  let totalGap = 0;
  for (let i = 0; i < sorted.length - 1; i++) {
    const gap = sorted[i + 1].startMinutes - sorted[i].endMinutes;
    if (gap > 0) {
      totalGap += gap;
    }
  }
  return totalGap;
}
