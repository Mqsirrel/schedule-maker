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

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;

    // Standard course format: CODE-NUMBER (section/crn) - name
    const standard = line.match(
      /^([A-Za-z][A-Za-z0-9]*)\s*-\s*(\d+)\s*\(\s*(?:(?:شعبة|section|sec|crn)\s*[:#-]?\s*)?([^)]*)\)\s*(?:[-–—:]\s*)?(.*)$/i
    );

    if (standard) {
      entries.push({
        courseCode: standard[1].toUpperCase(),
        courseNumber: standard[2],
        crn: standard[3].trim().toUpperCase(),
        courseName: standard[4].trim(),
        source: line
      });
      continue;
    }

    // Tabular university copy/paste format:
    // No. | Course name | Code | Number | Section/CRN | Units
    const cells = line.split('\t').map(cell => cell.trim());
    if (cells.length >= 5) {
      const start = /^\d+$/.test(cells[0]) ? 1 : 0;
      const courseName = cells[start] || '';
      const courseCode = cells[start + 1] || '';
      const courseNumber = cells[start + 2] || '';
      const crn = cells[start + 3] || '';

      if (/^[A-Za-z][A-Za-z0-9]*$/.test(courseCode) && /^\d+$/.test(courseNumber) && crn) {
        entries.push({
          courseCode: courseCode.toUpperCase(),
          courseNumber,
          crn: crn.toUpperCase(),
          courseName,
          source: line
        });
        continue;
      }
    }
  }

  return entries;
}
