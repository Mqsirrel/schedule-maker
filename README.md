# ScheduleMaker 🎓✨
> **مجدول جامعة طيبة الذكي | Smart Academic Schedule Generator for Taibah University**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Vite](https://img.shields.io/badge/bundler-Vite-646CFF.svg)](https://vitejs.dev/)
[![Privacy: 100% Client-Side](https://img.shields.io/badge/Privacy-100%25%20Client--Side-brightgreen.svg)](#privacy--security)

A modern, high-performance, open-source web application designed to automatically generate collision-free academic schedules for university students. 

---

## 🌟 Key Highlights & Features (أبرز المميزات)

- 🔒 **100% Client-Side & Privacy First**: Zero student data is sent to servers. Everything executes inside your browser using fast background Web Workers.
- 📅 **Interactive Weekly Timetable Grid (الجدول الأسبوعي التفاعلي)**: Color-coded visual timetable (Sunday to Thursday, 08:00 to 18:00) with instructor information and instant detail popovers.
- 📊 **Detailed Matrix Table View (جدول التفاصيل)**: Tabular overview showing course codes, sections, instructor names, times, and available seats.
- ⚡ **High-Performance Constraint Solver (خوارزمية بحث متطورة)**: DFS Backtracking solver with early branch pruning ($O(\text{valid combinations})$) running in a background Web Worker—guaranteeing smooth 60fps UI even with thousands of potential combinations.
- 🎯 **Multi-Criteria Smart Filters (فلاتر وترتيب ذكي)**:
  - Filter by **Days Off (أيام فراغ 1, 2, 3+)**.
  - Filter by **Available Seats Only (المقاعد المتاحة)**.
  - Live search by **Doctor / Instructor Name or Section Number**.
  - Sort by **Least Gaps Between Lectures (أقل فراغات)**, **Earliest Finish**, or **Latest Start (No 8 AMs)**.
- 📲 **Export & Calendar Sync (تصدير متكامل)**:
  - **iCalendar (`.ics`) Export**: One-click sync with Apple Calendar, Google Calendar, and Microsoft Outlook.
  - **High-Resolution PNG Snapshot**: Download a crisp image of your schedule ready for WhatsApp and Telegram student groups.
  - **Print-Friendly View (`@media print`)**: Clean layout optimized for physical A4 printing.
- 📥 **Flexible All-in-One Input Hub (طرق إدخال متعددة)**:
  - Drag & Drop `.html` timetable file exported from TaibahReg (EAS).
  - Direct HTML/Text Paste Box.
  - 1-Click Demo Data Button for immediate testing without a university account.
- 🌐 **Full Bilingual Support (دعم ثنائي اللغة بالكامل)**:
  - Arabic (العربية - RTL) & English (LTR).
  - Sleek Dark Mode & Light Mode themes with modern typography (**Tajawal**, **Outfit**, **JetBrains Mono**).

---

## 🚀 Quick Start & Local Development

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/schedulemaker.git
cd schedulemaker

# Install dependencies
npm install

# Start local development server
npm run dev
```

### Production Build
```bash
# Compile and bundle static assets to /dist
npm run build

# Preview production build locally
npm run preview
```

---

## 📖 How to Use with Taibah University Portal (كيفية الاستخدام)

1. Log into **TaibahReg (EAS)** at [eas.taibahu.edu.sa](https://eas.taibahu.edu.sa/TaibahReg/student_login.jsp).
2. Navigate to the **Timetable (الجدول الزمني)** page.
3. Right-click anywhere in the page and select **Save As... (حفظ باسم)** as an **HTML** file.
4. Drag and drop the saved file into **ScheduleMaker**.
5. Add your desired course codes and numbers, then click **Generate Valid Schedules (توليد وبحث الجداول)**!

---

## 🛠️ Architecture Overview

```
src/
├── components/          # Reusable UI controllers
│   ├── CalendarGrid.js  # Weekly graphical time matrix
│   ├── TableView.js     # Detailed table breakdown
│   ├── CourseSelector.js# Autocomplete course builder
│   ├── FilterBar.js     # Multi-criteria filter & sort
│   ├── ImportModal.js   # Drag-and-drop & paste modal
│   ├── HelpModal.js     # Interactive tutorial guide
│   └── Notification.js  # Web Audio synthesized chime & toasts
├── engine/              # Core scheduling logic
│   ├── parser.js        # Semantic HTML table extractor
│   ├── time.js          # Normalizer (minutes from 00:00 & collision detection)
│   ├── sampleData.js    # Realistic Taibah sample dataset
│   ├── solver.js        # Main-thread coordinator
│   └── solver.worker.js # Web Worker DFS backtracking engine
├── i18n/                # Localization dictionary (AR / EN)
│   └── translations.js
├── styles/              # Design system & theme tokens
│   ├── variables.css
│   ├── base.css
│   ├── components.css
│   └── calendar.css
├── utils/               # Exporters & Storage
│   ├── icsExporter.js   # iCalendar RFC 5545 generator
│   ├── imageExporter.js # High-res PNG snapshot generator
│   └── storage.js       # LocalStorage state persistence
├── index.html           # Semantic HTML5 entrypoint
└── main.js              # Application bootstrapper
```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
