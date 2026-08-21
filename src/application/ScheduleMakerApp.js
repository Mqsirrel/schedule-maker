import '../styles/responsive-foundation.css';

import { NotificationManager } from '../components/Notification.js';
import { CourseSelector } from '../components/CourseSelector.js';
import { CalendarGrid } from '../components/CalendarGrid.js';
import { TableView } from '../components/TableView.js';
import { FilterBar } from '../components/FilterBar.js';
import { ImportModal } from '../components/ImportModal.js';
import { HelpModal } from '../components/HelpModal.js';
import { ScheduleSolver } from '../engine/solver.js';
import { getSampleSections } from '../engine/sampleData.js';
import { IcsExporter } from '../utils/icsExporter.js';
import { ImageExporter } from '../utils/imageExporter.js';
import { AppStorage } from '../utils/storage.js';
import { diagnosePairwiseConflicts } from '../engine/scheduleUtils.js';
import { t, getLang, setLang, updateDOMTranslations } from '../i18n/translations.js';
import { AppState } from './AppState.js';
import { filterSchedules } from './filterSchedules.js';

export class ScheduleMakerApp {
  constructor() {
    this.state = new AppState();
    this._init();
  }

  // Compatibility accessors keep the existing public controller shape while
  // making AppState the single owner of mutable application state.
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
      onCoursesChange: courseGroups => this.onWantedCoursesChanged(courseGroups),
      onGenerate: () => this.generateSchedules()
    });

    this.calendarGrid = new CalendarGrid('calendarGridMatrix', {
      onCourseClick: section => this.showCourseDetailModal(section)
    });
    this.tableView = new TableView('scheduleDetailTbody');

    this.filterBar = new FilterBar({
      onFilterChange: filters => this.applyFilters(filters)
    });

    this._initDOMElements();
    this._bindEvents();
    this._checkCachedData();
    updateDOMTranslations();
  }

  _initDOMElements() {
    this.btnToggleTheme = document.getElementById('btnToggleTheme');
    this.btnToggleLang = document.getElementById('btnToggleLang');
    this.btnLoadDemo = document.getElementById('btnLoadDemo');

    this.resultsToolbar = document.getElementById('resultsToolbar');
    this.resultsPlaceholder = document.getElementById('resultsPlaceholder');
    this.calendarViewContainer = document.getElementById('calendarViewContainer');
    this.tableViewContainer = document.getElementById('tableViewContainer');

    this.btnViewCalendar = document.getElementById('btnViewCalendar');
    this.btnViewTable = document.getElementById('btnViewTable');

    this.btnPrevSchedule = document.getElementById('btnPrevSchedule');
    this.btnNextSchedule = document.getElementById('btnNextSchedule');
    this.currIndexEl = document.getElementById('currScheduleIndex');
    this.totalCountEl = document.getElementById('totalSchedulesCount');

    this.statScore = document.getElementById('statScore');
    this.valScore = document.getElementById('valScore');
    this.valDaysOff = document.getElementById('valDaysOff');
    this.valTotalGaps = document.getElementById('valTotalGaps');

    this.btnCopyCrns = document.getElementById('btnCopyCrns');
    this.btnBookmark = document.getElementById('btnBookmarkSchedule');
    this.btnExportPng = document.getElementById('btnExportImage');
    this.btnExportIcs = document.getElementById('btnExportIcs');
    this.conflictDiagnosticBox = document.getElementById('conflictDiagnosticBox');

    this.courseDetailModal = document.getElementById('courseDetailModal');
    this.courseDetailBody = document.getElementById('courseDetailBody');
    this.btnCloseCourseDetail = document.getElementById('btnCloseCourseDetail');
  }

  _bindEvents() {
    this.btnToggleTheme.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      AppStorage.setTheme(newTheme);
    });

    this.btnToggleLang.addEventListener('click', () => {
      const newLang = getLang() === 'ar' ? 'en' : 'ar';
      setLang(newLang);
      this.courseSelector._updateStatusBadge();
      this.renderCurrentSchedule();
    });

    window.addEventListener('keydown', e => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowRight') {
        const delta = getLang() === 'ar' ? -1 : 1;
        this.navigateSchedule(delta);
      } else if (e.key === 'ArrowLeft') {
        const delta = getLang() === 'ar' ? 1 : -1;
        this.navigateSchedule(delta);
      } else if (e.key === 'b' || e.key === 'B' || e.key === 'لا') {
        this.toggleCurrentBookmark();
      } else if (e.key === 'Escape') {
        this.importModal.close();
        this.helpModal.close();
        if (this.courseDetailModal) this.courseDetailModal.close();
      }
    });

    this.btnLoadDemo.addEventListener('click', () => this.loadDemoDataset());
    this.btnViewCalendar.addEventListener('click', () => this.switchView('calendar'));
    this.btnViewTable.addEventListener('click', () => this.switchView('table'));
    this.btnPrevSchedule.addEventListener('click', () => this.navigateSchedule(-1));
    this.btnNextSchedule.addEventListener('click', () => this.navigateSchedule(1));

    if (this.btnCopyCrns) {
      this.btnCopyCrns.addEventListener('click', () => this.copyCurrentScheduleCrns());
    }
    this.btnBookmark.addEventListener('click', () => this.toggleCurrentBookmark());
    this.btnExportPng.addEventListener('click', () => this.exportCurrentSchedulePng());
    this.btnExportIcs.addEventListener('click', () => this.exportCurrentScheduleIcs());

    if (this.btnCloseCourseDetail) {
      this.btnCloseCourseDetail.addEventListener('click', () => this.courseDetailModal.close());
    }
  }

  _checkCachedData() {
    const cached = AppStorage.getCachedTimetable();
    if (cached && cached.length > 0) {
      this.timetableSections = cached;
      this.courseSelector.setTimetableData(cached);
    }
    this.wantedCourseGroups = this.courseSelector.getWantedCourseGroups();
  }

  onTimetableLoaded(sections) {
    this.timetableSections = sections;
    AppStorage.saveTimetable(sections);
    this.courseSelector.setTimetableData(sections);
  }

  loadDemoDataset() {
    const sampleSections = getSampleSections();
    this.onTimetableLoaded(sampleSections);

    setTimeout(() => {
      const inputCode = document.getElementById('courseCode');
      const inputNumber = document.getElementById('courseNumber');

      inputCode.value = 'CS';
      inputNumber.value = '181';
      this.courseSelector.addCurrentCourse();

      inputCode.value = 'MATH';
      inputNumber.value = '101';
      this.courseSelector.addCurrentCourse();

      inputCode.value = 'PHYS';
      inputNumber.value = '101';
      this.courseSelector.addCurrentCourse();

      this.notification.showSuccess(t('toast_demo_loaded'));
      this.generateSchedules();
    }, 150);
  }

  onWantedCoursesChanged(courseGroups) {
    this.wantedCourseGroups = courseGroups;
    if (courseGroups.length === 0) {
      this.state.resetResults();
      this._updateDisplayState();
    }
  }

  async generateSchedules() {
    if (this.wantedCourseGroups.length === 0) return;

    const filterState = this.filterBar.getFilterState();
    const schedules = await ScheduleSolver.solve(this.wantedCourseGroups, {
      allowFullSeats: filterState.allowFullSeats,
      maxResults: 2000
    });

    this.allGeneratedSchedules = schedules;

    if (schedules.length === 0) {
      this.notification.showError(t('toast_no_schedules_found'));
      this.filteredSchedules = [];

      const bottlenecks = diagnosePairwiseConflicts(this.wantedCourseGroups);
      if (bottlenecks.length > 0 && this.conflictDiagnosticBox) {
        let diagHtml = `
          <div class="diagnostic-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <strong>${t('conflict_diagnostic_title')}</strong>
          </div>
          <ul class="diagnostic-list">
        `;
        for (const b of bottlenecks) {
          diagHtml += `<li>${t('conflict_between_courses', { c1: `<strong>${this._escapeHtml(b.courseA)}</strong>`, c2: `<strong>${this._escapeHtml(b.courseB)}</strong>` })}</li>`;
        }
        diagHtml += `
          </ul>
          <p class="diagnostic-tip">💡 نصيحة: جرّب إزالة إحدى المادتين المتعارضتين أو تفعيل خيار الشعب الممتلئة لإيجاد جدول متوافق.</p>
        `;
        this.conflictDiagnosticBox.innerHTML = diagHtml;
        this.conflictDiagnosticBox.style.display = 'block';
      } else if (this.conflictDiagnosticBox) {
        this.conflictDiagnosticBox.style.display = 'none';
      }

      this._updateDisplayState();
      return;
    }

    if (this.conflictDiagnosticBox) this.conflictDiagnosticBox.style.display = 'none';

    this.notification.playChime();
    this.notification.showSuccess(t('toast_schedules_found', { count: schedules.length }));
    this.applyFilters(filterState);
  }

  applyFilters(filters) {
    const result = filterSchedules(this.allGeneratedSchedules, filters);
    this.filteredSchedules = result;

    if (this.allGeneratedSchedules.length === 0) {
      this._updateDisplayState();
      return;
    }

    this._updateDisplayState();
    this.renderCurrentSchedule();
  }

  _updateDisplayState() {
    const hasResults = this.filteredSchedules.length > 0;

    if (hasResults) {
      this.resultsToolbar.style.display = 'flex';
      this.resultsPlaceholder.style.display = 'none';
      if (this.currentView === 'calendar') {
        this.calendarViewContainer.style.display = 'block';
        this.tableViewContainer.style.display = 'none';
      } else {
        this.calendarViewContainer.style.display = 'none';
        this.tableViewContainer.style.display = 'block';
      }
    } else {
      this.resultsToolbar.style.display = 'none';
      this.resultsPlaceholder.style.display = 'flex';
      this.calendarViewContainer.style.display = 'none';
      this.tableViewContainer.style.display = 'none';
    }
  }

  renderCurrentSchedule() {
    if (this.filteredSchedules.length === 0) return;

    const currentSchedule = this.state.getCurrentSchedule();
    if (!currentSchedule) return;

    this.currIndexEl.textContent = this.currentScheduleIndex + 1;
    this.totalCountEl.textContent = this.filteredSchedules.length;
    this.btnPrevSchedule.disabled = this.currentScheduleIndex === 0;
    this.btnNextSchedule.disabled = this.currentScheduleIndex >= this.filteredSchedules.length - 1;

    if (typeof currentSchedule.score === 'number' && this.statScore && this.valScore) {
      this.valScore.textContent = `${currentSchedule.score}%`;
      this.statScore.style.display = 'inline-flex';
    } else if (this.statScore) {
      this.statScore.style.display = 'none';
    }

    this.valDaysOff.textContent = currentSchedule.metrics.daysOffCount;
    this.valTotalGaps.textContent = `${currentSchedule.metrics.totalGapHours}h`;

    const isBookmarked = AppStorage.isBookmarked(currentSchedule.id);
    this.btnBookmark.classList.toggle('bookmarked', isBookmarked);

    if (this.currentView === 'calendar') {
      this.calendarGrid.renderSchedule(currentSchedule);
    } else {
      this.tableView.renderSchedule(currentSchedule);
    }
  }

  navigateSchedule(delta) {
    if (this.state.navigateSchedule(delta)) this.renderCurrentSchedule();
  }

  switchView(viewMode) {
    this.currentView = viewMode;
    if (viewMode === 'calendar') {
      this.btnViewCalendar.classList.add('active');
      this.btnViewCalendar.setAttribute('aria-selected', 'true');
      this.btnViewTable.classList.remove('active');
      this.btnViewTable.setAttribute('aria-selected', 'false');
      this.calendarViewContainer.style.display = 'block';
      this.tableViewContainer.style.display = 'none';
    } else {
      this.btnViewTable.classList.add('active');
      this.btnViewTable.setAttribute('aria-selected', 'true');
      this.btnViewCalendar.classList.remove('active');
      this.btnViewCalendar.setAttribute('aria-selected', 'false');
      this.calendarViewContainer.style.display = 'none';
      this.tableViewContainer.style.display = 'block';
    }
    this.renderCurrentSchedule();
  }

  showCourseDetailModal(section) {
    if (!section || !this.courseDetailModal) return;

    this.courseDetailBody.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 0.85rem;">
        <div>
          <h4 style="font-size: 1.15rem; color: var(--color-primary);">${this._escapeHtml(section.courseName)}</h4>
          <p style="font-size: 0.9rem; margin-top: 0.2rem;">${this._escapeHtml(section.courseKey)} - شعبة ${this._escapeHtml(section.section)}</p>
        </div>
        <div style="background: var(--color-bg-base); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--color-border); display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; font-size: 0.9rem;">
          <div><strong>أستاذ المادة:</strong> ${this._escapeHtml(section.instructor)}</div>
          <div><strong>الفرع:</strong> ${this._escapeHtml(section.branch || 'المقر الرئيسي')}</div>
          <div><strong>المقاعد المتاحة:</strong> ${section.availableSeats}</div>
          <div><strong>المسجلون:</strong> ${section.enrolledSeats}</div>
        </div>
      </div>
    `;

    this.courseDetailModal.showModal();
  }

  toggleCurrentBookmark() {
    const current = this.state.getCurrentSchedule();
    if (!current) return;

    const added = AppStorage.toggleBookmark(current);
    this.btnBookmark.classList.toggle('bookmarked', added);
    this.notification.showSuccess(added ? 'تمت إضافة الجدول للمفضلة' : 'تمت إزالة الجدول من المفضلة');
  }

  copyCurrentScheduleCrns() {
    if (this.filteredSchedules.length === 0) return;
    const currentSchedule = this.state.getCurrentSchedule();
    if (!currentSchedule || !currentSchedule.sections) return;

    const sectionLines = currentSchedule.sections.map(s => {
      const code = s.courseKey || `${s.courseCode || ''} ${s.courseNumber || ''}`.trim();
      const sec = s.section ? `(شعبة ${s.section})` : '';
      const name = s.courseName ? `- ${s.courseName}` : '';
      return `• ${code} ${sec} ${name}`.trim();
    }).join('\n');

    const rawCrns = currentSchedule.sections.map(s => s.section).filter(Boolean).join(', ');
    const payload = `${sectionLines}\n\nأرقام الشعب (CRNs):\n${rawCrns}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(payload).then(() => {
        this.notification.showSuccess(t('toast_crns_copied'));
      }).catch(() => this._fallbackCopy(payload));
    } else {
      this._fallbackCopy(payload);
    }
  }

  _fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
      document.execCommand('copy');
      this.notification.showSuccess(t('toast_crns_copied'));
    } catch {
      this.notification.showInfo(text);
    }
    document.body.removeChild(ta);
  }

  async exportCurrentSchedulePng() {
    const printableArea = document.getElementById('calendarPrintableArea');
    if (!printableArea) return;

    this.notification.showInfo('جاري تجهيز الصورة...');
    const success = await ImageExporter.exportToPng(printableArea, `Taibah_Schedule_${this.currentScheduleIndex + 1}.png`);
    if (success) this.notification.showSuccess(t('toast_export_png_success'));
  }

  exportCurrentScheduleIcs() {
    const current = this.state.getCurrentSchedule();
    if (!current) return;

    const success = IcsExporter.exportSchedule(current);
    if (success) this.notification.showSuccess(t('toast_export_ics_success'));
  }

  _escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }
}
