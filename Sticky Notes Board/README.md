# Sticky Notes Board

A premium creative-studio sticky notes board built with vanilla HTML5, CSS3, and JavaScript (ES6+). Write, color-code, search, and manage notes on a beautiful corkboard canvas with automatic `localStorage` persistence.

## Features

- **Inline Text Editing** — Each note is fully editable in-place via `contenteditable`. Every keystroke auto-saves to memory and `localStorage`.
- **6-Color Palette** — Choose from Warm Yellow, Pastel Mint, Soft Pink, Electric Blue, Lavender, or Peach for each note.
- **Real-Time Search** — Type in the filter bar to instantly hide non-matching notes with smooth fade-out animation.
- **Character Limit** — Live counter per note turns amber at 80% and red at 200-character max; paste and input are both truncated.
- **Dark / Light Theme** — Toggle with one click; preference is saved in `localStorage`.
- **Quick Add** — Click the **+ Add Note** button or press `Ctrl+N` to spawn a new note instantly.
- **Subtle Rotation** — Notes spawn with alternating slight skew rotations for a real corkboard feel.
- **Hover Lift** — Cards scale up and cast deeper shadows on hover for tactile feedback.
- **Fully Responsive** — Auto-fill grid collapses to single-column on mobile.

## Tech Stack

- HTML5 — Semantic structure with ARIA labels
- CSS3 — CSS custom properties, `backdrop-filter`, CSS Grid `auto-fill`, keyframe animations
- Vanilla JS (ES6+) — `contenteditable` handling, `localStorage`, event delegation, real-time filtering

## Usage

1. Open `index.html` in any modern browser.
2. Click **+ Add Note** or press `Ctrl+N` to create a note.
3. Click the note body and start typing.
4. Change a note's color by clicking any swatch in its header.
5. Use the search bar to filter notes by text content.
6. Click the 🗑 icon to delete a note.
7. Toggle ☀︎ / ☽ in the toolbar to switch themes.

## Project Structure

```
Sticky Notes Board/
├── index.html        # Main entry point
├── style.css         # Creative studio theme (dark/light)
├── script.js         # Client-side engine & localStorage
├── project.json      # Project metadata
├── thumbnail.svg     # Preview thumbnail
└── README.md         # This file
```

## Author

**Girish Madarkar** — [Girish0902](https://github.com/Girish0902)
