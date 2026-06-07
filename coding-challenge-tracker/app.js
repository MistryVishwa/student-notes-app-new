// ==========================================================================
// Pre-populated Mock Coding Challenge Logs
// ==========================================================================
const mockChallenges = [
  {
    id: "challenge-1",
    title: "Reverse Linked List II",
    platform: "LeetCode",
    difficulty: "Medium",
    language: "C++",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // Yesterday
    link: "https://leetcode.com/problems/reverse-linked-list-ii/",
    tags: "Linked List, Two Pointers",
    code: "ListNode* reverseBetween(ListNode* head, int left, int right) {\n    if (!head || left == right) return head;\n    ListNode dummy(0);\n    dummy.next = head;\n    ListNode* prev = &dummy;\n    for (int i = 0; i < left - 1; ++i) prev = prev->next;\n    ListNode* start = prev->next;\n    ListNode* then = start->next;\n    for (int i = 0; i < right - left; ++i) {\n        start->next = then->next;\n        then->next = prev->next;\n        prev->next = then;\n        then = start->next;\n    }\n    return dummy.next;\n}",
    notes: "Utilized standard dummy node pattern to avoid edge cases near the head. O(N) time complexity, O(1) space complexity."
  },
  {
    id: "challenge-2",
    title: "Merge k Sorted Lists",
    platform: "LeetCode",
    difficulty: "Hard",
    language: "Java",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 2 Days Ago
    link: "https://leetcode.com/problems/merge-k-sorted-lists/",
    tags: "Linked List, Divide and Conquer, Heap",
    code: "public ListNode mergeKLists(ListNode[] lists) {\n    if (lists == null || lists.length == 0) return null;\n    PriorityQueue<ListNode> queue = new PriorityQueue<>((a, b) -> a.val - b.val);\n    for (ListNode node : lists) {\n        if (node != null) queue.add(node);\n    }\n    ListNode dummy = new ListNode(0);\n    ListNode tail = dummy;\n    while (!queue.isEmpty()) {\n        tail.next = queue.poll();\n        tail = tail.next;\n        if (tail.next != null) queue.add(tail.next);\n    }\n    return dummy.next;\n}",
    notes: "Used a min-priority queue of size k to merge sorted elements incrementally. Time complexity: O(N log k) where N is total nodes."
  },
  {
    id: "challenge-3",
    title: "Two Sum",
    platform: "LeetCode",
    difficulty: "Easy",
    language: "JavaScript",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 3 Days Ago
    link: "https://leetcode.com/problems/two-sum/",
    tags: "Array, Hash Table",
    code: "const twoSum = (nums, target) => {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) {\n            return [map.get(complement), i];\n        }\n        map.set(nums[i], i);\n    }\n    return [];\n};",
    notes: "O(N) time using single-pass hash map to lookup dynamic values."
  },
  {
    id: "challenge-4",
    title: "Fibonacci Numbers - DP",
    platform: "GeeksforGeeks",
    difficulty: "Easy",
    language: "Python",
    date: new Date().toISOString().split("T")[0], // Today
    link: "https://www.geeksforgeeks.org/program-for-nth-fibonacci-number/",
    tags: "Dynamic Programming, Math",
    code: "def fib(n):\n    if n <= 1:\n        return n\n    dp = [0] * (n + 1)\n    dp[1] = 1\n    for i in range(2, n + 1):\n        dp[i] = dp[i-1] + dp[i-2]\n    return dp[n]",
    notes: "Simple tabulating dynamic programming approach. O(N) time and O(N) space. Can be optimized further to O(1) space."
  }
];

const defaultProfile = {
  name: "Vishwa Mistry",
  bio: "Problem Solver & Algorithmic Thinker",
  avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=devgrit"
};

let appState = {
  profile: { ...defaultProfile },
  logs: [...mockChallenges],
  dailyTarget: 3,
  streak: 4,
  lastSolvedDate: new Date().toISOString().split("T")[0] // today
};

// Global Chart References
let activeChartType = "difficulty"; // difficulty, tags, timeline
let chartInstance = null;

// ==========================================================================
// Initialization & Startup Handlers
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  loadAppData();
  bindEventHandlers();
  
  // Render views
  renderProfile();
  renderDailyTargetRing();
  renderSummaryStats();
  renderChallengeLogs();
  initAnalyticsChart();

  lucide.createIcons();
});

function loadAppData() {
  const saved = localStorage.getItem("devgrit_state_v1");
  if (saved) {
    try {
      appState = JSON.parse(saved);
    } catch (e) {
      console.error("Error loading DevGrit app state.", e);
    }
  }

  const savedTheme = localStorage.getItem("devgrit_theme_v1");
  if (savedTheme) {
    document.body.className = savedTheme;
  }
}

function saveAppData() {
  localStorage.setItem("devgrit_state_v1", JSON.stringify(appState));
}

function bindEventHandlers() {
  // Theme Toggle switcher
  document.getElementById("theme-toggle").addEventListener("click", () => {
    const isDark = document.body.classList.contains("dark-theme");
    const newTheme = isDark ? "light-theme" : "dark-theme";
    document.body.className = newTheme;
    localStorage.setItem("devgrit_theme_v1", newTheme);
    drawCharts();
  });

  // Mobile sidebar menu toggles
  document.getElementById("sidebar-toggle-open").addEventListener("click", () => {
    document.getElementById("app-sidebar").classList.add("active");
  });
  document.getElementById("sidebar-toggle-close").addEventListener("click", () => {
    document.getElementById("app-sidebar").classList.remove("active");
  });

  // Profile modal triggers
  document.getElementById("edit-profile-btn").addEventListener("click", openProfileModal);
  document.getElementById("profile-modal-close").addEventListener("click", closeProfileModal);
  document.getElementById("profile-modal-cancel").addEventListener("click", closeProfileModal);
  document.getElementById("profile-form").addEventListener("submit", handleProfileSave);

  // Daily target editor widgets
  document.getElementById("edit-target-btn").addEventListener("click", () => {
    document.getElementById("daily-target-input").value = appState.dailyTarget;
    document.getElementById("inline-target-form").style.display = "flex";
  });
  document.getElementById("save-target-btn").addEventListener("click", () => {
    const targetVal = parseInt(document.getElementById("daily-target-input").value);
    if (targetVal > 0) {
      appState.dailyTarget = targetVal;
      saveAppData();
      renderDailyTargetRing();
    }
    document.getElementById("inline-target-form").style.display = "none";
  });

  // Challenge log modal controls
  document.getElementById("add-challenge-btn").addEventListener("click", () => openChallengeModal());
  document.getElementById("modal-close-btn").addEventListener("click", closeChallengeModal);
  document.getElementById("modal-cancel-btn").addEventListener("click", closeChallengeModal);
  document.getElementById("challenge-form").addEventListener("submit", handleChallengeSubmit);

  // Search & Filter event binds
  document.getElementById("log-search").addEventListener("input", renderChallengeLogs);
  document.getElementById("filter-platform").addEventListener("change", renderChallengeLogs);
  document.getElementById("filter-difficulty").addEventListener("change", renderChallengeLogs);
  document.getElementById("filter-language").addEventListener("change", renderChallengeLogs);

  // Chart view switches
  document.getElementById("btn-chart-difficulty").addEventListener("click", () => switchChart("difficulty"));
  document.getElementById("btn-chart-tags").addEventListener("click", () => switchChart("tags"));
  document.getElementById("btn-chart-timeline").addEventListener("click", () => switchChart("timeline"));

  // Reset database actions
  document.getElementById("reset-btn").addEventListener("click", resetDatabase);

  // Backup file controls
  document.getElementById("export-btn").addEventListener("click", exportDatabaseJSON);
  const importBtn = document.getElementById("import-btn");
  const importFile = document.getElementById("import-file");
  importBtn.addEventListener("click", () => importFile.click());
  importFile.addEventListener("change", importDatabaseJSON);
}

// ==========================================================================
// Profile Management
// ==========================================================================
function renderProfile() {
  document.getElementById("profile-name").textContent = appState.profile.name || "Developer";
  document.getElementById("profile-bio").textContent = appState.profile.bio || "Bio description...";
  document.getElementById("profile-avatar").src = appState.profile.avatar || "https://api.dicebear.com/7.x/bottts/svg?seed=devgrit";
  updateStreakDisplay();
}

function openProfileModal() {
  document.getElementById("form-profile-name").value = appState.profile.name || "";
  document.getElementById("form-profile-bio").value = appState.profile.bio || "";
  document.getElementById("form-profile-avatar").value = appState.profile.avatar || "";
  document.getElementById("profile-modal").style.display = "flex";
}

function closeProfileModal() {
  document.getElementById("profile-modal").style.display = "none";
}

function handleProfileSave(e) {
  e.preventDefault();
  appState.profile.name = document.getElementById("form-profile-name").value.trim();
  appState.profile.bio = document.getElementById("form-profile-bio").value.trim();
  appState.profile.avatar = document.getElementById("form-profile-avatar").value.trim();
  
  saveAppData();
  renderProfile();
  closeProfileModal();
}

function updateStreakDisplay() {
  document.getElementById("streak-counter").textContent = `${appState.streak} Day${appState.streak === 1 ? '' : 's'}`;
}

// ==========================================================================
// Daily Targets SVG progress circle
// ==========================================================================
function renderDailyTargetRing() {
  const todayStr = new Date().toISOString().split("T")[0];
  const todaySolved = appState.logs.filter(c => c.date === todayStr).length;
  const target = appState.dailyTarget;

  document.getElementById("daily-solved-count").textContent = todaySolved;
  document.getElementById("daily-target-count").textContent = target;

  // Calculate percentage & update circle dashoffset
  const percent = Math.min(100, Math.round((todaySolved / target) * 100));
  const circle = document.getElementById("daily-progress-ring");
  const radius = circle.r.baseVal.value;
  const circumference = radius * 2 * Math.PI;

  circle.style.strokeDasharray = `${circumference} ${circumference}`;
  const offset = circumference - (percent / 100) * circumference;
  circle.style.strokeDashoffset = offset;

  // Label updates
  const label = document.getElementById("daily-target-status");
  if (percent >= 100) {
    label.textContent = "Daily Target Cleared! 🎉";
    label.style.color = "var(--clr-easy)";
  } else {
    label.textContent = `Need ${target - todaySolved} more to clear target!`;
    label.style.color = "var(--text-muted)";
  }
}

// ==========================================================================
// Stats and Achievements Trophies Calculations
// ==========================================================================
function renderSummaryStats() {
  const total = appState.logs.length;
  const easy = appState.logs.filter(c => c.difficulty === "Easy").length;
  const medium = appState.logs.filter(c => c.difficulty === "Medium").length;
  const hard = appState.logs.filter(c => c.difficulty === "Hard").length;

  document.getElementById("stat-total").textContent = total;
  document.getElementById("stat-easy").textContent = easy;
  document.getElementById("stat-medium").textContent = medium;
  document.getElementById("stat-hard").textContent = hard;

  // Progress Bar Width mappings
  const easyPctVal = total === 0 ? 0 : Math.round((easy / total) * 100);
  const medPctVal = total === 0 ? 0 : Math.round((medium / total) * 100);
  const hardPctVal = total === 0 ? 0 : Math.round((hard / total) * 100);

  document.getElementById("easy-progress-bar").style.width = `${easyPctVal}%`;
  document.getElementById("medium-progress-bar").style.width = `${medPctVal}%`;
  document.getElementById("hard-progress-bar").style.width = `${hardPctVal}%`;

  document.getElementById("easy-pct").textContent = `${easyPctVal}% of total solved`;
  document.getElementById("medium-pct").textContent = `${medPctVal}% of total solved`;
  document.getElementById("hard-pct").textContent = `${hardPctVal}% of total solved`;

  // Weekly solving volume average
  const today = new Date();
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
  const weeklyCount = appState.logs.filter(c => new Date(c.date) >= startOfWeek).length;
  document.getElementById("weekly-solved-count-label").textContent = `${weeklyCount} solved this week`;

  // Render achievement cards
  renderAchievements();
}

const achievementDefinitions = [
  { id: "ac-1", title: "First Step", desc: "Solve your first coding challenge.", icon: "code-2", check: (state) => state.logs.length >= 1 },
  { id: "ac-medium-5", title: "Medium Explorer", desc: "Solve 5 medium difficulties.", icon: "zap", check: (state) => state.logs.filter(c => c.difficulty === "Medium").length >= 5 },
  { id: "ac-hard-1", title: "Hard Core Solver", desc: "Conquer a hard coding challenge.", icon: "flame", check: (state) => state.logs.filter(c => c.difficulty === "Hard").length >= 1 },
  { id: "ac-poly", title: "Polyglot coder", desc: "Solve using 3 different languages.", icon: "globe", check: (state) => {
      const langs = new Set(state.logs.map(c => c.language).filter(l => l));
      return langs.size >= 3;
    } 
  },
  { id: "ac-streak-3", title: "Streak Master", desc: "Keep a solving streak of 3+ days.", icon: "award", check: (state) => state.streak >= 3 },
  { id: "ac-total-10", title: "Algorithm Titan", desc: "Conquer 10 total problems.", icon: "terminal", check: (state) => state.logs.length >= 10 }
];

function renderAchievements() {
  const container = document.getElementById("badges-grid-container");
  container.innerHTML = "";

  achievementDefinitions.forEach(badge => {
    const isUnlocked = badge.check(appState);
    const card = document.createElement("div");
    card.className = `badge-card ${isUnlocked ? 'unlocked' : ''}`;

    card.innerHTML = `
      <div class="badge-icon">
        <i data-lucide="${badge.icon}"></i>
      </div>
      <h4>${badge.title}</h4>
      <p>${badge.desc}</p>
    `;
    container.appendChild(card);
  });

  lucide.createIcons();
}

// ==========================================================================
// Modals and Logging Form Submission Actions
// ==========================================================================
function openChallengeModal(id = null) {
  const form = document.getElementById("challenge-form");
  const modalTitle = document.getElementById("modal-title");
  form.reset();

  // Load date as today
  document.getElementById("form-date").value = new Date().toISOString().split("T")[0];

  if (id) {
    const log = appState.logs.find(c => c.id === id);
    if (log) {
      modalTitle.textContent = "Edit Challenge Log";
      document.getElementById("edit-challenge-id").value = log.id;
      document.getElementById("form-title").value = log.title;
      document.getElementById("form-platform").value = log.platform;
      document.getElementById("form-difficulty").value = log.difficulty;
      document.getElementById("form-language").value = log.language || "";
      document.getElementById("form-date").value = log.date;
      document.getElementById("form-link").value = log.link || "";
      document.getElementById("form-tags").value = log.tags || "";
      document.getElementById("form-code").value = log.code || "";
      document.getElementById("form-notes").value = log.notes || "";
    }
  } else {
    modalTitle.textContent = "Log Coding Challenge";
    document.getElementById("edit-challenge-id").value = "";
  }

  document.getElementById("challenge-modal").style.display = "flex";
}

function closeChallengeModal() {
  document.getElementById("challenge-modal").style.display = "none";
}

function handleChallengeSubmit(e) {
  e.preventDefault();

  const editId = document.getElementById("edit-challenge-id").value;
  const title = document.getElementById("form-title").value.trim();
  const platform = document.getElementById("form-platform").value;
  const difficulty = document.getElementById("form-difficulty").value;
  const language = document.getElementById("form-language").value.trim() || "N/A";
  const date = document.getElementById("form-date").value;
  const link = document.getElementById("form-link").value.trim();
  const tags = document.getElementById("form-tags").value.trim();
  const code = document.getElementById("form-code").value;
  const notes = document.getElementById("form-notes").value.trim();

  if (editId) {
    const log = appState.logs.find(c => c.id === editId);
    if (log) {
      log.title = title;
      log.platform = platform;
      log.difficulty = difficulty;
      log.language = language;
      log.date = date;
      log.link = link;
      log.tags = tags;
      log.code = code;
      log.notes = notes;
    }
  } else {
    const newChallenge = {
      id: "challenge-" + Date.now(),
      title, platform, difficulty, language, date, link, tags, code, notes
    };
    appState.logs.unshift(newChallenge);

    // Dynamic Streaks logic
    calculateStreaks(date);
  }

  saveAppData();
  closeChallengeModal();
  renderChallengeLogs();
  renderDailyTargetRing();
  renderSummaryStats();
  updateCharts();
}

function calculateStreaks(solvedDate) {
  const todayStr = new Date().toISOString().split("T")[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  if (solvedDate === todayStr) {
    if (appState.lastSolvedDate === yesterdayStr) {
      appState.streak++;
    } else if (appState.lastSolvedDate !== todayStr) {
      appState.streak = 1;
    }
    appState.lastSolvedDate = todayStr;
  }
}

function deleteChallenge(id) {
  if (confirm("Are you sure you want to delete this challenge log?")) {
    appState.logs = appState.logs.filter(c => c.id !== id);
    saveAppData();
    renderChallengeLogs();
    renderDailyTargetRing();
    renderSummaryStats();
    updateCharts();
  }
}

// ==========================================================================
// Log render lists with filters
// ==========================================================================
function renderChallengeLogs() {
  const container = document.getElementById("logs-list-container");
  container.innerHTML = "";

  const searchQuery = document.getElementById("log-search").value.toLowerCase();
  const platformFilter = document.getElementById("filter-platform").value;
  const diffFilter = document.getElementById("filter-difficulty").value;
  const langFilter = document.getElementById("filter-language").value;

  // Compile available languages dynamically for dropdown
  const languagesList = new Set();
  appState.logs.forEach(c => {
    if (c.language) languagesList.add(c.language);
  });

  const langSelect = document.getElementById("filter-language");
  const selectedLang = langSelect.value;
  langSelect.innerHTML = `<option value="all">All Languages</option>`;
  languagesList.forEach(lang => {
    langSelect.innerHTML += `<option value="${lang}">${lang}</option>`;
  });
  langSelect.value = selectedLang;

  // Filter processes
  const filtered = appState.logs.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery) ||
                          (c.notes && c.notes.toLowerCase().includes(searchQuery)) ||
                          (c.tags && c.tags.toLowerCase().includes(searchQuery));
    const matchesPlatform = platformFilter === "all" || c.platform === platformFilter;
    const matchesDiff = diffFilter === "all" || c.difficulty === diffFilter;
    const matchesLang = langFilter === "all" || c.language === langFilter;

    return matchesSearch && matchesPlatform && matchesDiff && matchesLang;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div class="empty-state-p">No challenges found matching filters. Let's solve some!</div>`;
    return;
  }

  filtered.forEach(c => {
    const card = document.createElement("div");
    card.className = `log-item-card ${c.difficulty.toLowerCase()}-card`;

    let diffIcon = "check-circle";
    if (c.difficulty === "Medium") diffIcon = "trending-up";
    else if (c.difficulty === "Hard") diffIcon = "zap";

    const descBlock = c.notes ? `<p class="log-desc">${c.notes}</p>` : "";
    
    // Code snippet layout
    let codeBlock = "";
    if (c.code) {
      // Escape HTML
      const escapedCode = c.code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      codeBlock = `
        <div class="log-code-snippet" style="display: none;" id="snippet-${c.id}">
          <pre><code>${escapedCode}</code></pre>
        </div>
      `;
    }

    // Dynamic tags row
    let tagsBlock = "";
    if (c.tags) {
      tagsBlock = c.tags.split(",").map(t => `<span class="log-meta-tag badge-tag">${t.trim()}</span>`).join("");
    }

    const titleAnchor = c.link ? `<a href="${c.link}" target="_blank">${c.title} <i data-lucide="external-link" style="width:12px;height:12px;display:inline-block;vertical-align:middle;margin-left:2px;"></i></a>` : c.title;

    card.innerHTML = `
      <div class="log-difficulty-indicator">
        <i data-lucide="${diffIcon}"></i>
      </div>
      <div class="log-content-box">
        <div class="log-title-row">
          <h4>${titleAnchor}</h4>
        </div>
        ${descBlock}
        <div class="log-meta-row">
          <span class="log-meta-tag badge-platform">${c.platform}</span>
          <span class="log-meta-tag"><i data-lucide="calendar"></i> ${c.date}</span>
          <span class="log-meta-tag"><i data-lucide="code-2"></i> ${c.language}</span>
          ${tagsBlock}
        </div>
        ${codeBlock}
      </div>
      <div class="log-actions-box">
        ${c.code ? `<button class="btn btn-secondary btn-action-log" onclick="toggleSnippet('${c.id}')" title="Toggle Code Snippet"><i data-lucide="terminal" style="width:12px;height:12px;"></i></button>` : ""}
        <button class="btn btn-secondary btn-action-log" onclick="openChallengeModal('${c.id}')" title="Edit Log"><i data-lucide="edit-3" style="width:12px;height:12px;"></i></button>
        <button class="btn btn-secondary btn-action-log" onclick="deleteChallenge('${c.id}')" title="Delete Log"><i data-lucide="trash-2" style="width:12px;height:12px;"></i></button>
      </div>
    `;

    container.appendChild(card);
  });

  lucide.createIcons();
}

window.toggleSnippet = function(id) {
  const el = document.getElementById(`snippet-${id}`);
  el.style.display = el.style.display === "none" ? "block" : "none";
};

// ==========================================================================
// Chart.js Visual Rendering
// ==========================================================================
function initAnalyticsChart() {
  drawCharts();
}

function switchChart(type) {
  activeChartType = type;
  document.getElementById("btn-chart-difficulty").classList.remove("active");
  document.getElementById("btn-chart-tags").classList.remove("active");
  document.getElementById("btn-chart-timeline").classList.remove("active");

  document.getElementById(`btn-chart-${type}`).classList.add("active");
  drawCharts();
}

function updateCharts() {
  drawCharts();
}

function drawCharts() {
  const canvas = document.getElementById("analyticsChart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  if (chartInstance) {
    chartInstance.destroy();
  }

  const isLight = document.body.classList.contains("light-theme");
  const labelColor = isLight ? "#57606a" : "#8b949e";
  const gridColor = isLight ? "rgba(9, 105, 218, 0.08)" : "rgba(88, 166, 255, 0.08)";

  if (activeChartType === "difficulty") {
    // Difficulty breakdown doughnut chart
    const easy = appState.logs.filter(c => c.difficulty === "Easy").length;
    const medium = appState.logs.filter(c => c.difficulty === "Medium").length;
    const hard = appState.logs.filter(c => c.difficulty === "Hard").length;

    chartInstance = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Easy", "Medium", "Hard"],
        datasets: [{
          data: [easy, medium, hard],
          backgroundColor: ["#2ea44f", "#d29922", "#f85149"],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
            labels: { color: labelColor, font: { family: "Outfit" } }
          }
        }
      }
    });
  } else if (activeChartType === "tags") {
    // Topic tag bar chart
    const tagsCounts = {};
    appState.logs.forEach(c => {
      if (c.tags) {
        c.tags.split(",").forEach(tag => {
          const name = tag.trim();
          tagsCounts[name] = (tagsCounts[name] || 0) + 1;
        });
      }
    });

    const sortedTags = Object.keys(tagsCounts).sort((a,b) => tagsCounts[b] - tagsCounts[a]).slice(0, 6);
    const sortedVals = sortedTags.map(t => tagsCounts[t]);

    chartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels: sortedTags,
        datasets: [{
          data: sortedVals,
          backgroundColor: "rgba(88, 166, 255, 0.65)",
          borderColor: "#58a6ff",
          borderWidth: 1.5,
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { ticks: { color: labelColor }, grid: { display: false } },
          y: { ticks: { color: labelColor, stepSize: 1 }, grid: { color: gridColor } }
        }
      }
    });
  } else {
    // Volume timeline line graph
    const timeline = {};
    appState.logs.forEach(c => {
      if (c.date) {
        timeline[c.date] = (timeline[c.date] || 0) + 1;
      }
    });

    const sortedDates = Object.keys(timeline).sort();
    const sortedCounts = sortedDates.map(d => timeline[d]);

    chartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels: sortedDates.map(d => {
          const parts = d.split("-");
          return `${parts[1]}/${parts[2]}`; // MM/DD
        }),
        datasets: [{
          data: sortedCounts,
          borderColor: "#58a6ff",
          backgroundColor: "rgba(88, 166, 255, 0.1)",
          borderWidth: 2,
          tension: 0.3,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { ticks: { color: labelColor }, grid: { display: false } },
          y: { ticks: { color: labelColor, stepSize: 1 }, grid: { color: gridColor } }
        }
      }
    });
  }
}

// ==========================================================================
// Backup System and Data Sync Reset Operations
// ==========================================================================
function exportDatabaseJSON() {
  const data = JSON.stringify(appState, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(data);
  const exportFileDefaultName = 'devgrit_challenges_backup.json';
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}

function importDatabaseJSON(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const parsed = JSON.parse(e.target.result);
      if (parsed.profile && parsed.logs && Array.isArray(parsed.logs)) {
        appState = parsed;
        saveAppData();
        renderProfile();
        renderDailyTargetRing();
        renderSummaryStats();
        renderChallengeLogs();
        drawCharts();
        alert("JSON Backup loaded successfully!");
      } else {
        alert("Invalid backup configuration layout.");
      }
    } catch (err) {
      alert("Error parsing backup JSON file.");
    }
  };
  reader.readAsText(file);
}

function resetDatabase() {
  if (confirm("Restore default coding challenges and wipe current database edits?")) {
    appState = {
      profile: { ...defaultProfile },
      logs: [...mockChallenges],
      dailyTarget: 3,
      streak: 4,
      lastSolvedDate: new Date().toISOString().split("T")[0]
    };
    saveAppData();
    renderProfile();
    renderDailyTargetRing();
    renderSummaryStats();
    renderChallengeLogs();
    drawCharts();
    alert("Database successfully reset.");
  }
}
