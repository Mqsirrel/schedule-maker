# 📋 ScheduleMaker — Full UI/UX Redesign Master Brief & Design Code Package

> **For AI Assistants & Designers**: This standalone document contains the full product specification, technical architecture, component breakdown, design system tokens, UX interaction models, anti-slop constraints, redesign objectives, and the **COMPLETE DESIGN & UI CODE** for **ScheduleMaker** (*مجدول جامعة طيبة الذكي*). Use this document to execute a comprehensive, production-grade frontend redesign.

---

## Table of Contents
1. [Product Identity & Problem Statement](#1-product-identity--problem-statement)
2. [Technology Stack & Architecture Constraints](#2-technology-stack--architecture-constraints)
3. [Design Philosophy & Taste Skill v2 Specification](#3-design-philosophy--taste-skill-v2-specification)
4. [Data Schemas (TypeScript)](#4-data-schemas-typescript)
5. [Complete Design Codebase](#5-complete-design-codebase)
   - 5.1 [`src/styles/variables.css` (Design Tokens & Color Locks)](#51-srcstylesvariablescss)
   - 5.2 [`src/styles/base.css` (Base Layout, Reset, Buttons & Micro-UIs)](#52-srcstylesbasecss)
   - 5.3 [`src/styles/components.css` (Header, Forms, Filters, Modals & Badges)](#53-srcstylescomponentscss)
   - 5.4 [`src/styles/calendar.css` (Weekly Grid Matrix & Print Layout)](#54-srcstylescalendarcss)
   - 5.5 [`index.html` (Complete Semantic Markup)](#55-indexhtml)
   - 5.6 [`src/components/CalendarGrid.js` (DOM Rendering Engine)](#56-srccomponentscalendargridjs)
   - 5.7 [`src/i18n/translations.js` (Bilingual Localization Dictionaries)](#57-srci18ntranslationsjs)
6. [Actionable Handoff Prompt for AI Redesign](#6-actionable-handoff-prompt-for-ai-redesign)

---

## 1. Product Identity & Problem Statement

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

## 2. Technology Stack & Architecture Constraints

* **Frontend Engine**: Pure Vanilla JavaScript (Modern ES Modules), Semantic HTML5, Vanilla CSS3.
* **Bundler & Dev Server**: Vite 6.
* **Algorithm & Concurrency**: Non-blocking **Web Worker** running Depth-First Search (DFS) with Most Constrained Variable (MRV) branch pruning.
* **Data Exporters**:
  - `html-to-image`: High-DPI 2x retinal PNG rendering with theme background preservation.
  - RFC 5545 iCalendar specification generator (`.ics`) with weekly recurrence rules (`RRULE:FREQ=WEEKLY`).
* **Zero Backend / 100% Client-Side Privacy**: No databases, no telemetry, no accounts. User state (theme, language, bookmarked schedules) is preserved strictly in browser `localStorage`.
* **Bilingual Support**: Instant full-page switching between **Arabic (RTL)** and **English (LTR)** without page reloads.

---

## 3. Design Philosophy & Taste Skill v2 Specification

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

## 4. Data Schemas (TypeScript)

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
    su: Array<{ startMinutes: number; endMinutes: number; timeStr: string; formatted: string }>;
    mo: Array<{ startMinutes: number; endMinutes: number; timeStr: string; formatted: string }>;
    tu: Array<{ startMinutes: number; endMinutes: number; timeStr: string; formatted: string }>;
    we: Array<{ startMinutes: number; endMinutes: number; timeStr: string; formatted: string }>;
    th: Array<{ startMinutes: number; endMinutes: number; timeStr: string; formatted: string }>;
  };
}

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

## 5. Complete Design Codebase

### 5.1 `src/styles/variables.css`
```css
/* Taste Skill v2 / ScheduleMaker visual tokens */
:root {
  --font-primary: 'Tajawal', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-latin: 'Outfit', 'Manrope', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'JetBrains Mono', 'IBM Plex Mono', monospace;

  --transition-fast: 0.12s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-normal: 0.22s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 0.35s cubic-bezier(0.4, 0, 0.2, 1);

  --radius-xs: 4px;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-pill: 9999px;

  /* Course colors are deliberately quieter than the primary action color. */
  --course-color-1: #4f86d9;
  --course-color-2: #39a879;
  --course-color-3: #c99028;
  --course-color-4: #8069b8;
  --course-color-5: #c86d8f;
  --course-color-6: #3d9eaf;
  --course-color-7: #cf7650;
  --course-color-8: #439b91;
  --course-color-9: #6e78bd;
  --course-color-10: #7ca64b;
}

/* Dark: deep ink rather than pure black, with a restrained warm action color. */
html[data-theme="dark"] {
  --color-bg-base: #10110f;
  --color-bg-surface: #171815;
  --color-bg-surface-hover: #1f211d;
  --color-bg-elevated: #262923;
  --color-bg-glass: rgba(16, 17, 15, 0.90);

  --color-border: rgba(244, 241, 232, 0.085);
  --color-border-hover: rgba(244, 241, 232, 0.16);
  --color-border-active: rgba(232, 111, 65, 0.55);

  --color-text-primary: #f3f0e9;
  --color-text-secondary: #b1afa7;
  --color-text-muted: #77766f;
  --color-text-inverse: #10110f;

  --color-primary: #e86f41;
  --color-primary-hover: #f07b4d;
  --color-primary-subtle: rgba(232, 111, 65, 0.12);
  --color-accent: #e86f41;
  --color-accent-hover: #f07b4d;

  --color-success: #51a879;
  --color-success-subtle: rgba(81, 168, 121, 0.13);
  --color-warning: #c9943c;
  --color-warning-subtle: rgba(201, 148, 60, 0.13);
  --color-danger: #d6655c;
  --color-danger-subtle: rgba(214, 101, 92, 0.13);

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.24);
  --shadow-md: 0 6px 18px rgba(0, 0, 0, 0.22);
  --shadow-lg: 0 18px 40px rgba(0, 0, 0, 0.28);
  --shadow-xl: 0 28px 60px rgba(0, 0, 0, 0.34);
  --shadow-button: 0 12px 28px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255,255,255,0.08);

  --grid-line-color: rgba(244, 241, 232, 0.055);
  --grid-hour-bg: rgba(244, 241, 232, 0.014);
}

/* Light: warm paper instead of sterile white. */
html[data-theme="light"] {
  --color-bg-base: #f3f0e8;
  --color-bg-surface: #fcfbf7;
  --color-bg-surface-hover: #eeebe2;
  --color-bg-elevated: #ffffff;
  --color-bg-glass: rgba(243, 240, 232, 0.92);

  --color-border: rgba(27, 27, 24, 0.095);
  --color-border-hover: rgba(27, 27, 24, 0.17);
  --color-border-active: rgba(190, 74, 42, 0.55);

  --color-text-primary: #1b1c18;
  --color-text-secondary: #5f6059;
  --color-text-muted: #8c8a81;
  --color-text-inverse: #ffffff;

  --color-primary: #bd4b2e;
  --color-primary-hover: #a93f25;
  --color-primary-subtle: rgba(189, 75, 46, 0.085);
  --color-accent: #bd4b2e;
  --color-accent-hover: #a93f25;

  --color-success: #347b57;
  --color-success-subtle: rgba(52, 123, 87, 0.085);
  --color-warning: #9a6b20;
  --color-warning-subtle: rgba(154, 107, 32, 0.085);
  --color-danger: #b54d45;
  --color-danger-subtle: rgba(181, 77, 69, 0.085);

  --shadow-sm: 0 1px 2px rgba(27, 27, 24, 0.035);
  --shadow-md: 0 6px 18px rgba(27, 27, 24, 0.055);
  --shadow-lg: 0 18px 40px rgba(27, 27, 24, 0.075);
  --shadow-xl: 0 28px 60px rgba(27, 27, 24, 0.10);
  --shadow-button: 0 12px 28px rgba(189, 75, 46, 0.18), inset 0 1px 0 rgba(255,255,255,0.45);

  --grid-line-color: rgba(27, 27, 24, 0.065);
  --grid-hour-bg: rgba(27, 27, 24, 0.014);
}

/* Shared numeric alignment for schedules and metrics. */
button, input, select, .stat-pill, .pagination-info, .brand-badge, .tag-badge {
  font-variant-numeric: tabular-nums;
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --transition-fast: 0s;
    --transition-normal: 0s;
    --transition-slow: 0s;
  }
}
```

---

### 5.2 `src/styles/base.css`
```css
/* Taste Skill v2 Base Styles, Reset & Modern Micro-Interactions */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  line-height: 1.5;
  -webkit-text-size-adjust: 100%;
  font-family: var(--font-primary);
  background-color: var(--color-bg-base);
  color: var(--color-text-primary);
  color-scheme: dark light;
  scroll-behavior: smooth;
  transition: background-color var(--transition-normal), color var(--transition-normal);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

html[dir="ltr"] {
  font-family: var(--font-latin);
}

body {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  position: relative;
}

/* Keep texture barely perceptible. Utility-first surface. */
.noise-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.012;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}

.skip-to-content {
  position: absolute;
  top: -100px;
  right: 1.5rem;
  padding: 0.5rem 1rem;
  background: var(--color-primary);
  color: #ffffff;
  border-radius: var(--radius-md);
  font-weight: 700;
  z-index: 10000;
  transition: top var(--transition-fast);
}

.skip-to-content:focus { top: 1rem; }

.time-slot, .metric-value, .course-block-time, .page-indicator, .table-col-time, .stat-value, .badge-count {
  font-variant-numeric: tabular-nums;
  font-feature-settings: "tnum";
}

kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.2rem 0.45rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: var(--radius-xs);
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  box-shadow: 0 1px 0 var(--color-border);
  line-height: 1;
  user-select: none;
}

:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

h1, h2, h3, h4, h5, h6 {
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: var(--color-text-primary);
}

p { color: var(--color-text-secondary); }

a {
  color: var(--color-primary);
  text-decoration: none;
  transition: color var(--transition-fast);
}

a:hover { color: var(--color-primary-hover); }

.uppercase { text-transform: uppercase; letter-spacing: 0.08em; }

.app-layout {
  max-width: 1480px;
  margin: 0 auto;
  padding: 1.25rem;
  width: 100%;
  flex: 1;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: inherit;
  font-size: 0.925rem;
  font-weight: 600;
  padding: 0.625rem 1.25rem;
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  cursor: pointer;
  user-select: none;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.btn:active { transform: scale(0.985); }
.btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }
.btn-primary { background-color: var(--color-primary); color: #ffffff; box-shadow: var(--shadow-button); }
.btn-primary:hover:not(:disabled) { background-color: var(--color-primary-hover); transform: translateY(-1px); }
.btn-secondary { background-color: var(--color-bg-surface); color: var(--color-text-primary); border-color: var(--color-border); box-shadow: var(--shadow-sm); }
.btn-secondary:hover:not(:disabled) { background-color: var(--color-bg-surface-hover); border-color: var(--color-border-hover); }
.btn-accent { background-color: var(--color-bg-surface-hover); color: var(--color-text-primary); border-color: var(--color-border); }
.btn-accent:hover:not(:disabled) { background-color: var(--color-bg-elevated); border-color: var(--color-border-hover); }
.btn-block { width: 100%; }
.btn-lg { padding: 0.875rem 1.5rem; font-size: 1rem; border-radius: var(--radius-lg); }
.btn-icon { display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: var(--radius-md); background: var(--color-bg-surface); border: 1px solid var(--color-border); color: var(--color-text-secondary); cursor: pointer; transition: all var(--transition-fast); }
.btn-icon:hover { background: var(--color-bg-surface-hover); color: var(--color-text-primary); border-color: var(--color-border-hover); }
.btn-pill { display: inline-flex; align-items: center; justify-content: center; padding: 0.35rem 0.85rem; font-weight: 700; font-size: 0.85rem; border-radius: var(--radius-pill); background: var(--color-bg-surface); border: 1px solid var(--color-border); color: var(--color-text-primary); cursor: pointer; transition: all var(--transition-fast); }
.btn-pill:hover { background: var(--color-bg-surface-hover); border-color: var(--color-border-hover); }
.btn-text { background: none; border: none; color: var(--color-primary); font-family: inherit; font-weight: 600; font-size: 0.9rem; cursor: pointer; padding: 0; display: inline-flex; align-items: center; gap: 0.25rem; }
.btn-text:hover { text-decoration: underline; }
.btn-text-danger { background: none; border: none; color: var(--color-danger); font-family: inherit; font-weight: 600; font-size: 0.8rem; cursor: pointer; padding: 0; }
.btn-text-danger:hover { text-decoration: underline; }

.input-text, .select-input, .text-area-input {
  width: 100%;
  font-family: inherit;
  font-size: 0.925rem;
  color: var(--color-text-primary);
  background-color: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 0.625rem 0.875rem;
  outline: none;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.input-text:focus, .select-input:focus, .text-area-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-subtle);
}

.input-text::placeholder, .text-area-input::placeholder { color: var(--color-text-muted); }

.custom-checkbox { display: inline-flex; align-items: center; gap: 0.6rem; cursor: pointer; font-size: 0.875rem; user-select: none; }
.custom-checkbox input { position: absolute; opacity: 0; cursor: pointer; height: 0; width: 0; }
.checkmark { height: 18px; width: 18px; background-color: var(--color-bg-surface); border: 1px solid var(--color-border); border-radius: var(--radius-xs); display: flex; align-items: center; justify-content: center; transition: all var(--transition-fast); }
.custom-checkbox:hover input ~ .checkmark { border-color: var(--color-primary); }
.custom-checkbox input:checked ~ .checkmark { background-color: var(--color-primary); border-color: var(--color-primary); }
.checkmark::after { content: ""; display: none; width: 4px; height: 8px; border: solid white; border-width: 0 2px 2px 0; transform: rotate(45deg); margin-bottom: 2px; }
.custom-checkbox input:checked ~ .checkmark::after { display: block; }

.app-modal { border: none; background: transparent; padding: 1rem; max-width: 650px; width: 95%; margin: auto; }
.app-modal::backdrop { background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(8px); animation: fadeIn 0.15s ease-out; }
.modal-card { background: var(--color-bg-surface); border: 1px solid var(--color-border); border-radius: var(--radius-xl); box-shadow: var(--shadow-xl); overflow: hidden; animation: scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
.modal-card--lg { max-width: 850px; }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--color-border); }
.modal-title-wrap { display: flex; align-items: center; gap: 0.75rem; color: var(--color-primary); }
.modal-close-btn { background: none; border: none; color: var(--color-text-muted); font-size: 1.75rem; cursor: pointer; line-height: 1; padding: 0.25rem 0.5rem; border-radius: var(--radius-sm); transition: all var(--transition-fast); }
.modal-close-btn:hover { color: var(--color-text-primary); background: var(--color-bg-surface-hover); }
.modal-body { padding: 1.5rem; }

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes scaleIn { from { opacity: 0; transform: scale(0.97) translateY(6px); } to { opacity: 1; transform: scale(1) translateY(0); } }

@media (max-width: 900px) {
  .app-layout { padding: 0.875rem; }
}

@media (max-width: 640px) {
  .app-layout { padding: 0.625rem; }
  .btn { min-height: 42px; }
  .btn-icon { width: 42px; height: 42px; }
  .btn-lg { width: 100%; }
  .app-modal { width: calc(100% - 0.75rem); padding: 0.375rem; }
  .modal-header { padding: 1rem; }
  .modal-body { padding: 1rem; }
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; transition-duration: 0.001ms !important; }
}
```

---

### 5.3 `src/styles/components.css`
```css
/* Component Styles */

/* Header & Navbar */
.app-header {
  position: sticky;
  top: 0;
  z-index: 40;
  background: var(--color-bg-glass);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border);
}

.header-container {
  max-width: 1480px;
  margin: 0 auto;
  padding: 0.875rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand-group {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.brand-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  background: var(--color-primary);
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(255, 107, 0, 0.35);
}

.brand-text {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.brand-title {
  font-family: var(--font-latin);
  font-size: 1.35rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--color-text-primary);
}

.brand-badge {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0.2rem 0.6rem;
  border-radius: var(--radius-pill);
  background: var(--color-primary-subtle);
  color: var(--color-primary);
  border: 1px solid rgba(255, 107, 0, 0.25);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

html[data-theme="dark"] .icon-moon { display: none; }
html[data-theme="dark"] .icon-sun { display: block; }
html[data-theme="light"] .icon-sun { display: none; }
html[data-theme="light"] .icon-moon { display: block; }

/* Top Banner / Quick Hero */
.top-banner {
  margin-bottom: 1.5rem;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: 1.5rem 2rem;
  box-shadow: var(--shadow-sm);
}

.banner-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.banner-text h2 {
  font-size: 1.45rem;
  margin-bottom: 0.25rem;
}

.banner-text p {
  font-size: 0.95rem;
}

.banner-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

/* Workspace Grid: Sidebar & Results Area */
.workspace-grid {
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 1.5rem;
  align-items: start;
}

@media (max-width: 1080px) {
  .workspace-grid {
    grid-template-columns: 1fr;
  }
}

/* Sidebar Panel */
.sidebar-panel {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  box-shadow: var(--shadow-sm);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.panel-title-wrap {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-primary);
}

.panel-title-wrap h3 {
  font-size: 1.15rem;
}

.status-badge {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.6rem;
  border-radius: var(--radius-pill);
}

.status-badge--empty {
  background: var(--color-warning-subtle);
  color: var(--color-warning);
}

.status-badge--ready {
  background: var(--color-success-subtle);
  color: var(--color-success);
}

/* Add Course Form */
.add-course-form {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.form-inputs-row {
  display: grid;
  grid-template-columns: 1.1fr 1fr 1fr;
  gap: 0.5rem;
}

.input-field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.input-field label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-text-secondary);
}

.course-meta-box {
  background: var(--color-primary-subtle);
  border: 1px solid rgba(255, 107, 0, 0.25);
  border-radius: var(--radius-md);
  padding: 0.6rem 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--color-primary);
  animation: fadeIn var(--transition-fast);
}

.course-meta-box .meta-name {
  font-weight: 700;
  flex: 1;
}

.course-meta-box .meta-count {
  font-size: 0.75rem;
  opacity: 0.8;
}

.form-hint {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  line-height: 1.4;
}

/* Selected Courses List */
.selected-courses-container {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  max-height: 320px;
  overflow-y: auto;
  padding-right: 0.25rem;
}

.selected-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-text-secondary);
}

.selected-courses-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.course-card-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--color-bg-base);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 0.65rem 0.85rem;
  transition: all var(--transition-fast);
  animation: scaleIn var(--transition-fast);
}

.course-card-item:hover {
  border-color: var(--color-border-hover);
  background: var(--color-bg-surface-hover);
}

.course-item-info {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.course-item-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--color-text-primary);
}

.course-item-tags {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.tag-badge {
  font-family: var(--font-mono);
  background: var(--color-bg-surface);
  padding: 0.1rem 0.4rem;
  border-radius: var(--radius-xs);
  border: 1px solid var(--color-border);
}

.btn-remove-course {
  background: none;
  border: none;
  color: var(--color-danger);
  cursor: pointer;
  padding: 0.35rem;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.btn-remove-course:hover {
  background: var(--color-danger-subtle);
}

/* Empty State Card */
.empty-state-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.6rem;
  padding: 2rem 1rem;
  color: var(--color-text-muted);
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-lg);
}

.empty-state-card p {
  font-size: 0.85rem;
}

/* Results Panel & Toolbar */
.results-panel {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.results-toolbar {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: var(--shadow-sm);
}

.filters-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-group label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  white-space: nowrap;
}

.search-filter {
  flex: 1;
  min-width: 200px;
}

.search-input-wrap {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
}

.search-input-wrap svg {
  position: absolute;
  right: 0.75rem;
  color: var(--color-text-muted);
  pointer-events: none;
}

html[dir="ltr"] .search-input-wrap svg {
  right: auto;
  left: 0.75rem;
}

.input-search {
  padding-right: 2.25rem;
}

html[dir="ltr"] .input-search {
  padding-right: 0.875rem;
  padding-left: 2.25rem;
}

.sub-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  padding-top: 0.85rem;
  border-top: 1px solid var(--color-border);
}

/* View Mode Switcher */
.view-mode-toggle {
  display: flex;
  background: var(--color-bg-base);
  padding: 0.25rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
}

.view-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.85rem;
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  background: none;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.view-btn.active {
  background: var(--color-bg-surface);
  color: var(--color-primary);
  box-shadow: var(--shadow-sm);
}

/* Schedule Pagination */
.schedule-pagination {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.btn-nav {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  background: var(--color-bg-base);
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-nav:hover:not(:disabled) {
  background: var(--color-primary);
  color: #ffffff;
  border-color: var(--color-primary);
}

.btn-nav:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination-info {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
}

.pagination-info strong {
  color: var(--color-text-primary);
  font-family: var(--font-mono);
}

.kbd-nav-hint {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  opacity: 0.7;
}

@media (max-width: 768px) {
  .kbd-nav-hint {
    display: none;
  }
}

/* Schedule Stats */
.schedule-stats {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stat-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8rem;
  padding: 0.25rem 0.65rem;
  border-radius: var(--radius-pill);
  background: var(--color-bg-base);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
}

.stat-pill strong {
  color: var(--color-primary);
  font-family: var(--font-mono);
}

/* Export Actions */
.export-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-icon-labeled {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.75rem;
  border-radius: var(--radius-md);
  background: var(--color-bg-base);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-icon-labeled:hover {
  background: var(--color-bg-surface-hover);
  color: var(--color-text-primary);
  border-color: var(--color-border-hover);
}

.btn-icon-labeled.bookmarked {
  background: var(--color-warning-subtle);
  color: var(--color-warning);
  border-color: rgba(245, 158, 11, 0.4);
}

.btn-icon-labeled.bookmarked svg {
  fill: currentColor;
}

/* Placeholder State */
.placeholder-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.placeholder-card {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: 3.5rem 2rem;
  max-width: 540px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  box-shadow: var(--shadow-sm);
}

.placeholder-illustration {
  color: var(--color-primary);
  opacity: 0.8;
  margin-bottom: 0.5rem;
}

.placeholder-card h3 {
  font-size: 1.35rem;
}

.placeholder-card p {
  font-size: 0.95rem;
  line-height: 1.6;
}

.placeholder-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

/* Detailed Table View */
.table-card {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.table-responsive {
  overflow-x: auto;
  width: 100%;
}

.schedule-detail-table {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
  font-size: 0.88rem;
}

.schedule-detail-table th {
  background: var(--color-bg-surface-hover);
  color: var(--color-text-secondary);
  font-weight: 700;
  padding: 0.75rem 0.6rem;
  border-bottom: 1px solid var(--color-border);
  white-space: nowrap;
}

.schedule-detail-table td {
  padding: 0.75rem 0.6rem;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text-primary);
}

.schedule-detail-table tbody tr:hover {
  background: var(--color-bg-base);
}

.schedule-detail-table td.time-cell {
  font-family: var(--font-mono);
  font-size: 0.82rem;
  direction: ltr;
}

.seats-badge {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.2rem 0.45rem;
  border-radius: var(--radius-xs);
}

.seats-badge--available {
  background: var(--color-success-subtle);
  color: var(--color-success);
}

.seats-badge--full {
  background: var(--color-danger-subtle);
  color: var(--color-danger);
}

/* Import Dropzone & Tabs */
.modal-tabs {
  display: flex;
  padding: 0 1.5rem;
  border-bottom: 1px solid var(--color-border);
}

.tab-btn {
  padding: 0.85rem 1.25rem;
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.tab-btn.active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

.drop-zone {
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-lg);
  padding: 2.5rem 1.5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  background: var(--color-bg-base);
  transition: all var(--transition-fast);
}

.drop-zone:hover, .drop-zone.dragover {
  border-color: var(--color-primary);
  background: var(--color-primary-subtle);
}

.drop-zone-icon {
  color: var(--color-primary);
}

.drop-zone h4 {
  font-size: 1.1rem;
}

.drop-zone p {
  font-size: 0.9rem;
}

.text-link {
  color: var(--color-primary);
  font-weight: 700;
  text-decoration: underline;
}

.import-helper-alert {
  margin-top: 1.25rem;
  background: var(--color-bg-base);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 1rem;
  display: flex;
  gap: 0.85rem;
  font-size: 0.85rem;
}

.alert-icon {
  font-size: 1.25rem;
}

.alert-text p {
  margin-bottom: 0.25rem;
}

/* Tutorial / Help Guide */
.tutorial-body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tutorial-step {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: var(--color-bg-base);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
}

.step-badge {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--color-primary);
  color: #ffffff;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.step-content h4 {
  font-size: 1rem;
  margin-bottom: 0.2rem;
}

.step-content p {
  font-size: 0.85rem;
}

/* Toast Notifications */
.toast-container {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  pointer-events: none;
}

html[dir="ltr"] .toast-container {
  right: auto;
  left: 1.5rem;
}

.toast {
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1.25rem;
  border-radius: var(--radius-md);
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  font-size: 0.9rem;
  font-weight: 600;
  box-shadow: var(--shadow-lg);
  animation: slideInToast 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  min-width: 280px;
  max-width: 420px;
}

.toast-icon { font-size: 1.1rem; }
.toast-msg { flex: 1; }
.toast--success { border-left: 4px solid var(--color-success); }
.toast--error { border-left: 4px solid var(--color-danger); }
.toast--warning { border-left: 4px solid var(--color-warning); }
.toast--info { border-left: 4px solid var(--color-primary); }

html[dir="rtl"] .toast--success { border-left: none; border-right: 4px solid var(--color-success); }
html[dir="rtl"] .toast--error { border-left: none; border-right: 4px solid var(--color-danger); }
html[dir="rtl"] .toast--warning { border-left: none; border-right: 4px solid var(--color-warning); }
html[dir="rtl"] .toast--info { border-left: none; border-right: 4px solid var(--color-primary); }

@keyframes slideInToast {
  from { opacity: 0; transform: translateY(12px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
```

---

### 5.4 `src/styles/calendar.css`
```css
/* Weekly Visual Calendar Styles */

.calendar-card {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
}

/* Header: Time Column + 5 Days (Sun to Thu) */
.calendar-header-row {
  display: grid;
  grid-template-columns: 75px repeat(5, 1fr);
  gap: 1px;
  background: var(--color-border);
  border: 1px solid var(--color-border);
  border-top-left-radius: var(--radius-lg);
  border-top-right-radius: var(--radius-lg);
  overflow: hidden;
}

.time-col-header, .day-col-header {
  background: var(--color-bg-surface-hover);
  padding: 0.85rem 0.5rem;
  text-align: center;
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--color-text-secondary);
}

.day-col-header {
  color: var(--color-text-primary);
}

/* Calendar Matrix Area */
.calendar-body-matrix {
  position: relative;
  display: grid;
  grid-template-columns: 75px repeat(5, 1fr);
  border: 1px solid var(--color-border);
  border-top: none;
  border-bottom-left-radius: var(--radius-lg);
  border-bottom-right-radius: var(--radius-lg);
  background: var(--color-bg-base);
  min-height: 600px;
  height: 600px;
}

/* Hourly Background Grid */
.calendar-time-axis {
  display: flex;
  flex-direction: column;
  border-left: 1px solid var(--color-border);
  background: var(--grid-hour-bg);
}

html[dir="ltr"] .calendar-time-axis {
  border-left: none;
  border-right: 1px solid var(--color-border);
}

.hour-marker {
  height: 60px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--color-text-muted);
  border-bottom: 1px dashed var(--grid-line-color);
  padding-top: 0.25rem;
  user-select: none;
}

.day-column-track {
  position: relative;
  height: 100%;
  border-left: 1px solid var(--grid-line-color);
}

html[dir="ltr"] .day-column-track {
  border-left: none;
  border-right: 1px solid var(--grid-line-color);
}

.day-column-track:last-child {
  border-left: none;
  border-right: none;
}

.day-column-gridline {
  position: absolute;
  left: 0;
  right: 0;
  height: 60px;
  border-bottom: 1px dashed var(--grid-line-color);
  pointer-events: none;
}

/* Visual Course Blocks */
.course-block {
  position: absolute;
  left: 4px;
  right: 4px;
  border-radius: var(--radius-md);
  padding: 0.5rem 0.6rem;
  color: #ffffff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition-fast);
  z-index: 10;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.course-block:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
  z-index: 20;
}

.course-block-title {
  font-weight: 800;
  font-size: 0.85rem;
  line-height: 1.2;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.course-block-code {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  opacity: 0.9;
  font-weight: 600;
}

.course-block-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.25rem;
  margin-top: 0.2rem;
}

.course-block-section {
  font-size: 0.7rem;
  font-weight: 700;
  background: rgba(0, 0, 0, 0.25);
  padding: 0.1rem 0.35rem;
  border-radius: var(--radius-xs);
  font-family: var(--font-mono);
}

.course-block-time {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  opacity: 0.9;
  direction: ltr;
}

.course-block-instructor {
  font-size: 0.72rem;
  opacity: 0.9;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Print Stylesheet */
@media print {
  body {
    background: #ffffff !important;
    color: #000000 !important;
  }

  .app-header, .top-banner, .sidebar-panel, .results-toolbar, .toast-container {
    display: none !important;
  }

  .app-layout {
    max-width: 100% !important;
    padding: 0 !important;
  }

  .workspace-grid {
    grid-template-columns: 1fr !important;
  }

  .calendar-card {
    border: none !important;
    box-shadow: none !important;
    padding: 0 !important;
  }

  .calendar-body-matrix {
    border: 1px solid #000000 !important;
    height: 700px !important;
  }

  .course-block {
    box-shadow: none !important;
    border: 1px solid #000000 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
```

---

### 5.5 `index.html`
```html
<!DOCTYPE html>
<html lang="ar" dir="rtl" data-theme="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ScheduleMaker | مجدول جامعة طيبة الذكي</title>
  <meta name="description" content="أداة ذكية وسريعة لتوليد وترتيب الجداول الدراسية لطلاب جامعة طيبة بدون تعارضات زمنية وبخصوصية تامة 100%." />
  <meta name="keywords" content="جامعة طيبة, مجدول الجداول, ترتيب الجدول, تعارض المواد, Taibah University, Schedule Maker, TaibahReg" />
  <meta name="author" content="ScheduleMaker Team" />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="ScheduleMaker | مجدول جامعة طيبة الذكي" />
  <meta property="og:description" content="توليد فوري للجداول الجامعية الخالية من التعارضات مع عرض أسبوعي تفاعلي وتصدير لتقويم الهاتف والصور." />
  <meta property="og:locale" content="ar_SA" />

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=JetBrains+Mono:wght@400;500;700&family=Manrope:wght@400;600;700;800&family=Outfit:wght@400;600;700;800&family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet" />

  <link rel="stylesheet" href="./src/styles/variables.css" />
  <link rel="stylesheet" href="./src/styles/base.css" />
  <link rel="stylesheet" href="./src/styles/components.css" />
  <link rel="stylesheet" href="./src/styles/calendar.css" />

  <script>
    (function() {
      const savedTheme = localStorage.getItem('sm_theme') || 'dark';
      document.documentElement.setAttribute('data-theme', savedTheme);
      const savedLang = localStorage.getItem('sm_lang') || 'ar';
      document.documentElement.setAttribute('lang', savedLang);
      document.documentElement.setAttribute('dir', savedLang === 'ar' ? 'rtl' : 'ltr');
    })();
  </script>
</head>
<body>
  <!-- Accessibility Skip Link -->
  <a href="#mainWorkspace" class="skip-to-content" data-i18n="skip_to_content">تخطي إلى المحتوى الرئيسي</a>

  <!-- Tactile Noise Texture Overlay -->
  <div class="noise-overlay" aria-hidden="true"></div>

  <!-- Header / Navbar -->
  <header class="app-header">
    <div class="header-container">
      <div class="brand-group">
        <div class="brand-logo" aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
            <path d="m9 16 2 2 4-4"></path>
          </svg>
        </div>
        <div class="brand-text">
          <h1 class="brand-title">ScheduleMaker</h1>
          <span class="brand-badge" data-i18n="badge_taibah">جامعة طيبة</span>
        </div>
      </div>

      <div class="header-actions">
        <button id="btnOpenHelp" class="btn-icon" title="دليل الاستخدام" data-i18n-title="btn_help" aria-label="Help Guide">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </button>

        <button id="btnToggleLang" class="btn-pill" aria-label="Toggle Language">
          <span id="langLabel">EN</span>
        </button>

        <button id="btnToggleTheme" class="btn-icon" title="تبديل المظهر" data-i18n-title="btn_theme" aria-label="Toggle Theme">
          <svg class="icon-sun" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
          <svg class="icon-moon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </button>

        <a href="https://github.com/Mqsirrel/schedule-maker" target="_blank" rel="noopener noreferrer" class="btn-icon" title="GitHub Repository" aria-label="GitHub Repository">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
          </svg>
        </a>
      </div>
    </div>
  </header>

  <!-- Main Content Layout -->
  <main class="app-layout" id="mainWorkspace">
    <!-- Top Control Bar / Quick Actions -->
    <section class="top-banner">
      <div class="banner-content">
        <div class="banner-text">
          <h2 data-i18n="hero_title">رتب جدولك الجامعي بذكاء وبدون أي تعارضات</h2>
          <p data-i18n="hero_desc">ارفع الجدول الزمني من موقع الجامعة، اختر المواد والشعب، وشاهد كل الجداول الممكنة فوراً.</p>
        </div>
        <div class="banner-actions">
          <button id="btnOpenImport" class="btn btn-primary" aria-haspopup="dialog">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            <span data-i18n="btn_import_timetable">استيراد الجدول الزمني</span>
          </button>
          <button id="btnLoadDemo" class="btn btn-secondary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            <span data-i18n="btn_demo_data">تجربة بيانات توضيحية</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Workspace Grid -->
    <div class="workspace-grid">
      <!-- Course Selector Sidebar -->
      <aside class="sidebar-panel">
        <div class="panel-header">
          <div class="panel-title-wrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            <h3 data-i18n="title_wanted_courses">المواد المراد إضافتها</h3>
          </div>
          <span id="timetableStatusBadge" class="status-badge status-badge--empty" data-i18n="status_no_data">لا توجد بيانات</span>
        </div>

        <!-- Add Subject Form -->
        <form id="addCourseForm" class="add-course-form" autocomplete="off">
          <div class="form-inputs-row">
            <div class="input-field">
              <label for="courseCode" data-i18n="lbl_course_code">رمز المادة</label>
              <input type="text" id="courseCode" list="listCourseCodes" placeholder="مثل: CS" class="input-text uppercase" autocomplete="off" required />
              <datalist id="listCourseCodes"></datalist>
            </div>
            <div class="input-field">
              <label for="courseNumber" data-i18n="lbl_course_num">رقم المادة</label>
              <input type="text" id="courseNumber" list="listCourseNumbers" placeholder="مثل: 181" class="input-text uppercase" autocomplete="off" required />
              <datalist id="listCourseNumbers"></datalist>
            </div>
            <div class="input-field">
              <label for="courseSection" data-i18n="lbl_section">الشعبة</label>
              <input type="text" id="courseSection" list="listCourseSections" placeholder="الكل" class="input-text uppercase" autocomplete="off" />
              <datalist id="listCourseSections"></datalist>
            </div>
          </div>

          <div id="coursePreviewMeta" class="course-meta-box" hidden>
            <span class="meta-icon">✓</span>
            <span id="coursePreviewName" class="meta-name"></span>
            <span id="coursePreviewSectionsCount" class="meta-count"></span>
          </div>

          <div class="form-actions-row">
            <button type="submit" id="btnAddCourse" class="btn btn-primary btn-block" disabled>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span data-i18n="btn_add_course">إضافة المادة للقائمة</span>
            </button>
          </div>
          <small class="form-hint" data-i18n="hint_section_wildcard">• يمكنك ترك حقل الشعبة فارغاً لاختيار كافة الشعب المتاحة، أو كتابة بدايتها لتضمين مجموعة محددة.</small>
        </form>

        <!-- Selected Courses List -->
        <div class="selected-courses-container">
          <div class="selected-header">
            <span class="selected-title" data-i18n="title_selected_list">المواد المختارة</span>
            <button id="btnClearAllCourses" class="btn-text-danger" style="display: none;" data-i18n="btn_clear_all">مسح الكل</button>
          </div>
          <ul id="selectedCoursesList" class="selected-courses-list"></ul>
        </div>

        <!-- Solve Button -->
        <div class="sidebar-footer">
          <button id="btnGenerateSchedules" class="btn btn-accent btn-block btn-lg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <span data-i18n="btn_generate_schedules">توليد وبحث الجداول الممكنة</span>
          </button>
        </div>
      </aside>

      <!-- Main Results Display Area -->
      <section class="results-panel">
        <!-- Results Toolbar -->
        <div class="results-toolbar" id="resultsToolbar" style="display: none;">
          <div class="filters-row">
            <div class="filter-group">
              <label for="filterDaysOff" data-i18n="lbl_filter_daysoff">أيام الفراغ:</label>
              <select id="filterDaysOff" class="select-input">
                <option value="all" data-i18n="opt_all">الكل</option>
                <option value="any_off" data-i18n="opt_has_off">تحتوي على أيام Off</option>
                <option value="1_off" data-i18n="opt_1_off">يوم Off واحد على الأقل</option>
                <option value="2_off" data-i18n="opt_2_off">يومين Off أو أكثر</option>
                <option value="3_off" data-i18n="opt_3_off">3 أيام Off</option>
              </select>
            </div>

            <div class="filter-group">
              <label for="sortResultsBy" data-i18n="lbl_sort_by">ترتيب حسب:</label>
              <select id="sortResultsBy" class="select-input">
                <option value="default" data-i18n="sort_default">الترتيب الافتراضي</option>
                <option value="most_days_off" data-i18n="sort_days_off">الأكثر أيام فراغ (Off)</option>
                <option value="least_gaps" data-i18n="sort_least_gaps">الأقل فراغات بين المحاضرات</option>
                <option value="earliest_finish" data-i18n="sort_early_finish">الانتهاء مبكراً</option>
                <option value="latest_start" data-i18n="sort_late_start">البدء متأخراً (بدون 8 صباحاً)</option>
              </select>
            </div>

            <div class="filter-group search-filter">
              <div class="search-input-wrap">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input type="text" id="searchDoctorSection" placeholder="بحث باسم دكتور أو شعبة..." data-i18n-placeholder="ph_search_doctor" class="input-text input-search" />
              </div>
            </div>

            <div class="checkbox-filter">
              <label class="custom-checkbox">
                <input type="checkbox" id="chkShowFullSections" />
                <span class="checkmark"></span>
                <span data-i18n="chk_show_full_seats">إظهار الشعب الممتلئة (بدون مقاعد)</span>
              </label>
            </div>
          </div>

          <!-- Sub-bar -->
          <div class="sub-toolbar">
            <div class="view-mode-toggle" role="tablist" aria-label="Schedule View Mode">
              <button id="btnViewCalendar" class="view-btn active" role="tab" aria-selected="true" aria-controls="calendarViewContainer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span data-i18n="tab_calendar_view">الجدول الأسبوعي</span>
              </button>
              <button id="btnViewTable" class="view-btn" role="tab" aria-selected="false" aria-controls="tableViewContainer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="8" y1="6" x2="21" y2="6"></line>
                  <line x1="8" y1="12" x2="21" y2="12"></line>
                  <line x1="8" y1="18" x2="21" y2="18"></line>
                  <line x1="3" y1="6" x2="3.01" y2="6"></line>
                  <line x1="3" y1="12" x2="3.01" y2="12"></line>
                  <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
                <span data-i18n="tab_table_view">جدول التفاصيل</span>
              </button>
            </div>

            <!-- Schedule Pagination Navigator -->
            <div class="schedule-pagination">
              <button id="btnPrevSchedule" class="btn-nav" title="الجدول السابق" data-i18n-title="btn_prev_schedule" aria-label="Previous Schedule">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
              <span class="pagination-info">
                <span data-i18n="txt_schedule">جدول</span>
                <strong id="currScheduleIndex">1</strong>
                <span data-i18n="txt_of">من</span>
                <strong id="totalSchedulesCount">0</strong>
              </span>
              <button id="btnNextSchedule" class="btn-nav" title="الجدول التالي" data-i18n-title="btn_next_schedule" aria-label="Next Schedule">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <div class="kbd-nav-hint" aria-hidden="true" title="مفاتيح الأسهم للتنقل">
                <kbd>←</kbd><kbd>→</kbd>
              </div>
            </div>

            <!-- Schedule Metrics Badges -->
            <div class="schedule-stats" id="scheduleStats">
              <span class="stat-pill" id="statScore" style="display: none;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                <span class="stat-label" data-i18n="stat_score">المطابقة:</span> <strong id="valScore">100%</strong>
              </span>
              <span class="stat-pill" id="statDaysOff">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M8 12h8"></path></svg>
                <span class="stat-label" data-i18n="stat_daysoff">أيام Off:</span> <strong id="valDaysOff">0</strong>
              </span>
              <span class="stat-pill" id="statTotalGaps">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                <span class="stat-label" data-i18n="stat_gaps">ساعات الفراغ:</span> <strong id="valTotalGaps">0h</strong>
              </span>
            </div>

            <!-- Export Actions -->
            <div class="export-actions">
              <button id="btnBookmarkSchedule" class="btn-icon-labeled" title="حفظ في المفضلة" data-i18n-title="btn_bookmark">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <span data-i18n="btn_favorite">المفضلة</span>
              </button>

              <button id="btnExportImage" class="btn-icon-labeled" title="حفظ كصورة بجودة عالية" data-i18n-title="btn_export_png">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                <span data-i18n="btn_export_png">تصدير صورة</span>
              </button>

              <button id="btnExportIcs" class="btn-icon-labeled" title="تصدير لتقويم الهاتف" data-i18n-title="btn_export_ics">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                <span data-i18n="btn_export_ics">تصدير للتقويم</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Schedule Visual Display Containers -->
        <div class="results-content">
          <!-- Placeholder State -->
          <div class="placeholder-container" id="resultsPlaceholder">
            <div class="placeholder-card">
              <div class="placeholder-illustration">
                <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                  <line x1="8" y1="14" x2="8" y2="14"></line>
                  <line x1="12" y1="14" x2="12" y2="14"></line>
                  <line x1="16" y1="14" x2="16" y2="14"></line>
                </svg>
              </div>
              <h3 data-i18n="placeholder_ready_title">مستعد لترتيب جدولك؟</h3>
              <p data-i18n="placeholder_ready_desc">استورد ملف الجدول الزمني أو جرب البيانات التوضيحية، ثم أضف المواد التي ترغب بتسجيلها واضغط "توليد وبحث الجداول".</p>
              <div class="placeholder-actions">
                <button class="btn btn-primary" onclick="document.getElementById('btnOpenImport').click()">
                  <span data-i18n="btn_import_now">استيراد الجدول الآن</span>
                </button>
                <button class="btn btn-secondary" onclick="document.getElementById('btnLoadDemo').click()">
                  <span data-i18n="btn_demo_now">تجربة سريعة</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Calendar Weekly Graphical Grid -->
          <div class="schedule-view-wrapper" id="calendarViewContainer" style="display: none;">
            <div class="calendar-card" id="calendarPrintableArea">
              <div class="calendar-header-row" id="calendarHeaderRow">
                <div class="time-col-header" data-i18n="col_time">الوقت</div>
                <div class="day-col-header" data-day="su" data-i18n="day_sun">الأحد</div>
                <div class="day-col-header" data-day="mo" data-i18n="day_mon">الاثنين</div>
                <div class="day-col-header" data-day="tu" data-i18n="day_tue">الثلاثاء</div>
                <div class="day-col-header" data-day="we" data-i18n="day_wed">الأربعاء</div>
                <div class="day-col-header" data-day="th" data-i18n="day_thu">الخميس</div>
              </div>

              <div class="calendar-body-matrix" id="calendarGridMatrix">
                <!-- Dynamically injected via CalendarGrid.js -->
              </div>
            </div>
          </div>

          <!-- Detailed Table Matrix -->
          <div class="schedule-view-wrapper" id="tableViewContainer" style="display: none;">
            <div class="table-card">
              <div class="table-responsive">
                <table class="schedule-detail-table" id="scheduleDetailTable">
                  <thead>
                    <tr>
                      <th data-i18n="th_row_id">#</th>
                      <th data-i18n="th_course_name">اسم المادة</th>
                      <th data-i18n="th_code_num">الرمز والرقم</th>
                      <th data-i18n="th_section">الشعبة</th>
                      <th data-i18n="th_instructor">أستاذ المادة</th>
                      <th data-i18n="day_sun">الأحد</th>
                      <th data-i18n="day_mon">الاثنين</th>
                      <th data-i18n="day_tue">الثلاثاء</th>
                      <th data-i18n="day_wed">الأربعاء</th>
                      <th data-i18n="day_thu">الخميس</th>
                      <th data-i18n="th_seats_available">المتاح</th>
                      <th data-i18n="th_seats_enrolled">المسجل</th>
                    </tr>
                  </thead>
                  <tbody id="scheduleDetailTbody"></tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </main>

  <!-- Import Modal -->
  <dialog id="importModal" class="app-modal" aria-labelledby="modalImportTitle">
    <div class="modal-card">
      <div class="modal-header">
        <div class="modal-title-wrap">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          <h3 id="modalImportTitle" data-i18n="modal_import_title">استيراد الجدول الزمني (جامعة طيبة)</h3>
        </div>
        <button class="modal-close-btn" id="btnCloseImport" aria-label="Close modal">×</button>
      </div>

      <div class="modal-tabs">
        <button class="tab-btn active" id="tabUploadFile" data-i18n="tab_upload_file">رفع ملف HTML</button>
        <button class="tab-btn" id="tabPasteText" data-i18n="tab_paste_text">لصق النص / الكود</button>
      </div>

      <div class="modal-body">
        <div class="tab-content" id="contentUploadFile">
          <div class="drop-zone" id="fileDropZone">
            <input type="file" id="inputFileUpload" accept=".html,.htm,.txt" hidden />
            <div class="drop-zone-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="12" y1="18" x2="12" y2="12"></line>
                <line x1="9" y1="15" x2="12" y2="12"></line>
                <line x1="15" y1="15" x2="12" y2="12"></line>
              </svg>
            </div>
            <h4 data-i18n="dropzone_title">اسحب وأفلت ملف الجدول الزمني هنا</h4>
            <p data-i18n="dropzone_subtitle">أو اضغط لاختيار الملف من جهازك (بصيغة HTML)</p>
          </div>

          <div class="import-helper-alert">
            <div class="alert-icon">💡</div>
            <div class="alert-text">
              <p><strong data-i18n="guide_quick_heading">كيف تحصل على الجدول الزمني؟</strong></p>
              <p data-i18n="guide_quick_steps">سجل دخولك في بوابة جامعة طيبة (TaibahReg) ➔ ادخل صفحة الجدول الزمني ➔ اضغط بزر الفأرة الأيمن في أي مكان ثم اختر 'حفظ باسم (Save As)' بصيغة HTML.</p>
              <button type="button" class="btn-text" id="btnOpenFullGuide" data-i18n="btn_view_full_guide">شاهد الشرح المصور بالخطوات ➔</button>
            </div>
          </div>
        </div>

        <div class="tab-content" id="contentPasteText" style="display: none;">
          <label for="txtPasteArea" class="form-label" data-i18n="lbl_paste_desc">انسخ كود صفحة الجدول أو النص من بوابة التسجيل والصقه هنا مباشرة:</label>
          <textarea id="txtPasteArea" class="text-area-input" rows="8" placeholder="الصق كود الـ HTML هنا..." data-i18n-placeholder="ph_paste_area"></textarea>
          <button id="btnProcessPaste" class="btn btn-primary btn-block" style="margin-top: 1rem;">
            <span data-i18n="btn_process_pasted_data">معالجة واستيراد البيانات</span>
          </button>
        </div>
      </div>
    </div>
  </dialog>

  <!-- Help & Tutorial Modal -->
  <dialog id="helpModal" class="app-modal" aria-labelledby="modalHelpTitle">
    <div class="modal-card modal-card--lg">
      <div class="modal-header">
        <div class="modal-title-wrap">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <h3 id="modalHelpTitle" data-i18n="modal_help_title">دليل استخدام مجدول جامعة طيبة الذكي</h3>
        </div>
        <button class="modal-close-btn" id="btnCloseHelp" aria-label="Close modal">×</button>
      </div>

      <div class="modal-body tutorial-body">
        <div class="tutorial-step">
          <div class="step-badge">1</div>
          <div class="step-content">
            <h4 data-i18n="step1_title">تسجيل الدخول في بوابة الجامعة</h4>
            <p data-i18n="step1_desc">توجه إلى بوابة النظام الأكاديمي بجامعة طيبة (EAS / TaibahReg) وقم بتسجيل الدخول بحسابك الجامعي.</p>
          </div>
        </div>

        <div class="tutorial-step">
          <div class="step-badge">2</div>
          <div class="step-content">
            <h4 data-i18n="step2_title">الانتقال لصفحة الجدول الزمني</h4>
            <p data-i18n="step2_desc">من القائمة، توجه لصفحة استبدال/اختيار المواد أو الجدول الزمني للشعب المتاحة في الفصل الحالي.</p>
          </div>
        </div>

        <div class="tutorial-step">
          <div class="step-badge">3</div>
          <div class="step-content">
            <h4 data-i18n="step3_title">حفظ الصفحة بصيغة HTML</h4>
            <p data-i18n="step3_desc">اضغط في أي مكان فارغ داخل الصفحة بزر الفأرة الأيمن (Right-Click) واختر Save As... (حفظ باسم)، ثم احفظ الملف بصيغة Webpage (HTML).</p>
          </div>
        </div>

        <div class="tutorial-step">
          <div class="step-badge">4</div>
          <div class="step-content">
            <h4 data-i18n="step4_title">إسقاط الملف في الموقع</h4>
            <p data-i18n="step4_desc">اسحب الملف المحفوظ إلى هذا الموقع، أو اختر 'استيراد الجدول الزمني' ثم حدد الملف.</p>
          </div>
        </div>
      </div>
    </div>
  </dialog>

  <!-- Course Detail Modal -->
  <dialog id="courseDetailModal" class="app-modal" aria-labelledby="modalCourseDetailTitle">
    <div class="modal-card">
      <div class="modal-header">
        <div class="modal-title-wrap">
          <h3 id="modalCourseDetailTitle">تفاصيل المادة</h3>
        </div>
        <button class="modal-close-btn" id="btnCloseCourseDetail" aria-label="Close modal">×</button>
      </div>
      <div class="modal-body" id="courseDetailBody"></div>
    </div>
  </dialog>

  <!-- Toast Notification Hub -->
  <div id="toastContainer" class="toast-container" aria-live="polite"></div>

  <!-- Audio Player (Web Audio API Synthesized Chime) -->
  <audio id="audioChime" preload="none"></audio>

  <script type="module" src="./src/main.js"></script>
</body>
</html>
```

---

### 5.6 `src/components/CalendarGrid.js`
```javascript
// Interactive Weekly Calendar Grid Component
import { DAYS } from '../engine/time.js';

const PIXELS_PER_MINUTE = 1; // 1 min = 1px

const COLOR_CLASSES = [
  'var(--course-color-1)',
  'var(--course-color-2)',
  'var(--course-color-3)',
  'var(--course-color-4)',
  'var(--course-color-5)',
  'var(--course-color-6)',
  'var(--course-color-7)',
  'var(--course-color-8)',
  'var(--course-color-9)',
  'var(--course-color-10)'
];

export class CalendarGrid {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.onCourseClick = options.onCourseClick || (() => {});
    this.startHour = 8;
    this.endHour = 18;
  }

  renderSchedule(schedule) {
    if (!this.container) return;

    if (!schedule || !schedule.sections || schedule.sections.length === 0) {
      this.container.innerHTML = `<div class="empty-state-card"><p>لا توجد بيانات لهذا الجدول</p></div>`;
      return;
    }

    // Dynamic hour bounds calculation
    const earliestMin = schedule.metrics?.earliestStartMinutes ?? 480;
    const latestMin = schedule.metrics?.latestEndMinutes ?? 1080;

    this.startHour = Math.min(8, Math.floor(earliestMin / 60));
    this.endHour = Math.max(18, Math.ceil(latestMin / 60));
    const totalHours = this.endHour - this.startHour;
    const gridHeight = totalHours * 60;

    // Apply dynamic height to matrix
    this.container.style.height = `${gridHeight}px`;

    // Map unique course keys to consistent color palette
    const courseColorMap = new Map();
    let colorIdx = 0;
    for (const sec of schedule.sections) {
      if (!courseColorMap.has(sec.courseKey)) {
        courseColorMap.set(sec.courseKey, COLOR_CLASSES[colorIdx % COLOR_CLASSES.length]);
        colorIdx++;
      }
    }

    let html = `
      <div class="calendar-time-axis">
        ${this._renderHourMarkers()}
      </div>
    `;

    for (const day of DAYS) {
      html += `
        <div class="day-column-track" data-day="${day}">
          ${this._renderDayGridlines(totalHours)}
          ${this._renderDayCourseBlocks(schedule.sections, day, courseColorMap)}
        </div>
      `;
    }

    this.container.innerHTML = html;

    // Attach click listeners to blocks
    this.container.querySelectorAll('.course-block').forEach(block => {
      block.addEventListener('click', () => {
        const secId = block.getAttribute('data-section-id');
        const section = schedule.sections.find(s => s.id === secId);
        if (section) {
          this.onCourseClick(section);
        }
      });
    });
  }

  _renderHourMarkers() {
    let markers = '';
    for (let h = this.startHour; h < this.endHour; h++) {
      const timeLabel = `${String(h).padStart(2, '0')}:00`;
      markers += `<div class="hour-marker">${timeLabel}</div>`;
    }
    return markers;
  }

  _renderDayGridlines(totalHours) {
    let lines = '';
    for (let h = 0; h < totalHours; h++) {
      lines += `<div class="day-column-gridline" style="top: ${h * 60}px;"></div>`;
    }
    return lines;
  }

  _renderDayCourseBlocks(sections, day, courseColorMap) {
    let blocksHtml = '';

    for (const section of sections) {
      const slots = section.days[day] || [];
      const bgColor = courseColorMap.get(section.courseKey) || 'var(--color-primary)';

      for (const slot of slots) {
        const startMin = slot.startMinutes;
        const endMin = slot.endMinutes;

        // Offset from startHour in pixels
        const top = Math.max(0, (startMin - this.startHour * 60) * PIXELS_PER_MINUTE);
        const height = Math.max(28, (endMin - startMin) * PIXELS_PER_MINUTE);

        blocksHtml += `
          <div class="course-block" 
               data-section-id="${section.id}" 
               style="top: ${top}px; height: ${height}px; background-color: ${bgColor};"
               title="${this._escapeHtml(section.courseName)} - ${this._escapeHtml(section.instructor)}">
            <div class="course-block-title">${this._escapeHtml(section.courseName)}</div>
            <div class="course-block-code">${this._escapeHtml(section.courseKey)}</div>
            <div class="course-block-footer">
              <span class="course-block-section">شعبة ${this._escapeHtml(section.section)}</span>
              <span class="course-block-time">${this._escapeHtml(slot.formatted)}</span>
            </div>
            ${height > 55 ? `<div class="course-block-instructor">${this._escapeHtml(section.instructor)}</div>` : ''}
          </div>
        `;
      }
    }

    return blocksHtml;
  }

  _escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }
}
```

---

### 5.7 `src/i18n/translations.js`
```javascript
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
    dropzone_subtitle: "أو اضغط لاختيار الملف من جهازك (بصيغة HTML)",
    dropzone_browse: "اضغط لاختيار الملف من جهازك",
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
    dropzone_subtitle: "or browse from your computer (.HTML format)",
    dropzone_browse: "browse from your computer",
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

export function getLang() { return currentLang; }

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
```

---

## 6. Actionable Handoff Prompt for AI Redesign

Copy and paste the prompt below into any AI model (Claude, GPT-4o, Codex, Gemini 1.5 Pro, Cursor) to execute the complete UI/UX redesign:

```markdown
You are an elite Principal Frontend Engineer and UI/UX Designer specialized in Taste Skill v2, Minimalist UI, and high-performance academic applications.

I have provided you with the complete REDESIGN_MASTER_BRIEF.md for ScheduleMaker (مجدول جامعة طيبة الذكي), which contains the complete design tokens, HTML markup, CSS stylesheets, and component rendering code.

### Your Assignment:
Execute a comprehensive, world-class UI/UX redesign of ScheduleMaker that elevates the application to modern utilitarian luxury (inspired by Linear and Notion).

### Strict Guidelines:
1. **Preserve All Underlying Engine & Solver Capabilities**:
   - The Web Worker backtracking DFS constraint solver, section locking/exclusion logic, and RFC 5545 `.ics` / 2x PNG exporters must remain 100% functional.
   - Retain full bilingual support (Arabic RTL & English LTR).
2. **Elevate Visual Hierarchy & Layout**:
   - Maintain the Taste Skill off-black (#10110f) and warm-paper (#f3f0e8) palettes with the signature Warm Orange (#ff6b00) accent.
   - Refine the weekly calendar grid layout with dynamic hour bounding, crisp grid lines, responsive card blocks, and subtle hover/active states.
   - Improve visual badges for lecture vs. lab slots, room locations, and instructor labels.
   - Support smooth fluid resizing and mobile drawer / tab fallback for small screens (< 768px).
3. **Taste Skill Anti-Slop Enforcement**:
   - 0 AI-purple gradients, 0 em-dashes in UI copy, 0 decorative cartoon mascots, 0 fake div mockups.
   - Enforce tabular numerals (`tabular-nums`) across all timestamps and badges.
4. **Output Complete Code**:
   - Provide complete, unabridged, copy-paste ready code files without placeholder comments (// TODO) or truncated blocks.
```
