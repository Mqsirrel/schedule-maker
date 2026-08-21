/** Parses pasted course/CRN lines. */
export function parseCrnList(text) {
  if (!text || typeof text !== 'string') return [];
  return text.split(/\r?\n/).map(line => line.trim()).filter(Boolean).map(line => {
    const match = line.match(/^([A-Za-z][A-Za-z0-9]*\s*-\s*\d+)\s*\(\s*(?:شعبة|section|sec|crn)\s*[:#-]?\s*([^)]*)\)\s*(?:[-–—:]\s*)?(.*)$/i);
    if (!match) return null;
    const course = match[1].replace(/\s+/g, '').toUpperCase();
    const parts = course.split('-');
    return {
      courseCode: parts[0],
      courseNumber: parts.slice(1).join('-'),
      crn: match[2].trim().toUpperCase(),
      courseName: match[3].trim(),
      source: line
    };
  }).filter(Boolean);
}
