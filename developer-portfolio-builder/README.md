# DevCraft 🛠️ | Developer Portfolio Builder with Live Preview

An interactive, responsive split-screen portfolio builder designed specifically for web developers. Build your professional portfolio dashboard on the left, customize themes, layout parameters, colors, and content, and watch the generated code render instantly in real-time in the simulated preview frame on the right. Once satisfied, download the code as a **completely standalone single-file HTML page** containing all your details, embedded images, styling rules, and fonts, ready to deploy to GitHub Pages, Netlify, or Vercel.

---

## 🚀 Purpose and Benefits
Setting up a developer portfolio from scratch often involves setting up heavy frameworks (NextJS, React), configure bundlers, and managing layouts, which takes away time from writing actual projects. 
**DevCraft** aims to solve this by providing:
- **Instant Deployment**: Generate a production-grade single-file portfolio ready to go. No frameworks or Node modules required in the final output.
- **Visual Theme Tuning**: See layout shifts, colors, and font pairings interactively.
- **Embedded Media**: Profile pictures and project covers are automatically converted to robust Base64 data strings and injected into the downloaded HTML code.
- **Exportable Configuration**: Save your configurations locally in JSON format to update or edit later.

---

## ✨ Features
1. **Developer Profile Editor**: Fill in your professional header details, long biographies, avatar photo, locations, and social media handles.
2. **Themes & Custom Styles**:
   - **Minimalist Slate**: Ultra-clean professional layout with light and dark defaults.
   - **Aurora Glass**: Glassmorphism aesthetic on deep gradients.
   - **Cyberpunk Neon**: High-contrast modern interface with glowing text styles.
   - **Warm Retro**: Neo-brutalist styled layout with borders and heavy shadow aesthetics.
3. **Typography & Layout Controls**: Swap between fonts (Inter, Outfit, Fira Code, Playfair Display) and project layouts (Grid vs List).
4. **Skills Management**: Group skills, specify categories, and configure proficiency levels with dynamic progress bars.
5. **Projects Showcase**: Document your repositories with live links, GitHub URLs, tags, and cover images.
6. **Work & Education Timelines**: Build professional chronologies detailing achievements.
7. **Simulated Live Preview Frame**: Inspect how your page renders on desktop, tablet, and mobile configurations using integrated viewport simulators.
8. **Config Backup/Import**: Upload a previously exported `portfolio_config.json` to load your data instantly.

---

## 🛠️ Tech Stack
- **Dashboard interface**: HTML5, Vanilla JavaScript (ES6+ Modules), CSS3 Grid & Custom Properties.
- **Icons**: [Lucide Icons](https://lucide.dev/) (Dynamic CDNs).
- **Embedded Styles & Font Providers**: Google Fonts integration.

---

## 📦 Local Setup Instructions
To run the editor dashboard on your local machine, follow these steps:

### Prerequisites
Make sure you have a basic web browser installed (Chrome, Firefox, Edge, Safari). No server environment or Node package installation is needed.

### Installation
1. Clone the repository containing the portfolio builder:
   ```bash
   git clone https://github.com/karthik2004-tech/student-notes-app.git
   cd student-notes-app/developer-portfolio-builder
   ```

2. Open the application:
   - **Double click** the `index.html` file inside the `developer-portfolio-builder` directory to run the dashboard directly in your default browser.
   - **Alternative (Recommended)**: Use a lightweight development server like VSCode Live Server extension, or Python's built-in HTTP server to run the application over `localhost`:
     ```bash
     # Python 3
     python -m http.server 8000
     ```
     Then open your browser to `http://localhost:8000`.

---

## 📖 Usage Guide
1. **Enter Personal Details**: Click on the **Profile** tab, upload a headshot photo, and fill in your names and social links.
2. **Adjust Aesthetics**: Move to the **Themes** tab. Try switching between themes, select accent colors using the color picker, adjust border corner rounding, and select fonts.
3. **Populate Content**: Use the **Skills**, **Projects**, **Experience**, and **Education** tabs to fill in details. Click the "+" button to add items. Click the Trash Can icon to remove them.
4. **Resizing Simulation**: Click the **Desktop**, **Tablet**, or **Mobile** viewport buttons at the top of the preview panel to inspect layout responsiveness.
5. **Save Configuration**: Click **Export Config** to download a local backup file `portfolio_config.json`.
6. **Deploy to Production**: When you are happy with the preview, click **Download Portfolio**. Upload the resulting `.html` file to a repository on GitHub, rename it to `index.html`, and activate **GitHub Pages** to deploy your website live in seconds!

---

## 📂 Folder Structure
```text
developer-portfolio-builder/
├── index.html        # Main editor dashboard layout and panels
├── style.css         # Dashboard styles and light/dark theme rules
├── app.js            # Editor state engine, dynamic compilers, and JSON builders
└── README.md         # Documentation and setup instructions
```

---

## 🚀 Future Enhancements
- [ ] Add more responsive layouts and template options.
- [ ] Integrate template-specific sections (e.g., custom services cards or blog timeline).
- [ ] Support direct integration/importing from GitHub repositories using the GitHub API.
- [ ] Add localized translation systems.

---

## 🤝 Contribution Guidelines
Contributions are welcome! Please follow these guidelines:
1. Fork this repository.
2. Create a feature branch: `git checkout -b feature/awesome-new-theme`.
3. Commit your changes: `git commit -m 'Add awesome new glassmorphism template variant'`.
4. Push to the branch: `git push origin feature/awesome-new-theme`.
5. Open a Pull Request detailing your enhancements.

---

## 📄 License
This project is open-source and distributed under the [MIT License](https://opensource.org/licenses/MIT). Feel free to use, modify, and distribute it for both commercial and personal use.
