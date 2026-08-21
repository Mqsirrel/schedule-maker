// Smart Filter and Sorting Toolbar Component

export class FilterBar {
  constructor(options = {}) {
    this.onFilterChange = options.onFilterChange || (() => {});

    this.filterDaysOff = document.getElementById('filterDaysOff');
    this.sortResultsBy = document.getElementById('sortResultsBy');
    this.searchDoctorSection = document.getElementById('searchDoctorSection');
    this.chkShowFullSeats = document.getElementById('chkShowFullSections');

    // Keep the underlying controls for compatibility, but remove them from
    // the UI to keep the results toolbar compact and focused.
    this.filterDaysOff?.closest('.filter-group')?.remove();
    this.sortResultsBy?.closest('.filter-group')?.remove();

    this._bindEvents();
  }

  _bindEvents() {
    const triggerChange = () => this.onFilterChange(this.getFilterState());
    const debouncedSearch = this._debounce(triggerChange, 200);

    this.chkShowFullSeats?.addEventListener('change', triggerChange);
    this.searchDoctorSection?.addEventListener('input', debouncedSearch);
  }

  getFilterState() {
    return {
      // These remain as neutral defaults so the existing filtering pipeline
      // continues to work without exposing the controls in the UI.
      daysOff: 'all',
      sortBy: 'default',
      query: this.searchDoctorSection?.value.trim().toLowerCase() || '',
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
