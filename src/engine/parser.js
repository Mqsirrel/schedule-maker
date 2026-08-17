// Semantic Timetable Parser for Taibah University & Generic Table Exports
import { parseTimeRange, DAYS } from './time.js';

export class TimetableParser {
  /**
   * Parses an HTML string exported from Taibah University registration portal.
   * @param {string} htmlContent
   * @returns {{ success: boolean, sections: Array, error?: string }}
   */
  static parseHtml(htmlContent) {
    if (!htmlContent || typeof htmlContent !== 'string') {
      return { success: false, sections: [], error: 'empty_content' };
    }

    try {
      let rows = null;

      if (typeof DOMParser !== 'undefined') {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');

        // Strategy 1: Find TaibahReg 13/14-column timetable table
        rows = this._extractTaibahRows(doc);

        // Strategy 2: Fallback to all tables with suitable column count
        if (!rows || rows.length === 0) {
          rows = this._extractGenericRows(doc);
        }
      } else {
        // Simple regex-based table row extraction for Node environment tests
        rows = this._extractRowsWithRegex(htmlContent);
      }

      if (!rows || rows.length === 0) {
        return { success: false, sections: [], error: 'no_table_found' };
      }

      const parsedSections = [];
      let rowCounter = 1;

      for (const rawCells of rows) {
        const sectionObj = this._normalizeRowToSection(rawCells, rowCounter++);
        if (sectionObj) {
          parsedSections.push(sectionObj);
        }
      }

      if (parsedSections.length === 0) {
        return { success: false, sections: [], error: 'no_valid_sections' };
      }

      return { success: true, sections: parsedSections };
    } catch (err) {
      console.error('Parser error:', err);
      return { success: false, sections: [], error: err.message };
    }
  }

  /**
   * Extracts table rows from TaibahReg EAS portal structure.
   */
  static _extractTaibahRows(doc) {
    const tableBodies = doc.querySelectorAll('tbody');
    for (const tbody of tableBodies) {
      const trs = Array.from(tbody.querySelectorAll('tr'));
      if (trs.length < 2) continue;

      const candidateRows = [];
      for (const tr of trs) {
        const cells = Array.from(tr.children).map(td => td.textContent.trim());
        if (cells.length >= 12 && cells.length <= 16) {
          candidateRows.push(cells);
        }
      }

      if (candidateRows.length > 0) {
        return candidateRows;
      }
    }

    const thHeaders = Array.from(doc.querySelectorAll('tr > th:first-child'));
    for (const th of thHeaders) {
      const parentRow = th.parentElement;
      const parentTable = parentRow ? parentRow.closest('table') : null;
      if (parentTable) {
        const trs = Array.from(parentTable.querySelectorAll('tr'));
        const rows = trs
          .map(tr => Array.from(tr.children).map(td => td.textContent.trim()))
          .filter(cells => cells.length >= 12);
        if (rows.length > 0) return rows;
      }
    }

    return null;
  }

  /**
   * Generic fallback parser for other tables
   */
  static _extractGenericRows(doc) {
    const tables = doc.querySelectorAll('table');
    for (const table of tables) {
      const trs = Array.from(table.querySelectorAll('tr'));
      const extracted = trs
        .map(tr => Array.from(tr.children).map(td => td.textContent.trim()))
        .filter(c => c.length >= 8);
      if (extracted.length > 0) return extracted;
    }
    return null;
  }

  /**
   * Node.js test environment regex fallback
   */
  static _extractRowsWithRegex(html) {
    const trMatches = html.match(/<tr[\s\S]*?<\/tr>/gi) || [];
    const rows = [];
    for (const tr of trMatches) {
      const tdMatches = tr.match(/<(td|th)[\s\S]*?>([\s\S]*?)<\/\1>/gi) || [];
      if (tdMatches.length >= 10) {
        const cells = tdMatches.map(td => td.replace(/<[^>]+>/g, '').trim());
        rows.push(cells);
      }
    }
    return rows;
  }

  /**
   * Converts raw cell string array to a clean normalized CourseSection object.
   */
  static _normalizeRowToSection(cells, index) {
    if (cells.length < 10) return null;

    let enrolled = 0;
    let available = 0;
    let thStr = '', weStr = '', tuStr = '', moStr = '', suStr = '';
    let teacher = '';
    let section = '';
    let subjectName = '';
    let subjectNum = '';
    let subjectCode = '';
    let branch = '';
    let rowId = String(index);

    if (cells.length >= 13) {
      enrolled = parseInt(cells[0], 10) || 0;
      available = parseInt(cells[1], 10) || 0;
      thStr = cells[2] || '';
      weStr = cells[3] || '';
      tuStr = cells[4] || '';
      moStr = cells[5] || '';
      suStr = cells[6] || '';
      teacher = cells[7] || 'غير محدد';
      section = cells[8] || '1';
      subjectName = cells[9] || 'مادة بدون اسم';
      subjectNum = cells[10] || '';
      subjectCode = cells[11] || '';
      branch = cells[12] || '';
      rowId = cells[13] || String(index);
    } else {
      teacher = cells[1] || 'غير محدد';
      subjectName = cells[0] || 'مادة';
      section = cells[2] || '1';
      suStr = cells[3] || '';
      moStr = cells[4] || '';
      tuStr = cells[5] || '';
      weStr = cells[6] || '';
      thStr = cells[7] || '';
    }

    subjectCode = subjectCode.trim().toUpperCase();
    subjectNum = subjectNum.trim();
    section = section.trim().toUpperCase();
    subjectName = subjectName.trim();
    teacher = teacher.trim();

    if (!subjectCode && !subjectNum && !subjectName) return null;

    const courseKey = `${subjectCode}-${subjectNum}`.replace(/^-|-$/, '') || subjectName;

    const days = {
      su: this._parseDaySlots(suStr),
      mo: this._parseDaySlots(moStr),
      tu: this._parseDaySlots(tuStr),
      we: this._parseDaySlots(weStr),
      th: this._parseDaySlots(thStr)
    };

    return {
      id: `${courseKey}_${section}_${rowId}`,
      rowId,
      courseKey,
      courseCode: subjectCode,
      courseNumber: subjectNum,
      courseName: subjectName,
      section,
      instructor: teacher,
      branch,
      enrolledSeats: enrolled,
      availableSeats: available,
      isFull: enrolled >= available && available > 0,
      days,
      rawDays: { su: suStr, mo: moStr, tu: tuStr, we: weStr, th: thStr }
    };

  }

  static _parseDaySlots(dayStr) {
    if (!dayStr || dayStr.trim().length < 4) return [];
    const parts = dayStr.split(/[\n,]/);
    const slots = [];
    for (const part of parts) {
      const parsed = parseTimeRange(part.trim());
      if (parsed) {
        slots.push(parsed);
      }
    }
    return slots;
  }
}
