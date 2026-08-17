// Course Selection Controller: Datalists, Autocomplete & Selected Courses Manager
import { t } from '../i18n/translations.js';

export class CourseSelector {
  constructor(options = {}) {
    this.onCoursesChange = options.onCoursesChange || (() => {});
    this.onGenerate = options.onGenerate || (() => {});
    this.notification = options.notification;

    this.allSections = [];
    this.wantedCourses = {}; // { 'CS-181': [section1, section2, ...] }

    this._initDOMElements();
    this._bindEvents();
  }

  _initDOMElements() {
    this.form = document.getElementById('addCourseForm');
    this.inputCode = document.getElementById('courseCode');
    this.inputNumber = document.getElementById('courseNumber');
    this.inputSection = document.getElementById('courseSection');

    this.listCodes = document.getElementById('listCourseCodes');
    this.listNumbers = document.getElementById('listCourseNumbers');
    this.listSections = document.getElementById('listCourseSections');

    this.previewBox = document.getElementById('coursePreviewMeta');
    this.previewName = document.getElementById('coursePreviewName');
    this.previewCount = document.getElementById('coursePreviewSectionsCount');

    this.btnAdd = document.getElementById('btnAddCourse');
    this.btnGenerate = document.getElementById('btnGenerateSchedules');
    this.btnClearAll = document.getElementById('btnClearAllCourses');

    this.coursesListEl = document.getElementById('selectedCoursesList');
    this.emptyNotice = document.getElementById('emptyCoursesNotice');
    this.countBadge = document.getElementById('countSelectedCourses');
    this.statusBadge = document.getElementById('timetableStatusBadge');
  }

  _bindEvents() {
    const onInputDebounced = this._debounce(() => this._handleInputChange(), 120);

    this.inputCode.addEventListener('input', onInputDebounced);
    this.inputNumber.addEventListener('input', onInputDebounced);
    this.inputSection.addEventListener('input', onInputDebounced);

    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.addCurrentCourse();
    });

    this.btnGenerate.addEventListener('click', () => {
      this.onGenerate();
    });

    this.btnClearAll.addEventListener('click', () => {
      this.clearAll();
    });
  }

  setTimetableData(sections) {
    this.allSections = sections || [];
    this._populateDatalists();
    this._updateStatusBadge();
    this._handleInputChange();
  }

  _populateDatalists() {
    if (!this.allSections || this.allSections.length === 0) {
      this.listCodes.innerHTML = '';
      this.listNumbers.innerHTML = '';
      this.listSections.innerHTML = '';
      return;
    }

    const uniqueCodes = new Set();
    const uniqueNumbers = new Set();
    const uniqueSections = new Set();

    for (const sec of this.allSections) {
      if (sec.courseCode) uniqueCodes.add(sec.courseCode);
      if (sec.courseNumber) uniqueNumbers.add(sec.courseNumber);
      if (sec.section) uniqueSections.add(sec.section);
    }

    this.listCodes.innerHTML = Array.from(uniqueCodes).sort().map(c => `<option value="${c}">`).join('');
    this.listNumbers.innerHTML = Array.from(uniqueNumbers).sort().map(n => `<option value="${n}">`).join('');
    this.listSections.innerHTML = Array.from(uniqueSections).sort().map(s => `<option value="${s}">`).join('');
  }

  _handleInputChange() {
    const code = this.inputCode.value.trim().toUpperCase();
    const number = this.inputNumber.value.trim();
    const sectionPrefix = this.inputSection.value.trim().toUpperCase();

    if (!code && !number) {
      this._hidePreview();
      return;
    }

    const matched = this.allSections.filter(sec => {
      const matchCode = !code || sec.courseCode.toUpperCase() === code;
      const matchNum = !number || sec.courseNumber === number;
      const matchSec = !sectionPrefix || sec.section.toUpperCase().startsWith(sectionPrefix);
      return matchCode && matchNum && matchSec;
    });

    if (matched.length > 0 && code && number) {
      const first = matched[0];
      this.previewName.textContent = first.courseName;
      this.previewCount.textContent = `(${matched.length} شعبة)`;
      this.previewBox.hidden = false;
      this.btnAdd.disabled = false;
    } else {
      this._hidePreview();
    }
  }

  _hidePreview() {
    this.previewBox.hidden = true;
    this.btnAdd.disabled = true;
  }

  addCurrentCourse() {
    const code = this.inputCode.value.trim().toUpperCase();
    const number = this.inputNumber.value.trim();
    const sectionPrefix = this.inputSection.value.trim().toUpperCase();

    if (!code || !number) return;

    const courseKey = `${code}-${number}`;

    if (this.wantedCourses[courseKey]) {
      this.notification?.showError(t('toast_duplicate_course'));
      return;
    }

    const matchingSections = this.allSections.filter(sec => {
      const matchCode = sec.courseCode.toUpperCase() === code;
      const matchNum = sec.courseNumber === number;
      const matchSec = !sectionPrefix || sec.section.toUpperCase().startsWith(sectionPrefix);
      return matchCode && matchNum && matchSec;
    });

    if (matchingSections.length === 0) {
      this.notification?.showError(t('toast_course_not_found'));
      return;
    }

    this.wantedCourses[courseKey] = matchingSections;

    // Reset inputs
    this.inputCode.value = '';
    this.inputNumber.value = '';
    this.inputSection.value = '';
    this._hidePreview();
    this.inputCode.focus();

    this.notification?.showSuccess(t('toast_course_added', {
      name: matchingSections[0].courseName,
      count: matchingSections.length
    }));

    this._renderSelectedCourses();
    this.onCoursesChange(this.getWantedCourseGroups());
  }

  removeCourse(courseKey) {
    if (this.wantedCourses[courseKey]) {
      delete this.wantedCourses[courseKey];
      this._renderSelectedCourses();
      this.onCoursesChange(this.getWantedCourseGroups());
    }
  }

  clearAll() {
    this.wantedCourses = {};
    this._renderSelectedCourses();
    this.onCoursesChange(this.getWantedCourseGroups());
  }

  getWantedCourseGroups() {
    return Object.values(this.wantedCourses);
  }

  _renderSelectedCourses() {
    const keys = Object.keys(this.wantedCourses);
    this.countBadge.textContent = keys.length;

    if (keys.length === 0) {
      this.coursesListEl.innerHTML = '';
      this.coursesListEl.appendChild(this.emptyNotice);
      this.emptyNotice.style.display = 'flex';
      this.btnClearAll.style.display = 'none';
      this.btnGenerate.disabled = true;
      return;
    }

    this.emptyNotice.style.display = 'none';
    this.btnClearAll.style.display = 'inline-block';
    this.btnGenerate.disabled = keys.length < 1;

    this.coursesListEl.innerHTML = keys.map(key => {
      const sections = this.wantedCourses[key];
      const first = sections[0];
      const sectionsSummary = sections.length === 1
        ? `شعبة ${first.section}`
        : `${sections.length} شُعب (${sections.map(s => s.section).slice(0, 3).join(', ')}${sections.length > 3 ? '...' : ''})`;

      return `
        <li class="course-card-item">
          <div class="course-item-info">
            <span class="course-item-title">${this._escapeHtml(first.courseName)}</span>
            <div class="course-item-tags">
              <span class="tag-badge">${this._escapeHtml(key)}</span>
              <span class="tag-badge">${this._escapeHtml(sectionsSummary)}</span>
            </div>
          </div>
          <button type="button" class="btn-remove-course" data-key="${key}" title="حذف المادة" aria-label="Remove Course">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </li>
      `;
    }).join('');

    // Attach remove listeners
    this.coursesListEl.querySelectorAll('.btn-remove-course').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const key = btn.getAttribute('data-key');
        this.removeCourse(key);
      });
    });
  }

  _updateStatusBadge() {
    if (this.allSections.length > 0) {
      this.statusBadge.textContent = t('status_ready') + ` (${this.allSections.length})`;
      this.statusBadge.className = 'status-badge status-badge--ready';
    } else {
      this.statusBadge.textContent = t('status_no_data');
      this.statusBadge.className = 'status-badge status-badge--empty';
    }
  }

  _debounce(fn, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  _escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
}
