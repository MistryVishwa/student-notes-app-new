# DevGrit | Coding Challenge Tracker with Problem Analytics & Progress Dashboard

A premium, offline-first developer companion dashboard designed to help programmers, students, and competitive coders track their coding problem logs (from platforms like LeetCode, HackerRank, Codeforces, and GeeksforGeeks), monitor daily target goals, and visualize analytics trends using dynamic Chart.js charts and progress gauges.

## Key Features

- **Dashboard Analytics Panel**: 
  - Difficulty matrix tracking solved statistics for Easy, Medium, and Hard challenges.
  - Interactive widgets showing total solved counts and weekly rates.
  - Chart.js powered Doughnut Chart (difficulty split), Bar Chart (top solved topics/tags), and Line Graph (volume timeline).
- **Comprehensive Challenge Logger**:
  - Track titles, URLs, platforms, difficulties, language, tags, code solutions, and performance analysis notes.
  - Collapse and expand code solution snippets in a syntax-styled console layout.
  - Robust search queries combined with filters for platform, difficulty, and language dropdowns.
- **Daily Target Goal Ring**:
  - An SVG radial progress ring displaying daily target achievements (e.g., "Solved 2 / 3 today").
  - Dynamically updates goal statements based on remaining solved counts.
- **Milestone Achievements Trophies**:
  - Automatically unlocks accomplishment badges based on total solved numbers, streak sizes, and language variety (e.g., "Medium Explorer", "Polyglot Coder", "Streak Master").
- **State Persistence & Backup Utility**:
  - Saves your profiles, logged lists, streaks, and targets in client-side `localStorage`.
  - Backup your data by exporting the state to a JSON file and import backups whenever needed.
- **Themes Switcher**: Elegant, customized Dark mode (default) and Light mode options.

## Technical Stack

- **Core Structure**: HTML5, CSS3 CSS Custom Properties (Design System), Vanilla JavaScript (ES6+).
- **Libraries**:
  - **Chart.js**: Fast, responsive visualizations.
  - **Lucide Icons**: Clean, light icon rendering.
  - **Google Fonts**: Outfit, Plus Jakarta Sans, and Fira Code for code blocks.

## Folders & Code Layout

```
coding-challenge-tracker/
├── index.html   # HTML dashboard templates and forms
├── style.css    # Responsive css properties, theme selectors, animation sets
├── app.js       # App state controller, Chart.js integrations, streak counters
└── README.md    # Product documentation and setup guides
```

## Setup Instructions

1. Simply open `index.html` directly in a browser to run the app offline.
2. Alternatively, run a static file server in the project folder:
   ```bash
   npx http-server -p 8002
   ```
   and navigate to `http://localhost:8002`.
