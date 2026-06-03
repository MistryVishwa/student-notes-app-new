// State Management & Data Store
let portfolioState = {
  profile: {
    name: "Vishwa Mistry",
    title: "Frontend Architect & UI Designer",
    bio: "Passionate software engineer specializing in interactive user interfaces, premium web architecture, and clean code. Translating rich design concepts into production-grade systems with high performance and accessibility.",
    email: "vishwa@example.com",
    location: "Mumbai, India",
    phone: "+91 9876543210",
    resume: "#",
    avatar: "", // Base64 image
    socials: {
      github: "https://github.com/vishwa-mistry",
      linkedin: "https://linkedin.com/in/vishwa-mistry",
      twitter: "https://x.com/vishwa_mistry",
      website: "https://vishwamistry.dev"
    }
  },
  styles: {
    theme: "minimalist", // minimalist, glassmorphism, neon, retro
    font: "Outfit",
    layout: "grid",
    color: "#6366f1",
    radius: "16px"
  },
  skills: [
    { id: "s1", name: "JavaScript (ES6+)", category: "Languages", proficiency: 95, tags: "React, Node" },
    { id: "s2", name: "TypeScript", category: "Languages", proficiency: 90, tags: "Strict Types" },
    { id: "s3", name: "React / Next.js", category: "Frontend", proficiency: 92, tags: "Tailwind, Redux" },
    { id: "s4", name: "CSS Grid & Flexbox", category: "Frontend", proficiency: 98, tags: "Responsive" },
    { id: "s5", name: "Node.js & Express", category: "Backend", proficiency: 85, tags: "REST APIs" },
    { id: "s6", name: "UI/UX Prototyping", category: "Tools", proficiency: 88, tags: "Figma" }
  ],
  projects: [
    {
      id: "p1",
      title: "TaskFlow | Collaborative Workspace",
      desc: "A rich SaaS kanban task manager equipped with instant web sockets syncing, project progress bars, drag-and-drop mechanics, and custom telemetry graphs.",
      demoUrl: "https://example.com/demo1",
      repoUrl: "https://github.com/vishwa-mistry/taskflow",
      tags: "React, Node.js, WebSockets, ChartJS",
      imageUrl: ""
    },
    {
      id: "p2",
      title: "Aura Commerce | Headless Storefront",
      desc: "Fast e-commerce web storefront boasting fully responsive layout designs, Stripe checkout integration, micro-animations, and dynamic visual filters.",
      demoUrl: "https://example.com/demo2",
      repoUrl: "https://github.com/vishwa-mistry/aura-commerce",
      tags: "Next.js, Tailwind, Stripe, GraphQL",
      imageUrl: ""
    }
  ],
  experience: [
    {
      id: "x1",
      title: "Senior UI Engineer",
      company: "Innovate Labs",
      dates: "2024 - Present",
      desc: "Spearheaded design system construction across 4 React native apps, improving performance metrics by 35% and reducing developer handoff latency by half."
    },
    {
      id: "x2",
      title: "Full Stack Developer",
      company: "Hexa Solutions",
      dates: "2022 - 2024",
      desc: "Managed high-availability backend microservices using Express, scaling request thresholds to support 20,000 active concurrent connections seamlessly."
    }
  ],
  education: [
    {
      id: "e1",
      title: "Bachelor of Science in Computer Science",
      institution: "Indian Institute of Technology (IIT)",
      dates: "2018 - 2022",
      desc: "Graduated with Honors. Focused heavily on Systems Architecture, Human-Computer Interaction, and Agile methodologies."
    }
  ]
};

// Global References for Current uploads
let currentProjectImage = "";

// Initialize Lucide Icons on Dashboard Load
document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();
  loadDataToInputs();
  bindEvents();
  renderSkillsList();
  renderProjectsList();
  renderExperienceList();
  renderEducationList();
  updatePreview();
});

// Load state values directly into form controls
function loadDataToInputs() {
  // Profile elements
  document.getElementById("prof-name").value = portfolioState.profile.name;
  document.getElementById("prof-title").value = portfolioState.profile.title;
  document.getElementById("prof-bio").value = portfolioState.profile.bio;
  document.getElementById("prof-email").value = portfolioState.profile.email;
  document.getElementById("prof-location").value = portfolioState.profile.location;
  document.getElementById("prof-phone").value = portfolioState.profile.phone;
  document.getElementById("prof-resume").value = portfolioState.profile.resume;
  
  // Profile socials
  document.getElementById("soc-github").value = portfolioState.profile.socials.github;
  document.getElementById("soc-linkedin").value = portfolioState.profile.socials.linkedin;
  document.getElementById("soc-twitter").value = portfolioState.profile.socials.twitter;
  document.getElementById("soc-website").value = portfolioState.profile.socials.website;
  
  // Customizations
  document.querySelector(`input[name="portfolio-theme"][value="${portfolioState.styles.theme}"]`).checked = true;
  document.getElementById("style-font").value = portfolioState.styles.font;
  document.getElementById("style-layout").value = portfolioState.styles.layout;
  document.getElementById("style-color").value = portfolioState.styles.color;
  document.getElementById("style-color-hex").value = portfolioState.styles.color;
  document.getElementById("style-radius").value = portfolioState.styles.radius;
  
  // Load avatar preview if it exists
  const avatarPreview = document.getElementById("avatar-preview-box");
  if (portfolioState.profile.avatar) {
    avatarPreview.innerHTML = `<img src="${portfolioState.profile.avatar}" alt="Avatar">`;
  } else {
    avatarPreview.innerHTML = `<i data-lucide="user" class="placeholder-icon"></i>`;
    lucide.createIcons();
  }
}

// Bind all listeners
function bindEvents() {
  // Tabs Toggle mechanism
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");
  
  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      tabButtons.forEach(b => b.classList.remove("active"));
      tabContents.forEach(c => c.classList.remove("active"));
      
      btn.classList.add("active");
      const targetTab = btn.getAttribute("data-tab");
      document.getElementById(`tab-${targetTab}`).classList.add("active");
    });
  });
  
  // Dashboard Dark/Light Switcher
  const themeToggle = document.getElementById("theme-toggle");
  themeToggle.addEventListener("click", () => {
    const body = document.body;
    if (body.classList.contains("dark-theme")) {
      body.classList.replace("dark-theme", "light-theme");
    } else {
      body.classList.replace("light-theme", "dark-theme");
    }
  });
  
  // Dynamic Range slider indicator
  const rangeSlider = document.getElementById("new-skill-proficiency");
  const sliderVal = document.getElementById("skill-proficiency-val");
  rangeSlider.addEventListener("input", (e) => {
    sliderVal.textContent = `${e.target.value}%`;
  });
  
  // Realtime inputs mapping to state
  const syncInputs = [
    { id: "prof-name", target: ["profile", "name"] },
    { id: "prof-title", target: ["profile", "title"] },
    { id: "prof-bio", target: ["profile", "bio"] },
    { id: "prof-email", target: ["profile", "email"] },
    { id: "prof-location", target: ["profile", "location"] },
    { id: "prof-phone", target: ["profile", "phone"] },
    { id: "prof-resume", target: ["profile", "resume"] },
    { id: "soc-github", target: ["profile", "socials", "github"] },
    { id: "soc-linkedin", target: ["profile", "socials", "linkedin"] },
    { id: "soc-twitter", target: ["profile", "socials", "twitter"] },
    { id: "soc-website", target: ["profile", "socials", "website"] }
  ];
  
  syncInputs.forEach(item => {
    const el = document.getElementById(item.id);
    el.addEventListener("input", (e) => {
      updateStateValue(item.target, e.target.value);
      updatePreview();
    });
  });
  
  // Theme options listener
  const themeRadios = document.querySelectorAll('input[name="portfolio-theme"]');
  themeRadios.forEach(radio => {
    radio.addEventListener("change", (e) => {
      portfolioState.styles.theme = e.target.value;
      updatePreview();
    });
  });
  
  // Select configs change
  document.getElementById("style-font").addEventListener("change", (e) => {
    portfolioState.styles.font = e.target.value;
    updatePreview();
  });
  
  document.getElementById("style-layout").addEventListener("change", (e) => {
    portfolioState.styles.layout = e.target.value;
    updatePreview();
  });
  
  document.getElementById("style-radius").addEventListener("change", (e) => {
    portfolioState.styles.radius = e.target.value;
    updatePreview();
  });
  
  // Custom Color Selection Link
  const styleColor = document.getElementById("style-color");
  const styleColorHex = document.getElementById("style-color-hex");
  
  styleColor.addEventListener("input", (e) => {
    styleColorHex.value = e.target.value;
    portfolioState.styles.color = e.target.value;
    updatePreview();
  });
  styleColorHex.addEventListener("input", (e) => {
    if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
      styleColor.value = e.target.value;
      portfolioState.styles.color = e.target.value;
      updatePreview();
    }
  });
  
  // Profile Avatar Upload Handlers
  const avatarInput = document.getElementById("avatar-input");
  const removeAvatarBtn = document.getElementById("remove-avatar-btn");
  const avatarPreview = document.getElementById("avatar-preview-box");
  
  avatarInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image file size exceeds 2MB limit!");
        return;
      }
      const reader = new FileReader();
      reader.onload = function(evt) {
        portfolioState.profile.avatar = evt.target.result;
        avatarPreview.innerHTML = `<img src="${evt.target.result}" alt="Avatar">`;
        updatePreview();
      };
      reader.readAsDataURL(file);
    }
  });
  
  removeAvatarBtn.addEventListener("click", () => {
    portfolioState.profile.avatar = "";
    avatarPreview.innerHTML = `<i data-lucide="user" class="placeholder-icon"></i>`;
    lucide.createIcons();
    updatePreview();
  });
  
  // Project Cover image upload Handlers
  const projImgInput = document.getElementById("proj-img-input");
  const removeProjImgBtn = document.getElementById("remove-proj-img-btn");
  const projImgPreview = document.getElementById("proj-img-preview-box");
  
  projImgInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image file size exceeds 2MB limit!");
        return;
      }
      const reader = new FileReader();
      reader.onload = function(evt) {
        currentProjectImage = evt.target.result;
        projImgPreview.innerHTML = `<img src="${evt.target.result}" alt="Project preview">`;
      };
      reader.readAsDataURL(file);
    }
  });
  
  removeProjImgBtn.addEventListener("click", () => {
    currentProjectImage = "";
    projImgPreview.innerHTML = `<i data-lucide="image" class="placeholder-icon"></i>`;
    lucide.createIcons();
  });
  
  // Resizer viewport controls
  const viewportBtns = document.querySelectorAll(".btn-viewport");
  const iframeWrapper = document.querySelector(".preview-frame-wrapper");
  
  viewportBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      viewportBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      const widthType = btn.getAttribute("data-viewport");
      iframeWrapper.className = `preview-frame-wrapper ${widthType}-width`;
    });
  });
  
  // Force sync preview button
  document.getElementById("refresh-preview-btn").addEventListener("click", () => {
    updatePreview();
  });
  
  // Add Dynamic list elements triggers
  document.getElementById("add-skill-btn").addEventListener("click", addSkillItem);
  document.getElementById("add-project-btn").addEventListener("click", addProjectItem);
  document.getElementById("add-experience-btn").addEventListener("click", addExperienceItem);
  document.getElementById("add-education-btn").addEventListener("click", addEducationItem);
  
  // Configuration Import/Export listeners
  document.getElementById("export-btn").addEventListener("click", exportConfigJSON);
  
  const importBtn = document.getElementById("import-btn");
  const importFile = document.getElementById("import-file");
  importBtn.addEventListener("click", () => importFile.click());
  importFile.addEventListener("change", importConfigJSON);
  
  // Standalone Download button
  document.getElementById("download-portfolio-btn").addEventListener("click", downloadPortfolioPage);
  
  // PDF Download button
  document.getElementById("download-pdf-btn").addEventListener("click", downloadPDFPage);
}

// Trigger PDF printing dialog of the simulated IFrame contents
function downloadPDFPage() {
  const iframe = document.getElementById("portfolio-preview-frame");
  if (!iframe) return;
  
  // Ensure the iframe has loaded the document completely
  iframe.contentWindow.focus();
  iframe.contentWindow.print();
}

// Deep state updating mechanism helper
function updateStateValue(path, val) {
  let ref = portfolioState;
  for (let i = 0; i < path.length - 1; i++) {
    ref = ref[path[i]];
  }
  ref[path[path.length - 1]] = val;
}

// ==========================================================================
// CRUD Functions for arrays
// ==========================================================================

// Add Skills
function addSkillItem() {
  const nameEl = document.getElementById("new-skill-name");
  const catEl = document.getElementById("new-skill-category");
  const profEl = document.getElementById("new-skill-proficiency");
  const tagsEl = document.getElementById("new-skill-tags");
  
  if (!nameEl.value.trim()) {
    alert("Please specify a skill name.");
    return;
  }
  
  const newSkill = {
    id: "s-" + Date.now(),
    name: nameEl.value.trim(),
    category: catEl.value,
    proficiency: parseInt(profEl.value),
    tags: tagsEl.value.trim()
  };
  
  portfolioState.skills.push(newSkill);
  renderSkillsList();
  updatePreview();
  
  // Clean inputs
  nameEl.value = "";
  tagsEl.value = "";
  profEl.value = "85";
  document.getElementById("skill-proficiency-val").textContent = "85%";
}

function removeSkillItem(id) {
  portfolioState.skills = portfolioState.skills.filter(s => s.id !== id);
  renderSkillsList();
  updatePreview();
}

function renderSkillsList() {
  const container = document.getElementById("skills-list");
  container.innerHTML = "";
  
  portfolioState.skills.forEach(s => {
    const card = document.createElement("div");
    card.className = "list-item-card";
    card.innerHTML = `
      <div class="list-item-info">
        <div class="list-item-text">
          <h4>${s.name}</h4>
          <p>${s.category} &bull; ${s.proficiency}% Proficiency</p>
          ${s.tags ? `<div class="list-item-meta"><span class="badge badge-primary">${s.tags}</span></div>` : ""}
        </div>
      </div>
      <div class="list-item-actions">
        <button type="button" class="btn btn-danger-outline btn-icon" onclick="removeSkillItem('${s.id}')">
          <i data-lucide="trash-2"></i>
        </button>
      </div>
    `;
    container.appendChild(card);
  });
  lucide.createIcons();
}

// Add Projects
function addProjectItem() {
  const titleEl = document.getElementById("new-proj-title");
  const descEl = document.getElementById("new-proj-desc");
  const demoEl = document.getElementById("new-proj-demo");
  const repoEl = document.getElementById("new-proj-repo");
  const tagsEl = document.getElementById("new-proj-tags");
  
  if (!titleEl.value.trim()) {
    alert("Please enter a project title.");
    return;
  }
  
  const newProj = {
    id: "p-" + Date.now(),
    title: titleEl.value.trim(),
    desc: descEl.value.trim(),
    demoUrl: demoEl.value.trim() || "#",
    repoUrl: repoEl.value.trim() || "#",
    tags: tagsEl.value.trim(),
    imageUrl: currentProjectImage
  };
  
  portfolioState.projects.push(newProj);
  renderProjectsList();
  updatePreview();
  
  // Clean inputs
  titleEl.value = "";
  descEl.value = "";
  demoEl.value = "";
  repoEl.value = "";
  tagsEl.value = "";
  currentProjectImage = "";
  document.getElementById("proj-img-preview-box").innerHTML = `<i data-lucide="image" class="placeholder-icon"></i>`;
  lucide.createIcons();
}

function removeProjectItem(id) {
  portfolioState.projects = portfolioState.projects.filter(p => p.id !== id);
  renderProjectsList();
  updatePreview();
}

function renderProjectsList() {
  const container = document.getElementById("projects-list");
  container.innerHTML = "";
  
  portfolioState.projects.forEach(p => {
    const card = document.createElement("div");
    card.className = "list-item-card";
    
    let imgBlock = `<div class="list-item-avatar"><i data-lucide="image" class="placeholder-icon" style="padding: 10px;"></i></div>`;
    if (p.imageUrl) {
      imgBlock = `<div class="list-item-avatar"><img src="${p.imageUrl}" alt="Project thumb"></div>`;
    }
    
    card.innerHTML = `
      <div class="list-item-info">
        ${imgBlock}
        <div class="list-item-text">
          <h4>${p.title}</h4>
          <p>${p.desc.substring(0, 75)}${p.desc.length > 75 ? "..." : ""}</p>
          ${p.tags ? `<div class="list-item-meta"><span class="badge">${p.tags}</span></div>` : ""}
        </div>
      </div>
      <div class="list-item-actions">
        <button type="button" class="btn btn-danger-outline btn-icon" onclick="removeProjectItem('${p.id}')">
          <i data-lucide="trash-2"></i>
        </button>
      </div>
    `;
    container.appendChild(card);
  });
  lucide.createIcons();
}

// Add Experience
function addExperienceItem() {
  const titleEl = document.getElementById("new-exp-title");
  const compEl = document.getElementById("new-exp-company");
  const datesEl = document.getElementById("new-exp-dates");
  const descEl = document.getElementById("new-exp-desc");
  
  if (!titleEl.value.trim() || !compEl.value.trim()) {
    alert("Please enter both the Job Title and Company.");
    return;
  }
  
  const newExp = {
    id: "x-" + Date.now(),
    title: titleEl.value.trim(),
    company: compEl.value.trim(),
    dates: datesEl.value.trim(),
    desc: descEl.value.trim()
  };
  
  portfolioState.experience.push(newExp);
  renderExperienceList();
  updatePreview();
  
  // Clean inputs
  titleEl.value = "";
  compEl.value = "";
  datesEl.value = "";
  descEl.value = "";
}

function removeExperienceItem(id) {
  portfolioState.experience = portfolioState.experience.filter(x => x.id !== id);
  renderExperienceList();
  updatePreview();
}

function renderExperienceList() {
  const container = document.getElementById("experience-list");
  container.innerHTML = "";
  
  portfolioState.experience.forEach(x => {
    const card = document.createElement("div");
    card.className = "list-item-card";
    card.innerHTML = `
      <div class="list-item-info">
        <div class="list-item-text">
          <h4>${x.title}</h4>
          <p>${x.company} &bull; ${x.dates}</p>
        </div>
      </div>
      <div class="list-item-actions">
        <button type="button" class="btn btn-danger-outline btn-icon" onclick="removeExperienceItem('${x.id}')">
          <i data-lucide="trash-2"></i>
        </button>
      </div>
    `;
    container.appendChild(card);
  });
  lucide.createIcons();
}

// Add Education
function addEducationItem() {
  const degEl = document.getElementById("new-edu-degree");
  const instEl = document.getElementById("new-edu-institution");
  const datesEl = document.getElementById("new-edu-dates");
  const descEl = document.getElementById("new-edu-desc");
  
  if (!degEl.value.trim() || !instEl.value.trim()) {
    alert("Please enter the Degree and Institution.");
    return;
  }
  
  const newEdu = {
    id: "e-" + Date.now(),
    title: degEl.value.trim(),
    institution: instEl.value.trim(),
    dates: datesEl.value.trim(),
    desc: descEl.value.trim()
  };
  
  portfolioState.education.push(newEdu);
  renderEducationList();
  updatePreview();
  
  // Clean inputs
  degEl.value = "";
  instEl.value = "";
  datesEl.value = "";
  descEl.value = "";
}

function removeEducationItem(id) {
  portfolioState.education = portfolioState.education.filter(e => e.id !== id);
  renderEducationList();
  updatePreview();
}

function renderEducationList() {
  const container = document.getElementById("education-list");
  container.innerHTML = "";
  
  portfolioState.education.forEach(e => {
    const card = document.createElement("div");
    card.className = "list-item-card";
    card.innerHTML = `
      <div class="list-item-info">
        <div class="list-item-text">
          <h4>${e.title}</h4>
          <p>${e.institution} &bull; ${e.dates}</p>
        </div>
      </div>
      <div class="list-item-actions">
        <button type="button" class="btn btn-danger-outline btn-icon" onclick="removeEducationItem('${e.id}')">
          <i data-lucide="trash-2"></i>
        </button>
      </div>
    `;
    container.appendChild(card);
  });
  lucide.createIcons();
}

// ==========================================================================
// File Configurations Import/Export
// ==========================================================================
function exportConfigJSON() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(portfolioState, null, 2));
  const dlAnchorElem = document.createElement("a");
  dlAnchorElem.setAttribute("href", dataStr);
  dlAnchorElem.setAttribute("download", `portfolio_config.json`);
  dlAnchorElem.click();
}

function importConfigJSON(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const parsedData = JSON.parse(e.target.result);
      if (parsedData.profile && parsedData.styles) {
        portfolioState = parsedData;
        loadDataToInputs();
        renderSkillsList();
        renderProjectsList();
        renderExperienceList();
        renderEducationList();
        updatePreview();
        alert("Configuration loaded successfully!");
      } else {
        alert("Invalid portfolio configuration file format.");
      }
    } catch (err) {
      alert("Error parsing JSON file. Check file integrity.");
    }
  };
  reader.readAsText(file);
}

// ==========================================================================
// Preview Generation Iframe Builder
// ==========================================================================
function updatePreview() {
  const iframe = document.getElementById("portfolio-preview-frame");
  if (!iframe) return;
  
  const outputHTML = buildPortfolioHTML();
  
  const doc = iframe.contentDocument || iframe.contentWindow.document;
  doc.open();
  doc.write(outputHTML);
  doc.close();
}

// Single standalone html builder for downloading
function downloadPortfolioPage() {
  const finalHTML = buildPortfolioHTML();
  const blob = new Blob([finalHTML], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement("a");
  a.href = url;
  a.download = `${portfolioState.profile.name.toLowerCase().replace(/\s+/g, "_")}_portfolio.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Compiler core that matches themes and returns entire HTML code
function buildPortfolioHTML() {
  const p = portfolioState.profile;
  const s = portfolioState.styles;
  
  // Theme logic variables
  let themeStyles = "";
  
  if (s.theme === "minimalist") {
    themeStyles = `
      :root {
        --bg-body: #f8fafc;
        --bg-card: #ffffff;
        --text-head: #0f172a;
        --text-body: #334155;
        --text-muted: #64748b;
        --border-color: #e2e8f0;
        --shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
      }
      body {
        background-color: var(--bg-body);
      }
      .navbar {
        border-bottom: 1px solid var(--border-color);
        background: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(8px);
      }
      .hero {
        text-align: center;
        padding: 8rem 2rem 5rem 2rem;
      }
      .hero-avatar {
        box-shadow: 0 0 0 4px #ffffff, 0 10px 30px -10px rgba(0,0,0,0.15);
      }
      .card {
        border: 1px solid var(--border-color);
        background-color: var(--bg-card);
      }
    `;
  } else if (s.theme === "glassmorphism") {
    themeStyles = `
      :root {
        --bg-body: #0a0b10;
        --bg-card: rgba(255, 255, 255, 0.04);
        --text-head: #ffffff;
        --text-body: #cbd5e1;
        --text-muted: #94a3b8;
        --border-color: rgba(255, 255, 255, 0.08);
        --shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
      }
      body {
        background: radial-gradient(circle at 0% 0%, #1e1b4b 0%, #0f172a 40%, #020617 100%);
        background-attachment: fixed;
      }
      .navbar {
        border-bottom: 1px solid var(--border-color);
        background: rgba(15, 23, 42, 0.5);
        backdrop-filter: blur(12px);
      }
      .hero {
        padding: 9rem 2rem 6rem 2rem;
        background: radial-gradient(ellipse 50% 50% at 50% 30%, rgba(99, 102, 241, 0.15), transparent);
      }
      .hero-avatar {
        box-shadow: 0 0 0 1px var(--border-color), 0 0 40px rgba(99, 102, 241, 0.3);
      }
      .card {
        border: 1px solid var(--border-color);
        background: var(--bg-card);
        backdrop-filter: blur(10px);
      }
    `;
  } else if (s.theme === "neon") {
    themeStyles = `
      :root {
        --bg-body: #030408;
        --bg-card: #0c0f1d;
        --text-head: #ffffff;
        --text-body: #94a3b8;
        --text-muted: #64748b;
        --border-color: #1e293b;
        --shadow: 0 0 15px rgba(0, 242, 254, 0.05);
      }
      body {
        background-color: var(--bg-body);
        font-family: var(--font-main);
      }
      .navbar {
        border-bottom: 1px solid #1e293b;
        background: rgba(3, 4, 8, 0.9);
      }
      .hero {
        padding: 9rem 2rem 5rem 2rem;
      }
      .hero-avatar {
        border: 2px solid var(--accent);
        box-shadow: 0 0 20px rgba(var(--accent-rgb), 0.5);
      }
      .card {
        background-color: var(--bg-card);
        border: 1px solid var(--border-color);
        transition: border-color 0.3s, box-shadow 0.3s;
      }
      .card:hover {
        border-color: var(--accent);
        box-shadow: 0 0 15px rgba(var(--accent-rgb), 0.15);
      }
      h1, h2, h3 {
        text-shadow: 0 0 20px rgba(var(--accent-rgb), 0.25);
      }
    `;
  } else if (s.theme === "retro") {
    themeStyles = `
      :root {
        --bg-body: #fdf6e2;
        --bg-card: #f4edd8;
        --text-head: #282828;
        --text-body: #3c3836;
        --text-muted: #7c6f64;
        --border-color: #282828;
        --shadow: 4px 4px 0px 0px #282828;
      }
      body {
        background-color: var(--bg-body);
      }
      .navbar {
        border-bottom: 3px solid var(--border-color);
        background: var(--bg-card);
      }
      .hero {
        padding: 8rem 2rem 5rem 2rem;
      }
      .hero-avatar {
        border: 3px solid var(--border-color);
        border-radius: 0 !important;
        box-shadow: 4px 4px 0px 0px var(--border-color);
      }
      .card {
        border: 3px solid var(--border-color);
        background-color: var(--bg-card);
        border-radius: 0 !important;
        box-shadow: var(--shadow);
      }
      .card:hover {
        transform: translate(-2px, -2px);
        box-shadow: 6px 6px 0px 0px var(--border-color);
      }
    `;
  }
  
  // Custom font loader string
  let fontLink = "";
  if (s.font === "Fira Code") {
    fontLink = "@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&display=swap');";
  } else if (s.font === "Outfit") {
    fontLink = "@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap');";
  } else if (s.font === "Playfair Display") {
    fontLink = "@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');";
  } else {
    fontLink = "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');";
  }
  
  // Base64 helper or generic avatar placeholder
  const avatarSrc = p.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80";
  
  // Convert hex color to rgb for neon styles shadow support
  const r = parseInt(s.color.slice(1, 3), 16);
  const g = parseInt(s.color.slice(3, 5), 16);
  const bVal = parseInt(s.color.slice(5, 7), 16);
  
  // Skills mapping
  let skillsHTML = "";
  if (portfolioState.skills.length > 0) {
    skillsHTML = `
      <section class="section" id="skills">
        <h2 class="section-title">Technical Expertise</h2>
        <div class="skills-grid">
          ${portfolioState.skills.map(skill => `
            <div class="skill-card card">
              <div class="skill-meta">
                <span class="skill-name">${skill.name}</span>
                <span class="skill-level">${skill.proficiency}%</span>
              </div>
              <div class="skill-bar-wrapper">
                <div class="skill-bar" style="width: ${skill.proficiency}%;"></div>
              </div>
              ${skill.tags ? `<span class="skill-tag">${skill.tags}</span>` : ""}
            </div>
          `).join("")}
        </div>
      </section>
    `;
  }
  
  // Projects list
  let projectsHTML = "";
  if (portfolioState.projects.length > 0) {
    projectsHTML = `
      <section class="section" id="projects">
        <h2 class="section-title">Projects Showcase</h2>
        <div class="projects-layout-${s.layout}">
          ${portfolioState.projects.map(proj => {
            const projectImgSrc = proj.imageUrl || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=500&q=80";
            return `
              <div class="project-card card">
                <div class="project-img-wrapper">
                  <img src="${projectImgSrc}" alt="${proj.title}" loading="lazy">
                </div>
                <div class="project-body">
                  <h3 class="project-title">${proj.title}</h3>
                  <p class="project-desc">${proj.desc}</p>
                  ${proj.tags ? `
                    <div class="project-tags">
                      ${proj.tags.split(",").map(t => `<span class="p-tag">${t.trim()}</span>`).join("")}
                    </div>
                  ` : ""}
                  <div class="project-links">
                    <a href="${proj.demoUrl}" target="_blank" class="p-link demo-link">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                      <span>Demo</span>
                    </a>
                    <a href="${proj.repoUrl}" target="_blank" class="p-link repo-link">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                      <span>GitHub</span>
                    </a>
                  </div>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </section>
    `;
  }
  
  // Work experience
  let experienceHTML = "";
  if (portfolioState.experience.length > 0) {
    experienceHTML = `
      <section class="section" id="experience">
        <h2 class="section-title">Work Experience</h2>
        <div class="timeline">
          ${portfolioState.experience.map(exp => `
            <div class="timeline-item">
              <div class="timeline-dot"></div>
              <div class="timeline-content card">
                <div class="timeline-header">
                  <h3 class="job-title">${exp.title}</h3>
                  <span class="job-dates">${exp.dates}</span>
                </div>
                <h4 class="job-company">${exp.company}</h4>
                <p class="job-desc">${exp.desc}</p>
              </div>
            </div>
          `).join("")}
        </div>
      </section>
    `;
  }
  
  // Education section
  let educationHTML = "";
  if (portfolioState.education.length > 0) {
    educationHTML = `
      <section class="section" id="education">
        <h2 class="section-title">Education & Certifications</h2>
        <div class="timeline">
          ${portfolioState.education.map(edu => `
            <div class="timeline-item">
              <div class="timeline-dot"></div>
              <div class="timeline-content card">
                <div class="timeline-header">
                  <h3 class="edu-title">${edu.title}</h3>
                  <span class="edu-dates">${edu.dates}</span>
                </div>
                <h4 class="edu-inst">${edu.institution}</h4>
                <p class="edu-desc">${edu.desc}</p>
              </div>
            </div>
          `).join("")}
        </div>
      </section>
    `;
  }
  
  // Contacts block & Footer
  let footerHTML = `
    <footer class="footer" id="contact">
      <div class="footer-container">
        <h2>Get In Touch</h2>
        <p>Have an interesting project or want to collaborate? Reach out via channels below.</p>
        
        <div class="contact-links">
          ${p.email ? `<a href="mailto:${p.email}" class="btn btn-contact">Email Me</a>` : ""}
          ${p.phone ? `<a href="tel:${p.phone}" class="btn btn-contact btn-contact-outline">${p.phone}</a>` : ""}
        </div>
        
        <div class="footer-socials">
          ${p.socials.github ? `<a href="${p.socials.github}" target="_blank">GitHub</a>` : ""}
          ${p.socials.linkedin ? `<a href="${p.socials.linkedin}" target="_blank">LinkedIn</a>` : ""}
          ${p.socials.twitter ? `<a href="${p.socials.twitter}" target="_blank">Twitter</a>` : ""}
          ${p.socials.website ? `<a href="${p.socials.website}" target="_blank">Website</a>` : ""}
        </div>
        
        <p class="copyright">&copy; ${new Date().getFullYear()} ${p.name}. Powered by DevCraft.</p>
      </div>
    </footer>
  `;
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${p.name} | Portfolio</title>
  <style>
    ${fontLink}
    
    ${themeStyles}
    
    :root {
      --accent: ${s.color};
      --accent-rgb: ${r}, ${g}, ${bVal};
      --radius: ${s.radius};
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: "${s.font}", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: var(--text-body);
      line-height: 1.6;
      transition: background-color 0.3s, color 0.3s;
    }
    
    h1, h2, h3, h4 {
      color: var(--text-head);
      font-weight: 700;
    }
    
    a {
      color: var(--accent);
      text-decoration: none;
      transition: color 0.2s;
    }
    
    .container {
      max-width: 960px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }
    
    /* Navbar styles */
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 70px;
      z-index: 100;
      display: flex;
      align-items: center;
      transition: background-color 0.3s;
    }
    .nav-container {
      width: 100%;
      max-width: 960px;
      margin: 0 auto;
      padding: 0 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo {
      font-weight: 800;
      font-size: 1.25rem;
      letter-spacing: -0.5px;
      color: var(--text-head) !important;
    }
    .nav-links {
      display: flex;
      gap: 1.5rem;
    }
    .nav-links a {
      color: var(--text-body);
      font-size: 0.9rem;
      font-weight: 500;
    }
    .nav-links a:hover {
      color: var(--accent);
    }
    
    /* Hero Section */
    .hero {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
    }
    .hero-avatar {
      width: 130px;
      height: 130px;
      border-radius: 50%;
      object-fit: cover;
      margin-bottom: 0.5rem;
    }
    .hero-name {
      font-size: 2.75rem;
      font-weight: 800;
      letter-spacing: -1px;
      line-height: 1.1;
      text-align: center;
    }
    .hero-title {
      font-size: 1.25rem;
      color: var(--accent);
      font-weight: 600;
      text-align: center;
      margin-top: -0.5rem;
    }
    .hero-bio {
      max-width: 600px;
      text-align: center;
      font-size: 1rem;
      color: var(--text-muted);
    }
    
    /* Layout Cards & Components */
    .section {
      padding: 5rem 0;
      border-bottom: 1px solid var(--border-color);
    }
    .section:last-of-type {
      border-bottom: none;
    }
    .section-title {
      font-size: 1.75rem;
      margin-bottom: 2.5rem;
      text-align: center;
      letter-spacing: -0.5px;
      position: relative;
    }
    
    /* Skills Grid */
    .skills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1.25rem;
    }
    .skill-card {
      border-radius: var(--radius);
      padding: 1.25rem;
    }
    .skill-meta {
      display: flex;
      justify-content: space-between;
      font-weight: 600;
      font-size: 0.9rem;
      margin-bottom: 8px;
    }
    .skill-name {
      color: var(--text-head);
    }
    .skill-level {
      color: var(--accent);
    }
    .skill-bar-wrapper {
      height: 6px;
      background-color: var(--border-color);
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 8px;
    }
    .skill-bar {
      height: 100%;
      background-color: var(--accent);
      border-radius: 4px;
    }
    .skill-tag {
      font-size: 0.75rem;
      color: var(--text-muted);
      font-weight: 500;
    }
    
    /* Projects grid and list views */
    .projects-layout-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    
    .projects-layout-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .projects-layout-list .project-card {
      display: flex;
      flex-direction: row;
      align-items: stretch;
    }
    .projects-layout-list .project-img-wrapper {
      width: 280px;
      min-height: 100%;
    }
    
    .project-card {
      border-radius: var(--radius);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .project-card:hover {
      transform: translateY(-4px);
    }
    .project-img-wrapper {
      height: 180px;
      overflow: hidden;
      background-color: var(--border-color);
      position: relative;
    }
    .project-img-wrapper img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .project-body {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    .project-title {
      font-size: 1.2rem;
      margin-bottom: 0.5rem;
    }
    .project-desc {
      font-size: 0.9rem;
      color: var(--text-muted);
      margin-bottom: 1.25rem;
      flex: 1;
    }
    .project-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 1.25rem;
    }
    .p-tag {
      font-size: 0.7rem;
      padding: 3px 8px;
      background-color: var(--border-color);
      border-radius: 4px;
      font-weight: 600;
    }
    .project-links {
      display: flex;
      gap: 1rem;
    }
    .p-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 0.85rem;
      font-weight: 600;
    }
    .p-link:hover {
      color: var(--text-head);
    }
    
    /* Timeline / Work / Education styles */
    .timeline {
      position: relative;
      max-width: 800px;
      margin: 0 auto;
      padding-left: 2rem;
    }
    .timeline::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 2px;
      background-color: var(--border-color);
    }
    .timeline-item {
      position: relative;
      margin-bottom: 2rem;
    }
    .timeline-dot {
      position: absolute;
      left: calc(-2rem - 5px);
      top: 1.25rem;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background-color: var(--accent);
      border: 2px solid var(--bg-body);
    }
    .timeline-content {
      border-radius: var(--radius);
      padding: 1.5rem;
    }
    .timeline-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 4px;
      flex-wrap: wrap;
      gap: 8px;
    }
    .job-title, .edu-title {
      font-size: 1.15rem;
    }
    .job-dates, .edu-dates {
      font-size: 0.85rem;
      color: var(--accent);
      font-weight: 600;
    }
    .job-company, .edu-inst {
      font-size: 0.95rem;
      color: var(--text-head);
      margin-bottom: 12px;
    }
    .job-desc, .edu-desc {
      font-size: 0.9rem;
      color: var(--text-muted);
    }
    
    /* Footer & Get In Touch */
    .footer {
      padding: 6rem 0;
      background-color: var(--bg-card);
      border-top: 1px solid var(--border-color);
      text-align: center;
    }
    .footer-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }
    .footer-container h2 {
      font-size: 2.25rem;
      letter-spacing: -0.5px;
      margin-bottom: 0.75rem;
    }
    .footer-container p {
      color: var(--text-muted);
      margin-bottom: 2.5rem;
    }
    
    .contact-links {
      display: flex;
      justify-content: center;
      gap: 1.25rem;
      margin-bottom: 3.5rem;
      flex-wrap: wrap;
    }
    .btn-contact {
      padding: 12px 28px;
      font-weight: 700;
      border-radius: 8px;
      background-color: var(--accent);
      color: var(--bg-body) !important;
      display: inline-block;
      transition: transform 0.2s, background-color 0.2s;
    }
    .btn-contact:hover {
      transform: translateY(-2px);
    }
    .btn-contact-outline {
      background-color: transparent;
      border: 2px solid var(--accent);
      color: var(--accent) !important;
    }
    .btn-contact-outline:hover {
      background-color: rgba(var(--accent-rgb), 0.05);
    }
    
    .footer-socials {
      display: flex;
      justify-content: center;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    .footer-socials a {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--text-muted);
    }
    .footer-socials a:hover {
      color: var(--accent);
    }
    .copyright {
      font-size: 0.8rem !important;
      color: var(--text-muted);
    }
    
    /* Responsive overrides */
    @media (max-width: 768px) {
      .projects-layout-list .project-card {
        flex-direction: column;
      }
      .projects-layout-list .project-img-wrapper {
        width: 100%;
        height: 180px;
      }
      .timeline-header {
        flex-direction: column;
        gap: 2px;
      }
      .hero-name {
        font-size: 2.25rem;
      }
    }
    
    /* Print Layout Overrides for PDF Exact Rendering */
    @media print {
      body {
        background-color: var(--bg-body) !important;
        color: var(--text-body) !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .navbar {
        position: absolute !important;
        background: transparent !important;
        border-bottom: none !important;
      }
      .nav-links {
        display: none !important;
      }
      .section {
        page-break-inside: avoid;
        border-bottom: 1px solid var(--border-color) !important;
        padding: 3rem 0 !important;
      }
      .card {
        page-break-inside: avoid;
        box-shadow: none !important;
      }
    }
  </style>
</head>
<body>

  <!-- Navigation -->
  <nav class="navbar">
    <div class="nav-container">
      <a href="#" class="logo">${p.name.split(" ")[0] || "Portfolio"}</a>
      <div class="nav-links">
        ${portfolioState.skills.length > 0 ? '<a href="#skills">Skills</a>' : ''}
        ${portfolioState.projects.length > 0 ? '<a href="#projects">Projects</a>' : ''}
        ${portfolioState.experience.length > 0 ? '<a href="#experience">Experience</a>' : ''}
        <a href="#contact">Contact</a>
      </div>
    </div>
  </nav>

  <!-- Hero Section -->
  <header class="hero container">
    <img src="${avatarSrc}" alt="${p.name}" class="hero-avatar">
    <h1 class="hero-name">${p.name}</h1>
    <div class="hero-title">${p.title}</div>
    <p class="hero-bio">${p.bio}</p>
  </header>

  <main class="container">
    <!-- Skills Section -->
    ${skillsHTML}
    
    <!-- Projects Section -->
    ${projectsHTML}
    
    <!-- Work Experience Section -->
    ${experienceHTML}
    
    <!-- Education Section -->
    ${educationHTML}
  </main>

  <!-- Footer / Contact info -->
  ${footerHTML}

</body>
</html>`;
}
