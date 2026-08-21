/**
 * Parses pasted course/CRN lines.
 * Supported formats:
 *   GS-303 (شعبة M5) - جودة الحياة
 *   GS-303 (M5) - جودة الحياة
 *   1\tجودة الحياة\tGS\t303\tM5\t2
 *   1 جودة الحياة GS 303 M5 2
 */
export function parseCrnList(text) {
  if (!text || typeof text !== 'string') return [];

  const entries = [];
  const normalize = (value) => String(value || '')
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  for (const rawLine of text.split(/\r?\n/)) {
    const line = normalize(rawLine);
    if (!line) continue;

    // Standard course format: CODE-NUMBER (section/crn) - name
    const standard = line.match(
      /^([A-Za-z][A-Za-z0-9]*)\s*-\s*(\d+)\s*\(\s*(?:(?:شعبة|section|sec|crn)\s*[:#-]?\s*)?([^)]*)\)\s*(?:[-–—:]\s*)?(.*)$/i
    );

    if (standard) {
      const crn = normalize(standard[3]).toUpperCase();
      if (crn) {
        entries.push({
          courseCode: standard[1].toUpperCase(),
          courseNumber: standard[2],
          crn,
          courseName: normalize(standard[4]),
          source: rawLine.trim()
        });
      }
      continue;
    }

    // University table copy/paste:
    // No. | Course name | Code | Number | Section/CRN | Units | ...
    const cells = rawLine.split('\t').map(cell => normalize(cell));
    if (cells.length >= 5) {
      const start = /^\d+$/.test(cells[0]) ? 1 : 0;
      const courseName = cells[start] || '';
      const courseCode = cells[start + 1] || '';
      const courseNumber = cells[start + 2] || '';
      const crn = cells[start + 3] || '';

      if (/^[A-Za-z][A-Za-z0-9]*$/.test(courseCode)
        && /^\d+$/.test(courseNumber)
        && /^[A-Za-z0-9]+$/.test(crn)) {
        entries.push({
          courseCode: courseCode.toUpperCase(),
          courseNumber,
          crn: crn.toUpperCase(),
          courseName,
          source: rawLine.trim()
        });
        continue;
      }
    }

    // Same table copied with spaces instead of tabs. Course name may contain spaces,
    // so locate the code/number/CRN triplet rather than splitting the name blindly.
    const spaced = line.match(
      /^(?:\d+\s+)?(.+?)\s+([A-Za-z][A-Za-z0-9]*)\s+(\d+)\s+([A-Za-z0-9]+)(?:\s+\d+)?$/
    );

    if (spaced) {
      entries.push({
        courseCode: spaced[2].toUpperCase(),
        courseNumber: spaced[3],
        crn: spaced[4].toUpperCase(),
        courseName: normalize(spaced[1]),
        source: rawLine.trim()
      });
    }
  }

  return entries;
}
