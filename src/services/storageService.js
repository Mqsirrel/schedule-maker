import { AppStorage } from '../utils/storage.js';

export const storageService = {
  getTimetable() {
    return AppStorage.getCachedTimetable();
  },
  saveTimetable(sections) {
    return AppStorage.saveTimetable(sections);
  },
  isBookmarked(id) {
    return AppStorage.isBookmarked(id);
  },
  toggleBookmark(schedule) {
    return AppStorage.toggleBookmark(schedule);
  },
  setTheme(theme) {
    return AppStorage.setTheme(theme);
  }
};
