// Smart Filter and Sorting Toolbar Component

export class FilterBar {
  constructor(options = {}) {
    this.onFilterChange = options.onFilterChange || (() => {});

    this.filterDaysOff = document.getElementById('filterDaysOff');
    this.sortResultsBy = document.getElementById('sortResultsBy');
    this.searchDoctorSection = document.getElementById('searchDoctorSection');
    this.chkShowFullSeats = document.getElementById('chkShowFullSections');
    this.btnBookmark = document.getElementById('btnBookmarkSchedule');

    // Keep the existing DOM references for compatibility with the main
    // controller, but hide controls that are no longer part of the UI.
    this.filterDaysOff?.closest('.filter-group')?.remove();
    this.sortResultsBy?.closest('.filter-group')?.remove();
    this.searchDoctorSection?.closest('.filter-group')?.remove();

    // Do not remove the bookmark element: main.js still uses its reference
    // when rendering schedules. Hide it instead so schedule generation and
    // rendering cannot fail because of a null DOM reference.
    if (this.btnBookmark) this.btnBookmark.style.display = 'none';

    this._bindEvents();
  }

  _bindEvents() {
    const triggerChange = () => this.onFilterChange(this.getFilterState());
    this.chkShowFullSeats?.addEventListener('change', triggerChange);
  }

  getFilterState() {
    return {
      daysOff: 'all',
      sortBy: 'default',
      query: '',
      allowFullSeats: this.chkShowFullSeats?.checked || false
    };
  }

  resetFilters() {
    if (this.searchDoctorSection) this.searchDoctorSection.value = '';
    if (this.chkShowFullSeats) this.chkShowFullSeats.checked = false;
  }

  _debounce(fn, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }
}
