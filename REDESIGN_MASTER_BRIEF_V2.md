# ScheduleMaker Redesign Master Brief

## Mission

Redesign and refine ScheduleMaker as a real, production-quality university scheduling utility.

This is **not** a cosmetic reskin. Inspect the existing repository first. Preserve working functionality and improve the product end-to-end: correctness, solver behavior, parser reliability, UX, accessibility, performance, and visual design.

A Pinterest/reference image may be provided separately. Use it as **visual inspiration only**. Extract its principles (depth, lighting, materials, composition, geometry, atmosphere) and create an original ScheduleMaker design. Do not copy its exact composition, artwork, branding, or layout.

## Product promise

> Import your university timetable → choose your courses → get the best valid timetable.

Optimize for:

**Speed → simplicity → clarity → control**

A new student should reach a useful timetable in roughly four meaningful interactions. Advanced preferences must not block the first result.

---

# 1. Repository-first rule

Before coding:

1. Inspect the entire repository.
2. Inspect recent commits and open PRs.
3. Understand the parser, normalized data model, solver, Web Worker, ranking, constraints, state, calendar, table, filters, exports, storage, i18n, and tests.
4. Identify what is already good.
5. Identify real bugs and friction.
6. Make a prioritized plan.
7. Do not rewrite working systems merely for style.

The existing code is the source of truth for implementation details. This document is the product/design/engineering direction.

---

# 2. Non-negotiable product invariants

Preserve:

- 100% client-side/private operation
- no backend required
- no telemetry or unnecessary tracking
- Web Worker scheduling
- Arabic/English parity and RTL/LTR correctness
- PNG timetable export
- ICS calendar export
- local persistence
- demo mode
- existing parser capabilities
- existing solver capabilities

Do not add accounts, university passwords, chatbot features, unnecessary backend services, social features, gamification, or fake AI functionality.

---

# 3. Core functional priorities

## 🔴 Critical: ranking must actually be correct

Do not claim "Best Schedule" if the implementation only takes the first N valid schedules and ranks those afterward.

The search must preserve the best candidates across the valid search space, using an appropriate bounded top-K strategy and stronger pruning where useful.

The final result should be defensible as the best according to the active preferences.

## 🔴 Hard constraints vs preferences

Hard constraints determine validity:

- selected courses
- no time conflicts
- locked sections
- excluded sections

Preferences determine ranking:

- fewer university days
- fewer gaps
- preferred start time
- preferred finish time
- available seats
- preferred instructor
- preferred time range

Never silently turn a preference into a hard constraint.

## 🔴 Lock / exclude semantics

A locked section **must** be included.

An excluded section **must never** be used.

An impossible/invalid lock must produce a clear no-solution state. Never silently ignore a lock.

## 🔴 Parser reliability

Prefer:

```text
semantic/header detection
        ↓
normalized columns
        ↓
validation
        ↓
positional fallback only when necessary
```

Do not silently produce incorrect schedules when a portal layout changes.

Add representative Taibah HTML fixtures and regression tests for parser behavior.

## 🔴 No-solution diagnostics

Never stop at:

> No schedules found.

Explain likely conflicts when possible and give useful actions.

Example:

```text
No valid timetable exists with these courses.

CS301 conflicts with MATH202 in every available combination.

[Inspect conflict] [Change courses]
```

Prefer identifying a small conflicting set rather than dumping every failed combination.

---

# 4. Course selection

After import, automatically discover courses.

Preferred flow:

```text
23 courses found

Search courses...

CS301
Operating Systems
5 sections

NET302
Computer Networks
4 sections

SEC401
Security
3 sections
```

Manual course-code/number entry may remain as an advanced fallback.

The normal student should not need to understand internal identifiers.

Validate courses with zero usable sections before solving and explain the problem.

---

# 5. Preferences

Use progressive disclosure.

Defaults should be sensible.

Advanced preferences can include:

- prefer fewer days
- minimize gaps
- avoid early classes
- avoid late classes
- prefer available seats
- preferred instructor
- preferred time range

Preferences should affect ranking, not validity, unless the user explicitly chooses a hard constraint.

---

# 6. Results experience

The first result must be the strongest valid candidate.

Make the reason obvious:

```text
BEST MATCH

3 university days
1h 30m total gaps
Starts 9:00 AM
Finishes 2:00 PM
No conflicts
All sections available
```

Do not use mysterious AI-style scoring.

Alternatives must be easy to scan without clicking through hundreds of results one-by-one.

Example:

```text
#1  3 days · 1h gaps · 9:00 start
#2  3 days · 1h 30m gaps · 8:00 start
#3  4 days · 30m gaps · 9:00 start
```

Preserve canonical overall ranking when filters are applied. If useful, expose both overall rank and filtered rank.

Deduplicate schedules using a canonical section identity.

---

# 7. Metrics

Useful metrics include:

- days off
- active days
- total gaps
- longest individual gap
- earliest start
- latest finish
- total on-campus span
- total class time
- instructor count
- available seats
- full-section presence

Prefer metrics that help a student make an actual decision.

---

# 8. Seats

Treat seat availability as useful ranking information, not automatically as a hard exclusion.

Clearly distinguish:

- available
- almost full
- full

A full section can remain as a fallback when no alternative exists, unless the user explicitly chooses to exclude full sections.

---

# 9. Solver reliability and performance

The solver must not freeze the main UI.

Use the Worker correctly.

Support cancellation when a new solve supersedes an old solve.

Prefer cancellation/abort signaling over arbitrary timeouts.

Optimize with:

- precomputed section conflicts where worthwhile
- course/section ordering by constraint tightness
- early pruning
- bounded top-K retention
- avoiding repeated time parsing
- avoiding unnecessary object cloning

Do not sacrifice correctness for a superficial benchmark.

Add solver tests for:

- exact overlap
- partial overlap
- adjacent classes
- multiple meeting slots
- multiple days
- locks
- invalid locks
- exclusions
- lock + exclusion interactions
- full sections
- no solution
- duplicate schedules
- ranking
- cancellation
- large search spaces

---

# 10. Export and persistence

Verify ICS correctness including:

- timezone behavior
- multiple meetings
- Arabic text
- special characters
- correct start/end times

Verify PNG export on desktop and mobile.

Version local storage schemas so future data-model changes do not break old cached data.

---

# 11. Accessibility

Support:

- keyboard navigation
- visible focus
- semantic controls
- sufficient contrast
- screen-reader labels
- information not conveyed by color alone
- touch-friendly mobile targets
- reduced motion
- correct Arabic RTL behavior
- correct English LTR behavior

Arabic should feel native, not like mechanically mirrored English.

---

# 12. Visual design direction

The product should feel like a serious, premium academic utility.

Desired qualities:

- calm
- precise
- editorial
- tactile but restrained
- information-dense without clutter
- excellent typography
- strong alignment
- clear hierarchy
- subtle depth
- useful motion only

Avoid generic AI/SaaS aesthetics.

Do not use:

- AI-purple/violet glow gradients
- excessive glassmorphism
- glowing borders everywhere
- huge rounded cards
- excessive shadows
- excessive pill buttons
- decorative badges with no meaning
- cartoon mascots
- fake dashboard mockups
- giant marketing hero sections
- meaningless animations
- fake AI terminology
- visual noise

Use course colors sparingly and keep them harmonious/desaturated enough that the timetable remains readable.

Use the existing brand direction when appropriate, but improve it if the current implementation creates usability problems.

---

# 13. 3D background

A 3D background is allowed and may be a major visual element if the reference image supports it.

However:

> The 3D environment is atmosphere around the product, not the product itself.

If using 3D:

- keep the actual scheduling UI dominant
- maintain strong text/readability contrast
- use depth and lighting intentionally
- avoid decorative objects that compete with the calendar
- avoid constant expensive animation
- respect prefers-reduced-motion
- lazy-load or progressively initialize the 3D layer
- keep geometry and draw calls reasonable
- disable/reduce 3D on low-power/mobile devices where appropriate
- do not delay the useful UI because of 3D
- the application must remain excellent with 3D disabled

If the reference image is visually dramatic, translate its visual principles rather than copying it.

---

# 14. Responsive design

Mobile is not a shrunken desktop.

The timetable must remain genuinely usable on an iPhone.

Possible mobile patterns:

- day-by-day navigation
- horizontal day tabs
- vertical schedule cards
- bottom sheets for section details
- sticky essential actions

Do not sacrifice schedule readability for decorative design.

---

# 15. Motion

Use motion to communicate state:

Good:

- schedule switching
- selection feedback
- import completion
- modal transitions
- subtle result transitions

Avoid:

- perpetual floating
- bouncing
- pulsing
- animated gradients
- excessive parallax
- animation for its own sake

Support `prefers-reduced-motion`.

---

# 16. Architecture

Keep clear boundaries between:

```text
parser
solver
constraints
ranking
state
UI
storage
export
```

Avoid turning the application controller into an unmaintainable monolith.

Do not over-engineer. Use the simplest architecture that keeps responsibilities clear.

Do not add a dependency unless it solves a real problem.

Prefer platform APIs for small functionality.

---

# 17. Performance

Performance is a product feature.

Audit:

- initial load
- bundle size
- JavaScript execution
- unnecessary re-renders
- Worker lifecycle
- solver runtime
- parser runtime
- localStorage usage
- export performance
- 3D rendering
- asset loading

Local filtering should not rerun the solver.

The UI should remain responsive while solving.

Do not add heavy libraries merely for visual effects.

---

# 18. Testing

Every important bug discovered during the redesign should receive a regression test.

At minimum, cover:

### Parser
- representative Taibah HTML
- changed column ordering
- Arabic data
- multiple meeting times
- malformed/empty input
- invalid rows

### Solver
- overlap
- adjacent times
- multi-slot sections
- locks
- invalid locks
- exclusions
- no solution
- duplicates
- ranking
- cancellation
- large search spaces

### Export
- ICS timezone
- Arabic text
- multiple meetings
- special characters

Run tests and production build after implementation.

---

# 19. What NOT to build

Do not add:

- chatbot
- AI assistant
- AI-generated explanations where deterministic logic is sufficient
- account system
- backend
- university authentication
- social platform
- gamification
- notification infrastructure
- unnecessary analytics
- feature-heavy dashboards

ScheduleMaker should become exceptionally good at scheduling, not become a general student platform.

---

# 20. Implementation workflow

Follow this order:

### Phase 1: Understand

Inspect repository, architecture, commits, PRs, tests, and current behavior.

### Phase 2: Correctness

Fix ranking, constraints, deduplication, parser reliability, and solver cancellation.

### Phase 3: Product UX

Improve course discovery, preferences, no-solution explanations, result browsing, and metrics.

### Phase 4: Visual redesign

Apply the new visual language and Pinterest-inspired 3D direction without compromising usability.

### Phase 5: Performance

Measure and optimize real bottlenecks.

### Phase 6: Verification

Run:

- all tests
- production build
- mobile verification
- Arabic/RTL verification
- dark/light verification
- reduced-motion verification
- import verification
- solver verification
- ranking verification
- export verification
- no-solution verification
- 3D-disabled verification
- console/error audit

Do not stop at mockups. Implement the actual product.

---

# 21. Definition of done

A student can:

1. Open ScheduleMaker.
2. Understand what to do immediately.
3. Import a timetable without technical knowledge.
4. See courses automatically discovered.
5. Select courses quickly.
6. Generate without configuring a complicated form.
7. Receive a genuinely strong ranked schedule.
8. Understand why it is recommended.
9. Browse alternatives quickly.
10. Lock or exclude sections predictably.
11. Understand conflicts when no solution exists.
12. Read the calendar comfortably on mobile.
13. Save, share, or export the result.
14. Use Arabic or English naturally.
15. Experience no UI freeze during solving.

The visual design should remain excellent even if the 3D layer is removed.

If the product only looks impressive but requires too much thinking, the redesign has failed.

---

# Final instruction

Do not imitate the reference image literally.

Do not produce an AI-looking template.

Do not optimize for screenshots or Dribbble-style presentation.

Design for the real student using the real scheduling workflow.

**Make the product feel inevitable: the simplest, fastest, clearest way to turn a university timetable into a good schedule.**
