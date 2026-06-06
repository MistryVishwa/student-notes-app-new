# Brick Breaker

A cyberpunk arcade brick-breaker game built with vanilla HTML5, CSS3, and JavaScript (ES6+) using the HTML5 Canvas API. Smash through a multi-tiered brick matrix with a glow-ball and paddle, rack up combos, and chase your personal best.

## Features

- **Canvas 2D Rendering** — Hardware-accelerated 60fps game loop via `requestAnimationFrame` with clean `ctx.clearRect()` frame wiping.
- **Angle-Steering Paddle Physics** — Ball deflection depends on where it hits the paddle: edges launch sharp angles, centre sends it straight up. Max 60° deflection for precise column targeting.
- **Multi-Tiered Durability Bricks** — 6 rows × 8 columns of bricks with neon themes: top 4 rows require 2 hits (magenta/pink), bottom 2 rows require 1 hit (cyan). Damaged bricks visually darken.
- **Stuck Ball Launch** — Ball rests on the paddle until you click/tap, giving you time to aim.
- **Score & Lives** — 3 lives per round. High score persisted in `localStorage`.
- **Game Over / Victory Modal** — Polished overlay with final score, personal best, and instant zero-refresh restart.
- **Mouse & Touch Input** — Seamless pointer tracking for desktop (mousemove) and mobile (touchmove + touchstart).
- **Cyberpunk Minimal Theme** — `#060813` velvet black canvas, neon pink `#ff2a5f`/electric cyan `#00f0ff` bricks, glow-ball, glassmorphic UI panels.

## Tech Stack

- HTML5 — Semantic markup
- CSS3 — `backdrop-filter` glassmorphism, `@keyframes` modal slide-in, `vmin` responsive scaling, CSS custom properties
- Vanilla JS (ES6+) — `requestAnimationFrame` game loop, Canvas 2D API, AABB collision detection, vector reflection equations, pointer/touch event mapping, `localStorage`

## Rules

1. Move the paddle left/right with your mouse or finger.
2. Click or tap to launch the ball from the paddle.
3. Break all bricks to win. You have 3 lives.
4. Each brick is worth 10 points. Tougher bricks take 2 hits.
5. The ball bounces off walls, ceiling, paddle, and bricks.
6. Lose all lives → Game Over. Clear all bricks → You Win!
7. Click **Play Again** to restart without refreshing the page.

## Usage

1. Open `index.html` in any modern browser.
2. Move your mouse (or drag your finger on mobile) to position the paddle.
3. Click/tap to launch the glowing ball.
4. Break all the bricks!

## Project Structure

```
Brick Breaker/
├── index.html        # Main entry point
├── style.css         # Cyberpunk minimal theme
├── script.js         # Canvas game engine
├── project.json      # Project metadata
├── thumbnail.svg     # Preview thumbnail
└── README.md         # This file
```

## Author

**Girish Madarkar** — [Girish0902](https://github.com/Girish0902)
