# Speed-Track Attention Shifter

A cognitive cyberpunk game built with vanilla HTML5, CSS3, and JavaScript (ES6+). Items with random shapes (circle, square, triangle) and colors (red, green, blue) fall down a track. Sort them into the correct basket — but the rule swaps between **Match Color** and **Match Shape** every 4–6 seconds!

## Features

- **Dynamic Rule Shifting** — The sorting rule swaps every 4–6 seconds with a high-visibility banner flash (electric blue for MATCH COLOR, bright purple for MATCH SHAPE).
- **Procedural Item Spawning** — A new shape–color combination drops every 1.5 seconds. Each item has an SVG icon with its color applied via `currentColor`.
- **Smooth Physics Descent** — Items fall using `requestAnimationFrame` for smooth 60fps motion.
- **Multi-Attribute Sorting** — Under MATCH COLOR, ignore shape and sort by color. Under MATCH SHAPE, ignore color and sort by shape.
- **Multiplier System** — Consecutive correct sorts increase the multiplier (×1 → ×10). Wrong picks or missed items reset it.
- **High Score Caching** — Best score persisted in `localStorage`.
- **Cyberpunk Lab Theme** — `#090a0f` canvas, frosted track and baskets, neon rule banners.

## Tech Stack

- HTML5 — Semantic markup
- CSS3 — `backdrop-filter` glassmorphism, CSS Grid baskets, `vmin` scaling
- Vanilla JS (ES6+) — `requestAnimationFrame` game loop, `setTimeout` scheduling, SVG shape rendering, `localStorage`

## Rules

1. Press **▶ Launch Task** to begin.
2. Colored shape items fall from the top of the track.
3. The rule banner shows **MATCH COLOR** or **MATCH SHAPE**.
4. Click the correct basket to sort the lowest falling item.
   - MATCH COLOR: sort by the item's color.
   - MATCH SHAPE: sort by the item's shape.
5. Correct sort = +10 × multiplier points. Multiplier increases with each correct hit.
6. Wrong basket or a missed item = multiplier reset + screen flash penalty.
7. The rule changes every 4–6 seconds — stay focused!

## Usage

1. Open `index.html` in any modern browser.
2. Click **▶ Launch Task** to start the item stream.
3. Watch the rule banner and sort items into the matching basket.
4. React quickly when the rule switches.
5. Your high score is saved automatically.

## Project Structure

```
Speed-Track Attention Shifter/
├── index.html        # Main entry point
├── style.css         # Cyberpunk lab theme
├── script.js         # Game engine & render loop
├── project.json      # Project metadata
├── thumbnail.svg     # Preview thumbnail
└── README.md         # This file
```

## Author

**Girish Madarkar** — [Girish0902](https://github.com/Girish0902)
