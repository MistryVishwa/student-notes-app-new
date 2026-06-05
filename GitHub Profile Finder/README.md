# GitHub Profile Finder

A premium, neon-glassmorphic GitHub profile explorer built with vanilla HTML5, CSS3, and JavaScript (ES6+). Search any GitHub username to view profile details, stats, and the top 5 most recently updated public repositories.

## Features

- **Live GitHub API Lookup** — Fetches user data and repos via the public REST API with `async/await`.
- **Top 5 Repositories** — Automatically displays the 5 most recently updated public repos with language badges and star counts.
- **Search History** — Last 5 successfully queried usernames are cached in `localStorage` and rendered as clickable pills.
- **Light / Dark Theme** — Seamless toggle between deep midnight (`#0d1117`) and clean neutral white, with preference persisted.
- **Skeleton Loader** — Smooth shimmer animation while API calls are in flight.
- **Error Handling** — Graceful 404 user-not-found messages and network error catch without breaking the UI.
- **Copy Profile Link** — One-click copy the profile URL to clipboard with a confirmation toast.
- **Fully Responsive** — Adaptive grid layouts that collapse cleanly on mobile viewports.

## Tech Stack

- HTML5 — Semantic markup with ARIA labels
- CSS3 — Glassmorphism, CSS custom properties, `backdrop-filter`, keyframe shimmer animations
- Vanilla JS (ES6+) — `fetch` API, `async/await`, `localStorage`, Clipboard API

## Usage

1. Open `index.html` in any modern browser.
2. Type a GitHub username in the search bar and press Enter or click **Search**.
3. View the profile card with stats, bio, and the top 5 repositories.
4. Click the 🔗 button to copy the profile link to your clipboard.
5. Click any history pill below the search bar to quickly re-query a user.
6. Toggle the theme with the ☀︎ / ☽ button in the header.

## Project Structure

```
GitHub Profile Finder/
├── index.html        # Main entry point
├── style.css         # Neon glassmorphic styles (light/dark)
├── script.js         # Client-side engine & GitHub API
├── project.json      # Project metadata
├── thumbnail.svg     # Preview thumbnail
└── README.md         # This file
```

## Author

**Girish Madarkar** — [Girish0902](https://github.com/Girish0902)
