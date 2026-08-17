# 📋 ScheduleMaker — Full UI/UX Redesign Master Brief & System Spec

> **For AI Assistants & Designers**: This document contains the complete product specification, technical architecture, component breakdown, design system tokens, UX interaction models, anti-slop constraints, and redesign objectives for **ScheduleMaker** (*مجدول جامعة طيبة الذكي*). Use this document to execute a comprehensive, production-grade frontend redesign.

---

## 1. 🎯 Product Identity & Context

### What is ScheduleMaker?
**ScheduleMaker** is a modern, privacy-first, client-side academic schedule generator and timetable optimizer built specifically for undergraduate and graduate students at **Taibah University (جامعة طيبة)** in Saudi Arabia.

### The Real Student Problem
During university registration (*TaibahReg / EAS*), students are faced with raw portal tables listing 300+ course sections across 14 table columns with complex schedules (multi-slot days, split lectures/labs, varying professors, morning vs. evening hours). Manually building a conflict-free weekly timetable is frustrating, error-prone, and takes hours.

### The Solution
Students upload their saved timetable HTML page or paste the raw portal text. ScheduleMaker instantly:
1. Parses all courses, sections, times, days, instructors, and available seats.
2. Runs a background **Web Worker Constraint-Satisfaction (DFS Backtracking) Solver**.
3. Generates all mathematically valid, conflict-free schedule combinations in milliseconds.
4. Ranks combinations using student-first weights (Days Off $\rightarrow$ Minimized Dead-Hour Gaps $\rightarrow$ Seat Availability $\rightarrow$ Morning/Evening preferences).
5. Renders an interactive, color-coded weekly visual grid (Sunday to Thursday) and a detailed table view.
6. Allows instant 1-click export to **Google/Apple Calendar (`.ics`)** and **2x Retina PNG Timetable Posters**.

---

## 2. 🧱 Technology Stack & Architecture Constraints

* **Frontend Engine**: Pure Vanilla JavaScript (Modern ES Modules), Semantic HTML5, Vanilla CSS3.
* **Bundler & Dev Server**: Vite 6.
* **Algorithm & Concurrency**: Non-blocking **Web Worker** running Depth-First Search (DFS) with Most Constrained Variable (MRV) branch pruning.
* **Data Exporters**:
  - `html-to-image`: High-DPI 2x retinal PNG rendering with theme background preservation.
  - RFC 5545 iCalendar specification generator (`.ics`) with weekly recurrence rules (`RRULE:FREQ=WEEKLY`).
* **Zero Backend / 100% Client-Side Privacy**: No databases, no telemetry, no accounts. User state (theme, language, bookmarked schedules) is preserved strictly in browser `localStorage`.
* **Bilingual Support**: Instant full-page switching between **Arabic (RTL)** and **English (LTR)** without page reloads.

---

## 3. 🎨 Design Aesthetics & Taste Skill v2 Specification

This product adheres to the **Taste Skill v2**, **Minimalist UI**, and **Soft Skill** design philosophy. Any redesign **must preserve these core locks and principles**:

### A. Color Consistency Lock
* **Dark Theme Neutral Base**: Off-black/deep ink `#10110f` (Base) $\rightarrow$ `#171815` (Surface) $\rightarrow$ `#262923` (Elevated). Never pure `#000000`.
* **Light Theme Neutral Base**: Warm off-white/paper `#f3f0e8` (Base) $\rightarrow$ `#fcfbf7` (Surface) $\rightarrow$ `#eeebe2` (Hover). Never sterile `#ffffff`.
* **Primary High-Contrast Accent**: Single unified Warm Orange / Terracotta (`#ff6b00` or `#e86f41` / `#bd4b2e`). Used for primary CTAs, active tab indicators, focus rings, and selection highlights.
* **Course Block Palette**: Desaturated, harmonious, non-clashing spot pastels (Electric Blue, Sage Green, Warm Amber, Lavender, Rose, Muted Teal, Coral, Slate). Course colors must remain quieter than primary UI controls.

### B. Typography & Numeric Precision
* **Arabic Typography**: `Tajawal` (Weights: 400, 500, 700, 800) — clean geometric sans-serif tailored for modern Arabic interfaces.
* **Latin Display**: `Outfit` / `Manrope` (Weights: 400, 600, 700) — humanistic display type.
* **Monospace / Data / Code**: `JetBrains Mono` / `IBM Plex Mono` — time slots, section codes, keyboard shortcuts, and statistics.
* **Tabular Figures**: Enforced globally on all numbers, times, and metrics:
  ```css
  font-variant-numeric: tabular-nums;
  font-feature-settings: "tnum";
  ```

### C. Shape Consistency Lock
* One unified corner radius hierarchy across all surfaces:
  - Micro chips / Badges: `4px` (`--radius-xs`) / `8px` (`--radius-sm`)
  - Form Inputs, Buttons & Selects: `12px` (`--radius-md`)
  - Panels, Workspace Cards & Modals: `16px` (`--radius-lg`) / `20px` (`--radius-xl`)
  - Status Pills: `9999px` (`--radius-pill`)

### D. Tactile Micro-Interactions & Surfaces
* **Physical Keyboard Micro-UIs (`<kbd>`)**: Visual keyboard keystroke chips (`<kbd>←</kbd> <kbd>→</kbd>`) for quick schedule pagination and `Esc` modal dismissal.
* **Active Press Physics**: Buttons use spring-style tactile push:
  ```css
  .btn:active {
    transform: scale(0.985);
  }
  ```
* **Surface Texture**: Subtle SVG fractal noise texture overlay (`.noise-overlay`, opacity `0.025`) for visual depth without gradient clutter.
* **Accessibility**: Accessible Skip-to-Content anchor (`.skip-to-content`) and high-contrast `:focus-visible` outlines.

### E. 🚫 Anti-Slop Ban List (DO NOT VIOLATE)
1. ❌ **No AI-Purple/Violet Glow Gradients** on headlines, cards, or background blobs.
2. ❌ **No Em-Dashes or En-Dashes** in user-facing UI copy.
3. ❌ **No Section-Numbering Eyebrows** (`00 / INDEX`, `01 · FEATURES`).
4. ❌ **No Fake Div Mockup Dashboards** (keep the live interactive schedule matrix).
5. ❌ **No Cartoon Mascots or Decorative Creatures**.
6. ❌ **No `window.addEventListener('scroll')`** in JavaScript.
7. ❌ **No Audio File Asset Dependencies** (chimes synthesized on the fly via Web Audio API).

---

## 4. 🗺️ Application Layout & Component Hierarchy

```
┌───────────────────────────────────────────────────────────────────────────────┐
│ 1. HEADER (Brand, Badge, Help Guide, Lang Toggle AR/EN, Theme Toggle, GitHub) │
├───────────────────────────────────────────────────────────────────────────────┤
│ 2. TOP BANNER / HERO (Concise academic value prop + Import & Demo Quick CTAs)  │
├───────────────────────────────────────┬───────────────────────────────────────┤
│ 3. SIDEBAR PANEL (Course Selection)   │ 4. RESULTS PANEL (Interactive Matrix) │
│                                       │                                       │
│ • Panel Header + Data Status Badge    │ • Filters Toolbar:                    │
│ • Add Course Form:                    │   - Days Off Filter (All, 1+, 2+, 3)  │
│   - Course Code (Datalist: CS, CYB..) │   - Sort By (Default, Off, Gaps, Time)│
│   - Course Num  (Datalist: 111, 211..)│   - Instructor/Section Search Query   │
│   - Section Wildcard (Optional)       │   - Show Full Sections Checkbox       │
│   - Interactive Match Preview Box     │ • Sub-Toolbar:                        │
│   - "Add Course to List" Button       │   - View Toggle (Weekly Grid / Table) │
│ • Selected Courses List (Card Items   │   - Schedule Pagination (< 1 of 5 >)  │
│   with tags, section counts, remove)  │   - Metric Badges (Score, Off, Gaps)  │
│ • "Clear All" Action                  │   - Exporters (Favorite, PNG, .ICS)   │
│ • "Generate Valid Schedules" Main CTA │ • Visual Weekly Grid (Sun - Thu Matrix│
│                                       │   with color-coded course blocks)     │
│                                       │ • Alternative Detailed Table View     │
├───────────────────────────────────────┴───────────────────────────────────────┤
│ 5. MODAL DIALOGS & OVERLAYS                                                   │
│ • Import Timetable Modal (File Drop Zone + Paste Area + Portal Guide)         │
│ • Help / Tutorial Modal (4-step visual onboarding guide)                      │
│ • Course Detail Popover Modal                                                 │
│ • Toast Notification Hub (Non-intrusive bottom alert feed)                    │
└───────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. ⚙️ Data Schemas & Solver Engine Interface

### Section Object Schema
```typescript
interface Section {
  id: string;               // e.g. "CS-111_M26_101"
  courseKey: string;        // e.g. "CS-111"
  courseCode: string;       // e.g. "CS"
  courseNumber: string;     // e.g. "111"
  courseName: string;       // e.g. "أساسيات البرمجة"
  section: string;          // e.g. "M26"
  instructor: string;       // e.g. "د. أحمد الأحمدي"
  campus: string;           // e.g. "الرئيسي - شطر الطلاب"
  room: string;             // e.g. "معمل 102"
  availableSeats: number;   // Remaining open seats
  enrolledSeats: number;    // Already registered seats
  isFull: boolean;          // true if availableSeats <= 0
  days: {
    su: Array<{ startMinutes: number; endMinutes: number; timeStr: string }>;
    mo: Array<{ startMinutes: number; endMinutes: number; timeStr: string }>;
    tu: Array<{ startMinutes: number; endMinutes: number; timeStr: string }>;
    we: Array<{ startMinutes: number; endMinutes: number; timeStr: string }>;
    th: Array<{ startMinutes: number; endMinutes: number; timeStr: string }>;
  };
}
```

### Schedule Object Schema (Generated by Solver)
```typescript
interface GeneratedSchedule {
  id: string;               // e.g. "sched_1"
  rank: number;             // e.g. 1
  score: number;            // 0 - 100 (Absolute student preference score)
  sections: Section[];      // Exactly one chosen section per desired course
  metrics: {
    daysOffCount: number;         // Count of days with 0 lectures (0 to 4)
    activeDays: string[];         // ['su', 'tu', 'we']
    totalGapMinutes: number;      // Total idle wait minutes between lectures
    totalGapHours: string;        // e.g. "1.5"
    earliestStartMinutes: number; // e.g. 480 (08:00 AM)
    latestEndMinutes: number;     // e.g. 970 (16:10 PM)
    totalStudyMinutes: number;    // Sum of active class minutes
    instructorsCount: number;     // Distinct professors
    availableSeats: number;       // Sum of available open seats
    hasFullSection: boolean;      // true if any section has 0 open seats
  };
}
```

---

## 6. 🚀 Redesign Goals & Prompt Instructions for the AI

When prompting an AI to redesign **ScheduleMaker**, provide the following clear prompt:

```markdown
You are an elite Staff Frontend Engineer and UI/UX Designer specialized in Taste Skill v2, Minimalist UI, and high-performance academic applications.

Your task is to execute a complete, full-scale redesign of ScheduleMaker (مجدول جامعة طيبة الذكي) based on the specification in REDESIGN_MASTER_BRIEF.md.

### Core Objectives:
1. **Elevate Aesthetics to World-Class Minimalist Luxury**:
   - Deliver a refined, utilitarian interface inspired by Linear and Notion.
   - Maintain the Taste Skill off-black (#10110f) and warm-paper (#f3f0e8) palettes with the signature Warm Orange (#ff6b00) accent.
   - Ensure pixel-perfect typographic hierarchy across Tajawal (Arabic), Outfit (Latin), and JetBrains Mono (Figures/Tokens).
   - Retain full tabular number alignment (`tabular-nums`) across all timestamps and badges.

2. **Refine Visual Timetable Matrix (Weekly Grid)**:
   - Enhance the weekly calendar grid layout with dynamic hour bounding, crisp grid lines, responsive card blocks, and subtle hover/active states.
   - Improve visual badges for lecture vs. lab slots, room locations, and instructor labels.
   - Support smooth fluid resizing and mobile drawer / tab fallback for small screens (< 768px).

3. **Polish Course Selector & Filter Controls**:
   - Provide clean cascading auto-complete inputs for Course Code, Number, and Section.
   - Make selected course cards informative, showing total available sections and quick remove/lock actions.
   - Design an ergonomic, accessible filter toolbar with instant live filtering and score sorting.

4. **Preserve All Underlying Engine & Solver Capabilities**:
   - Keep the Web Worker backtracking solver, strict constraint logic (locks/exclusions), and RFC 5545 / 2x PNG exporters 100% functional.
   - Preserve zero-dependency client-side architecture and instant Arabic/English localization.
   - Never use placeholder comments or truncated code. Produce complete, working code.
```

---

## 7. 📂 Key Files in the Codebase

* [`index.html`](file:///home/albraa/Documents/antigravity/dazzling-hertz/index.html): Semantic HTML5 structure, accessible landmarks, and dialog modals.
* [`src/styles/variables.css`](file:///home/albraa/Documents/antigravity/dazzling-hertz/src/styles/variables.css): Complete CSS custom properties, color tokens, typography scales, and shadows.
* [`src/styles/base.css`](file:///home/albraa/Documents/antigravity/dazzling-hertz/src/styles/base.css): Layout scaffolding, noise texture, button physics, `<kbd>` styling.
* [`src/styles/components.css`](file:///home/albraa/Documents/antigravity/dazzling-hertz/src/styles/components.css): Header, banner, forms, filters, toast notifications, modals.
* [`src/styles/calendar.css`](file:///home/albraa/Documents/antigravity/dazzling-hertz/src/styles/calendar.css): Weekly grid matrix, time axis, course blocks, and print stylesheet.
* [`src/engine/time.js`](file:///home/albraa/Documents/antigravity/dazzling-hertz/src/engine/time.js): Integer-minute time parser, normalization, and overlap intersection math.
* [`src/engine/parser.js`](file:///home/albraa/Documents/antigravity/dazzling-hertz/src/engine/parser.js): Robust TaibahReg HTML and text parser with header skipping.
* [`src/engine/solver.worker.js`](file:///home/albraa/Documents/antigravity/dazzling-hertz/src/engine/solver.worker.js): DFS backtracking solver with MRV constraint pruning and ranking.
* [`src/engine/solver.js`](file:///home/albraa/Documents/antigravity/dazzling-hertz/src/engine/solver.js): Web Worker lifecycle and async solve cancellation manager.
* [`src/components/CalendarGrid.js`](file:///home/albraa/Documents/antigravity/dazzling-hertz/src/components/CalendarGrid.js): Visual weekly timetable renderer.
* [`src/components/CourseSelector.js`](file:///home/albraa/Documents/antigravity/dazzling-hertz/src/components/CourseSelector.js): Course selection form and interactive datalists.
* [`src/i18n/translations.js`](file:///home/albraa/Documents/antigravity/dazzling-hertz/src/i18n/translations.js): Arabic & English localization dictionaries.
* [`src/utils/imageExporter.js`](file:///home/albraa/Documents/antigravity/dazzling-hertz/src/utils/imageExporter.js): 2x retina PNG exporter.
* [`src/utils/icsExporter.js`](file:///home/albraa/Documents/antigravity/dazzling-hertz/src/utils/icsExporter.js): iCalendar `.ics` generator.
