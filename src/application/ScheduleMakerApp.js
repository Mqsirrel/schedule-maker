import '../styles/responsive-foundation.css';
import { NotificationManager } from '../components/Notification.js';
import { CourseSelector } from '../components/CourseSelector.js';
import { CalendarGrid } from '../components/CalendarGrid.js';
import { TableView } from '../components/TableView.js';
import { FilterBar } from '../components/FilterBar.js';
import { ImportModal } from '../components/ImportModal.js';
import { HelpModal } from '../components/HelpModal.js';
import { getSampleSections } from '../engine/sampleData.js';
import { t, getLang, setLang, updateDOMTranslations } from '../i18n/translations.js';
import { AppState } from './AppState.js';
import { filterSchedules } from './filterSchedules.js';
import { generateSchedules, getScheduleConflicts } from './scheduleActions.js';
import { storageService } from '../services/storageService.js';
import { exportService } from '../services/exportService.js';

export class ScheduleMakerApp {
  constructor() {
    this.state = new AppState();
    this._init();
  }

  get timetableSections() { return this.state.get('timetableSections'); }
  set timetableSections(value) { this.state.set('timetableSections', value); }
  get wantedCourseGroups() { return this.state.get('wantedCourseGroups'); }
  set wantedCourseGroups(value) { this.state.set('wantedCourseGroups', value); }
  get allGeneratedSchedules() { return this.state.get('allGeneratedSchedules'); }
  set allGeneratedSchedules(value) { this.state.set('allGeneratedSchedules', value); }
  get filteredSchedules() { return this.state.get('filteredSchedules'); }
  set filteredSchedules(value) { this.state.set('filteredSchedules', value); }
  get currentScheduleIndex() { return this.state.get('currentScheduleIndex'); }
  set currentScheduleIndex(value) { this.state.set('currentScheduleIndex', value); }
  get currentView() { return this.state.get('currentView'); }
  set currentView(value) { this.state.set('currentView', value); }

  _init() {
    this.notification = new NotificationManager();
    this.helpModal = new HelpModal();
    this.importModal = new ImportModal({
      notification: this.notification,
      onTimetableLoaded: sections => this.onTimetableLoaded(sections),
      onOpenHelp: () => this.helpModal.open()
    });
    this.courseSelector = new CourseSelector({
      notification: this.notification,
      onCoursesChange: groups => this.onWantedCoursesChanged(groups),
      onGenerate: () => this.generateSchedules()
    });
    this.calendarGrid = new CalendarGrid('calendarGridMatrix', {
      onCourseClick: section => this.showCourseDetailModal(section)
    });
    this.tableView = new TableView('scheduleDetailTbody');
    this.filterBar = new FilterBar({ onFilterChange: filters => this.applyFilters(filters) });

    this._initDOMElements();
    this._bindEvents();
    this._checkCachedData();
    updateDOMTranslations();
  }

  _initDOMElements() {
    const ids = [
      'btnToggleTheme','btnToggleLang','btnLoadDemo','resultsToolbar','resultsPlaceholder',
      'calendarViewContainer','tableViewContainer','btnViewCalendar','btnViewTable',
      'btnPrevSchedule','btnNextSchedule','currScheduleIndex','totalSchedulesCount',
      'statScore','valScore','valDaysOff','valTotalGaps','btnCopyCrns','btnBookmarkSchedule',
      'btnExportImage','btnExportIcs','conflictDiagnosticBox','courseDetailModal',
      'courseDetailBody','btnCloseCourseDetail'
    ];
    for (const id of ids) this[id] = document.getElementById(id);
  }

  _bindEvents() {
    this.btnToggleTheme.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      storageService.setTheme(next);
    });
    this.btnToggleLang.addEventListener('click', () => {
      setLang(getLang() === 'ar' ? 'en' : 'ar');
      this.courseSelector._updateStatusBadge();
      this.renderCurrentSchedule();
    });
    window.addEventListener('keydown', e => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') this.navigateSchedule(getLang() === 'ar' ? -1 : 1);
      else if (e.key === 'ArrowLeft') this.navigateSchedule(getLang() === 'ar' ? 1 : -1);
      else if (e.key === 'b' || e.key === 'B' || e.key === 'لا') this.toggleCurrentBookmark();
      else if (e.key === 'Escape') {
        this.importModal.close(); this.helpModal.close();
        if (this.courseDetailModal) this.courseDetailModal.close();
      }
    });
    this.btnLoadDemo.addEventListener('click', () => this.loadDemoDataset());
    this.btnViewCalendar.addEventListener('click', () => this.switchView('calendar'));
    this.btnViewTable.addEventListener('click', () => this.switchView('table'));
    this.btnPrevSchedule.addEventListener('click', () => this.navigateSchedule(-1));
    this.btnNextSchedule.addEventListener('click', () => this.navigateSchedule(1));
    if (this.btnCopyCrns) this.btnCopyCrns.addEventListener('click', () => this.copyCurrentScheduleCrns());
    this.btnBookmark.addEventListener('click', () => this.toggleCurrentBookmark());
    this.btnExportImage.addEventListener('click', () => this.exportCurrentSchedulePng());
    this.btnExportIcs.addEventListener('click', () => this.exportCurrentScheduleIcs());
    if (this.btnCloseCourseDetail) this.btnCloseCourseDetail.addEventListener('click', () => this.courseDetailModal.close());
  }

  _checkCachedData() {
    const cached = storageService.getTimetable();
    if (cached?.length) {
      this.timetableSections = cached;
      this.courseSelector.setTimetableData(cached);
    }
    this.wantedCourseGroups = this.courseSelector.getWantedCourseGroups();
  }

  onTimetableLoaded(sections) {
    this.timetableSections = sections;
    storageService.saveTimetable(sections);
    this.courseSelector.setTimetableData(sections);
  }

  loadDemoDataset() {
    this.onTimetableLoaded(getSampleSections());
    setTimeout(() => {
      const code = document.getElementById('courseCode');
      const number = document.getElementById('courseNumber');
      for (const [c, n] of [['CS','181'], ['MATH','101'], ['PHYS','101']]) {
        code.value = c; number.value = n; this.courseSelector.addCurrentCourse();
      }
      this.notification.showSuccess(t('toast_demo_loaded'));
      this.generateSchedules();
    }, 150);
  }

  onWantedCoursesChanged(groups) {
    this.wantedCourseGroups = groups;
    if (!groups.length) { this.state.resetResults(); this._updateDisplayState(); }
  }

  async generateSchedules() {
    if (!this.wantedCourseGroups.length) return;
    const filters = this.filterBar.getFilterState();
    const schedules = await generateSchedules(this.wantedCourseGroups, {
      allowFullSeats: filters.allowFullSeats, maxResults: 2000
    });
    this.state.setGeneratedSchedules(schedules);
    if (!schedules.length) {
      this.notification.showError(t('toast_no_schedules_found'));
      const bottlenecks = getScheduleConflicts(this.wantedCourseGroups);
      this._renderConflictDiagnostics(bottlenecks);
      this._updateDisplayState();
      return;
    }
    this._renderConflictDiagnostics([]);
    this.notification.playChime();
    this.notification.showSuccess(t('toast_schedules_found', { count: schedules.length }));
    this.applyFilters(filters);
  }

  applyFilters(filters) {
    const result = filterSchedules(this.allGeneratedSchedules, filters);
    this.state.setFilteredSchedules(result);
    this._updateDisplayState();
    if (result.length) this.renderCurrentSchedule();
  }

  _renderConflictDiagnostics(bottlenecks) {
    if (!this.conflictDiagnosticBox) return;
    if (!bottlenecks.length) { this.conflictDiagnosticBox.style.display = 'none'; return; }
    const items = bottlenecks.map(b => `<li>${t('conflict_between_courses', {
      c1: `<strong>${this._escapeHtml(b.courseA)}</strong>`, c2: `<strong>${this._escapeHtml(b.courseB)}</strong>`
    })}</li>`).join('');
    this.conflictDiagnosticBox.innerHTML = `<div class="diagnostic-title"><strong>${t('conflict_diagnostic_title')}</strong></div><ul class="diagnostic-list">${items}</ul><p class="diagnostic-tip">💡 نصيحة: جرّب إزالة إحدى المادتين المتعارضتين أو تفعيل خيار الشعب الممتلئة لإيجاد جدول متوافق.</p>`;
    this.conflictDiagnosticBox.style.display = 'block';
  }

  _updateDisplayState() {
    const has = this.filteredSchedules.length > 0;
    this.resultsToolbar.style.display = has ? 'flex' : 'none';
    this.resultsPlaceholder.style.display = has ? 'none' : 'flex';
    this.calendarViewContainer.style.display = has && this.currentView === 'calendar' ? 'block' : 'none';
    this.tableViewContainer.style.display = has && this.currentView === 'table' ? 'block' : 'none';
  }

  renderCurrentSchedule() {
    const current = this.state.getCurrentSchedule();
    if (!current) return;
    this.currIndexEl.textContent = this.currentScheduleIndex + 1;
    this.totalCountEl.textContent = this.filteredSchedules.length;
    this.btnPrevSchedule.disabled = this.currentScheduleIndex === 0;
    this.btnNextSchedule.disabled = this.currentScheduleIndex >= this.filteredSchedules.length - 1;
    if (typeof current.score === 'number' && this.statScore && this.valScore) {
      this.valScore.textContent = `${current.score}%`; this.statScore.style.display = 'inline-flex';
    } else if (this.statScore) this.statScore.style.display = 'none';
    this.valDaysOff.textContent = current.metrics.daysOffCount;
    this.valTotalGaps.textContent = `${current.metrics.totalGapHours}h`;
    this.btnBookmark.classList.toggle('bookmarked', storageService.isBookmarked(current.id));
    if (this.currentView === 'calendar') this.calendarGrid.renderSchedule(current);
    else this.tableView.renderSchedule(current);
  }

  navigateSchedule(delta) { if (this.state.navigateSchedule(delta)) this.renderCurrentSchedule(); }

  switchView(view) {
    this.currentView = view;
    this.btnViewCalendar.classList.toggle('active', view === 'calendar');
    this.btnViewCalendar.setAttribute('aria-selected', String(view === 'calendar'));
    this.btnViewTable.classList.toggle('active', view === 'table');
    this.btnViewTable.setAttribute('aria-selected', String(view === 'table'));
    this._updateDisplayState();
    this.renderCurrentSchedule();
  }

  showCourseDetailModal(section) {
    if (!section || !this.courseDetailModal) return;
    this.courseDetailBody.innerHTML = `<div style="display:flex;flex-direction:column;gap:.85rem"><div><h4 style="font-size:1.15rem;color:var(--color-primary)">${this._escapeHtml(section.courseName)}</h4><p style="font-size:.9rem;margin-top:.2rem">${this._escapeHtml(section.courseKey)} - شعبة ${this._escapeHtml(section.section)}</p></div><div style="background:var(--color-bg-base);padding:1rem;border-radius:var(--radius-md);border:1px solid var(--color-border);display:grid;grid-template-columns:1fr 1fr;gap:.75rem;font-size:.9rem"><div><strong>أستاذ المادة:</strong> ${this._escapeHtml(section.instructor)}</div><div><strong>الفرع:</strong> ${this._escapeHtml(section.branch || 'المقر الرئيسي')}</div><div><strong>المقاعد المتاحة:</strong> ${section.availableSeats}</div><div><strong>المسجلون:</strong> ${section.enrolledSeats}</div></div></div>`;
    this.courseDetailModal.showModal();
  }

  toggleCurrentBookmark() {
    const current = this.state.getCurrentSchedule(); if (!current) return;
    const added = storageService.toggleBookmark(current);
    this.btnBookmark.classList.toggle('bookmarked', added);
    this.notification.showSuccess(added ? 'تمت إضافة الجدول للمفضلة' : 'تمت إزالة الجدول من المفضلة');
  }

  copyCurrentScheduleCrns() {
    const current = this.state.getCurrentSchedule(); if (!current?.sections) return;
    const lines = current.sections.map(s => `${s.courseKey || `${s.courseCode || ''} ${s.courseNumber || ''}`.trim()} ${s.section ? `(شعبة ${s.section})` : ''} ${s.courseName ? `- ${s.courseName}` : ''}`.trim()).join('\n');
    const payload = `${lines}\n\nأرقام الشعب (CRNs):\n${current.sections.map(s => s.section).filter(Boolean).join(', ')}`;
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(payload).then(() => this.notification.showSuccess(t('toast_crns_copied'))).catch(() => this._fallbackCopy(payload));
    else this._fallbackCopy(payload);
  }

  _fallbackCopy(text) {
    const ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.focus(); ta.select();
    try { document.execCommand('copy'); this.notification.showSuccess(t('toast_crns_copied')); } catch { this.notification.showInfo(text); }
    document.body.removeChild(ta);
  }

  async exportCurrentSchedulePng() {
    const area = document.getElementById('calendarPrintableArea'); if (!area) return;
    this.notification.showInfo('جاري تجهيز الصورة...');
    const success = await exportService.image(area, `Taibah_Schedule_${this.currentScheduleIndex + 1}.png`);
    if (success) this.notification.showSuccess(t('toast_export_png_success'));
  }

  exportCurrentScheduleIcs() {
    const current = this.state.getCurrentSchedule(); if (!current) return;
    if (exportService.ics(current)) this.notification.showSuccess(t('toast_export_ics_success'));
  }

  _escapeHtml(str) { const div = document.createElement('div'); div.textContent = str || ''; return div.innerHTML; }
}
