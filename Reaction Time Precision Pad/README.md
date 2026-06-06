# Reaction Time Precision Pad

A high-precision reaction time benchmarking tool built with vanilla HTML5, CSS3, and JavaScript (ES6+). Features a 5-state machine driven by `performance.now()` for sub-millisecond accuracy, anti-cheat false start detection, and a rolling history log with localStorage persistence.

## Features

- **5-State Machine** — Idle → Waiting → Triggered → Penalty / Results, each with distinct visual feedback.
- **Precision Timing** — Uses `performance.now()` to capture reaction latency down to fractions of a millisecond.
- **Anti-Cheat False Start Shielding** — Clicks during the random 2–5s waiting phase immediately trigger a penalty state and block score recording.
- **Rolling History Log** — Every trial (valid hits and early penalties) is appended to a scrollable sidebar with trial number and time.
- **Personal Best Caching** — Best reaction time is saved to `localStorage` and highlighted with an animated "BEST" badge in the history list.
- **Auto-Reset** — After each trial or penalty, the pad resets itself to the idle state after a short feedback delay.
- **Dark Laboratory Aesthetic** — `#090a10` charcoal backdrop, glassmorphic interaction pad, state-driven neon colour profiles (crimson/emerald/amber), monospace data displays.

## Tech Stack

- HTML5 — Semantic markup
- CSS3 — `backdrop-filter` glassmorphism, `@keyframes` slide-in and penalty pulse animations, `vmin` responsive scaling, CSS custom properties
- Vanilla JS (ES6+) — IIFE module pattern, `performance.now()` high-resolution timing, `setTimeout`/`clearTimeout` state orchestration, `localStorage` persistence

## Usage

1. Open `index.html` in any modern browser.
2. Click the large central pad to start a trial.
3. A random delay of 2–5 seconds will pass — **wait for the pad to turn green**.
4. Click as soon as you see green — your reaction time is recorded.
5. Click too early and the pad flashes amber with "Too Early! ⚠️".
6. View your last time, personal best, trial count, and full history in the sidebar.
7. Your best score is saved automatically between sessions.

## Project Structure

```
Reaction Time Precision Pad/
├── index.html        # Main entry point
├── style.css         # Dark laboratory theme
├── script.js         # 5-state machine engine
├── project.json      # Project metadata
├── thumbnail.svg     # Preview thumbnail
└── README.md         # This file
```

## Author

**Girish Madarkar** — [Girish0902](https://github.com/Girish0902)
