export class ScheduleActions {
  constructor({ state, storageService, exportService, notification, translate }) {
    this.state = state;
    this.storageService = storageService;
    this.exportService = exportService;
    this.notification = notification;
    this.t = translate;
  }

  toggleBookmark(button) {
    const current = this.state.getCurrentSchedule();
    if (!current) return false;
    const added = this.storageService.toggleBookmark(current);
    button?.classList.toggle('bookmarked', added);
    this.notification.showSuccess(added ? 'تمت إضافة الجدول للمفضلة' : 'تمت إزالة الجدول من المفضلة');
    return added;
  }

  async copyCrns(fallbackCopy) {
    const current = this.state.getCurrentSchedule();
    if (!current?.sections) return;
    const lines = current.sections.map(s => `${s.courseKey || `${s.courseCode || ''} ${s.courseNumber || ''}`.trim()} ${s.section ? `(شعبة ${s.section})` : ''} ${s.courseName ? `- ${s.courseName}` : ''}`.trim()).join('\n');
    const payload = `${lines}\n\nأرقام الشعب (CRNs):\n${current.sections.map(s => s.section).filter(Boolean).join(', ')}`;
    if (navigator.clipboard?.writeText) {
      try { await navigator.clipboard.writeText(payload); this.notification.showSuccess(this.t('toast_crns_copied')); return; }
      catch { /* use legacy fallback */ }
    }
    fallbackCopy(payload);
  }

  async exportPng(area, index) {
    if (!area) return;
    this.notification.showInfo('جاري تجهيز الصورة...');
    const success = await this.exportService.image(area, `Taibah_Schedule_${index + 1}.png`);
    if (success) this.notification.showSuccess(this.t('toast_export_png_success'));
  }

  exportIcs() {
    const current = this.state.getCurrentSchedule();
    if (current && this.exportService.ics(current)) this.notification.showSuccess(this.t('toast_export_ics_success'));
  }
}
