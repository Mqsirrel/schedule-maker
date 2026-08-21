// Smart Filter and Sorting Toolbar Component

export class FilterBar {
  constructor(options = {}) {
    this.onFilterChange = options.onFilterChange || (() => {});

    this.filterDaysOff = document.getElementById('filterDaysOff');
    this.sortResultsBy = document.getElementById('sortResultsBy');
    this.searchDoctorSection = document.getElementById('searchDoctorSection');
    this.chkShowFullSeats = document.getElementById('chkShowFullSections');

    // Keep the underlying controls for compatibility, but remove controls
    // that are not useful in the compact results UI.
    this.filterDaysOff?.closest('.filter-group')?.remove();
    this.sortResultsBy?.closest('.filter-group')?.remove();
    this.searchDoctorSection?.closest('.filter-group')?.remove();

    // Favorites had no dedicated way to browse/restore saved schedules,
    // so remove the action rather than exposing a misleading button.
    document.getElementById('btnBookmarkSchedule')?.remove();

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
