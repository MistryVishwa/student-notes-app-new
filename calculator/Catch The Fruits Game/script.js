/* ═══════════════════════════════════════════════════════
   Catch The Fruits Game — Canvas Engine
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── Canvas ─── */
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const W = 480, H = 640;

  /* ─── DOM ─── */
  const scoreEl = document.getElementById('score');
  const comboEl = document.getElementById('combo');
  const livesEl = document.getElementById('lives');
  const bestEl = document.getElementById('best');
  const modal = document.getElementById('modal');
  const mScore = document.getElementById('m-score');
  const mBest = document.getElementById('m-best');
  const restartBtn = document.getElementById('btn-restart');

  /* ─── Constants ─── */
  const BASKET_W = 72, BASKET_H = 16;
  const BASKET_Y = H - 36;
  const BASE_SPEED = 3.2;
  const LIVES_MAX = 3;
  const DIFFICULTY_INTERVAL = 12000;   // ms
  const SPAWN_BASE = 750;              // ms
  const SPAWN_MIN = 300;
  const LS_KEY = 'ctf_high';

  /* ─── Fruit definitions ─── */
  const FRUIT_TYPES = [
    { label: 'Apple',  w: 20, h: 20, fill: '#10b981', glow: 'rgba(16,185,129,0.3)', fresh: true,  points: 10 },
    { label: 'Banana', w: 24, h: 16, fill: '#f59e0b', glow: 'rgba(245,158,11,0.3)', fresh: true,  points: 10 },
    { label: 'Grape',  w: 18, h: 22, fill: '#a855f7', glow: 'rgba(168,85,247,0.3)', fresh: true,  points: 15 },
    { label: 'Rotten', w: 20, h: 18, fill: '#5c6b4d', glow: 'rgba(92,107,77,0.3)', fresh: false, points: 0  },
  ];

  /* ─── State ─── */
  let score = 0, combo = 1, lives = LIVES_MAX, highScore = 0;
  let basket = { x: (W - BASKET_W) / 2, w: BASKET_W, h: BASKET_H, y: BASKET_Y };
  let fruits = [];
  let particles = [];
  let floats = [];
  let speedMul = 1;
  let spawnTimer = SPAWN_BASE;
  let timeToDiff = DIFFICULTY_INTERVAL;
  let elapsed = 0;
  let isRunning = false;
  let animId = null;
  let spawnTimeoutId = null;
  let lastTime = 0;
  let flashAlpha = 0;

  /* ─── Keys ─── */
  const keys = { left: false, right: false };

  /* ─── Init ─── */
  function init () {
    highScore = parseInt(localStorage.getItem(LS_KEY) || '0', 10);
    bestEl.textContent = highScore;
    restartBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      resetGame();
    });
    setupInput();
    resetGame();
  }

  /* ─── Input ─── */
  function setupInput () {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = true;
    });
    document.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = false;
    });

    // Touch: left/right half
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      if (!touch) return;
      const x = (touch.clientX - rect.left) / rect.width;
      keys.left = x < 0.5;
      keys.right = x >= 0.5;
    }, { passive: false });

    canvas.addEventListener('touchend', () => {
      keys.left = false;
      keys.right = false;
    });

    canvas.addEventListener('touchcancel', () => {
      keys.left = false;
      keys.right = false;
    });
  }

  /* ─── Reset ─── */
  function resetGame () {
    if (animId) { cancelAnimationFrame(animId); animId = null; }
    if (spawnTimeoutId) { clearTimeout(spawnTimeoutId); spawnTimeoutId = null; }

    score = 0; combo = 1; lives = LIVES_MAX;
    speedMul = 1; spawnTimer = SPAWN_BASE;
    timeToDiff = DIFFICULTY_INTERVAL;
    elapsed = 0;
    fruits = []; particles = []; floats = [];
    flashAlpha = 0;
    basket.x = (W - BASKET_W) / 2;
    isRunning = true;
    updateUI();

    lastTime = performance.now();
    scheduleSpawn();
    animId = requestAnimationFrame(loop);
  }

  /* ─── Spawn ─── */
  function scheduleSpawn () {
    if (!isRunning) return;
    spawnFruit();
    const delay = Math.max(SPAWN_MIN, spawnTimer * (0.75 + Math.random() * 0.5));
    spawnTimeoutId = setTimeout(scheduleSpawn, delay);
  }

  function spawnFruit () {
    if (!isRunning) return;

    // 70% fresh, 30% rotten
    const isRotten = Math.random() < 0.3;
    const pool = isRotten
      ? [FRUIT_TYPES[3]]
      : FRUIT_TYPES.slice(0, 3);
    const type = pool[Math.floor(Math.random() * pool.length)];

    const x = type.w / 2 + Math.random() * (W - type.w);
    const vy = (1.2 + Math.random() * 0.6) * speedMul;
    const vx = (Math.random() - 0.5) * 0.4 * speedMul;

    fruits.push({
      x, y: -type.h,
      w: type.w, h: type.h,
      vx, vy,
      fresh: type.fresh,
      fill: type.fill,
      glow: type.glow,
      points: type.points,
      label: type.label,
      caught: false,
    });
  }

  /* ─── Update ─── */
  function update (dt) {
    if (!isRunning) return;
    const dtNorm = Math.min(dt / 16.667, 3);

    elapsed += dt;
    timeToDiff -= dt;

    if (timeToDiff <= 0) {
      timeToDiff += DIFFICULTY_INTERVAL;
      speedMul *= 1.12;
      spawnTimer = Math.max(SPAWN_MIN, spawnTimer * 0.92);
    }

    // Basket movement
    const basketSpeed = BASE_SPEED * dtNorm;
    if (keys.left) basket.x -= basketSpeed;
    if (keys.right) basket.x += basketSpeed;
    basket.x = Math.max(0, Math.min(W - basket.w, basket.x));

    // Move fruits
    for (const f of fruits) {
      f.x += f.vx * dtNorm;
      f.y += f.vy * dtNorm;
    }

    // AABB collision detection
    for (let i = fruits.length - 1; i >= 0; i--) {
      const f = fruits[i];
      if (f.caught) continue;

      // Check catch
      if (f.y + f.h >= basket.y &&
          f.y <= basket.y + basket.h &&
          f.x + f.w >= basket.x &&
          f.x <= basket.x + basket.w) {

        f.caught = true;

        if (f.fresh) {
          // Good catch
          const earned = f.points * combo;
          score += earned;
          combo++;
          spawnFloat(f.x + f.w / 2, f.y, '+' + earned + '  ×' + (combo - 1), 'good');
          spawnCatchParticles(f.x + f.w / 2, f.y + f.h / 2, f.fill);
        } else {
          // Rotten catch
          combo = 1;
          lives--;
          flashAlpha = 0.5;
          spawnFloat(f.x + f.w / 2, f.y, 'Rotten!', 'bad');
          spawnCatchParticles(f.x + f.w / 2, f.y + f.h / 2, '#5c6b4d');
          if (lives <= 0) {
            lives = 0;
            updateUI();
            gameOver();
            return;
          }
        }

        fruits.splice(i, 1);
        updateUI();
        continue;
      }

      // Remove if off screen
      if (f.y - f.h > H + 10 || f.x + f.w < -20 || f.x > W + 20) {
        // Missed fresh fruit — no penalty per spec, just remove
        fruits.splice(i, 1);
      }
    }

    // Update particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx * dtNorm;
      p.y += p.vy * dtNorm;
      p.vy += 0.08 * dtNorm;
      p.life -= p.decay * dtNorm;
      if (p.life <= 0) particles.splice(i, 1);
    }

    // Fade flash
    if (flashAlpha > 0) flashAlpha = Math.max(0, flashAlpha - dt / 400);
  }

  /* ─── Draw ─── */
  function draw () {
    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = '#080c1a';
    ctx.fillRect(0, 0, W, H);

    // Floor line
    ctx.strokeStyle = 'rgba(51,65,85,0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, basket.y + basket.h + 6);
    ctx.lineTo(W, basket.y + basket.h + 6);
    ctx.stroke();

    // Fruits
    for (const f of fruits) {
      ctx.shadowColor = f.glow;
      ctx.shadowBlur = 14;
      ctx.fillStyle = f.fill;
      // Draw rounded rect or ellipse
      ctx.beginPath();
      ctx.ellipse(f.x + f.w / 2, f.y + f.h / 2, f.w / 2, f.h / 2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Highlight
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(255,255,255,0.08)';
      ctx.beginPath();
      ctx.ellipse(f.x + f.w * 0.3, f.y + f.h * 0.3, f.w * 0.15, f.h * 0.15, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.shadowBlur = 0;

    // Basket
    ctx.shadowColor = 'rgba(16, 185, 129, 0.3)';
    ctx.shadowBlur = 16;
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.roundRect(basket.x, basket.y, basket.w, basket.h, 6);
    ctx.fill();

    // Basket rim
    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(basket.x - 2, basket.y - 2, basket.w + 4, basket.h + 4, 8);
    ctx.stroke();

    // Particles
    for (const p of particles) {
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.fill;
      ctx.shadowColor = p.glow;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    // Red flash overlay
    if (flashAlpha > 0) {
      ctx.fillStyle = 'rgba(239, 68, 68, ' + (flashAlpha * 0.2) + ')';
      ctx.fillRect(0, 0, W, H);
    }
  }

  /* ─── Particle effects ─── */
  function spawnCatchParticles (x, y, fill) {
    const count = 6;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i + (Math.random() - 0.5) * 0.5;
      const speed = 1.5 + Math.random() * 2;
      particles.push({
        x, y,
        r: 2 + Math.random() * 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        life: 1,
        decay: 0.025 + Math.random() * 0.015,
        fill,
        glow: 'rgba(255,255,255,0.15)',
      });
    }
  }

  /* ─── Floating score ─── */
  function spawnFloat (x, y, text, cls) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = rect.width / W;
    const scaleY = rect.height / H;
    const el = document.createElement('div');
    el.className = 'float-text ' + cls;
    el.textContent = text;
    el.style.left = (rect.left + x * scaleX) + 'px';
    el.style.top = (rect.top + y * scaleY) + 'px';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 800);
  }

  /* ─── Loop ─── */
  function loop (now) {
    const dt = now - lastTime;
    lastTime = now;
    update(dt);
    draw();
    if (isRunning) animId = requestAnimationFrame(loop);
  }

  /* ─── Game Over ─── */
  function gameOver () {
    isRunning = false;
    if (animId) { cancelAnimationFrame(animId); animId = null; }
    if (spawnTimeoutId) { clearTimeout(spawnTimeoutId); spawnTimeoutId = null; }

    if (score > highScore) {
      highScore = score;
      localStorage.setItem(LS_KEY, String(highScore));
      bestEl.textContent = highScore;
    }

    mScore.textContent = score;
    mBest.textContent = highScore;
    modal.classList.add('active');
  }

  /* ─── UI ─── */
  function updateUI () {
    scoreEl.textContent = score;
    comboEl.textContent = '×' + combo;
    livesEl.textContent = lives;
    bestEl.textContent = highScore;
  }

  /* ─── RoundRect polyfill ─── */
  if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
      if (r > w / 2) r = w / 2;
      if (r > h / 2) r = h / 2;
      this.moveTo(x + r, y);
      this.arcTo(x + w, y, x + w, y + h, r);
      this.arcTo(x + w, y + h, x, y + h, r);
      this.arcTo(x, y + h, x, y, r);
      this.arcTo(x, y, x + w, y, r);
      this.closePath();
      return this;
    };
  }

  /* ─── Boot ─── */
  init();

})();
