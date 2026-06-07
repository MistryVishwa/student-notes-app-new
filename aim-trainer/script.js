/* ── Constants ── */

const SESSION_SECONDS = 30;
const TARGET_LIFETIME = 2000;
const TARGET_SIZE = 44;
const PADDING = 28;

/* ── DOM Refs ── */

const arena = document.getElementById('arena');
const hitsDisplay = document.getElementById('hitsDisplay');
const accDisplay = document.getElementById('accDisplay');
const rtDisplay = document.getElementById('rtDisplay');
const bestDisplay = document.getElementById('bestDisplay');
const timerEl = document.getElementById('timerDisplay');
const startOverlay = document.getElementById('startOverlay');
const endOverlay = document.getElementById('endOverlay');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const rHits = document.getElementById('rHits');
const rAcc = document.getElementById('rAcc');
const rRT = document.getElementById('rRT');
const rMissed = document.getElementById('rMissed');

/* ── State ── */

let isRunning = false;
let hits = 0;
let missClicks = 0;
let missedTargets = 0;
let reactionTimes = [];
let bestHits = 0;
let timeLeft = SESSION_SECONDS;
let sessionTimer = null;
let activeTarget = null;
let targetTimer = null;

/* ── Spawn ── */

function spawnTarget() {
  if (!isRunning) return;

  const w = arena.clientWidth;
  const h = arena.clientHeight;
  if (w < TARGET_SIZE + PADDING * 2 || h < TARGET_SIZE + PADDING * 2) return;

  const x = PADDING + Math.random() * (w - 2 * PADDING - TARGET_SIZE);
  const y = PADDING + Math.random() * (h - 2 * PADDING - TARGET_SIZE);

  const target = document.createElement('div');
  target.className = 'target';
  target.style.left = x + 'px';
  target.style.top = y + 'px';
  target.dataset.spawnTime = String(performance.now());

  arena.appendChild(target);
  activeTarget = target;

  target.style.transform = 'translate(-50%, -50%) scale(0)';
  target.style.transition = 'transform 0.12s ease-out';
  requestAnimationFrame(() => {
    target.style.transform = 'translate(-50%, -50%) scale(1)';
  });

  target.addEventListener('click', (e) => {
    e.stopPropagation();
    onTargetHit(target);
  });

  target.addEventListener('touchstart', (e) => {
    e.preventDefault();
    e.stopPropagation();
    onTargetHit(target);
  }, { passive: false });

  targetTimer = setTimeout(() => {
    if (target.parentNode && !target.classList.contains('hit')) {
      missedTargets++;
      target.classList.add('missed');
      target.style.transition = 'transform 0.15s ease, opacity 0.15s ease';
      target.style.transform = 'translate(-50%, -50%) scale(0)';
      target.style.opacity = '0';
      setTimeout(() => {
        if (target.parentNode) target.remove();
        activeTarget = null;
        spawnNext();
      }, 150);
    }
  }, TARGET_LIFETIME);
}

function spawnNext() {
  if (!isRunning) return;
  if (activeTarget && activeTarget.parentNode) return;
  spawnTarget();
}

/* ── Hit ── */

function onTargetHit(target) {
  if (!isRunning || target.classList.contains('hit')) return;

  hits++;
  const hitTime = performance.now();
  const spawnTime = parseFloat(target.dataset.spawnTime);
  reactionTimes.push(hitTime - spawnTime);

  target.classList.add('hit');
  target.style.transition = 'transform 0.2s ease, opacity 0.2s ease';
  target.style.transform = 'translate(-50%, -50%) scale(2.2)';
  target.style.opacity = '0';

  const tx = parseFloat(target.style.left) + TARGET_SIZE / 2;
  const ty = parseFloat(target.style.top) + TARGET_SIZE / 2;
  createRipple(tx, ty);

  clearTimeout(targetTimer);
  setTimeout(() => {
    if (target.parentNode) target.remove();
    activeTarget = null;
    spawnNext();
  }, 200);

  updateHUD();
}

/* ── Create Ripple ── */

function createRipple(x, y) {
  const ripple = document.createElement('div');
  ripple.className = 'ripple';
  ripple.style.left = x + 'px';
  ripple.style.top = y + 'px';
  arena.appendChild(ripple);
  ripple.addEventListener('animationend', () => {
    if (ripple.parentNode) ripple.remove();
  });
}

/* ── Arena Click (Miss) ── */

arena.addEventListener('click', (e) => {
  if (!isRunning) return;
  if (e.target.closest('.target')) return;

  missClicks++;
  arena.classList.remove('miss-flash');
  void arena.offsetWidth;
  arena.classList.add('miss-flash');
  updateHUD();
});

/* ── HUD ── */

function updateHUD() {
  hitsDisplay.textContent = String(hits);

  const total = hits + missClicks;
  if (total > 0) {
    accDisplay.textContent = Math.round((hits / total) * 100) + '%';
  } else {
    accDisplay.textContent = '\u2014';
  }

  if (reactionTimes.length > 0) {
    const avg = reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length;
    rtDisplay.textContent = Math.round(avg) + ' ms';
  } else {
    rtDisplay.textContent = '\u2014';
  }

  bestDisplay.textContent = String(bestHits);
}

/* ── Timer ── */

function startTimer() {
  timeLeft = SESSION_SECONDS;
  updateTimerDisplay();
  sessionTimer = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      endSession();
    } else if (timeLeft <= 5) {
      timerEl.classList.add('urgent');
      timerEl.classList.remove('running');
    }
  }, 1000);
}

function updateTimerDisplay() {
  timerEl.textContent = String(timeLeft).padStart(2, '0');
  if (timeLeft <= 5) {
    timerEl.classList.add('urgent');
    timerEl.classList.remove('running');
  } else {
    timerEl.classList.add('running');
    timerEl.classList.remove('urgent');
  }
}

/* ── Session ── */

function startSession() {
  hits = 0;
  missClicks = 0;
  missedTargets = 0;
  reactionTimes = [];
  activeTarget = null;
  isRunning = true;

  if (startOverlay) startOverlay.classList.add('hidden');
  if (endOverlay) endOverlay.classList.add('hidden');

  updateHUD();
  startTimer();
  spawnTarget();
}

function endSession() {
  isRunning = false;
  clearInterval(sessionTimer);
  clearTimeout(targetTimer);

  if (activeTarget && activeTarget.parentNode) {
    activeTarget.remove();
    activeTarget = null;
  }

  document.querySelectorAll('.target, .ripple').forEach(el => {
    if (el.parentNode) el.remove();
  });

  timerEl.classList.remove('running', 'urgent');

  if (hits > bestHits) {
    bestHits = hits;
    saveBest();
  }

  const total = hits + missClicks;
  const accPct = total > 0 ? Math.round((hits / total) * 100) : 0;
  const avgRT = reactionTimes.length > 0
    ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length) + ' ms'
    : '\u2014';

  rHits.textContent = String(hits);
  rAcc.textContent = accPct + '%';
  rRT.textContent = avgRT;
  rMissed.textContent = String(missedTargets);

  bestDisplay.textContent = String(bestHits);
  endOverlay.classList.remove('hidden');
}

/* ── High Score ── */

function loadBest() {
  try {
    const v = localStorage.getItem('aimTrainerBest');
    if (v !== null) bestHits = parseInt(v, 10) || 0;
  } catch (_) {}
  bestDisplay.textContent = String(bestHits);
}

function saveBest() {
  try { localStorage.setItem('aimTrainerBest', String(bestHits)); } catch (_) {}
}

/* ── Event Wiring ── */

startBtn.addEventListener('click', startSession);
restartBtn.addEventListener('click', startSession);

/* ── Boot ── */

loadBest();
updateHUD();
timerEl.textContent = String(SESSION_SECONDS).padStart(2, '0');
