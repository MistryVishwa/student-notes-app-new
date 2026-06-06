// ==========================================================================
// Default / Mock Startup Idea Data
// ==========================================================================
const mockIdeas = [
  {
    id: "idea-1",
    name: "EcoSphere Analytics",
    category: "CleanTech / Climate",
    innovation: "New Technology Application",
    targetAudience: "Enterprise ESG compliance officers and supply chain managers.",
    problemStatement: "Companies struggle to track real-time Scope 3 carbon emissions across international multi-tiered supply chains due to fragmented supplier reporting.",
    solutionDesc: "A B2B SaaS platform that uses automated API integrations and machine learning to map, verify, and report Scope 3 emissions automatically.",
    valueProp: "Reduces audit preparation times by 75% while assuring 100% regulatory audit compliance.",
    marketTam: 400000000,
    marketSam: 85000000,
    marketSom: 8500000,
    competitorLevel: "Moderate (Clear niches, established players)",
    barrierToEntry: "Medium (Moderate setup / tech required)",
    defensibility: ["data", "tech"],
    revModel: "Subscription / SaaS",
    pricingTier: "Enterprise ($100+ / month)",
    grossMargin: "High (80%+ e.g. Software/SaaS)",
    scalabilityLevel: 8,
    capitalReq: "Medium (Needs core developer hire / key API licenses)",
    fundingStrategy: "Organic Bootstrapping",
    checklist: ["interviews", "pain-confirmed", "channels", "landing-page", "waitlist", "domain"]
  },
  {
    id: "idea-2",
    name: "Acuity Tax Platform",
    category: "FinTech",
    innovation: "Incremental Improvement",
    targetAudience: "Digital nomads and cross-border freelancers.",
    problemStatement: "Traditional tax software does not handle multi-country tax filings, forcing nomads to pay expensive cross-border consultants.",
    solutionDesc: "A localized tax filing wizard that automatically pulls income details via Plaid and files taxes in both home and residency countries.",
    valueProp: "Files dual-country taxes in under 20 minutes for a flat $99 fee instead of $1,500 consulting bills.",
    marketTam: 90000000,
    marketSam: 25000000,
    marketSom: 2500000,
    competitorLevel: "Low (Blue Ocean, high educational cost)",
    barrierToEntry: "Medium (Requires specific expertise, brand development, or API integrations)",
    defensibility: ["brand"],
    revModel: "Freemium / Premium Add-ons",
    pricingTier: "Mid Ticket ($11 - $99 / month)",
    grossMargin: "Medium (40% - 79% e.g. Marketplace, Agency)",
    scalabilityLevel: 6,
    capitalReq: "Low (Bootstrappable with API/No-code)",
    fundingStrategy: "Grants / Crowdfunding",
    checklist: ["interviews", "pain-confirmed"]
  }
];

let appState = {
  ideas: [...mockIdeas],
  activeIdeaId: "idea-1"
};

// Global Chart References
let radarChartInstance = null;
let barChartInstance = null;

// ==========================================================================
// Initialization & Events Binding
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  loadAppData();
  bindEventHandlers();
  renderSidebar();
  selectIdea(appState.activeIdeaId);
  lucide.createIcons();
});

function loadAppData() {
  const saved = localStorage.getItem("venturevalidate_state_v1");
  if (saved) {
    try {
      appState = JSON.parse(saved);
    } catch (e) {
      console.error("Error loading application state.", e);
    }
  }
}

function saveAppData() {
  localStorage.setItem("venturevalidate_state_v1", JSON.stringify(appState));
}

function bindEventHandlers() {
  // Mobile sidebar menu toggles
  document.getElementById("sidebar-toggle-open").addEventListener("click", () => {
    document.getElementById("app-sidebar").classList.add("active");
  });
  document.getElementById("sidebar-toggle-close").addEventListener("click", () => {
    document.getElementById("app-sidebar").classList.remove("active");
  });

  // Tab Navigation Switching
  const tabButtons = document.querySelectorAll(".tab-btn");
  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      tabButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      const targetPaneId = "tab-" + btn.getAttribute("data-tab");
      document.querySelectorAll(".tab-pane").forEach(pane => pane.classList.remove("active"));
      document.getElementById(targetPaneId).classList.add("active");
    });
  });

  // Create & Reset actions
  document.getElementById("new-idea-btn").addEventListener("click", createNewIdea);
  document.getElementById("welcome-create-btn").addEventListener("click", createNewIdea);
  document.getElementById("reset-btn").addEventListener("click", resetAllData);

  // Backup file handlers
  document.getElementById("export-btn").addEventListener("click", exportDataJSON);

  // Form Saves (Real-time or Submit based)
  document.getElementById("strategy-form").addEventListener("submit", (e) => {
    e.preventDefault();
    saveStrategyData();
  });
  document.getElementById("market-form").addEventListener("submit", (e) => {
    e.preventDefault();
    saveMarketData();
  });
  document.getElementById("business-form").addEventListener("submit", (e) => {
    e.preventDefault();
    saveBusinessData();
  });

  // Checklist updates recalculate score instantly
  document.querySelectorAll(".validation-checklist-item").forEach(item => {
    item.addEventListener("change", saveChecklistsData);
  });

  // Real-time slider labels
  const tamSlider = document.getElementById("market-tam");
  const samSlider = document.getElementById("market-sam");
  const somSlider = document.getElementById("market-som");
  
  tamSlider.addEventListener("input", (e) => {
    document.getElementById("lbl-tam").textContent = Number(e.target.value).toLocaleString();
    if (Number(samSlider.value) > Number(e.target.value)) {
      samSlider.value = e.target.value;
      document.getElementById("lbl-sam").textContent = Number(e.target.value).toLocaleString();
    }
    if (Number(somSlider.value) > Number(samSlider.value)) {
      somSlider.value = samSlider.value;
      document.getElementById("lbl-som").textContent = Number(somSlider.value).toLocaleString();
    }
  });

  samSlider.addEventListener("input", (e) => {
    if (Number(e.target.value) > Number(tamSlider.value)) {
      e.target.value = tamSlider.value;
    }
    document.getElementById("lbl-sam").textContent = Number(e.target.value).toLocaleString();
    if (Number(somSlider.value) > Number(e.target.value)) {
      somSlider.value = e.target.value;
      document.getElementById("lbl-som").textContent = Number(e.target.value).toLocaleString();
    }
  });

  somSlider.addEventListener("input", (e) => {
    if (Number(e.target.value) > Number(samSlider.value)) {
      e.target.value = samSlider.value;
    }
    document.getElementById("lbl-som").textContent = Number(e.target.value).toLocaleString();
  });

  document.getElementById("scalability-level").addEventListener("input", (e) => {
    document.getElementById("lbl-scalability").textContent = e.target.value;
  });
}

// ==========================================================================
// Sidebar & Navigation Operations
// ==========================================================================
function renderSidebar() {
  const container = document.getElementById("ideas-list-container");
  container.innerHTML = "";

  if (appState.ideas.length === 0) {
    document.getElementById("main-workspace").style.display = "none";
    document.getElementById("welcome-pane").style.display = "flex";
    document.getElementById("current-idea-title").textContent = "No Idea Selected";
    document.getElementById("current-idea-category").textContent = "";
    return;
  }

  document.getElementById("main-workspace").style.display = "flex";
  document.getElementById("welcome-pane").style.display = "none";

  appState.ideas.forEach(idea => {
    const li = document.createElement("li");
    li.className = `ideas-list-item ${idea.id === appState.activeIdeaId ? 'active' : ''}`;
    li.onclick = () => selectIdea(idea.id);

    li.innerHTML = `
      <div class="idea-details">
        <span class="idea-title">${idea.name || 'Untitled Idea'}</span>
        <span class="idea-desc">${idea.category || 'General SaaS'}</span>
      </div>
      <button class="btn-idea-del" onclick="deleteIdea(event, '${idea.id}')" title="Delete Idea">
        <i data-lucide="trash-2"></i>
      </button>
    `;
    container.appendChild(li);
  });

  lucide.createIcons();
}

function selectIdea(id) {
  if (!id) return;
  appState.activeIdeaId = id;
  const idea = appState.ideas.find(i => i.id === id);
  if (!idea) return;

  // Render sidebar active states
  document.querySelectorAll(".ideas-list-item").forEach(item => item.classList.remove("active"));
  renderSidebar();

  // Header updates
  document.getElementById("current-idea-title").textContent = idea.name;
  document.getElementById("current-idea-category").textContent = idea.category;

  // Populating Form values
  // Tab 1: Profile & Strategy
  document.getElementById("idea-name").value = idea.name || "";
  document.getElementById("idea-category").value = idea.category || "SaaS / Software";
  document.getElementById("idea-innovation").value = idea.innovation || "Incremental Improvement";
  document.getElementById("target-audience").value = idea.targetAudience || "";
  document.getElementById("problem-statement").value = idea.problemStatement || "";
  document.getElementById("solution-desc").value = idea.solutionDesc || "";
  document.getElementById("value-prop").value = idea.valueProp || "";

  // Tab 2: Market Evaluation
  document.getElementById("market-tam").value = idea.marketTam || 50000000;
  document.getElementById("market-sam").value = idea.marketSam || 10000000;
  document.getElementById("market-som").value = idea.marketSom || 1000000;
  
  document.getElementById("lbl-tam").textContent = Number(idea.marketTam || 50000000).toLocaleString();
  document.getElementById("lbl-sam").textContent = Number(idea.marketSam || 10000000).toLocaleString();
  document.getElementById("lbl-som").textContent = Number(idea.marketSom || 1000000).toLocaleString();

  document.getElementById("competitor-level").value = idea.competitorLevel || "Moderate (Clear niches, established players)";
  document.getElementById("barrier-to-entry").value = idea.barrierToEntry || "Medium (Moderate setup / tech required)";
  
  // Checkboxes
  document.querySelectorAll(".defensibility-chk").forEach(chk => {
    chk.checked = idea.defensibility ? idea.defensibility.includes(chk.value) : false;
  });

  // Tab 3: Business Model
  document.getElementById("rev-model").value = idea.revModel || "Subscription / SaaS";
  document.getElementById("pricing-tier").value = idea.pricingTier || "Mid Ticket ($11 - $99 / month)";
  document.getElementById("gross-margin").value = idea.grossMargin || "High (80%+ e.g. Software/SaaS)";
  
  document.getElementById("scalability-level").value = idea.scalabilityLevel || 5;
  document.getElementById("lbl-scalability").textContent = idea.scalabilityLevel || 5;
  
  document.getElementById("capital-req").value = idea.capitalReq || "Medium (Needs core developer hire / key API licenses)";
  document.getElementById("funding-strategy").value = idea.fundingStrategy || "Organic Bootstrapping";

  // Tab 4: Checklists
  document.querySelectorAll(".validation-checklist-item").forEach(chk => {
    const key = chk.value;
    chk.checked = idea.checklist ? idea.checklist.includes(key) : false;
  });

  // Close mobile sidebar if open
  document.getElementById("app-sidebar").classList.remove("active");

  // Re-calculate math and draw charts
  calculateViabilityScores();
}

function createNewIdea() {
  const newIdea = {
    id: "idea-" + Date.now(),
    name: "New Startup Idea",
    category: "SaaS / Software",
    innovation: "Incremental Improvement",
    targetAudience: "",
    problemStatement: "",
    solutionDesc: "",
    valueProp: "",
    marketTam: 50000000,
    marketSam: 10000000,
    marketSom: 1000000,
    competitorLevel: "Moderate (Clear niches, established players)",
    barrierToEntry: "Medium (Moderate setup / tech required)",
    defensibility: [],
    revModel: "Subscription / SaaS",
    pricingTier: "Mid Ticket ($11 - $99 / month)",
    grossMargin: "High (80%+ e.g. Software/SaaS)",
    scalabilityLevel: 5,
    capitalReq: "Medium (Needs core developer hire / key API licenses)",
    fundingStrategy: "Organic Bootstrapping",
    checklist: []
  };

  appState.ideas.push(newIdea);
  appState.activeIdeaId = newIdea.id;
  
  saveAppData();
  renderSidebar();
  selectIdea(newIdea.id);
  
  // Auto route to Profile & Strategy tab
  const strategyTab = document.querySelector(".tab-btn[data-tab='strategy']");
  if (strategyTab) strategyTab.click();
}

function deleteIdea(e, id) {
  e.stopPropagation();
  if (confirm("Are you sure you want to permanently delete this startup idea evaluation?")) {
    appState.ideas = appState.ideas.filter(i => i.id !== id);
    if (appState.activeIdeaId === id) {
      appState.activeIdeaId = appState.ideas.length > 0 ? appState.ideas[0].id : null;
    }
    
    saveAppData();
    renderSidebar();
    if (appState.activeIdeaId) {
      selectIdea(appState.activeIdeaId);
    }
  }
}

// ==========================================================================
// Form / Strategy Save Logic
// ==========================================================================
function saveStrategyData() {
  const idea = appState.ideas.find(i => i.id === appState.activeIdeaId);
  if (!idea) return;

  idea.name = document.getElementById("idea-name").value.trim();
  idea.category = document.getElementById("idea-category").value;
  idea.innovation = document.getElementById("idea-innovation").value;
  idea.targetAudience = document.getElementById("target-audience").value.trim();
  idea.problemStatement = document.getElementById("problem-statement").value.trim();
  idea.solutionDesc = document.getElementById("solution-desc").value.trim();
  idea.valueProp = document.getElementById("value-prop").value.trim();

  saveAppData();
  renderSidebar();
  document.getElementById("current-idea-title").textContent = idea.name;
  document.getElementById("current-idea-category").textContent = idea.category;
  
  calculateViabilityScores();
  alert("Strategy profile saved successfully!");
}

function saveMarketData() {
  const idea = appState.ideas.find(i => i.id === appState.activeIdeaId);
  if (!idea) return;

  idea.marketTam = parseInt(document.getElementById("market-tam").value);
  idea.marketSam = parseInt(document.getElementById("market-sam").value);
  idea.marketSom = parseInt(document.getElementById("market-som").value);
  
  idea.competitorLevel = document.getElementById("competitor-level").value;
  idea.barrierToEntry = document.getElementById("barrier-to-entry").value;
  
  // Defensibility Checklist
  const defs = [];
  document.querySelectorAll(".defensibility-chk:checked").forEach(chk => {
    defs.push(chk.value);
  });
  idea.defensibility = defs;

  saveAppData();
  calculateViabilityScores();
  alert("Market analysis saved successfully!");
}

function saveBusinessData() {
  const idea = appState.ideas.find(i => i.id === appState.activeIdeaId);
  if (!idea) return;

  idea.revModel = document.getElementById("rev-model").value;
  idea.pricingTier = document.getElementById("pricing-tier").value;
  idea.grossMargin = document.getElementById("gross-margin").value;
  idea.scalabilityLevel = parseInt(document.getElementById("scalability-level").value);
  idea.capitalReq = document.getElementById("capital-req").value;
  idea.fundingStrategy = document.getElementById("funding-strategy").value;

  saveAppData();
  calculateViabilityScores();
  alert("Business model data saved successfully!");
}

function saveChecklistsData() {
  const idea = appState.ideas.find(i => i.id === appState.activeIdeaId);
  if (!idea) return;

  const checkedItems = [];
  document.querySelectorAll(".validation-checklist-item:checked").forEach(chk => {
    checkedItems.push(chk.value);
  });
  idea.checklist = checkedItems;

  saveAppData();
  calculateViabilityScores();
}

// ==========================================================================
// Scoring System math logic
// ==========================================================================
function calculateViabilityScores() {
  const idea = appState.ideas.find(i => i.id === appState.activeIdeaId);
  if (!idea) return;

  // 1. Innovation Score Math (Max 100)
  let innovationScore = 50;
  if (idea.innovation === "Incremental Improvement") innovationScore = 60;
  if (idea.innovation === "New Technology Application") innovationScore = 80;
  if (idea.innovation === "Disruptive Innovation") innovationScore = 100;
  
  // Length validations bonus
  let bonus = 0;
  if (idea.problemStatement && idea.problemStatement.length > 50) bonus += 5;
  if (idea.solutionDesc && idea.solutionDesc.length > 50) bonus += 5;
  if (idea.valueProp && idea.valueProp.length > 30) bonus += 5;
  if (idea.targetAudience && idea.targetAudience.length > 30) bonus += 5;
  
  innovationScore = Math.min(100, innovationScore + bonus);

  // 2. Market Demand Score (Max 100)
  let marketScore = 0;
  // TAM sizing
  if (idea.marketTam >= 500000000) marketScore += 30;
  else if (idea.marketTam >= 100000000) marketScore += 25;
  else if (idea.marketTam >= 10000000) marketScore += 20;
  else marketScore += 10;
  
  // Competition
  if (idea.competitorLevel.includes("Low")) marketScore += 25;
  else if (idea.competitorLevel.includes("Moderate")) marketScore += 18;
  else marketScore += 8;

  // Barriers to Entry
  if (idea.barrierToEntry.includes("High")) marketScore += 25;
  else if (idea.barrierToEntry.includes("Medium")) marketScore += 18;
  else marketScore += 8;

  // Defensibility checks
  const defCount = idea.defensibility ? idea.defensibility.length : 0;
  marketScore += (defCount * 5); // Max 20 points
  
  marketScore = Math.min(100, marketScore);

  // 3. Feasibility Score (Max 100)
  let feasibilityScore = 0;
  // Scalability Index
  const scaleIdx = idea.scalabilityLevel || 5;
  feasibilityScore += (scaleIdx * 4); // Max 40 points

  // Capital Requirements
  if (idea.capitalReq.includes("Low")) feasibilityScore += 30;
  else if (idea.capitalReq.includes("Medium")) feasibilityScore += 20;
  else feasibilityScore += 10;

  // Gross Margin
  if (idea.grossMargin.includes("High")) feasibilityScore += 30;
  else if (idea.grossMargin.includes("Medium")) feasibilityScore += 20;
  else feasibilityScore += 10;

  feasibilityScore = Math.min(100, feasibilityScore);

  // 4. Risk / Validation checklists completion Rate (Max 100)
  const checklistChecked = idea.checklist ? idea.checklist.length : 0;
  const riskMitigationScore = Math.round((checklistChecked / 12) * 100);

  // 5. Overall Viability Index (Average)
  const viabilityIndex = Math.round((innovationScore + marketScore + feasibilityScore + riskMitigationScore) / 4);

  // Update UI Elements
  document.getElementById("score-viability").textContent = viabilityIndex;
  document.getElementById("viability-progress-bar").style.width = viabilityIndex + "%";

  document.getElementById("score-innovation").textContent = innovationScore;
  document.getElementById("score-market").textContent = marketScore;
  document.getElementById("score-feasibility").textContent = feasibilityScore;
  document.getElementById("score-risk").textContent = riskMitigationScore;

  // Abstract update
  const probField = document.getElementById("abstract-problem");
  probField.textContent = idea.problemStatement || "No problem defined yet. Go to Profile & Strategy.";
  probField.className = idea.problemStatement ? "" : "abstract-placeholder";

  const solField = document.getElementById("abstract-solution");
  solField.textContent = idea.solutionDesc || "No solution defined yet. Go to Profile & Strategy.";
  solField.className = idea.solutionDesc ? "" : "abstract-placeholder";

  const valField = document.getElementById("abstract-value-prop");
  valField.textContent = idea.valueProp || "No value proposition defined yet. Go to Profile & Strategy.";
  valField.className = idea.valueProp ? "" : "abstract-placeholder";

  // Tier Badge update
  const badge = document.getElementById("validation-tier-badge");
  badge.className = "badge";
  if (viabilityIndex < 40) {
    badge.textContent = "Unviable Idea";
    badge.classList.add("unviable");
  } else if (viabilityIndex < 60) {
    badge.textContent = "Draft Stage";
  } else if (viabilityIndex < 80) {
    badge.textContent = "Promising Strategy";
    badge.classList.add("promising");
  } else {
    badge.textContent = "Validated Venture";
    badge.classList.add("validated");
  }

  // Draw or update visual charts
  drawCharts(idea, innovationScore, marketScore, feasibilityScore, riskMitigationScore, viabilityIndex);
}

// ==========================================================================
// Chart.js Visual Rendering Functions
// ==========================================================================
function drawCharts(idea, innovation, market, feasibility, risk, viability) {
  // Theme state colors (strict light theme scheme)
  const tickColor = "#4f46e5";
  const gridColor = "rgba(79, 70, 229, 0.1)";

  // 1. Radar Dimensions Chart
  const radarCtx = document.getElementById("dimensionRadarChart").getContext("2d");
  if (radarChartInstance) {
    radarChartInstance.destroy();
  }

  radarChartInstance = new Chart(radarCtx, {
    type: "radar",
    data: {
      labels: ["Innovation", "Market Fit", "Feasibility", "Risk Mitigation", "Avg Viability"],
      datasets: [{
        label: idea.name,
        data: [innovation, market, feasibility, risk, viability],
        backgroundColor: "rgba(99, 102, 241, 0.2)",
        borderColor: "#6366f1",
        pointBackgroundColor: "#14b8a6",
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        r: {
          grid: { color: gridColor },
          angleLines: { color: gridColor },
          pointLabels: { color: tickColor, font: { family: "Outfit", size: 10 } },
          ticks: { display: false },
          min: 0,
          max: 100
        }
      }
    }
  });

  // 2. TAM SAM SOM Estimation Funnel Chart (Horizontal Bar representation)
  const barCtx = document.getElementById("marketFunnelChart").getContext("2d");
  if (barChartInstance) {
    barChartInstance.destroy();
  }

  barChartInstance = new Chart(barCtx, {
    type: "bar",
    data: {
      labels: ["TAM", "SAM", "SOM"],
      datasets: [{
        data: [idea.marketTam, idea.marketSam, idea.marketSom],
        backgroundColor: ["#6366f1", "#14b8a6", "#f59e0b"],
        borderRadius: 6
      }]
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          grid: { color: "rgba(79, 70, 229, 0.05)" },
          ticks: {
            color: tickColor,
            font: { family: "Outfit", size: 9 },
            callback: function(value) {
              if (value >= 1e6) return '$' + (value / 1e6) + 'M';
              if (value >= 1e3) return '$' + (value / 1e3) + 'K';
              return '$' + value;
            }
          }
        },
        y: {
          grid: { display: false },
          ticks: { color: tickColor, font: { family: "Outfit", weight: "bold" } }
        }
      }
    }
  });
}

// ==========================================================================
// Backup export / reset
// ==========================================================================
function exportDataJSON() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appState, null, 2));
  const dlAnchor = document.createElement("a");
  dlAnchor.setAttribute("href", dataStr);
  dlAnchor.setAttribute("download", `venturevalidate_ideas_backup.json`);
  dlAnchor.click();
}

function resetAllData() {
  if (confirm("Are you sure you want to restore original default startup ideas? This will wipe your current database edits.")) {
    appState = {
      ideas: [...mockIdeas],
      activeIdeaId: "idea-1"
    };
    saveAppData();
    renderSidebar();
    selectIdea(appState.activeIdeaId);
    alert("VentureValidate reset to mock templates.");
  }
}
