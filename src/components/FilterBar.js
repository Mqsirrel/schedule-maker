// Smart Filter and Sorting Toolbar Component

export class FilterBar {
  constructor(options = {}) {
    this.onFilterChange = options.onFilterChange || (() => {});

    this.filterDaysOff = document.getElementById('filterDaysOff');
    this.sortResultsBy = document.getElementById('sortResultsBy');
    this.searchDoctorSection = document.getElementById('searchDoctorSection');
    this.chkShowFullSeats = document.getElementById('chkShowFullSections');

    this._bindEvents();
  }

  _bindEvents() {
    const triggerChange = () => this.onFilterChange(this.getFilterState());
    const debouncedSearch = this._debounce(triggerChange, 200);

    this.filterDaysOff.addEventListener('change', triggerChange);
    this.sortResultsBy.addEventListener('change', triggerChange);
    this.chkShowFullSeats.addEventListener('change', triggerChange);
    this.searchDoctorSection.addEventListener('input', debouncedSearch);
  }

  getFilterState() {
    return {
      daysOff: this.filterDaysOff.value,
      sortBy: this.sortResultsBy.value,
      query: this.searchDoctorSection.value.trim().toLowerCase(),
      allowFullSeats: this.chkShowFullSeats.checked
    };
  }

  resetFilters() {
    this.filterDaysOff.value = 'all';
    this.sortResultsBy.value = 'default';
    this.searchDoctorSection.value = '';
    this.chkShowFullSeats.checked = false;
  }

  _debounce(fn, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }
}
