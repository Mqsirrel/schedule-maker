# 🎨 ScheduleMaker — Design System & Architecture Specification

> Built with **Taste Skill v2**, **Minimalist UI**, and **Soft Skill** Anti-Slop frontend engineering principles.

---

## 1. 🎯 Design Read & Aesthetic Language
* **Application**: Smart Academic Schedule Generator for Taibah University (*مجدول جامعة طيبة الذكي*).
* **Audience**: Undergraduate and graduate students at Taibah University looking for rapid, conflict-free timetable generation.
* **Aesthetic Direction**: **Calm Minimalist Workspace** (Notion/Linear-inspired utilitarian luxury).
* **Taste Dials**:
  - `DESIGN_VARIANCE: 6` (Structured, disciplined, grid-aligned)
  - `MOTION_INTENSITY: 4` (Spring-based tactile feedback, subtle and fast)
  - `VISUAL_DENSITY: 5` (Spacious cards, tabular figures, high scannability)

---

## 2. 🔒 The Three Taste Locks

### A. Color Consistency Lock
- **Base Surfaces**:
  - **Dark Mode**: Off-Black `#0c0d10`, Card Surface `#14161d`, Elevated `#222632`.
  - **Light Mode**: Off-White `#f5f4f2`, Card Surface `#ffffff`, Hover Surface `#eae8e3`.
- **Primary Accent**: Unified **Taste Skill Warm Orange** (`#ff6b00`) across all interactive buttons, focus rings, active tabs, and primary CTAs.
- **Spot Pastels for Courses**: Harmonious, non-clashing, high-contrast palette (Electric Blue, Emerald, Amber, Violet, Pink, Cyan, Orange, Teal).

### B. Shape Consistency Lock
- One unified corner-radius scale across the entire application:
  - Small elements & Badges: `4px` (`--radius-xs`) / `8px` (`--radius-sm`)
  - Inputs & Standard Buttons: `12px` (`--radius-md`)
  - Cards, Containers & Modals: `16px` (`--radius-lg`) / `20px` (`--radius-xl`)
  - Status Pills: `9999px` (`--radius-pill`)

### C. Page Theme Lock
- Full dual-theme parity (Dark & Light) with persistent user preference in `localStorage`.
- WCAG AA contrast compliance across all text labels, badges, and controls.

---

## 3. ✍️ Typographic Hierarchy & Figures
* **Arabic Primary**: `Tajawal` (Weights: 400, 500, 700, 800) — clean geometric sans-serif tailored for modern Arabic interfaces.
* **Latin Secondary**: `Outfit` / `Manrope` (Weights: 400, 600, 700) — balanced, humanistic display type.
* **Monospace / Meta**: `JetBrains Mono` / `IBM Plex Mono` — used for time codes, section numbers, shortcuts, and metrics.
* **Tabular Figures**: Enforced via `font-variant-numeric: tabular-nums` and `font-feature-settings: "tnum"` to prevent layout jitter during number updates.

---

## 4. ⌨️ Micro-Interactions & Accessibility
* **Physical `<kbd>` Micro-UIs**: Keystroke chips (`<kbd>←</kbd> <kbd>→</kbd>`) indicating instant schedule navigation and `Esc` modal dismissal.
* **Tactile Feedback**: `:active` button push state using `transform: scale(0.985)` and layered shadows (`box-shadow: var(--shadow-button)`).
* **Tactile Noise Overlay**: Subtle film-grain texture (`.noise-overlay`, opacity `0.025`) providing physical surface depth.
* **Skip-to-Content**: Accessible hidden skip link for keyboard navigation.
* **Focus Indicators**: Explicit `:focus-visible` rings with offset.

---

## 5. 🚫 Anti-Slop Ban Compliance
* ❌ **No AI-purple / violet glow gradients** on headline text or cards.
* ❌ **No em-dashes / en-dashes** in UI copy.
* ❌ **No section-numbering eyebrows** (`00 / INDEX`, etc.).
* ❌ **No fake div dashboards** or decorative creatures/mascots.
* ❌ **No `window.addEventListener('scroll')`** in JavaScript.
* ❌ **No audio asset dependencies**: Chime generated purely on-the-fly via Web Audio API.

---

## 6. 📦 Stack & Modules
* **Core**: Vanilla HTML5, CSS3, Modern ES Modules.
* **Bundler**: Vite 6.
* **Async Solver**: Web Worker Depth-First Search (DFS) Backtracking constraint solver.
* **Exporters**: RFC 5545 `.ics` generator and `html-to-image` 2x retina PNG snapshot.
