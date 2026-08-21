// Localization Dictionary (Arabic & English)

export const translations = {
  ar: {
    // Accessibility & Navigation
    skip_to_content: "تخطي إلى المحتوى الرئيسي",

    // Brand & Header
    badge_taibah: "جامعة طيبة",
    btn_help: "دليل الاستخدام",
    btn_theme: "تبديل المظهر",
    btn_import_timetable: "استيراد الجدول الزمني",
    btn_demo_data: "تجربة بيانات توضيحية",
    btn_bookmark: "حفظ في المفضلة",

    // Banner / Hero
    hero_title: "أنشئ جدولك الجامعي",
    hero_desc: "ارفع الجدول، اختر المواد والشعب، وشوف الجداول المتاحة بدون تعارض.",

    // Sidebar - Course selection
    title_wanted_courses: "المواد المراد إضافتها",
    status_no_data: "لا توجد بيانات",
    status_ready: "جاهز (محمل)",
    lbl_course_code: "رمز المادة",
    lbl_course_num: "رقم المادة",
    lbl_section: "الشعبة",
    btn_add_course: "إضافة المادة للقائمة",
    hint_section_wildcard: "• يمكنك ترك حقل الشعبة فارغاً لاختيار كافة الشعب المتاحة، أو كتابة بدايتها لتضمين مجموعة محددة.",
    title_selected_list: "المواد المختارة",
    btn_clear_all: "مسح الكل",
    msg_no_courses_added: "لم تتم إضافة أي مادة بعد. استورد الجدول ثم أضف المواد لبدء توليد الجداول.",
    btn_generate_schedules: "توليد وبحث الجداول الممكنة",

    // Toolbar & Filters
    lbl_filter_daysoff: "أيام الفراغ:",
    opt_all: "الكل",
    opt_has_off: "تحتوي على أيام Off",
    opt_1_off: "يوم Off واحد على الأقل",
    opt_2_off: "يومين Off أو أكثر",
    opt_3_off: "3 أيام Off",
    lbl_sort_by: "ترتيب حسب:",
    sort_default: "الترتيب الافتراضي",
    sort_days_off: "الأكثر أيام فراغ (Off)",
    sort_least_gaps: "الأقل فراغات بين المحاضرات",
    sort_early_finish: "الانتهاء مبكراً",
    sort_late_start: "البدء متأخراً (بدون 8 صباحاً)",
    ph_search_doctor: "بحث باسم دكتور أو شعبة...",
    chk_show_full_seats: "إظهار الشعب الممتلئة (بدون مقاعد)",

    // View switcher & Pagination
    tab_calendar_view: "الجدول الأسبوعي",
    tab_table_view: "جدول التفاصيل",
    txt_schedule: "جدول",
    txt_of: "من",
    btn_prev_schedule: "الجدول السابق",
    btn_next_schedule: "الجدول التالي",
    stat_daysoff: "أيام Off:",
    stat_gaps: "ساعات الفراغ:",
    stat_score: "المطابقة:",
    btn_favorite: "المفضلة",

    btn_export_png: "تصدير صورة",
    btn_export_ics: "تصدير للتقويم",
    btn_copy_crns: "نسخ أرقام الشُعب (CRNs)",
    toast_crns_copied: "تم نسخ أرقام الشُعب إلى الحافظة بنجاح للتسجيل السريع!",
    conflict_diagnostic_title: "تشخيص سبب عدم توفر جدول:",
    conflict_between_courses: "تعارض زمني حتمي بين مادة {c1} ومادة {c2}.",

    // Days of week
    col_time: "الوقت",
    day_sun: "الأحد",
    day_mon: "الاثنين",
    day_tue: "الثلاثاء",
    day_wed: "الأربعاء",
    day_thu: "الخميس",

    // Table view columns
    th_row_id: "#",
    th_course_name: "اسم المادة",
    th_code_num: "الرمز والرقم",
    th_section: "الشعبة",
    th_instructor: "أستاذ المادة",
    th_seats_available: "المتاح",
    th_seats_enrolled: "المسجل",

    // Placeholder
    placeholder_ready_title: "مستعد لترتيب جدولك؟",
    placeholder_ready_desc: "استورد ملف الجدول الزمني أو جرب البيانات التوضيحية، ثم أضف المواد التي ترغب بتسجيلها واضغط 'توليد وبحث الجداول'.",
    btn_import_now: "استيراد الجدول الآن",
    btn_demo_now: "تجربة سريعة",

    // Modal Import
    modal_import_title: "استيراد الجدول الزمني (جامعة طيبة)",
    tab_upload_file: "رفع ملف HTML",
    tab_paste_text: "لصق النص / الكود",
    dropzone_title: "اسحب وأفلت ملف الجدول الزمني هنا",
    dropzone_subtitle: "يدعم ملفات HTML المحفوظة من بوابة الجامعة",
    dropzone_browse: "اختيار ملف من جهازك",
    guide_quick_heading: "كيف تحصل على الجدول الزمني؟",
    toast_no_file: "يرجى اختيار ملف HTML أولاً.",
    toast_invalid_file: "الملف غير صالح أو لا يحتوي على جدول مفهوم.",
    toast_import_success: "تم استيراد الجدول بنجاح.",
    toast_import_error: "تعذر استيراد الجدول. تأكد من أن الملف من بوابة الجامعة.",
    toast_demo_loaded: "تم تحميل البيانات التوضيحية.",
    toast_no_schedules_found: "لم يتم العثور على جدول متوافق مع المواد والشعب المختارة.",
    toast_schedules_found: "تم العثور على {count} جدول.",
    toast_no_courses: "أضف مادة واحدة على الأقل أولاً.",
    toast_course_added: "تمت إضافة المادة.",
    toast_course_removed: "تم حذف المادة.",
    toast_course_duplicate: "المادة موجودة بالفعل في القائمة.",
    toast_course_not_found: "لم يتم العثور على المادة المطلوبة.",
    toast_invalid_course: "تحقق من رمز المادة ورقمها.",
    toast_crns_copied: "تم نسخ أرقام الشُعب إلى الحافظة.",
    toast_export_success: "تم تصدير الجدول بنجاح.",
    toast_export_error: "تعذر تصدير الجدول.",
    btn_close: "إغلاق",
    btn_cancel: "إلغاء",
    btn_confirm: "تأكيد",
    btn_copy: "نسخ",
    btn_download: "تحميل",
    btn_open_help: "دليل الاستخدام",
  },

  en: {
    skip_to_content: "Skip to main content",
    badge_taibah: "Taibah University",
    btn_help: "User guide",
    btn_theme: "Toggle theme",
    btn_import_timetable: "Import timetable",
    btn_demo_data: "Try sample data",
    btn_bookmark: "Save to favorites",
    hero_title: "Build your university schedule",
    hero_desc: "Upload your timetable, choose your courses and sections, and see available schedules without conflicts.",
    title_wanted_courses: "Courses to add",
    status_no_data: "No data",
    status_ready: "Ready",
    lbl_course_code: "Course code",
    lbl_course_num: "Course number",
    lbl_section: "Section",
    btn_add_course: "Add course",
    hint_section_wildcard: "Leave section empty to include all available sections, or enter a prefix to include a group.",
    title_selected_list: "Selected courses",
    btn_clear_all: "Clear all",
    msg_no_courses_added: "No courses added yet. Import your timetable, then add courses to generate schedules.",
    btn_generate_schedules: "Generate schedules",
    lbl_filter_daysoff: "Days off:",
    opt_all: "All",
    opt_has_off: "Has days off",
    opt_1_off: "At least 1 day off",
    opt_2_off: "2+ days off",
    opt_3_off: "3 days off",
    lbl_sort_by: "Sort by:",
    sort_default: "Default",
    sort_days_off: "Most days off",
    sort_least_gaps: "Fewest gaps",
    sort_early_finish: "Earliest finish",
    sort_late_start: "Latest start",
    ph_search_doctor: "Search by instructor or section...",
    chk_show_full_seats: "Show full sections",
    tab_calendar_view: "Weekly schedule",
    tab_table_view: "Details table",
    txt_schedule: "Schedule",
    txt_of: "of",
    btn_prev_schedule: "Previous schedule",
    btn_next_schedule: "Next schedule",
    stat_daysoff: "Days off:",
    stat_gaps: "Gap hours:",
    stat_score: "Match:",
    btn_favorite: "Favorites",
    btn_export_png: "Export image",
    btn_export_ics: "Export to calendar",
    btn_copy_crns: "Copy section numbers (CRNs)",
    conflict_diagnostic_title: "Why no schedule is available:",
    conflict_between_courses: "A fixed time conflict exists between {c1} and {c2}.",
    col_time: "Time",
    day_sun: "Sunday",
    day_mon: "Monday",
    day_tue: "Tuesday",
    day_wed: "Wednesday",
    day_thu: "Thursday",
    th_row_id: "#",
    th_course_name: "Course name",
    th_code_num: "Code & number",
    th_section: "Section",
    th_instructor: "Instructor",
    th_seats_available: "Available",
    th_seats_enrolled: "Enrolled",
    placeholder_ready_title: "Ready to build your schedule?",
    placeholder_ready_desc: "Import your timetable or try the sample data, add the courses you want, then generate schedules.",
    btn_import_now: "Import timetable",
    btn_demo_now: "Try sample data",
    modal_import_title: "Import timetable (Taibah University)",
    tab_upload_file: "Upload HTML",
    tab_paste_text: "Paste text / code",
    dropzone_title: "Drag and drop your timetable HTML here",
    dropzone_subtitle: "Supports HTML files saved from the university portal",
    dropzone_browse: "Choose a file",
    guide_quick_heading: "How to get your timetable",
    toast_no_file: "Please choose an HTML file first.",
    toast_invalid_file: "The file is invalid or does not contain a recognizable timetable.",
    toast_import_success: "Timetable imported successfully.",
    toast_import_error: "Could not import the timetable.",
    toast_demo_loaded: "Sample data loaded.",
    toast_no_schedules_found: "No compatible schedule was found.",
    toast_schedules_found: "Found {count} schedules.",
    toast_no_courses: "Add at least one course first.",
    toast_course_added: "Course added.",
    toast_course_removed: "Course removed.",
    toast_course_duplicate: "Course is already in the list.",
    toast_course_not_found: "Course not found.",
    toast_invalid_course: "Check the course code and number.",
    toast_crns_copied: "Section numbers copied.",
    toast_export_success: "Schedule exported successfully.",
    toast_export_error: "Could not export the schedule.",
    btn_close: "Close",
    btn_cancel: "Cancel",
    btn_confirm: "Confirm",
    btn_copy: "Copy",
    btn_download: "Download",
    btn_open_help: "User guide",
  }
};

export function getLang() {
  return localStorage.getItem('sm_lang') || 'ar';
}

export function setLang(lang) {
  localStorage.setItem('sm_lang', lang);
  document.documentElement.setAttribute('lang', lang);
  document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  updateDOMTranslations();
}

export function t(key, params = {}) {
  const lang = getLang();
  let text = translations[lang]?.[key] ?? translations.ar[key] ?? key;
  for (const [param, value] of Object.entries(params)) {
    text = text.replace(new RegExp(`\\{${param}\\}`, 'g'), value);
  }
  return text;
}

export function updateDOMTranslations() {
  const lang = getLang();
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const translated = translations[lang]?.[key] ?? translations.ar[key] ?? el.textContent;
    el.textContent = translated;
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const translated = translations[lang]?.[key] ?? translations.ar[key] ?? el.placeholder;
    el.placeholder = translated;
  });
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    const translated = translations[lang]?.[key] ?? translations.ar[key] ?? el.title;
    el.title = translated;
  });
}
