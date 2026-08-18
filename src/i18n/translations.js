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
    hero_title: "رتب جدولك الجامعي بذكاء وبدون أي تعارضات",
    hero_desc: "ارفع الجدول الزمني من موقع الجامعة، اختر المواد والشعب، وشاهد كل الجداول الممكنة فوراً.",

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
    guide_quick_steps: "سجل دخولك في بوابة جامعة طيبة (TaibahReg) ➔ ادخل صفحة الجدول الزمني ➔ اضغط بزر الفأرة الأيمن في أي مكان ثم اختر 'حفظ باسم (Save As)' بصيغة HTML.",
    btn_view_full_guide: "شاهد الشرح المصور بالخطوات ➔",
    lbl_paste_desc: "انسخ كود صفحة الجدول أو النص من بوابة التسجيل والصقه هنا مباشرة:",
    ph_paste_area: "الصق كود الـ HTML هنا...",
    btn_process_pasted_data: "معالجة واستيراد البيانات",

    // Modal Help / Tutorial
    modal_help_title: "دليل استخدام مجدول جامعة طيبة الذكي",
    step1_title: "تسجيل الدخول في بوابة الجامعة",
    step1_desc: "توجه إلى بوابة النظام الأكاديمي بجامعة طيبة (EAS / TaibahReg) وقم بتسجيل الدخول بحسابك الجامعي.",
    step2_title: "الانتقال لصفحة الجدول الزمني",
    step2_desc: "من القائمة، توجه لصفحة استبدال/اختيار المواد أو الجدول الزمني للشعب المتاحة في الفصل الحالي.",
    step3_title: "حفظ الصفحة بصيغة HTML",
    step3_desc: "اضغط في أي مكان فارغ داخل الصفحة بزر الفأرة الأيمن (Right-Click) واختر Save As... (حفظ باسم)، ثم احفظ الملف بصيغة Webpage (HTML).",
    step4_title: "إسقاط الملف في الموقع",
    step4_desc: "اسحب الملف المحفوظ إلى هذا الموقع، أو اختر 'استيراد الجدول الزمني' ثم حدد الملف.",

    // Notifications
    toast_timetable_loaded: "تم استيراد الجدول الزمني بنجاح! تم العثور على {count} شعبة.",
    toast_demo_loaded: "تم تحميل البيانات التوضيحية بنجاح. أضف المواد الآن لتوليد الجداول!",
    toast_course_added: "تمت إضافة مادة {name} بنجاح ({count} شعبة).",
    toast_duplicate_course: "هذه المادة مضافة بالفعل في القائمة!",
    toast_course_not_found: "لم يتم العثور على المادة المحددة في بيانات الجدول الزمني.",
    toast_no_schedules_found: "لم يتم العثور على أي جدول متوافق بدون تعارض للمواد المختارة. حاول اختيار شعب بديلة أو تفعيل خيار إظهار الشعب الممتلئة.",
    toast_schedules_found: "تم توليد {count} جدول ممكن بنجاح!",
    toast_export_png_success: "تم تصدير صورة الجدول بنجاح!",
    toast_export_ics_success: "تم إنشاء ملف تقويم iCalendar (.ics) بنجاح!",
    toast_invalid_file: "الملف المرفوع غير متوافق. تأكد من رفع صفحة HTML للجدول الزمني من جامعة طيبة."
  },

  en: {
    // Accessibility & Navigation
    skip_to_content: "Skip to main content",

    // Brand & Header
    badge_taibah: "Taibah University",
    btn_help: "Usage Guide",
    btn_theme: "Toggle Theme",
    btn_import_timetable: "Import Timetable",
    btn_demo_data: "Load Demo Data",
    btn_bookmark: "Add to Favorites",


    // Banner / Hero
    hero_title: "Build Your Smart University Schedule Conflict-Free",
    hero_desc: "Import your university timetable, pick your desired courses and sections, and generate all possible schedules instantly.",

    // Sidebar - Course selection
    title_wanted_courses: "Desired Courses",
    status_no_data: "No Data",
    status_ready: "Loaded",
    lbl_course_code: "Course Code",
    lbl_course_num: "Course Number",
    lbl_section: "Section",
    btn_add_course: "Add Course to List",
    hint_section_wildcard: "• Leave section empty to include all available sections, or write prefix to filter.",
    title_selected_list: "Selected Courses",
    btn_clear_all: "Clear All",
    msg_no_courses_added: "No courses added yet. Import timetable and add courses to generate schedules.",
    btn_generate_schedules: "Generate Valid Schedules",

    // Toolbar & Filters
    lbl_filter_daysoff: "Days Off:",
    opt_all: "All",
    opt_has_off: "Has Days Off",
    opt_1_off: "At least 1 Day Off",
    opt_2_off: "2+ Days Off",
    opt_3_off: "3 Days Off",
    lbl_sort_by: "Sort By:",
    sort_default: "Default Order",
    sort_days_off: "Most Days Off",
    sort_least_gaps: "Least Wait Gaps",
    sort_early_finish: "Earliest Finish",
    sort_late_start: "Latest Start (No 8 AM)",
    ph_search_doctor: "Search instructor or section...",
    chk_show_full_seats: "Show full sections (no available seats)",

    // View switcher & Pagination
    tab_calendar_view: "Weekly Grid",
    tab_table_view: "Details Table",
    txt_schedule: "Schedule",
    txt_of: "of",
    btn_prev_schedule: "Previous Schedule",
    btn_next_schedule: "Next Schedule",
    stat_daysoff: "Days Off:",
    stat_gaps: "Wait Gaps:",
    stat_score: "Match Score:",
    btn_favorite: "Favorite",

    btn_export_png: "Export Image",
    btn_export_ics: "Export Calendar",
    btn_copy_crns: "Copy CRNs",
    toast_crns_copied: "Section CRNs copied to clipboard for quick registration!",
    conflict_diagnostic_title: "Conflict Diagnostic:",
    conflict_between_courses: "Direct time conflict between {c1} and {c2}.",

    // Days of week
    col_time: "Time",
    day_sun: "Sun",
    day_mon: "Mon",
    day_tue: "Tue",
    day_wed: "Wed",
    day_thu: "Thu",

    // Table view columns
    th_row_id: "#",
    th_course_name: "Course Title",
    th_code_num: "Code & Number",
    th_section: "Section",
    th_instructor: "Instructor",
    th_seats_available: "Available",
    th_seats_enrolled: "Enrolled",

    // Placeholder
    placeholder_ready_title: "Ready to schedule?",
    placeholder_ready_desc: "Import your timetable or try demo data, add your courses, and click 'Generate Valid Schedules'.",
    btn_import_now: "Import Timetable Now",
    btn_demo_now: "Quick Demo",

    // Modal Import
    modal_import_title: "Import Timetable (Taibah University)",
    tab_upload_file: "Upload HTML File",
    tab_paste_text: "Paste HTML / Text",
    dropzone_title: "Drag & Drop Timetable File Here",
    dropzone_subtitle: "Supports saved HTML timetable pages from university portal",
    dropzone_browse: "Browse File from Device",
    guide_quick_heading: "How to export your timetable?",
    guide_quick_steps: "Login to TaibahReg ➔ Open the Timetable page ➔ Right-Click anywhere and select 'Save As...' in HTML format.",
    btn_view_full_guide: "View Step-by-Step Tutorial ➔",
    lbl_paste_desc: "Paste raw table HTML or copied text from TaibahReg here:",
    ph_paste_area: "Paste HTML content here...",
    btn_process_pasted_data: "Process & Import Data",

    // Modal Help / Tutorial
    modal_help_title: "Taibah Smart Scheduler Guide",
    step1_title: "Login to Portal",
    step1_desc: "Go to Taibah University academic portal (TaibahReg / EAS) and log in with your credentials.",
    step2_title: "Navigate to Timetable",
    step2_desc: "Open the current semester timetable or course selection sections page.",
    step3_title: "Save As Webpage (HTML)",
    step3_desc: "Right-click anywhere on the page and select Save As... with HTML file format.",
    step4_title: "Upload & Generate",
    step4_desc: "Drag the saved HTML file into ScheduleMaker to generate conflict-free schedules.",

    // Notifications
    toast_timetable_loaded: "Timetable imported successfully! Found {count} sections.",
    toast_demo_loaded: "Demo data loaded. Add courses to start generating schedules!",
    toast_course_added: "Added {name} ({count} sections).",
    toast_duplicate_course: "This course is already in your list!",
    toast_course_not_found: "Course not found in current timetable.",
    toast_no_schedules_found: "No conflict-free schedules found. Try relaxing section filters or allowing full sections.",
    toast_schedules_found: "Generated {count} possible schedules!",
    toast_export_png_success: "Schedule image exported successfully!",
    toast_export_ics_success: "iCalendar (.ics) calendar file generated successfully!",
    toast_invalid_file: "Invalid file format. Please upload a valid Taibah University HTML timetable."
  }
};

let currentLang = localStorage.getItem('sm_lang') || 'ar';

export function getLang() {
  return currentLang;
}

export function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('sm_lang', lang);
  document.documentElement.setAttribute('lang', lang);
  document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  updateDOMTranslations();
}

export function t(key, params = {}) {
  const dict = translations[currentLang] || translations.ar;
  let text = dict[key] || translations.ar[key] || key;
  for (const [paramKey, paramVal] of Object.entries(params)) {
    text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramVal));
  }
  return text;
}

export function updateDOMTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key) el.textContent = t(key);
  });

  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    if (key) el.setAttribute('title', t(key));
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (key) el.setAttribute('placeholder', t(key));
  });

  const langLabel = document.getElementById('langLabel');
  if (langLabel) {
    langLabel.textContent = currentLang === 'ar' ? 'EN' : 'عربي';
  }
}
