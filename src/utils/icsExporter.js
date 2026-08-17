// iCalendar (.ics) Exporter for Apple Calendar, Google Calendar & Outlook
import { DAYS } from '../engine/time.js';

const DAY_TO_ICS_DAY = {
  su: 'SU',
  mo: 'MO',
  tu: 'TU',
  we: 'WE',
  th: 'TH'
};

export class IcsExporter {
  /**
   * Generates a downloadable .ics file from a schedule
   * @param {Object} schedule
   * @param {Object} options
   */
  static exportSchedule(schedule, options = {}) {
    if (!schedule || !schedule.sections) return false;

    const semesterWeeks = options.semesterWeeks || 14;
    // Set anchor date to next upcoming Sunday
    const startDate = this._getNextSunday();

    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//ScheduleMaker//Taibah University Smart Scheduler//AR',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:الجدول الجامعي - جامعة طيبة',
      'X-WR-TIMEZONE:Asia/Riyadh'
    ];

    for (const section of schedule.sections) {
      for (const [dayKey, dayIndex] of Object.entries({ su: 0, mo: 1, tu: 2, we: 3, th: 4 })) {
        const slots = section.days[dayKey] || [];
        for (const slot of slots) {
          const eventDate = new Date(startDate);
          eventDate.setDate(startDate.getDate() + dayIndex);

          const startHours = Math.floor(slot.startMinutes / 60);
          const startMins = slot.startMinutes % 60;
          const endHours = Math.floor(slot.endMinutes / 60);
          const endMins = slot.endMinutes % 60;

          const dtStart = this._formatIcsDate(eventDate, startHours, startMins);
          const dtEnd = this._formatIcsDate(eventDate, endHours, endMins);
          const uid = `event_${section.id}_${dayKey}_${slot.startMinutes}@schedulemaker`;

          icsContent.push(
            'BEGIN:VEVENT',
            `UID:${uid}`,
            `DTSTAMP:${this._formatIcsDate(new Date())}`,
            `DTSTART:${dtStart}`,
            `DTEND:${dtEnd}`,
            `RRULE:FREQ=WEEKLY;COUNT=${semesterWeeks};BYDAY=${DAY_TO_ICS_DAY[dayKey]}`,
            `SUMMARY:${section.courseName} (${section.courseCode} ${section.courseNumber} - شعبة ${section.section})`,
            `DESCRIPTION:أستاذ المادة: ${section.instructor || 'غير محدد'}\\nرمز المادة: ${section.courseKey}\\nالشعبة: ${section.section}`,
            `LOCATION:جامعة طيبة - ${section.branch || 'المقر الرئيسي'}`,
            'STATUS:CONFIRMED',
            'BEGIN:VALARM',
            'TRIGGER:-PT15M',
            'ACTION:DISPLAY',
            'DESCRIPTION:تذكير بالمحاضرة القادمة',
            'END:VALARM',
            'END:VEVENT'
          );
        }
      }
    }

    icsContent.push('END:VCALENDAR');
    const icsBlob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    this._downloadBlob(icsBlob, 'Taibah_Schedule.ics');
    return true;
  }

  static _getNextSunday() {
    const today = new Date();
    const day = today.getDay(); // 0 is Sunday
    const diff = (7 - day) % 7;
    const nextSunday = new Date(today);
    nextSunday.setDate(today.getDate() + diff);
    nextSunday.setHours(0, 0, 0, 0);
    return nextSunday;
  }

  static _formatIcsDate(date, hours = null, minutes = null) {
    const d = new Date(date);
    if (hours !== null) d.setHours(hours);
    if (minutes !== null) d.setMinutes(minutes);

    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
  }

  static _downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
