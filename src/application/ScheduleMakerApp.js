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
import { ScheduleController } from './ScheduleController.js';
import { storageService } from '../services/storageService.js';
import { exportService } from '../services/exportService.js';
import { ScheduleResultsView } from '../presentation/ScheduleResultsView.js';
import { ScheduleDiagnosticsView } from '../presentation/ScheduleDiagnosticsView.js';
import { CourseDetailView } from '../presentation/CourseDetailView.js';

export class ScheduleMakerApp {
  constructor() { this.state = new AppState(); this._init(); }
  get timetableSections() { return this.state.get('timetableSections'); }
  set timetableSections(v) { this.state.set('timetableSections', v); }
  get wantedCourseGroups() { return this.state.get('wantedCourseGroups'); }
  set wantedCourseGroups(v) { this.state.set('wantedCourseGroups', v); }
  get filteredSchedules() { return this.state.get('filteredSchedules'); }
  get currentScheduleIndex() { return this.state.get('currentScheduleIndex'); }

  _init() {
    this.notification = new NotificationManager();
    this.helpModal = new HelpModal();
    this.importModal = new ImportModal({ notification: this.notification, onTimetableLoaded: s => this.onTimetableLoaded(s), onOpenHelp: () => this.helpModal.open() });
    this.courseSelector = new CourseSelector({ notification: this.notification, onCoursesChange: g => this.onWantedCoursesChanged(g), onGenerate: () => this.generateSchedules() });
    this.calendarGrid = new CalendarGrid('calendarGridMatrix', { onCourseClick: s => this.showCourseDetailModal(s) });
    this.tableView = new TableView('scheduleDetailTbody');
    this.filterBar = new FilterBar({ onFilterChange: f => this.applyFilters(f) });
    this.scheduleController = new ScheduleController({ state: this.state, getFilterState: () => this.filterBar.getFilterState() });
    this._initDOMElements();
    this.resultsView = new ScheduleResultsView({ state: this.state, calendarGrid: this.calendarGrid, tableView: this.tableView, storageService, elements: {
      resultsToolbar: this.resultsToolbar, resultsPlaceholder: this.resultsPlaceholder, calendarViewContainer: this.calendarViewContainer, tableViewContainer: this.tableViewContainer,
      btnViewCalendar: this.btnViewCalendar, btnViewTable: this.btnViewTable, btnPrevSchedule: this.btnPrevSchedule, btnNextSchedule: this.btnNextSchedule,
      currScheduleIndex: this.currScheduleIndex, totalSchedulesCount: this.totalSchedulesCount, statScore: this.statScore, valScore: this.valScore,
      valDaysOff: this.valDaysOff, valTotalGaps: this.valTotalGaps, btnBookmark: this.btnBookmark
    }});
    this.diagnosticsView = new ScheduleDiagnosticsView({ element: this.conflictDiagnosticBox, translate: t, escapeHtml: s => this._escapeHtml(s) });
    this.courseDetailView = new CourseDetailView({ modal: this.courseDetailModal, body: this.courseDetailBody, escapeHtml: s => this._escapeHtml(s) });
    this._bindEvents(); this._checkCachedData(); updateDOMTranslations();
  }

  _initDOMElements() {
    const ids = ['btnToggleTheme','btnToggleLang','btnLoadDemo','resultsToolbar','resultsPlaceholder','calendarViewContainer','tableViewContainer','btnViewCalendar','btnViewTable','btnPrevSchedule','btnNextSchedule','currScheduleIndex','totalSchedulesCount','statScore','valScore','valDaysOff','valTotalGaps','btnCopyCrns','btnBookmarkSchedule','btnExportImage','btnExportIcs','conflictDiagnosticBox','courseDetailModal','courseDetailBody','btnCloseCourseDetail'];
    for (const id of ids) this[id] = document.getElementById(id);
    this.btnBookmark = this.btnBookmarkSchedule;
  }

  _bindEvents() {
    this.btnToggleTheme.addEventListener('click', () => { const next = (document.documentElement.getAttribute('data-theme') || 'dark') === 'dark' ? 'light' : 'dark'; document.documentElement.setAttribute('data-theme', next); storageService.setTheme(next); });
    this.btnToggleLang.addEventListener('click', () => { setLang(getLang() === 'ar' ? 'en' : 'ar'); this.courseSelector._updateStatusBadge(); this.renderCurrentSchedule(); });
    window.addEventListener('keydown', e => { if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return; if (e.key === 'ArrowRight') this.navigateSchedule(getLang() === 'ar' ? -1 : 1); else if (e.key === 'ArrowLeft') this.navigateSchedule(getLang() === 'ar' ? 1 : -1); else if (e.key === 'b' || e.key === 'B' || e.key === 'لا') this.toggleCurrentBookmark(); else if (e.key === 'Escape') { this.importModal.close(); this.helpModal.close(); this.courseDetailView.close(); } });
    this.btnLoadDemo.addEventListener('click', () => this.loadDemoDataset());
    this.btnViewCalendar.addEventListener('click', () => this.switchView('calendar')); this.btnViewTable.addEventListener('click', () => this.switchView('table'));
    this.btnPrevSchedule.addEventListener('click', () => this.navigateSchedule(-1)); this.btnNextSchedule.addEventListener('click', () => this.navigateSchedule(1));
    if (this.btnCopyCrns) this.btnCopyCrns.addEventListener('click', () => this.copyCurrentScheduleCrns());
    this.btnBookmark.addEventListener('click', () => this.toggleCurrentBookmark()); this.btnExportImage.addEventListener('click', () => this.exportCurrentSchedulePng()); this.btnExportIcs.addEventListener('click', () => this.exportCurrentScheduleIcs());
    if (this.btnCloseCourseDetail) this.btnCloseCourseDetail.addEventListener('click', () => this.courseDetailView.close());
  }

  _checkCachedData() { const cached = storageService.getTimetable(); if (cached?.length) { this.timetableSections = cached; this.courseSelector.setTimetableData(cached); } this.wantedCourseGroups = this.courseSelector.getWantedCourseGroups(); }
  onTimetableLoaded(sections) { this.timetableSections = sections; storageService.saveTimetable(sections); this.courseSelector.setTimetableData(sections); }
  loadDemoDataset() { this.onTimetableLoaded(getSampleSections()); setTimeout(() => { const code = document.getElementById('courseCode'), number = document.getElementById('courseNumber'); for (const [c,n] of [['CS','181'],['MATH','101'],['PHYS','101']]) { code.value=c; number.value=n; this.courseSelector.addCurrentCourse(); } this.notification.showSuccess(t('toast_demo_loaded')); this.generateSchedules(); }, 150); }
  onWantedCoursesChanged(groups) { this.wantedCourseGroups = groups; if (!groups.length) { this.state.resetResults(); this.resultsView.updateVisibility(); } }
  async generateSchedules() { if (!this.wantedCourseGroups.length) return; const result = await this.scheduleController.generate(this.wantedCourseGroups); if (!result.schedules.length) { this.notification.showError(t('toast_no_schedules_found')); this.diagnosticsView.render(this.scheduleController.diagnoseConflicts(this.wantedCourseGroups)); this.resultsView.updateVisibility(); return; } this.diagnosticsView.render([]); this.notification.playChime(); this.notification.showSuccess(t('toast_schedules_found', { count: result.schedules.length })); this.applyFilters(result.filters); }
  applyFilters(filters) { const result = this.scheduleController.filter(filters); this.resultsView.updateVisibility(); if (result.length) this.renderCurrentSchedule(); }
  renderCurrentSchedule() { this.resultsView.render(); }
  navigateSchedule(delta) { if (this.state.navigateSchedule(delta)) this.resultsView.render(); }
  switchView(view) { this.resultsView.switchView(view); }
  showCourseDetailModal(section) { this.courseDetailView.show(section); }
  toggleCurrentBookmark() { const current=this.state.getCurrentSchedule(); if(!current)return; const added=storageService.toggleBookmark(current); this.btnBookmark.classList.toggle('bookmarked',added); this.notification.showSuccess(added?'تمت إضافة الجدول للمفضلة':'تمت إزالة الجدول من المفضلة'); }
  copyCurrentScheduleCrns() { const current=this.state.getCurrentSchedule(); if(!current?.sections)return; const lines=current.sections.map(s=>`${s.courseKey||`${s.courseCode||''} ${s.courseNumber||''}`.trim()} ${s.section?`(شعبة ${s.section})`:''} ${s.courseName?`- ${s.courseName}`:''}`.trim()).join('\n'); const payload=`${lines}\n\nأرقام الشعب (CRNs):\n${current.sections.map(s=>s.section).filter(Boolean).join(', ')}`; if(navigator.clipboard?.writeText)navigator.clipboard.writeText(payload).then(()=>this.notification.showSuccess(t('toast_crns_copied'))).catch(()=>this._fallbackCopy(payload)); else this._fallbackCopy(payload); }
  _fallbackCopy(text) { const ta=document.createElement('textarea'); ta.value=text; ta.style.position='fixed'; ta.style.opacity='0'; document.body.appendChild(ta); ta.focus(); ta.select(); try{document.execCommand('copy');this.notification.showSuccess(t('toast_crns_copied'));}catch{this.notification.showInfo(text);} document.body.removeChild(ta); }
  async exportCurrentSchedulePng() { const area=document.getElementById('calendarPrintableArea'); if(!area)return; this.notification.showInfo('جاري تجهيز الصورة...'); const success=await exportService.image(area,`Taibah_Schedule_${this.currentScheduleIndex+1}.png`); if(success)this.notification.showSuccess(t('toast_export_png_success')); }
  exportCurrentScheduleIcs() { const current=this.state.getCurrentSchedule(); if(current && exportService.ics(current))this.notification.showSuccess(t('toast_export_ics_success')); }
  _escapeHtml(str) { const div=document.createElement('div'); div.textContent=str||''; return div.innerHTML; }
}
