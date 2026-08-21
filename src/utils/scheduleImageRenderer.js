import { DAYS } from '../engine/time.js';

const DAY_LABELS = {
  ar: { su: 'الأحد', mo: 'الاثنين', tu: 'الثلاثاء', we: 'الأربعاء', th: 'الخميس' },
  en: { su: 'Sunday', mo: 'Monday', tu: 'Tuesday', we: 'Wednesday', th: 'Thursday' }
};

/* Desaturated print-ink palette — mirrors --course-color-* tokens */
const PALETTE = ['#41678c', '#3d7357', '#b05f33', '#8a5069', '#a07a2e', '#33747d', '#685a90', '#407464', '#99563e', '#5d7040'];

const SERIF = '"Thmanyah Serif", Georgia, "Times New Roman", serif';
const SANS = '"Thmanyah Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif';
const MONO = '"JetBrains Mono", ui-monospace, Menlo, Consolas, monospace';

export class ScheduleImageRenderer {
  static render(schedule, { compact = false, lang = 'ar', theme = 'light', scale = 2 } = {}) {
    if (!schedule?.sections?.length) throw new Error('No schedule data to export');

    return compact
      ? this._renderCompact(schedule, { lang, theme, scale })
      : this._renderWeekly(schedule, { lang, theme, scale });
  }

  /* ======================================================================
     Compact (day-by-day) export
     ====================================================================== */
  static _renderCompact(schedule, { lang, theme, scale }) {
    const labels = DAY_LABELS[lang];
    const rtl = lang === 'ar';
    const days = DAYS.filter(day => (schedule.sections || []).some(section => section.days?.[day]?.length));

    const width = 1080;
    const margin = 64;
    const headerH = 210;
    const dayLabelH = 78;
    const eventH = 112;
    const eventGap = 14;
    const dayGap = 44;
    const footerH = 84;

    const dayHeights = days.map(day => dayLabelH + this._events(schedule, day).length * (eventH + eventGap));
    const height = headerH + dayHeights.reduce((s, v) => s + v + dayGap, 0) - dayGap + footerH;

    const canvas = this._canvas(width, height, scale);
    const ctx = canvas.getContext('2d');
    const colors = this._colors(schedule);
    const C = this._themeColors(theme);

    this._background(ctx, width, height, C);

    // Masthead
    this._masthead(ctx, width, margin, lang === 'ar' ? 'جدولي الدراسي' : 'My Schedule', lang, theme, C);

    let y = headerH;
    days.forEach((day, di) => {
      const events = this._events(schedule, day);

      // Day label: small-caps mono with a leading rule
      const labelX = rtl ? width - margin : margin;
      const ruleW = 56;
      const fontSize = 30;
      ctx.font = `700 ${fontSize}px ${MONO}`;
      const labelW = ctx.measureText(labels[day]).width;
      this._text(ctx, labels[day].toUpperCase(), labelX, y + 24, 24, true, C.ink, rtl ? 'right' : 'left', lang, MONO);
      const ruleStart = rtl ? labelX - labelW - 18 : labelX + labelW + 18;
      ctx.fillStyle = C.accent;
      ctx.globalAlpha = 0.55;
      ctx.fillRect(rtl ? ruleStart - ruleW : ruleStart, y + 22, ruleW, 2);
      ctx.globalAlpha = 1;

      let ey = y + dayLabelH;
      events.forEach(event => {
        const color = colors.get(event.section.courseKey) || PALETTE[0];
        const bx = margin;
        const bw = width - margin * 2;
        const bh = eventH - eventGap;

        // Tinted panel + accent bar on the reading-start edge
        this._roundedRect(ctx, bx, ey, bw, bh, 10, this._mix(color, C.surface, 0.88));
        ctx.strokeStyle = this._mix(color, C.surface, 0.62);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(bx + 0.75, ey + 0.75, bw - 1.5, bh - 1.5, 10);
        ctx.stroke();
        ctx.fillStyle = color;
        this._roundRectFill(ctx, rtl ? bx + bw - 5 : bx, ey, 5, bh, [2.5]);

        const padX = 34;
        const textX = rtl ? bx + bw - padX - 8 : bx + padX + 8;
        const align = rtl ? 'right' : 'left';
        const timeX = rtl ? bx + padX + 8 : bx + bw - padX - 8;
        const timeAlign = rtl ? 'left' : 'right';

        this._text(ctx, event.section.courseName || event.section.courseKey, textX, ey + 34, 28, true, C.ink, align, lang, SANS);
        this._text(ctx, event.section.courseKey, textX, ey + 66, 20, false, C.muted, align, lang, MONO);
        if (event.section.section) {
          this._text(ctx, `${rtl ? 'شعبة' : 'Section'} ${event.section.section}`, textX, ey + 92, 17, false, C.muted, align, lang, SANS);
        }
        this._text(ctx, event.slot.formatted || '', timeX, ey + bh / 2, 24, true, color, timeAlign, 'en', MONO);

        ey += eventH;
      });

      y += dayHeights[di] + dayGap;
    });

    this._footer(ctx, width, height - 52, lang, theme, C);
    return canvas;
  }

  /* ======================================================================
     Weekly grid export
     ====================================================================== */
  static _renderWeekly(schedule, { lang, theme, scale }) {
    const labels = DAY_LABELS[lang];
    const rtl = lang === 'ar';

    const width = 1800;
    const margin = 72;
    const headerH = 220;
    const dayHeaderH = 66;
    const hourHeight = 96;
    const footerH = 84;

    const startHour = Math.min(8, Math.floor((schedule.metrics?.earliestStartMinutes ?? 480) / 60));
    const endHour = Math.max(16, Math.ceil((schedule.metrics?.latestEndMinutes ?? 1020) / 60));
    const hours = endHour - startHour;

    const height = headerH + dayHeaderH + hours * hourHeight + footerH;
    const gridLeft = margin + 76;
    const gridWidth = width - gridLeft - margin;
    const dayWidth = gridWidth / DAYS.length;
    const gridTop = headerH + dayHeaderH;
    const gridBottom = gridTop + hours * hourHeight;

    const canvas = this._canvas(width, height, scale);
    const ctx = canvas.getContext('2d');
    const colors = this._colors(schedule);
    const C = this._themeColors(theme);

    this._background(ctx, width, height, C);
    this._masthead(ctx, width, margin, lang === 'ar' ? 'جدولي الدراسي الأسبوعي' : 'Weekly Schedule', lang, theme, C);

    // Column x-position honoring RTL reading order
    const colX = i => {
      const col = rtl ? DAYS.length - 1 - i : i;
      return gridLeft + col * dayWidth;
    };

    // Day headers: small-caps text sitting on a heavy baseline rule
    ctx.strokeStyle = C.ruleStrong;
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(gridLeft, gridTop - 14); ctx.lineTo(gridLeft + gridWidth, gridTop - 14); ctx.stroke();

    DAYS.forEach((day, i) => {
      const x = colX(i);
      this._text(ctx, labels[day], x + dayWidth / 2, gridTop - 44, 25, true, C.ink, 'center', lang, SANS);
    });

    // Hour lines + labels
    for (let h = startHour; h <= endHour; h++) {
      const y = gridTop + (h - startHour) * hourHeight;
      ctx.strokeStyle = C.rule;
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(gridLeft, y); ctx.lineTo(gridLeft + gridWidth, y); ctx.stroke();
      const labelX = rtl ? gridLeft + gridWidth + 18 : gridLeft - 18;
      this._text(ctx, `${String(h).padStart(2, '0')}:00`, labelX, y - 12, 19, false, C.muted, rtl ? 'left' : 'right', 'en', MONO);
    }

    // Vertical column separators
    for (let i = 0; i <= DAYS.length; i++) {
      const x = gridLeft + i * dayWidth;
      ctx.strokeStyle = C.rule;
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(x, gridTop); ctx.lineTo(x, gridBottom); ctx.stroke();
    }

    // Course blocks: tinted panels with an ink accent bar
    DAYS.forEach((day, i) => {
      const x = colX(i);
      this._events(schedule, day).forEach(event => {
        const start = event.slot.startMinutes;
        const end = event.slot.endMinutes;
        const y = gridTop + ((start - startHour * 60) / 60) * hourHeight;
        const h = Math.max(56, ((end - start) / 60) * hourHeight - 6);
        const color = colors.get(event.section.courseKey) || PALETTE[0];

        const bx = x + 8;
        const bw = dayWidth - 16;
        this._roundedRect(ctx, bx, y + 3, bw, h, 8, this._mix(color, C.surface, 0.87));
        ctx.strokeStyle = this._mix(color, C.surface, 0.6);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(bx + 0.75, y + 3.75, bw - 1.5, h - 1.5, 8);
        ctx.stroke();
        ctx.fillStyle = color;
        this._roundRectFill(ctx, rtl ? bx + bw - 4 : bx, y + 3, 4, h, [2]);

        const padX = 22;
        const tx = rtl ? bx + bw - padX : bx + padX;
        const align = rtl ? 'right' : 'left';
        this._text(ctx, event.section.courseName || event.section.courseKey, tx, y + 32, 21, true, C.ink, align, lang, SANS);
        this._text(ctx, event.section.courseKey, tx, y + 58, 16, false, this._mix(color, C.surface, 0.25), align, 'en', MONO);
        if (h > 92) {
          this._text(ctx, event.slot.formatted || '', tx, y + 82, 16, true, this._mix(color, C.surface, 0.2), align, 'en', MONO);
          if (h > 128 && event.section.instructor) {
            this._text(ctx, event.section.instructor, tx, y + 106, 15, false, C.muted, align, lang, SANS);
          }
        } else if (h > 68) {
          this._text(ctx, event.slot.formatted || '', tx, y + 78, 15, true, this._mix(color, C.surface, 0.2), align, 'en', MONO);
        }
      });
    });

    this._footer(ctx, width, height - 52, lang, theme, C);
    return canvas;
  }

  /* ======================================================================
     Shared pieces
     ====================================================================== */
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

  static _themeColors(theme) {
    return theme === 'dark'
      ? {
          bg: '#121310', surface: '#191b17',
          ink: '#f2efe7', muted: '#8b897d',
          rule: 'rgba(244,241,232,0.09)', ruleStrong: 'rgba(244,241,232,0.22)',
          accent: '#e2703e'
        }
      : {
          bg: '#f4f1e9', surface: '#fdfcf8',
          ink: '#1b1c15', muted: '#84826f',
          rule: 'rgba(26,27,21,0.10)', ruleStrong: 'rgba(26,27,21,0.45)',
          accent: '#b24a24'
        };
  }

  static _background(ctx, width, height, C) {
    ctx.fillStyle = C.bg;
    ctx.fillRect(0, 0, width, height);
  }

  /* Editorial masthead: mono kicker, serif title, double rule */
  static _masthead(ctx, width, margin, title, lang, theme, C) {
    const rtl = lang === 'ar';
    const x = rtl ? width - margin : margin;
    const align = rtl ? 'right' : 'left';

    this._text(ctx, rtl ? 'جامعة طيبة — SCHEDULEMAKER' : 'SCHEDULEMAKER — TAIBAH UNIVERSITY', x, 74, 17, false, C.accent, align, lang, MONO);
    this._text(ctx, title, x, 126, 52, true, C.ink, align, lang, SERIF);

    // Double rule: heavy then fine, like a newspaper masthead
    ctx.fillStyle = C.ruleStrong;
    ctx.fillRect(margin, 168, width - margin * 2, 3);
    ctx.fillStyle = C.rule;
    ctx.fillRect(margin, 176, width - margin * 2, 1.5);
  }

  static _footer(ctx, width, y, lang, theme, C) {
    const rtl = lang === 'ar';
    ctx.fillStyle = C.rule;
    ctx.fillRect(72, y - 22, width - 144, 1.5);
    this._text(
      ctx,
      rtl ? 'أُنشئ بواسطة ScheduleMaker' : 'Made with ScheduleMaker',
      rtl ? width - 72 : 72, y, 16, false, C.muted, rtl ? 'right' : 'left', lang, SANS
    );
    this._text(ctx, new Date().toLocaleDateString(rtl ? 'ar-SA' : 'en-GB'), rtl ? 72 : width - 72, y, 16, false, C.muted, rtl ? 'left' : 'right', 'en', MONO);
  }

  static _text(ctx, text, x, y, size, bold, color, align = 'left', lang = 'en', family = SANS) {
    ctx.save();
    ctx.direction = lang === 'ar' ? 'rtl' : 'ltr';
    ctx.textAlign = align;
    ctx.textBaseline = 'middle';
    ctx.font = `${bold ? 700 : 500} ${size}px ${family}`;
    ctx.fillStyle = color;
    ctx.fillText(String(text || ''), x, y);
    ctx.restore();
  }

  static _roundedRect(ctx, x, y, w, h, r, fill) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fillStyle = fill;
    ctx.fill();
  }

  /* Rounded bar used for course accent edges */
  static _roundRectFill(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fill();
  }

  static _mix(foreground, background, amount) {
    const a = this._hex(foreground), b = this._hex(background);
    const mix = (x, y) => Math.round(x * (1 - amount) + y * amount);
    return `rgb(${mix(a[0], b[0])}, ${mix(a[1], b[1])}, ${mix(a[2], b[2])})`;
  }

  static _hex(hex) {
    if (!hex.startsWith('#')) return hex.match(/\d+/g).map(Number);
    const clean = hex.replace('#', '');
    return [0, 2, 4].map(i => parseInt(clean.slice(i, i + 2), 16));
  }
}
