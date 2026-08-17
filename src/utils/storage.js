// LocalStorage Manager for State Persistence & Bookmarked Favorites

const STORAGE_KEYS = {
  THEME: 'sm_theme',
  LANG: 'sm_lang',
  TIMETABLE: 'sm_timetable_cache',
  WANTED_COURSES: 'sm_wanted_courses',
  BOOKMARKS: 'sm_bookmarked_schedules'
};

export class AppStorage {
  static getTheme() {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
  }

  static setTheme(theme) {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }

  static getLang() {
    return localStorage.getItem(STORAGE_KEYS.LANG) || 'ar';
  }

  static setLang(lang) {
    localStorage.setItem(STORAGE_KEYS.LANG, lang);
  }

  static saveTimetable(sections) {
    try {
      localStorage.setItem(STORAGE_KEYS.TIMETABLE, JSON.stringify(sections || []));
    } catch (e) {
      console.warn('Storage quota exceeded for timetable cache', e);
    }
  }

  static getCachedTimetable() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TIMETABLE);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  static saveWantedCourses(wanted) {
    try {
      localStorage.setItem(STORAGE_KEYS.WANTED_COURSES, JSON.stringify(wanted || {}));
    } catch (e) {
      console.warn('Storage quota exceeded for wanted courses', e);
    }
  }

  static getWantedCourses() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WANTED_COURSES);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  static getBookmarks() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  static toggleBookmark(schedule) {
    if (!schedule || !schedule.id) return false;
    const current = this.getBookmarks();
    const index = current.findIndex(s => s.id === schedule.id);

    if (index >= 0) {
      current.splice(index, 1);
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(current));
      return false; // Removed
    } else {
      current.push(schedule);
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(current));
      return true; // Added
    }
  }

  static isBookmarked(scheduleId) {
    const current = this.getBookmarks();
    return current.some(s => s.id === scheduleId);
  }

  static clearAll() {
    localStorage.removeItem(STORAGE_KEYS.TIMETABLE);
    localStorage.removeItem(STORAGE_KEYS.WANTED_COURSES);
  }
}
