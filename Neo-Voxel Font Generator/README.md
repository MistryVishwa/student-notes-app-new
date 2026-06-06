# Neo-Voxel Font Generator

An 8×8 pixel font design utility built with vanilla HTML5, CSS3, and JavaScript (ES6+). Draw glyphs on a click-and-drag grid matrix and watch real-time serialised output in Hex, Binary, and Vector Index formats — perfect for embedded display fonts, LED matrix projects, and retro-gaming tilesets.

## Features

- **8×8 Pixel Grid** — Smooth click-and-drag drawing with pointer capture. Paint or erase by dragging across cells.
- **Live Preview** — A scaled-down 8×8 preview panel mirrors the grid in real time.
- **Real-Time Serialization** — Three code-display panels update instantly on every grid change:
  - **Hex Matrix** — `[0x00, 0x7E, 0x42, …]` — row-by-row 8-bit → 2-digit hex conversion via bitwise shift.
  - **Binary Stream** — 8 lines of 8-bit binary strings (`01111110` per row).
  - **Vector Indices** — Array of active coordinate pairs `[{x:1, y:2}, …]`.
- **Utility Buttons** — **Copy Hex** (native Clipboard API), **Clear Canvas**, **Invert Board** (flip all bits).
- **Sample Glyph** — Boots with the letter 'A' pre-loaded as a starting template.
- **Dark Cyberpunk Aesthetic** — `#060812` matte black canvas, neon emerald `#10b981` active cells, glassmorphic data panels, monospace terminal code blocks.

## Tech Stack

- HTML5 — Semantic markup
- CSS3 — CSS Grid layout, `backdrop-filter` glassmorphism, `vmin` responsive scaling, custom properties
- Vanilla JS (ES6+) — Pointer Events API with capture for drag drawing, bitwise `<<` and `|=` row serialization, `navigator.clipboard.writeText`, DOM manipulation

## Usage

1. Open `index.html` in any modern browser.
2. Click or drag across the 8×8 grid to draw pixels (emerald = on).
3. The Preview panel and all three code outputs update instantly.
4. Click **⎘ Copy Hex** to copy the hex array to your clipboard.
5. Click **✕ Clear** to reset the grid, or **⊞ Invert** to flip all bits.
6. Use the vector list for coordinate-based rendering engines.

## Use Cases

- Design custom glyphs for 8×8 LED matrix displays
- Create pixel fonts for retro game tilesets
- Generate hex data for embedded display drivers (SSD1306, MAX7219, etc.)
- Prototype monochrome sprite art

## Project Structure

```
Neo-Voxel Font Generator/
├── index.html        # Main entry point
├── style.css         # Cyberpunk lab theme
├── script.js         # Grid engine & serialiser
├── project.json      # Project metadata
├── thumbnail.svg     # Preview thumbnail
└── README.md         # This file
```

## Author

**Girish Madarkar** — [Girish0902](https://github.com/Girish0902)
