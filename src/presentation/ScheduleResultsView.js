export class ScheduleResultsView {
  constructor({ state, calendarGrid, tableView, elements }) {
    this.state = state;
    this.calendarGrid = calendarGrid;
    this.tableView = tableView;
    Object.assign(this, elements);
  }

  updateVisibility() {
    const schedules = this.state.get('filteredSchedules');
    const hasResults = schedules.length > 0;
    this.resultsToolbar.style.display = hasResults ? 'flex' : 'none';
    this.resultsPlaceholder.style.display = hasResults ? 'none' : 'flex';
    this.calendarViewContainer.style.display = hasResults && this.state.get('currentView') === 'calendar' ? 'block' : 'none';
    this.tableViewContainer.style.display = hasResults && this.state.get('currentView') === 'table' ? 'block' : 'none';
  }

  render() {
    const schedules = this.state.get('filteredSchedules');
    const index = this.state.get('currentScheduleIndex');
    const current = this.state.getCurrentSchedule();
    if (!current) return;

    this.currScheduleIndex.textContent = index + 1;
    this.totalSchedulesCount.textContent = schedules.length;
    this.btnPrevSchedule.disabled = index === 0;
    this.btnNextSchedule.disabled = index >= schedules.length - 1;

    if (typeof current.score === 'number' && this.statScore && this.valScore) {
      this.valScore.textContent = `${current.score}%`;
      this.statScore.style.display = 'inline-flex';
    } else if (this.statScore) {
      this.statScore.style.display = 'none';
    }

    this.valDaysOff.textContent = current.metrics.daysOffCount;
    this.valTotalGaps.textContent = `${current.metrics.totalGapHours}h`;

    if (this.state.get('currentView') === 'calendar') this.calendarGrid.renderSchedule(current);
    else this.tableView.renderSchedule(current);
  }

  switchView(view) {
    this.state.set('currentView', view);
    this.btnViewCalendar.classList.toggle('active', view === 'calendar');
    this.btnViewCalendar.setAttribute('aria-selected', String(view === 'calendar'));
    this.btnViewTable.classList.toggle('active', view === 'table');
    this.btnViewTable.setAttribute('aria-selected', String(view === 'table'));
    this.updateVisibility();
    this.render();
  }
}
