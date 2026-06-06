/* ═══════════════════════════════════════════════════════
   Target Hunt Game — Game Engine
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── DOM ─── */
  const arena = document.getElementById('arena');
  const scoreEl = document.getElementById('score');
  const accEl = document.getElementById('accuracy');
  const timerEl = document.getElementById('timer');
  const bestEl = document.getElementById('best');
  const startBtn = document.getElementById('btn-start');
  const modal = document.getElementById('modal');
  const mHits = document.getElementById('m-hits');
  const mMisses = document.getElementById('m-misses');
  const mAcc = document.getElementById('m-acc');
  const mScore = document.getElementById('m-score');
  const mBest = document.getElementById('m-best');
  const restartBtn = document.getElementById('btn-restart');

  /* ─── State ─── */
  let score = 0, hits = 0, misses = 0, totalClicks = 0;
  let highScore = 0;
  let timeLeft = 30;
  let isRunning = false;
  let tickTimerId = null;
  let spawnTimerId = null;
  let activeTargets = [];

  /* ─── Constants ─── */
  const ROUND_SECONDS = 30;
  const TARGET_LIFETIME = 1500;        // ms
  const SPAWN_INTERVAL = 700;          // ms between spawns
  const TARGET_RADIUS_RATIO = 0.055;
  const LS_KEY = 'thg_high';

  /* ─── Init ─── */
  function init () {
    highScore = parseInt(localStorage.getItem(LS_KEY) || '0', 10);
    bestEl.textContent = highScore;
    startBtn.addEventListener('click', startRound);
    restartBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      startRound();
    });
    arena.addEventListener('click', onArenaClick);
    arena.addEventListener('touchstart', onArenaTouch, { passive: true });
  }

  /* ─── Sizing ─── */
  function getArenaRect () {
    return arena.getBoundingClientRect();
  }

  function getTargetRadius () {
    const rect = getArenaRect();
    return Math.max(16, Math.round(rect.width * TARGET_RADIUS_RATIO));
  }

  /* ─── Start Round ─── */
  function startRound () {
    stopAll();
    clearTargets();

    score = 0; hits = 0; misses = 0; totalClicks = 0;
    timeLeft = ROUND_SECONDS;
    isRunning = true;
    activeTargets = [];

    updateUI();
    timerEl.textContent = ROUND_SECONDS;
    startBtn.disabled = true;

    tickTimerId = setInterval(tick, 200);
    spawnTarget();
    spawnTimerId = setInterval(spawnTarget, SPAWN_INTERVAL);
  }

  /* ─── Timer ─── */
  function tick () {
    if (!isRunning) return;
    timeLeft -= 0.2;
    if (timeLeft <= 0) {
      timeLeft = 0;
      timerEl.textContent = '0';
      endRound();
      return;
    }
    timerEl.textContent = Math.ceil(timeLeft);
  }

  /* ─── Spawn ─── */
  function spawnTarget () {
    if (!isRunning) return;

    const rect = getArenaRect();
    const r = getTargetRadius();
    const pad = r + 4;
    const maxX = rect.width - pad * 2;
    const maxY = rect.height - pad * 2;
    if (maxX <= 0 || maxY <= 0) return;

    const x = pad + Math.random() * maxX;
    const y = pad + Math.random() * maxY;

    const el = document.createElement('div');
    el.className = 'target';
    el.style.left = (x - r) + 'px';
    el.style.top = (y - r) + 'px';
    el.style.width = (r * 2) + 'px';
    el.style.height = (r * 2) + 'px';
    el.dataset.hit = 'false';

    // Rings + bullseye + crosshair
    const ringOuter = document.createElement('div');
    ringOuter.className = 'ring-outer';
    el.appendChild(ringOuter);

    const ringInner = document.createElement('div');
    ringInner.className = 'ring-inner';
    el.appendChild(ringInner);

    const bullseye = document.createElement('div');
    bullseye.className = 'bullseye';
    el.appendChild(bullseye);

    const cross = document.createElement('div');
    cross.className = 'crosshair';
    el.appendChild(cross);

    arena.appendChild(el);

    const entry = { el, id: Date.now() + Math.random() };
    activeTargets.push(entry);

    el.addEventListener('animationend', () => {
      removeTarget(entry);
    });
  }

  /* ─── Remove ─── */
  function removeTarget (entry) {
    if (!entry) return;
    const idx = activeTargets.indexOf(entry);
    if (idx !== -1) activeTargets.splice(idx, 1);
    if (entry.el && entry.el.parentNode) {
      entry.el.parentNode.removeChild(entry.el);
    }
  }

  /* ─── Pointer handlers ─── */
  function onArenaClick (e) {
    if (!isRunning) return;
    handlePointer(e.clientX, e.clientY);
  }

  function onArenaTouch (e) {
    if (!isRunning) return;
    const touch = e.touches[0];
    if (!touch) return;
    handlePointer(touch.clientX, touch.clientY);
  }

  function handlePointer (cx, cy) {
    if (!isRunning) return;

    const rect = getArenaRect();
    const x = cx - rect.left;
    const y = cy - rect.top;

    totalClicks++;
    const r = getTargetRadius();
    let hitTarget = null;

    // Check each target (topmost first)
    for (let i = activeTargets.length - 1; i >= 0; i--) {
      const entry = activeTargets[i];
      if (entry.el.dataset.hit === 'true') continue;
      const ex = parseFloat(entry.el.style.left) + r;
      const ey = parseFloat(entry.el.style.top) + r;
      const dx = x - ex;
      const dy = y - ey;
      if (dx * dx + dy * dy <= r * r) {
        hitTarget = entry;
        break;
      }
    }

    // Visual trail
    spawnTrail(x, y, hitTarget !== null);

    if (hitTarget) {
      hitTarget.el.dataset.hit = 'true';
      hitTarget.el.classList.add('hit');
      hits++;
      score += 10;
      removeTarget(hitTarget);
    } else {
      misses++;
    }

    updateUI();
  }

  /* ─── Trail ─── */
  function spawnTrail (x, y, isHit) {
    const trail = document.createElement('div');
    trail.className = 'trail';
    const size = isHit ? 14 : 10;
    trail.style.left = (x - size / 2) + 'px';
    trail.style.top = (y - size / 2) + 'px';
    trail.style.width = size + 'px';
    trail.style.height = size + 'px';
    trail.style.background = isHit
      ? 'rgba(251, 191, 36, 0.5)'
      : 'rgba(239, 68, 68, 0.3)';
    trail.style.boxShadow = isHit
      ? '0 0 12px rgba(251, 191, 36, 0.3)'
      : '0 0 12px rgba(239, 68, 68, 0.3)';
    arena.appendChild(trail);
    setTimeout(() => {
      if (trail.parentNode) trail.parentNode.removeChild(trail);
    }, 400);
  }

  /* ─── End Round ─── */
  function endRound () {
    isRunning = false;
    stopAll();
    clearTargets();
    startBtn.disabled = false;

    if (score > highScore) {
      highScore = score;
      localStorage.setItem(LS_KEY, String(highScore));
      bestEl.textContent = highScore;
    }

    mHits.textContent = hits;
    mMisses.textContent = misses;
    const acc = totalClicks > 0 ? Math.round((hits / totalClicks) * 100) : 0;
    mAcc.textContent = acc + '%';
    mScore.textContent = score;
    mBest.textContent = highScore;
    modal.classList.add('active');
  }

  /* ─── Stop / Clear ─── */
  function stopAll () {
    if (tickTimerId) { clearInterval(tickTimerId); tickTimerId = null; }
    if (spawnTimerId) { clearInterval(spawnTimerId); spawnTimerId = null; }
  }

  function clearTargets () {
    for (const entry of activeTargets) {
      if (entry.el && entry.el.parentNode) {
        entry.el.parentNode.removeChild(entry.el);
      }
    }
    activeTargets = [];
  }

  /* ─── UI ─── */
  function updateUI () {
    scoreEl.textContent = score;
    const acc = totalClicks > 0 ? Math.round((hits / totalClicks) * 100) : 0;
    accEl.textContent = totalClicks > 0 ? acc + '%' : '—';
  }

  /* ─── Boot ─── */
  init();

})();
