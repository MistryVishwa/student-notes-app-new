/* ── DOM Refs ── */

const panel = document.getElementById('reactionPanel');
const panelText = document.getElementById('panelText');
const attemptDisplay = document.getElementById('attemptDisplay');
const avgDisplay = document.getElementById('avgDisplay');
const bestDisplay = document.getElementById('bestDisplay');
const historyList = document.getElementById('historyList');

/* ── State ── */

const STATE = { IDLE: 'idle', WAITING: 'waiting', READY: 'ready', TOO_EARLY: 'too-early', RESULT: 'result' };

let phase = STATE.IDLE;
let timeoutId = null;
let cueTime = 0;
let trials = [];
let bestMs = Infinity;
let totalAttempts = 0;
let fouls = 0;

/* ── Panel Helpers ── */

function setPanel(stateClass, text) {
  panel.className = stateClass;
  panelText.textContent = text;
}

/* ── Random Delay (2000-5000ms) ── */

function randomDelay() {
  return 2000 + Math.random() * 3000;
}

/* ── Start Wait ── */

function beginWait() {
  phase = STATE.WAITING;
  setPanel('state-waiting', 'Wait for Green...');

  timeoutId = setTimeout(() => {
    phase = STATE.READY;
    cueTime = performance.now();
    setPanel('state-ready', 'CLICK NOW!');
  }, randomDelay());
}

/* ── End Trial (premature) ── */

function foulClick() {
  clearTimeout(timeoutId);
  timeoutId = null;
  fouls++;
  totalAttempts++;
  phase = STATE.TOO_EARLY;
  setPanel('state-too-early', 'Too Early!');

  addHistoryEntry(null);

  setTimeout(() => returnToIdle(), 1500);
}

/* ── End Trial (valid) ── */

function validClick() {
  const reaction = performance.now() - cueTime;
  trials.push(reaction);
  totalAttempts++;

  const rounded = Math.round(reaction);

  if (reaction < bestMs) {
    bestMs = reaction;
    saveBest();
  }

  phase = STATE.RESULT;
  setPanel('state-result', `${rounded} ms`);

  addHistoryEntry(rounded);
  updateHUD();

  setTimeout(() => returnToIdle(), 2000);
}

/* ── Return to Idle ── */

function returnToIdle() {
  phase = STATE.IDLE;
  setPanel('state-idle', 'Click to Start');
}

/* ── Panel Click ── */

function handlePanelClick() {
  if (phase === STATE.IDLE) {
    beginWait();
    return;
  }

  if (phase === STATE.WAITING) {
    foulClick();
    return;
  }

  if (phase === STATE.READY) {
    validClick();
    return;
  }

  /* RESULT or TOO_EARLY — ignore clicks during feedback */
}

/* ── HUD ── */

function updateHUD() {
  attemptDisplay.textContent = String(totalAttempts);

  if (trials.length > 0) {
    const sum = trials.reduce((a, b) => a + b, 0);
    const avg = sum / trials.length;
    avgDisplay.textContent = `${Math.round(avg)} ms`;
  } else {
    avgDisplay.textContent = '\u2014';
  }

  bestDisplay.textContent = bestMs < Infinity ? `${Math.round(bestMs)} ms` : '\u2014';
}

/* ── History ── */

function addHistoryEntry(ms) {
  if (ms === null) {
    historyList.innerHTML = '';
    const all = getAllEntries();
    all.push({ ms: null, isFoul: true });
    renderHistory(all);
    return;
  }

  historyList.innerHTML = '';
  const all = getAllEntries();
  all.push({ ms, isFoul: false });
  renderHistory(all);
}

function getAllEntries() {
  const rows = [];
  const children = historyList.children;
  for (let i = 0; i < children.length; i++) {
    const row = children[i];
    if (row.classList.contains('history-empty')) continue;
    const ms = parseInt(row.dataset.ms, 10);
    const isFoul = row.dataset.foul === 'true';
    if (!isNaN(ms) || isFoul) {
      rows.push({ ms: isNaN(ms) ? null : ms, isFoul });
    }
  }
  return rows;
}

function renderHistory(entries) {
  if (entries.length === 0) {
    historyList.innerHTML = '<div class="history-empty">No trials yet</div>';
    return;
  }

  const last10 = entries.slice(-10);
  let html = '';
  last10.forEach((entry, i) => {
    const idx = entries.length - last10.length + i + 1;
    const isBest = !entry.isFoul && entry.ms !== null && entry.ms === Math.round(bestMs) && bestMs < Infinity;

    let badgeHtml = '';
    if (entry.isFoul) badgeHtml = '<span class="h-badge foul">FOUL</span>';
    else if (isBest && entry.ms !== null) badgeHtml = '<span class="h-badge best">BEST</span>';

    const timeStr = entry.isFoul ? '\u2014' : `${entry.ms} ms`;

    html += `<div class="history-row" data-ms="${entry.isFoul ? '' : entry.ms}" data-foul="${entry.isFoul}">
      <span class="h-idx">#${idx}</span>
      <span class="h-time">${timeStr}</span>
      ${badgeHtml}
    </div>`;
  });

  historyList.innerHTML = html;
}

/* ── localStorage ── */

function loadBest() {
  try {
    const saved = localStorage.getItem('reactionBest');
    if (saved !== null) {
      const parsed = parseFloat(saved);
      if (!isNaN(parsed) && parsed > 0) {
        bestMs = parsed;
      }
    }
  } catch (_) {}
}

function saveBest() {
  try {
    localStorage.setItem('reactionBest', String(bestMs));
  } catch (_) {}
}

/* ── Event Wiring ── */

panel.addEventListener('click', handlePanelClick);
panel.addEventListener('touchstart', (e) => {
  e.preventDefault();
  handlePanelClick();
}, { passive: false });

/* ── Boot ── */

loadBest();
updateHUD();
setPanel('state-idle', 'Click to Start');
