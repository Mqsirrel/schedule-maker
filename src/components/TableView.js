// Detailed Table View Component for Schedule Breakdown
import { DAYS } from '../engine/time.js';

export class TableView {
  constructor(tbodyId) {
    this.tbody = document.getElementById(tbodyId);
  }

  renderSchedule(schedule) {
    if (!this.tbody) return;

    if (!schedule || !schedule.sections || schedule.sections.length === 0) {
      this.tbody.innerHTML = `<tr><td colspan="12" style="padding: 2rem;">لا توجد بيانات لهذا الجدول</td></tr>`;
      return;
    }

    this.tbody.innerHTML = schedule.sections.map((section, idx) => {
      const isFull = section.isFull;
      const seatsBadgeClass = isFull ? 'seats-badge--full' : 'seats-badge--available';

      return `
        <tr>
          <td><strong>${idx + 1}</strong></td>
          <td style="text-align: right; font-weight: 700;">${this._escapeHtml(section.courseName)}</td>
          <td><span class="tag-badge">${this._escapeHtml(section.courseKey)}</span></td>
          <td><strong>${this._escapeHtml(section.section)}</strong></td>
          <td>${this._escapeHtml(section.instructor)}</td>
          <td class="time-cell">${this._formatDaySlot(section.days.su)}</td>
          <td class="time-cell">${this._formatDaySlot(section.days.mo)}</td>
          <td class="time-cell">${this._formatDaySlot(section.days.tu)}</td>
          <td class="time-cell">${this._formatDaySlot(section.days.we)}</td>
          <td class="time-cell">${this._formatDaySlot(section.days.th)}</td>
          <td><span class="seats-badge ${seatsBadgeClass}">${section.availableSeats}</span></td>
          <td><span class="seats-badge">${section.enrolledSeats}</span></td>
        </tr>
      `;
    }).join('');
  }

  _formatDaySlot(slots) {
    if (!slots || slots.length === 0) return '-';
    return slots.map(s => s.formatted).join('<br>');
  }

  _escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }
}
