import { DAYS } from '../engine/time.js';

const DAY_LABELS = {
  ar: { su: 'الأحد', mo: 'الاثنين', tu: 'الثلاثاء', we: 'الأربعاء', th: 'الخميس' },
  en: { su: 'Sunday', mo: 'Monday', tu: 'Tuesday', we: 'Wednesday', th: 'Thursday' }
};

const PALETTE = ['#5B8DEF', '#8B6FD9', '#2FAF8F', '#E19A45', '#D8647A', '#4AA8C7', '#7E9F48', '#B56BA8'];

export class ScheduleImageRenderer {
  static render(schedule, { compact = false, lang = 'ar', theme = 'light', scale = 2 } = {}) {
    if (!schedule?.sections?.length) throw new Error('No schedule data to export');

    return compact
      ? this._renderCompact(schedule, { lang, theme, scale })
      : this._renderWeekly(schedule, { lang, theme, scale });
  }

  static _renderCompact(schedule, { lang, theme, scale }) {
    const labels = DAY_LABELS[lang];
    const days = DAYS.filter(day => (schedule.sections || []).some(section => section.days?.[day]?.length));
    const width = 1080;
    const header = 190;
    const dayHeader = 86;
    const eventHeight = 118;
    const dayGap = 24;
    const dayHeights = days.map(day => dayHeader + Math.max(1, this._events(schedule, day).length) * eventHeight);
    const height = header + dayHeights.reduce((sum, value) => sum + value + dayGap, 0) + 70;
    const canvas = this._canvas(width, height, scale);
    const ctx = canvas.getContext('2d');
    const colors = this._colors(schedule);

    this._background(ctx, width, height, theme);
    this._header(ctx, width, 40, lang === 'ar' ? 'جدولي الدراسي' : 'My Schedule', lang, theme);

    let y = header;
    days.forEach((day, index) => {
      const events = this._events(schedule, day);
      this._roundedRect(ctx, 40, y, width - 80, dayHeights[index], 28, theme === 'dark' ? '#171a19' : '#ffffff');
      this._text(ctx, labels[day], width - 76, y + 54, 34, true, this._ink(theme), 'right', lang);

      let eventY = y + dayHeader;
      events.forEach(event => {
        const color = colors.get(event.section.courseKey) || PALETTE[0];
        this._roundedRect(ctx, 62, eventY, width - 124, eventHeight - 14, 20, this._mix(color, theme === 'dark' ? '#151817' : '#f7f8f8', 0.84));
        ctx.fillStyle = color;
        ctx.fillRect(62, eventY + 18, 8, eventHeight - 50);

        const rtl = lang === 'ar';
        const x = rtl ? width - 96 : 96;
        this._text(ctx, event.section.courseName || event.section.courseKey, x, eventY + 38, 29, true, this._ink(theme), rtl ? 'right' : 'left', lang);
        this._text(ctx, event.section.courseKey, x, eventY + 72, 22, false, this._muted(theme), rtl ? 'right' : 'left', lang);
        this._text(ctx, event.slot.formatted || '', rtl ? 96 : width - 96, eventY + 44, 25, true, color, rtl ? 'left' : 'right', 'en');
        this._text(ctx, event.section.section ? `${lang === 'ar' ? 'شعبة' : 'Section'} ${event.section.section}` : '', x, eventY + 99, 18, false, this._muted(theme), rtl ? 'right' : 'left', lang);
        eventY += eventHeight;
      });
      y += dayHeights[index] + dayGap;
    });

    return canvas;
  }

  static _renderWeekly(schedule, { lang, theme, scale }) {
    const labels = DAY_LABELS[lang];
    const width = 1800;
    const height = 1220;
    const left = 150;
    const top = 190;
    const gridWidth = width - left - 50;
    const dayWidth = gridWidth / DAYS.length;
    const startHour = Math.min(8, Math.floor((schedule.metrics?.earliestStartMinutes ?? 480) / 60));
    const endHour = Math.max(18, Math.ceil((schedule.metrics?.latestEndMinutes ?? 1080) / 60));
    const hourHeight = (height - top - 60) / (endHour - startHour);
    const canvas = this._canvas(width, height, scale);
    const ctx = canvas.getContext('2d');
    const colors = this._colors(schedule);

    this._background(ctx, width, height, theme);
    this._header(ctx, width, 42, lang === 'ar' ? 'جدولي الدراسي الأسبوعي' : 'Weekly Schedule', lang, theme);

    DAYS.forEach((day, index) => {
      const x = left + index * dayWidth;
      this._roundedRect(ctx, x + 5, top - 62, dayWidth - 10, 52, 14, theme === 'dark' ? '#1b1f1d' : '#ffffff');
      this._text(ctx, labels[day], x + dayWidth / 2, top - 28, 24, true, this._ink(theme), 'center', lang);
    });

    for (let hour = startHour; hour <= endHour; hour++) {
      const y = top + (hour - startHour) * hourHeight;
      ctx.strokeStyle = theme === 'dark' ? '#2a302d' : '#dfe4e1';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(left, y); ctx.lineTo(width - 50, y); ctx.stroke();
      this._text(ctx, `${String(hour).padStart(2, '0')}:00`, left - 22, y + 7, 20, false, this._muted(theme), 'right', 'en');
    }

    DAYS.forEach((day, index) => {
      const x = left + index * dayWidth;
      ctx.strokeStyle = theme === 'dark' ? '#2a302d' : '#e5e9e7';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(x, top); ctx.lineTo(x, height - 60); ctx.stroke();
      this._events(schedule, day).forEach(event => {
        const start = event.slot.startMinutes;
        const end = event.slot.endMinutes;
        const y = top + ((start - startHour * 60) / 60) * hourHeight;
        const h = Math.max(54, ((end - start) / 60) * hourHeight - 8);
        const color = colors.get(event.section.courseKey) || PALETTE[0];
        this._roundedRect(ctx, x + 10, y + 4, dayWidth - 20, h, 18, this._mix(color, theme === 'dark' ? '#151817' : '#f7f8f8', 0.82));
        ctx.fillStyle = color; ctx.fillRect(x + 10, y + 4, 8, Math.max(24, h - 8));
        this._text(ctx, event.section.courseName || event.section.courseKey, x + 30, y + 34, 21, true, this._ink(theme), 'left', lang);
        this._text(ctx, event.section.courseKey, x + 30, y + 61, 17, false, this._muted(theme), 'left', 'en');
        if (h > 90) this._text(ctx, event.slot.formatted || '', x + 30, y + 87, 17, true, color, 'left', 'en');
      });
    });

    return canvas;
  }

  static _events(schedule, day) {
    const events = [];
    for (const section of schedule.sections || []) {
      for (const slot of section.days?.[day] || []) events.push({ section, slot });
    }
    return events.sort((a, b) => a.slot.startMinutes - b.slot.startMinutes);
  }

  static _colors(schedule) {
    const map = new Map(); let i = 0;
    for (const section of schedule.sections || []) {
      if (!map.has(section.courseKey)) map.set(section.courseKey, PALETTE[i++ % PALETTE.length]);
    }
    return map;
  }

  static _canvas(width, height, scale) {
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext('2d');
    ctx.scale(scale, scale);
    return canvas;
  }

  static _background(ctx, width, height, theme) {
    ctx.fillStyle = theme === 'dark' ? '#10110f' : '#f3f0e8';
    ctx.fillRect(0, 0, width, height);
  }

  static _header(ctx, width, x, title, lang, theme) {
    this._text(ctx, title, lang === 'ar' ? width - 52 : 52, x + 48, 44, true, this._ink(theme), lang === 'ar' ? 'right' : 'left', lang);
    this._text(ctx, 'ScheduleMaker', lang === 'ar' ? width - 52 : 52, x + 82, 18, false, this._muted(theme), lang === 'ar' ? 'right' : 'left', 'en');
  }

  static _text(ctx, text, x, y, size, bold, color, align = 'left', lang = 'en') {
    ctx.save();
    ctx.direction = lang === 'ar' ? 'rtl' : 'ltr';
    ctx.textAlign = align;
    ctx.textBaseline = 'middle';
    ctx.font = `${bold ? 700 : 500} ${size}px -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Arial, sans-serif`;
    ctx.fillStyle = color;
    ctx.fillText(String(text || ''), x, y, 760);
    ctx.restore();
  }

  static _roundedRect(ctx, x, y, w, h, r, fill) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fillStyle = fill;
    ctx.fill();
  }

  static _ink(theme) { return theme === 'dark' ? '#f2f4f2' : '#1d211f'; }
  static _muted(theme) { return theme === 'dark' ? '#aab2ad' : '#66706a'; }

  static _mix(foreground, background, amount) {
    const a = this._hex(foreground), b = this._hex(background);
    const mix = (x, y) => Math.round(x * (1 - amount) + y * amount);
    return `rgb(${mix(a[0], b[0])}, ${mix(a[1], b[1])}, ${mix(a[2], b[2])})`;
  }

  static _hex(hex) {
    const clean = hex.replace('#', '');
    return [0, 2, 4].map(i => parseInt(clean.slice(i, i + 2), 16));
  }
}
