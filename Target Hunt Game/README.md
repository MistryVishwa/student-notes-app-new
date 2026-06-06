# Target Hunt Game

A tactical firing-range arcade game built with vanilla HTML5, CSS3, and JavaScript (ES6+). Neon amber bullseye targets with crosshair patterns spawn at random positions — click them before they fade away. Track your score, accuracy, and personal best across 30-second rounds.

## Features

- **Procedural Target Spawning** — Targets appear at random coordinates within the arena, with radius-aware boundary clamping to prevent clipping.
- **CSS-Animated Lifetime** — Each target scales from 0 → 1 → 0 over 1500ms via a `@keyframes targetLife` animation. Miss the window and it's gone.
- **Bullseye with Crosshair** — Each target has concentric rings, a solid amber bullseye dot, and crosshair lines for precise aim feedback.
- **Real-Time Accuracy Tracking** — Every click counts: hits vs misses computed live as `(Hits / Total Clicks) × 100`, updated on the dashboard.
- **30-Second Rounds** — A countdown timer drives each session. When it hits zero, all spawns stop and a detailed results modal appears.
- **Click Trail Feedback** — Amber burst on hits, red burst on misses — visual feedback at the click position.
- **Persistent High Score** — Best score saved in `localStorage` and displayed on the dashboard and results modal.
- **Tactical Radar Theme** — `#040712` matte black canvas, radar grid background, neon amber `#fbbf24` targets, glassmorphic panels, crosshair cursor.
- **Mouse & Touch** — Works with mouse clicks and touch taps on mobile.

## Tech Stack

- HTML5 — Semantic markup
- CSS3 — `@keyframes` target life cycle, concentric ring bullseye with crosshair pseudo-elements, `backdrop-filter` glassmorphism, radar grid background via `linear-gradient`, `vmin` responsive scaling
- Vanilla JS (ES6+) — IIFE module, `setInterval` spawn/tick loops, DOM manipulation, `localStorage`, squared-distance hit detection

## Rules

1. Click **▶ Start Hunt** to begin a 30-second session.
2. Amber bullseye targets with crosshairs appear at random positions.
3. Click a target to score +10 points (hit). Click empty space = miss.
4. Targets shrink and disappear after 1.5 seconds — be quick!
5. Your accuracy percentage updates after every click.
6. When the timer hits 0, the results modal shows hits, misses, accuracy, and score.
7. Click **Hunt Again** to start a new round without refreshing.

## Usage

1. Open `index.html` in any modern browser.
2. Press **▶ Start Hunt**.
3. Click/tap the amber bullseye targets as fast as you can.
4. Track your accuracy and try to beat your personal best.

## Project Structure

```
Target Hunt Game/
├── index.html        # Main entry point
├── style.css         # Tactical radar theme
├── script.js         # Game engine
├── project.json      # Project metadata
├── thumbnail.svg     # Preview thumbnail
└── README.md         # This file
```

## Author

**Girish Madarkar** — [Girish0902](https://github.com/Girish0902)
