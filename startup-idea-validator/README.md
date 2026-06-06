# Startup Idea Validator with Business Analysis & Market Evaluation Dashboard

VentureValidate is an interactive, responsive business validation dashboard designed to help aspiring entrepreneurs, students, and innovators evaluate startup ideas through structured validation frameworks, market analysis tools, and business scoring systems.

## Features

- **Startup Idea Hub**: Manage multiple ideas, customize categories (SaaS, FinTech, CleanTech, E-commerce, EdTech), and define core problem statements.
- **Problem-Solution Alignment**: Structured questionnaire templates to define target audiences, customer pain points, value propositions, and alignment metrics.
- **Market Size Estimator**: Sliders for Total Addressable Market (TAM), Serviceable Addressable Market (SAM), and Serviceable Obtainable Market (SOM) with instant bar chart updates.
- **Business Model Planner**: Evaluate revenue model options (SaaS, Freemium, Transactional), scalability index ratings, gross margin targets, and capital requirements.
- **Validation Checklist Wizard**: Interactive checkboxes covering Customer Discovery, Product-Market Fit validation phases, and Launch Readiness to reduce project risk.
- **Multi-Dimensional Viability Scoring System**: Real-time evaluation calculating Innovation, Market, Feasibility, and Risk mitigation scores. Renders dimension vectors using a radar graph.
- **JSON Configuration Backup**: Seamlessly export data configs or import backups to restore project histories.
- **Theme Persistence**: Sleek dark and light styling options matching browser localStorage preferences.

## Technologies Used

- **Structure**: Semantic HTML5
- **Styling**: Modern CSS3 using flex grids, glassmorphism card surfaces, and responsive breakpoints
- **Logic**: Vanilla ES6+ client-side JavaScript
- **Libraries**:
  - [Lucide Icons](https://github.com/lucide-icons/lucide) for visual iconography
  - [Chart.js](https://www.chartjs.org/) for vector radar and horizontal bar market sizes

## Directory Outline

```
startup-idea-validator/
├── index.html   # Main dashboard interface
├── style.css    # Responsive theme styling & glass layouts
├── app.js       # Core logic, viability scoring equations, and ChartJS bindings
└── README.md    # Documentation and user manual
```

## Running Locally

1. Clone the repository workspace.
2. Open `/startup-idea-validator/`.
3. Launch `index.html` directly in your browser or run a simple local web server (e.g., `python -m http.server 8000` or via VS Code Live Server).
