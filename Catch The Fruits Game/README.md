# Catch The Fruits Game

A cyberpunk orchard arcade game built with vanilla HTML5, CSS3, and JavaScript (ES6+) using the HTML5 Canvas API. Fresh fruits fall from the sky — catch them with your basket to score and build combos, but avoid rotten hazards that cost a life!

## Features

- **Dual Control Input** — Arrow keys / WASD for desktop; left/right screen-tap zones for mobile touch.
- **Procedural Multi-Type Spawning** — Four fruit varieties: Green Apple (emerald), Banana (amber), Grape (purple), and Rotten hazard (muddy brown). 70% fresh / 30% rotten split.
- **AABB Collision Detection** — Precise axis-aligned bounding box intersection between each fruit and the basket on every frame.
- **Combo Multiplier** — Each successful fresh-fruit catch increments the combo (×1 → ×2 …). Catching a rotten fruit or dropping a fresh one resets it to ×1.
- **Dynamic Difficulty Escalation** — Every 12 seconds, falling speed increases by 12% and spawn interval tightens by 8%, creating a genuine arcade difficulty curve.
- **Visual Feedback** — Green score-float text + particle burst on good catches; red flash + screen shake on rotten catches. Floating score labels use DOM overlays synced to canvas coordinates.
- **3 Lives** — Three chances. When lives hit zero, the game loop freezes and a results modal appears.
- **Persistent High Score** — Best score saved in `localStorage`.
- **Cyberpunk Orchard Theme** — `#060814` matte canvas, neon emerald/amber/purple fruits, glassmorphic dashboard, monospace instrumentation.

## Tech Stack

- HTML5 — Semantic markup
- CSS3 — `backdrop-filter` glassmorphism, `@keyframes floatUp` for score text, `@keyframes modalIn`, `vmin` responsive scaling
- Vanilla JS (ES6+) — `requestAnimationFrame` 60fps game loop, Canvas 2D rendering, AABB collision, `setTimeout` spawn pipeline, `localStorage`

## Controls

| Input | Action |
|-------|--------|
| ← / A | Move basket left |
| → / D | Move basket right |
| Tap left half | Move basket left (mobile) |
| Tap right half | Move basket right (mobile) |

## Rules

1. Fruits fall from the top — move your basket to catch them.
2. Fresh fruits (Apple, Banana, Grape) add score × combo.
3. Rotten fruits deduct one life and reset your combo to ×1.
4. Speed and spawn rate increase every 12 seconds.
5. Game over when all 3 lives are lost.
6. Click **Play Again** to restart without refreshing.

## Usage

1. Open `index.html` in any modern browser.
2. Use arrow keys (or tap the screen halves on mobile) to move the basket.
3. Catch fresh fruits, avoid rotten ones.
4. Try to beat your personal best!

## Project Structure

```
Catch The Fruits Game/
├── index.html        # Main entry point
├── style.css         # Cyberpunk orchard theme
├── script.js         # Canvas game engine
├── project.json      # Project metadata
├── thumbnail.svg     # Preview thumbnail
└── README.md         # This file
```

## Author

**Girish Madarkar** — [Girish0902](https://github.com/Girish0902)
