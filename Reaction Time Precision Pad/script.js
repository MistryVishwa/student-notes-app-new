/* ═══════════════════════════════════════════════════════
   Reaction Time Precision Pad — 5-State Engine
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── DOM refs ─── */
  const pad = document.getElementById('pad');
  const padText = document.getElementById('pad-text');
  const lastTimeEl = document.getElementById('last-time');
  const bestTimeEl = document.getElementById('best-time');
  const trialCountEl = document.getElementById('trial-count');
  const historyList = document.getElementById('history-list');

  /* ─── State Machine ─── */
  const STATE = { IDLE: 'idle', WAITING: 'waiting', TRIGGERED: 'triggered', PENALTY: 'penalty', RESULTS: 'results' };
  let state = STATE.IDLE;
  let waitingTimerId = null;
  let reactionStartTime = 0;
  let lastTime = null;
  let bestTime = null;
  let trialCount = 0;
  let history = [];

  /* ─── Constants ─── */
  const DELAY_MIN = 2000;
  const DELAY_MAX = 5000;
  const AUTO_RESET_DELAY = 1200;
  const LS_KEY = 'rtp_records';

  /* ─── Init ─── */
  function init () {
    loadData();
    updateDashboard();
    renderHistory();
    pad.addEventListener('click', handlePadClick);
    pad.addEventListener('touchstart', handlePadClick, { passive: true });
  }

  /* ─── Main Interaction ─── */
  function handlePadClick (e) {
    e.preventDefault();

    switch (state) {
      case STATE.IDLE:
        enterWaiting();
        break;
      case STATE.WAITING:
        enterPenalty();
        break;
      case STATE.TRIGGERED:
        recordHit();
        break;
      case STATE.PENALTY:
      case STATE.RESULTS:
        // Ignore clicks during feedback phase
        break;
    }
  }

  /* ─── States ─── */

  function enterIdle () {
    state = STATE.IDLE;
    setPadClass(STATE.IDLE);
    padText.textContent = 'Click to Start';
  }

  function enterWaiting () {
    state = STATE.WAITING;
    setPadClass(STATE.WAITING);
    padText.textContent = 'Wait for Green…';

    const delay = DELAY_MIN + Math.random() * (DELAY_MAX - DELAY_MIN);
    waitingTimerId = setTimeout(() => {
      enterTriggered();
    }, delay);
  }

  function enterTriggered () {
    state = STATE.TRIGGERED;
    setPadClass(STATE.TRIGGERED);
    padText.textContent = 'CLICK NOW!';
    reactionStartTime = performance.now();
    waitingTimerId = null;
  }

  function enterPenalty () {
    // Clear waiting timer
    if (waitingTimerId) {
      clearTimeout(waitingTimerId);
      waitingTimerId = null;
    }

    state = STATE.PENALTY;
    setPadClass(STATE.PENALTY);
    padText.textContent = 'Too Early! ⚠️';

    // Log penalty in history
    trialCount += 1;
    history.unshift({ trial: trialCount, time: null, isPenalty: true, isBest: false });
    trimHistory();
    saveData();
    updateDashboard();
    renderHistory();

    // Auto-reset
    setTimeout(() => enterIdle(), AUTO_RESET_DELAY);
  }

  function recordHit () {
    const now = performance.now();
    const elapsed = now - reactionStartTime;
    // Clamp to sensible range
    const time = Math.round(Math.min(elapsed, 9999));

    state = STATE.RESULTS;
    lastTime = time;

    // Check personal best
    let isBest = false;
    if (bestTime === null || time < bestTime) {
      bestTime = time;
      isBest = true;
      saveData();
    }

    // Log result in history
    trialCount += 1;
    history.unshift({ trial: trialCount, time, isPenalty: false, isBest });
    trimHistory();
    saveData();
    updateDashboard();
    renderHistory();
    setPadClass(STATE.IDLE);
    padText.textContent = time + ' ms';

    // Auto-reset
    setTimeout(() => enterIdle(), AUTO_RESET_DELAY);
  }

  /* ─── UI ─── */

  function setPadClass (s) {
    pad.className = 'pad ' + s;
  }

  function updateDashboard () {
    lastTimeEl.textContent = lastTime !== null ? lastTime + ' ms' : '—';
    bestTimeEl.textContent = bestTime !== null ? bestTime + ' ms' : '—';
    trialCountEl.textContent = trialCount;
  }

  function renderHistory () {
    historyList.innerHTML = '';

    history.forEach((entry) => {
      const div = document.createElement('div');
      div.className = 'history-item' + (entry.isPenalty ? ' penalty-item' : '') + (entry.isBest ? ' best' : '');

      const numSpan = document.createElement('span');
      numSpan.className = 'trial-num';
      numSpan.textContent = '#' + entry.trial;
      div.appendChild(numSpan);

      const timeSpan = document.createElement('span');
      timeSpan.className = 'trial-time';
      if (entry.isPenalty) {
        timeSpan.textContent = '⚠️ EARLY';
      } else {
        timeSpan.textContent = entry.time + ' ms';
      }
      div.appendChild(timeSpan);

      if (entry.isBest) {
        const badge = document.createElement('span');
        badge.className = 'best-badge';
        badge.textContent = 'BEST';
        div.appendChild(badge);
      }

      historyList.appendChild(div);
    });
  }

  /* ─── Persistence ─── */

  function trimHistory () {
    if (history.length > 50) {
      history = history.slice(0, 50);
    }
  }

  function saveData () {
    try {
      const data = { bestTime, trialCount, history };
      localStorage.setItem(LS_KEY, JSON.stringify(data));
    } catch (_) {
      // Quota exceeded — silently degrade
    }
  }

  function loadData () {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (typeof data.bestTime === 'number') bestTime = data.bestTime;
      if (typeof data.trialCount === 'number') trialCount = data.trialCount;
      if (Array.isArray(data.history)) history = data.history;
    } catch (_) {
      // Corrupt data — ignore
    }
  }

  /* ─── Boot ─── */
  init();

})();
