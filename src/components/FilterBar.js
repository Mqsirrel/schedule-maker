// Results filter component

export class FilterBar {
  constructor(options = {}) {
    this.onFilterChange = options.onFilterChange || (() => {});

    // These controls are no longer part of the UI, but removing them here
    // keeps the existing markup backward-compatible without affecting
    // schedule generation.
    document.getElementById('filterDaysOff')?.closest('.filter-group')?.remove();
    document.getElementById('sortResultsBy')?.closest('.filter-group')?.remove();
    document.getElementById('searchDoctorSection')?.closest('.filter-group')?.remove();

    this.chkShowFullSeats = document.getElementById('chkShowFullSections');
    this._bindEvents();
  }

  _bindEvents() {
    this.chkShowFullSeats?.addEventListener('change', () => {
      this.onFilterChange(this.getFilterState());
    });
  }

  getFilterState() {
    return {
      allowFullSeats: this.chkShowFullSeats?.checked ?? false
    };
  }

  resetFilters() {
    if (this.chkShowFullSeats) {
      this.chkShowFullSeats.checked = false;
    }
  }
}
