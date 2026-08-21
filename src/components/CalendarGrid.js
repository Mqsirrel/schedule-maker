// Interactive Weekly Calendar Grid Component
import { DAYS } from '../engine/time.js';

const PIXELS_PER_MINUTE = 1; // 1 min = 1px

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

const DAY_LABELS = {
  ar: { su: 'الأحد', mo: 'الاثنين', tu: 'الثلاثاء', we: 'الأربعاء', th: 'الخميس' },
  en: { su: 'Sun', mo: 'Mon', tu: 'Tue', we: 'Wed', th: 'Thu' }
};

export class CalendarGrid {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.onCourseClick = options.onCourseClick || (() => {});
    this.startHour = 8;
    this.endHour = 18;
    this.mobileSelectedDay = null;
  }

  renderSchedule(schedule) {
    if (!this.container) return;

    if (!schedule || !schedule.sections || schedule.sections.length === 0) {
      this.container.innerHTML = `<div class="empty-state-card"><p>لا توجد بيانات لهذا الجدول</p></div>`;
      return;
    }

    // Dynamic hour bounds calculation
    const earliestMin = schedule.metrics?.earliestStartMinutes ?? 480;
    const latestMin = schedule.metrics?.latestEndMinutes ?? 1080;

    this.startHour = Math.min(8, Math.floor(earliestMin / 60));
    this.endHour = Math.max(18, Math.ceil(latestMin / 60));
    const totalHours = this.endHour - this.startHour;
    const gridHeight = totalHours * 60;

    this.container.style.height = `${gridHeight}px`;

    // Map unique course keys to consistent color palette
    const courseColorMap = new Map();
    let colorIdx = 0;
    for (const sec of schedule.sections) {
      if (!courseColorMap.has(sec.courseKey)) {
        courseColorMap.set(sec.courseKey, COLOR_CLASSES[colorIdx % COLOR_CLASSES.length]);
        colorIdx++;
      }
    }

    const desktopHtml = `
      <div class="desktop-calendar-grid">
        <div class="calendar-time-axis">
          ${this._renderHourMarkers()}
        </div>
        ${DAYS.map(day => `
          <div class="day-column-track" data-day="${day}">
            ${this._renderDayGridlines(totalHours)}
            ${this._renderDayCourseBlocks(schedule.sections, day, courseColorMap)}
          </div>
        `).join('')}
      </div>
    `;

    const mobileHtml = this._renderMobileAgenda(schedule, courseColorMap);

    this.container.innerHTML = `${desktopHtml}${mobileHtml}`;
    this.container.style.height = '';

    this._bindCourseClicks(schedule);
    this._bindMobileDayNavigation(schedule, courseColorMap);
  }

  _renderMobileAgenda(schedule, courseColorMap) {
    const lang = document.documentElement.lang === 'en' ? 'en' : 'ar';
    const labels = DAY_LABELS[lang];
    const availableDays = DAYS.filter(day => (schedule.sections || []).some(sec => (sec.days?.[day] || []).length > 0));
    const initialDay = this.mobileSelectedDay && availableDays.includes(this.mobileSelectedDay)
      ? this.mobileSelectedDay
      : (availableDays[0] || DAYS[0]);

    this.mobileSelectedDay = initialDay;

    const tabs = DAYS.map(day => {
      const hasClasses = availableDays.includes(day);
      const selected = day === initialDay;
      return `
        <button class="mobile-day-tab${selected ? ' is-active' : ''}${hasClasses ? '' : ' is-empty'}"
                type="button"
                data-mobile-day="${day}"
                aria-pressed="${selected ? 'true' : 'false'}">
          <span>${this._escapeHtml(labels[day])}</span>
          ${hasClasses ? `<span class="mobile-day-count">${this._countDayEvents(schedule.sections, day)}</span>` : ''}
        </button>
      `;
    }).join('');

    return `
      <div class="mobile-calendar-view" aria-label="${lang === 'ar' ? 'الجدول اليومي' : 'Daily schedule'}">
        <div class="mobile-calendar-heading">
          <div>
            <span class="mobile-calendar-kicker">${lang === 'ar' ? 'عرض مختصر' : 'Compact view'}</span>
            <strong class="mobile-calendar-title">${this._escapeHtml(labels[initialDay])}</strong>
          </div>
          <span class="mobile-calendar-hint">${lang === 'ar' ? 'اختر اليوم' : 'Choose a day'}</span>
        </div>
        <div class="mobile-day-tabs" role="tablist" aria-label="${lang === 'ar' ? 'أيام الأسبوع' : 'Week days'}">
          ${tabs}
        </div>
        <div class="mobile-agenda" data-mobile-agenda></div>
      </div>
    `;
  }

  _bindMobileDayNavigation(schedule, courseColorMap) {
    const mobileView = this.container.querySelector('.mobile-calendar-view');
    if (!mobileView) return;

    const agenda = mobileView.querySelector('[data-mobile-agenda]');
    const title = mobileView.querySelector('.mobile-calendar-title');
    const lang = document.documentElement.lang === 'en' ? 'en' : 'ar';
    const labels = DAY_LABELS[lang];

    const renderDay = (day) => {
      this.mobileSelectedDay = day;
      const events = this._getDayEvents(schedule.sections, day);

      mobileView.querySelectorAll('.mobile-day-tab').forEach(tab => {
        const selected = tab.dataset.mobileDay === day;
        tab.classList.toggle('is-active', selected);
        tab.setAttribute('aria-pressed', selected ? 'true' : 'false');
      });

      if (title) title.textContent = labels[day];

      if (events.length === 0) {
        agenda.innerHTML = `
          <div class="mobile-agenda-empty">
            <span class="mobile-agenda-empty-icon" aria-hidden="true">—</span>
            <strong>${lang === 'ar' ? 'يوم فراغ' : 'Day off'}</strong>
            <span>${lang === 'ar' ? 'ما عندك محاضرات في هذا اليوم' : 'No classes scheduled for this day'}</span>
          </div>
        `;
        return;
      }

      agenda.innerHTML = events.map(event => {
        const color = courseColorMap.get(event.section.courseKey) || 'var(--color-primary)';
        const duration = Math.max(1, event.slot.endMinutes - event.slot.startMinutes);
        const instructor = event.section.instructor || (lang === 'ar' ? 'غير محدد' : 'TBA');
        const formatTime = (mins) => {
          const h = Math.floor(mins / 60);
          const m = mins % 60;
          return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        };
        const startTime = formatTime(event.slot.startMinutes);
        const endTime = formatTime(event.slot.endMinutes);
        return `
          <button class="mobile-course-item" type="button" data-section-id="${this._escapeHtml(event.section.id)}">
            <span class="mobile-course-time">
              <span class="mobile-time-start">${startTime}</span>
              <span class="mobile-time-sep">—</span>
              <span class="mobile-time-end">${endTime}</span>
            </span>
            <span class="mobile-course-line" style="--mobile-course-color: ${color};" aria-hidden="true"></span>
            <span class="mobile-course-content">
              <span class="mobile-course-title">${this._escapeHtml(event.section.courseName)}</span>
              <span class="mobile-course-code">${this._escapeHtml(event.section.courseKey)}</span>
              <span class="mobile-course-meta">
                <span>شعبة ${this._escapeHtml(event.section.section)}</span>
                <span>${this._escapeHtml(instructor)}</span>
                <span>${duration} ${lang === 'ar' ? 'دقيقة' : 'min'}</span>
              </span>
            </span>
          </button>
        `;
      }).join('');

      agenda.querySelectorAll('.mobile-course-item').forEach(item => {
        item.addEventListener('click', () => {
          const secId = item.getAttribute('data-section-id');
          const section = schedule.sections.find(s => s.id === secId);
          if (section) this.onCourseClick(section);
        });
      });
    };

    mobileView.querySelectorAll('.mobile-day-tab').forEach(tab => {
      tab.addEventListener('click', () => renderDay(tab.dataset.mobileDay));
    });

    renderDay(this.mobileSelectedDay);
  }

  _getDayEvents(sections, day) {
    const events = [];
    for (const section of sections) {
      for (const slot of (section.days?.[day] || [])) {
        events.push({ section, slot });
      }
    }
    return events.sort((a, b) => a.slot.startMinutes - b.slot.startMinutes);
  }

  _countDayEvents(sections, day) {
    return sections.reduce((count, section) => count + (section.days?.[day]?.length || 0), 0);
  }

  _bindCourseClicks(schedule) {
    this.container.querySelectorAll('.desktop-calendar-grid .course-block').forEach(block => {
      block.addEventListener('click', () => {
        const secId = block.getAttribute('data-section-id');
        const section = schedule.sections.find(s => s.id === secId);
        if (section) this.onCourseClick(section);
      });
    });
  }

  _renderHourMarkers() {
    let markers = '';
    for (let h = this.startHour; h < this.endHour; h++) {
      const timeLabel = `${String(h).padStart(2, '0')}:00`;
      markers += `<div class="hour-marker">${timeLabel}</div>`;
    }
    return markers;
  }

  _renderDayGridlines(totalHours) {
    let lines = '';
    for (let h = 0; h < totalHours; h++) {
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
        const top = Math.max(0, (startMin - this.startHour * 60) * PIXELS_PER_MINUTE);
        const height = Math.max(28, (endMin - startMin) * PIXELS_PER_MINUTE);

        blocksHtml += `
          <div class="course-block"
               data-section-id="${this._escapeHtml(section.id)}"
               style="top: ${top}px; height: ${height}px; --block-bg: ${bgColor};"
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
