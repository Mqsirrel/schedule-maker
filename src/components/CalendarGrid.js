// Interactive Weekly Calendar Grid Component
import { DAYS, DAY_LABELS } from '../engine/time.js';
import { getLang } from '../i18n/translations.js';

const START_HOUR = 8; // 08:00 AM
const END_HOUR = 18;  // 06:00 PM
const TOTAL_HOURS = END_HOUR - START_HOUR; // 10 hours
const PIXELS_PER_MINUTE = 1; // 1 min = 1px => 600px total height

const COLOR_CLASSES = [
  'var(--course-color-1)',
  'var(--course-color-2)',
  'var(--course-color-3)',
  'var(--course-color-4)',
  'var(--course-color-5)',
  'var(--course-color-6)',
  'var(--course-color-7)',
  'var(--course-color-8)',
  'var(--course-color-9)',
  'var(--course-color-10)'
];

export class CalendarGrid {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.onCourseClick = options.onCourseClick || (() => {});
  }

  renderSchedule(schedule) {
    if (!this.container) return;

    if (!schedule || !schedule.sections || schedule.sections.length === 0) {
      this.container.innerHTML = `<div class="empty-state-card"><p>لا توجد بيانات لهذا الجدول</p></div>`;
      return;
    }

    // Map unique course keys to consistent color palette
    const courseColorMap = new Map();
    let colorIdx = 0;
    for (const sec of schedule.sections) {
      if (!courseColorMap.has(sec.courseKey)) {
        courseColorMap.set(sec.courseKey, COLOR_CLASSES[colorIdx % COLOR_CLASSES.length]);
        colorIdx++;
      }
    }

    let html = `
      <div class="calendar-time-axis">
        ${this._renderHourMarkers()}
      </div>
    `;

    for (const day of DAYS) {
      html += `
        <div class="day-column-track" data-day="${day}">
          ${this._renderDayGridlines()}
          ${this._renderDayCourseBlocks(schedule.sections, day, courseColorMap)}
        </div>
      `;
    }

    this.container.innerHTML = html;

    // Attach click listeners to blocks
    this.container.querySelectorAll('.course-block').forEach(block => {
      block.addEventListener('click', () => {
        const secId = block.getAttribute('data-section-id');
        const section = schedule.sections.find(s => s.id === secId);
        if (section) {
          this.onCourseClick(section);
        }
      });
    });
  }

  _renderHourMarkers() {
    let markers = '';
    for (let h = START_HOUR; h < END_HOUR; h++) {
      const timeLabel = `${String(h).padStart(2, '0')}:00`;
      markers += `<div class="hour-marker">${timeLabel}</div>`;
    }
    return markers;
  }

  _renderDayGridlines() {
    let lines = '';
    for (let h = 0; h < TOTAL_HOURS; h++) {
      lines += `<div class="day-column-gridline" style="top: ${h * 60}px;"></div>`;
    }
    return lines;
  }

  _renderDayCourseBlocks(sections, day, courseColorMap) {
    let blocksHtml = '';

    for (const section of sections) {
      const slots = section.days[day] || [];
      const bgColor = courseColorMap.get(section.courseKey) || 'var(--color-primary)';

      for (const slot of slots) {
        const startMin = slot.startMinutes;
        const endMin = slot.endMinutes;

        // Offset from 08:00 (480 mins)
        const top = Math.max(0, (startMin - START_HOUR * 60) * PIXELS_PER_MINUTE);
        const height = Math.max(28, (endMin - startMin) * PIXELS_PER_MINUTE);

        blocksHtml += `
          <div class="course-block" 
               data-section-id="${section.id}" 
               style="top: ${top}px; height: ${height}px; background-color: ${bgColor};"
               title="${this._escapeHtml(section.courseName)} - ${this._escapeHtml(section.instructor)}">
            <div class="course-block-title">${this._escapeHtml(section.courseName)}</div>
            <div class="course-block-code">${this._escapeHtml(section.courseKey)}</div>
            <div class="course-block-footer">
              <span class="course-block-section">شعبة ${this._escapeHtml(section.section)}</span>
              <span class="course-block-time">${this._escapeHtml(slot.formatted)}</span>
            </div>
            ${height > 55 ? `<div class="course-block-instructor">${this._escapeHtml(section.instructor)}</div>` : ''}
          </div>
        `;
      }
    }

    return blocksHtml;
  }

  _escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }
}
