# Dynamic Physics Box Packer

A logistics puzzle tool built with vanilla HTML5, CSS3, and JavaScript (ES6+). Drag rectangular cargo blocks from the queue into an 8×8 container, rotate them with the 'R' key, and fill every cell to win. Real-time AABB collision detection, grid snapping, and volume efficiency analytics.

## Features

- **Drag-and-Drop Block Placement** — Pointer-based drag from the cargo queue into the container with smooth ghost preview.
- **20px Grid Snapping** — Blocks snap to a uniform grid on drop. Live position is always clamped to container bounds.
- **AABB Collision Detection** — Real-time Axis-Aligned Bounding Box intersection checks between the dragged block and all placed cargo. Invalid positions light up amber; valid positions glow cyan.
- **Rotation (R Key / Button)** — Press **R** or click **↻ Rotate** to swap a block's width and height during drag. Bounding metrics update instantly without losing the drag anchor.
- **Volume Efficiency Tracking** — Live dashboard shows `(Sum of Placed Block Areas / Container Area) × 100` with a progress bar.
- **Victory Modal** — When all blocks are placed successfully, a premium overlay shows efficiency, block count, and best record. Click **Pack Again** for a zero-refresh reset.
- **Persistent High Score** — Best efficiency percentage saved in `localStorage`.
- **Blueprint Dark Theme** — `#050811` navy-black canvas, blueprint grid lines, cyan valid / amber invalid states, glassmorphic panels, monospace instruments.

## Tech Stack

- HTML5 — Semantic markup
- CSS3 — CSS Grid for blueprint dots, `backdrop-filter` glassmorphism, `@keyframes` modal animation, `vmin` responsive scaling
- Vanilla JS (ES6+) — Pointer Events API with capture, AABB overlap formula, grid snapping math, `localStorage`

## Controls

| Input | Action |
|-------|--------|
| Click + drag on queue item | Pick up block |
| Move pointer | Position block with live validation |
| Release | Place if valid, return to queue if not |
| **R** key or **↻ Rotate** | Rotate active block 90° |
| **⟳ Reset** | Clear all blocks and restart |

## Rules

1. You have 11 cargo blocks of various sizes to pack into an 8×8 container.
2. Drag a block from the queue into the container.
3. The ghost preview shows cyan (valid) or amber (invalid/overlap).
4. Blocks snap to the grid when released. Invalid positions return the block to the queue.
5. Rotate blocks during drag with R or the Rotate button.
6. Fill all cells to win — the victory modal shows your efficiency.
7. Your best efficiency is saved automatically.

## Usage

1. Open `index.html` in any modern browser.
2. Click and drag a block from the **Cargo Queue** into the container.
3. Use **R** to rotate the block while dragging.
4. Place all blocks to complete the container.
5. Click **Pack Again** to start a new game.

## Project Structure

```
Dynamic Physics Box Packer/
├── index.html        # Main entry point
├── style.css         # Blueprint lab theme
├── script.js         # Packing engine
├── project.json      # Project metadata
├── thumbnail.svg     # Preview thumbnail
└── README.md         # This file
```

## Author

**Girish Madarkar** — [Girish0902](https://github.com/Girish0902)
