/* ═══════════════════════════════════════════════════════
   Speed-Track Attention Shifter — Game Engine
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── Constants ───
  const HIGH_SCORE_KEY = 'speedTrackHigh';
  const SPAWN_INTERVAL = 1500;       // ms between spawns
  const FALL_SPEED = 1.2;            // px per tick
  const TICK_MS = 16;                // ~60fps
  const RULE_MIN = 4000;             // ms min rule interval
  const RULE_MAX = 6000;             // ms max rule interval
  const POINTS_BASE = 10;
  const PENALTY = 5;

  const SHAPES = ['circle', 'square', 'triangle'];
  const COLORS = [
    { name: 'red',    hex: '#ef4444' },
    { name: 'green',  hex: '#10b981' },
    { name: 'blue',   hex: '#38bdf8' },
  ];

  // SVG shape strings
  const SVG = {
    circle:   '<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="16" fill="currentColor"/></svg>',
    square:   '<svg viewBox="0 0 40 40"><rect x="4" y="4" width="32" height="32" rx="4" fill="currentColor"/></svg>',
    triangle: '<svg viewBox="0 0 40 40"><polygon points="20,2 38,36 2,36" fill="currentColor"/></svg>',
  };

  // ─── State ───
  let score = 0;
  let multiplier = 1;
  let highScore = 0;
  let currentRule = 'color';          // 'color' | 'shape'
  let isRunning = false;

  let items = [];                     // { id, shape, color, y, el, sorted }
  let itemIdCounter = 0;
  let spawnTimer = null;
  let ruleTimer = null;
  let animFrame = null;

  // ─── DOM ───
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);

  const dom = {};

  function cacheDom() {
    dom.score = $('#score');
    dom.multiplier = $('#multiplier');
    dom.highScore = $('#high-score');
    dom.ruleValue = $('#rule-value');
    dom.ruleBanner = $('#rule-banner');
    dom.track = $('#track');
    dom.baskets = $$('.basket');
    dom.basketIcons = [0,1,2].map(i => $(`#basket-icon-${i}`));
    dom.basketLabels = [0,1,2].map(i => $(`#basket-label-${i}`));
    dom.feedback = $('#feedback');
    dom.btnLaunch = $('#btn-launch');
    dom.btnReset = $('#btn-reset');
    dom.screenFlash = $('#screen-flash');
  }

  // ─── Storage ───
  function loadHigh() {
    try {
      const v = localStorage.getItem(HIGH_SCORE_KEY);
      if (v) highScore = parseInt(v, 10) || 0;
    } catch { highScore = 0; }
  }

  function saveHigh() {
    try { localStorage.setItem(HIGH_SCORE_KEY, String(highScore)); } catch { /* ignore */ }
  }

  // ─── Item Generation ───
  function randomShape() {
    return SHAPES[Math.floor(Math.random() * SHAPES.length)];
  }

  function randomColor() {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
  }

  function createItem() {
    const shape = randomShape();
    const color = randomColor();
    const id = ++itemIdCounter;

    const el = document.createElement('div');
    el.className = 'item';
    el.style.color = color.hex;
    el.innerHTML = SVG[shape];
    el.dataset.id = id;
    dom.track.appendChild(el);

    const item = { id, shape: shape, color: color.name, y: -44, el, sorted: false };
    items.push(item);
    return item;
  }

  // ─── Get lowest unsorted item ───
  function getLowestActive() {
    const active = items.filter(i => !i.sorted);
    if (active.length === 0) return null;
    return active.reduce((a, b) => a.y > b.y ? a : b);
  }

  // ─── Rule Management ───
  function switchRule() {
    currentRule = currentRule === 'color' ? 'shape' : 'color';

    dom.ruleValue.textContent = currentRule === 'color' ? 'COLOR' : 'SHAPE';
    dom.ruleValue.className = 'rule-value ' + (currentRule === 'color' ? 'color-rule' : 'shape-rule');
    dom.ruleBanner.className = 'rule-banner flash-' + (currentRule === 'color' ? 'color' : 'shape');

    // Flash label
    const label = dom.ruleBanner.querySelector('.rule-label');
    label.textContent = 'RULE CHANGED: MATCH';
    setTimeout(() => { label.textContent = 'MATCH'; }, 1200);

    updateBaskets();
    scheduleRuleSwitch();
  }

  function scheduleRuleSwitch() {
    if (ruleTimer) clearTimeout(ruleTimer);
    if (!isRunning) return;
    const delay = RULE_MIN + Math.floor(Math.random() * (RULE_MAX - RULE_MIN));
    ruleTimer = setTimeout(switchRule, delay);
  }

  // ─── Basket Labels ───
  function updateBaskets() {
    if (currentRule === 'color') {
      // Baskets represent colors
      const colorItems = [
        { icon: SVG.circle, label: 'RED',   hex: '#ef4444' },
        { icon: SVG.circle, label: 'GREEN', hex: '#10b981' },
        { icon: SVG.circle, label: 'BLUE',  hex: '#38bdf8' },
      ];
      dom.basketIcons.forEach((el, i) => {
        el.innerHTML = colorItems[i].icon;
        el.style.color = colorItems[i].hex;
      });
      dom.basketLabels.forEach((el, i) => {
        el.textContent = colorItems[i].label;
      });
    } else {
      // Baskets represent shapes
      const shapeItems = [
        { icon: SVG.circle,   label: 'CIRCLE' },
        { icon: SVG.square,   label: 'SQUARE' },
        { icon: SVG.triangle, label: 'TRIANGLE' },
      ];
      dom.basketIcons.forEach((el, i) => {
        el.innerHTML = shapeItems[i].icon;
        el.style.color = '#94a3b8';
      });
      dom.basketLabels.forEach((el, i) => {
        el.textContent = shapeItems[i].label;
      });
    }
  }

  // ─── Basket Click ───
  function handleBasketClick(basketIndex) {
    if (!isRunning) return;

    const item = getLowestActive();
    if (!item) return;

    let isCorrect = false;

    if (currentRule === 'color') {
      // Basket 0=red, 1=green, 2=blue
      const colorMap = ['red', 'green', 'blue'];
      isCorrect = item.color === colorMap[basketIndex];
    } else {
      // Basket 0=circle, 1=square, 2=triangle
      const shapeMap = ['circle', 'square', 'triangle'];
      isCorrect = item.shape === shapeMap[basketIndex];
    }

    if (isCorrect) {
      const pts = POINTS_BASE * multiplier;
      score += pts;
      multiplier = Math.min(10, multiplier + 1);
      item.sorted = true;
      item.el.style.opacity = '0';
      item.el.style.transition = 'opacity 0.2s';
      setTimeout(() => { if (item.el && item.el.parentNode) item.el.parentNode.removeChild(item.el); }, 200);

      dom.feedback.textContent = `✓ +${pts}`;
      dom.feedback.className = 'feedback correct';
    } else {
      multiplier = 1;
      flashPenalty();
      dom.feedback.textContent = '✕ Wrong basket!';
      dom.feedback.className = 'feedback wrong';

      // Remove item
      item.sorted = true;
      item.el.style.opacity = '0';
      item.el.style.transition = 'opacity 0.15s';
      setTimeout(() => { if (item.el && item.el.parentNode) item.el.parentNode.removeChild(item.el); }, 150);
    }

    dom.score.textContent = score;
    dom.multiplier.textContent = `×${multiplier}`;

    if (score > highScore) {
      highScore = score;
      saveHigh();
      dom.highScore.textContent = highScore;
    }
  }

  // ─── Flash Penalty ───
  function flashPenalty() {
    dom.screenFlash.classList.add('active');
    setTimeout(() => dom.screenFlash.classList.remove('active'), 120);
  }

  // ─── Fall Loop ───
  function fallLoop() {
    if (!isRunning) return;

    const trackHeight = dom.track.clientHeight;

    items.forEach((item) => {
      if (item.sorted) return;
      item.y += FALL_SPEED;
      item.el.style.top = item.y + 'px';

      // Check if fallen past bottom
      if (item.y > trackHeight + 10) {
        item.sorted = true;
        if (item.el && item.el.parentNode) item.el.parentNode.removeChild(item.el);
        // Penalty
        multiplier = 1;
        flashPenalty();
        dom.feedback.textContent = '⏬ Item missed!';
        dom.feedback.className = 'feedback wrong';
        dom.multiplier.textContent = `×1`;
      }
    });

    animFrame = requestAnimationFrame(fallLoop);
  }

  // ─── Spawn ───
  function spawnItem() {
    if (!isRunning) return;
    createItem();
    spawnTimer = setTimeout(spawnItem, SPAWN_INTERVAL);
  }

  // ─── Start / Stop ───
  function startGame() {
    if (isRunning) return;
    stopGame();
    isRunning = true;
    dom.btnLaunch.disabled = true;
    dom.btnLaunch.textContent = '● Running';

    updateBaskets();
    scheduleRuleSwitch();
    spawnItem();

    if (animFrame) cancelAnimationFrame(animFrame);
    animFrame = requestAnimationFrame(fallLoop);
  }

  function stopGame() {
    isRunning = false;
    if (spawnTimer) { clearTimeout(spawnTimer); spawnTimer = null; }
    if (ruleTimer) { clearTimeout(ruleTimer); ruleTimer = null; }
    if (animFrame) { cancelAnimationFrame(animFrame); animFrame = null; }
    dom.btnLaunch.disabled = false;
    dom.btnLaunch.textContent = '▶ Launch Task';
  }

  // ─── Reset ───
  function resetGame() {
    stopGame();
    score = 0;
    multiplier = 1;
    items.forEach(i => {
      if (i.el && i.el.parentNode) i.el.parentNode.removeChild(i.el);
    });
    items = [];
    itemIdCounter = 0;

    dom.score.textContent = '0';
    dom.multiplier.textContent = '×1';
    dom.highScore.textContent = highScore;
    dom.feedback.textContent = '';
    dom.feedback.className = 'feedback';
    dom.ruleValue.textContent = 'COLOR';
    dom.ruleValue.className = 'rule-value color-rule';
    dom.ruleBanner.className = 'rule-banner';
    dom.ruleBanner.querySelector('.rule-label').textContent = 'MATCH';
    currentRule = 'color';
    updateBaskets();
  }

  // ─── Events ───
  function setupEvents() {
    dom.baskets.forEach((b) => {
      b.addEventListener('click', () => {
        handleBasketClick(parseInt(b.dataset.basket, 10));
      });
    });

    dom.btnLaunch.addEventListener('click', startGame);
    dom.btnReset.addEventListener('click', resetGame);
  }

  // ─── Init ───
  function init() {
    cacheDom();
    loadHigh();
    dom.highScore.textContent = highScore;
    updateBaskets();
    setupEvents();
    dom.feedback.textContent = 'Press Launch Task to begin';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
