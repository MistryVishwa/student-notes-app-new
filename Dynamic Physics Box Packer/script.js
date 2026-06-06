/* ═══════════════════════════════════════════════════════
   Dynamic Physics Box Packer — Packing Engine
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── DOM ─── */
  const container = document.getElementById('container');
  const queueEl = document.getElementById('queue');
  const ghost = document.getElementById('ghost');
  const volumeEl = document.getElementById('volume');
  const placedEl = document.getElementById('placed');
  const bestEl = document.getElementById('best');
  const barFill = document.getElementById('bar-fill');
  const modal = document.getElementById('modal');
  const mEff = document.getElementById('m-eff');
  const mBlocks = document.getElementById('m-blocks');
  const mBest = document.getElementById('m-best');
  const rotateBtn = document.getElementById('rotate-btn');
  const resetBtn = document.getElementById('reset-btn');
  const restartBtn = document.getElementById('btn-restart');

  /* ─── Constants ─── */
  const GRID = 8;
  const LS_KEY = 'dbp_best';

  /* ─── State ─── */
  let cellSize = 0;
  let highScore = 0;
  let placed = [];                     // [{gx, gy, gw, gh}]
  let queue = [];                      // [{w, h, placed}]
  let drag = null;                     // {index, w, h, origW, origH, offX, offY, valid}
  let containerRect = null;

  /* ─── Block definitions ─── */
  const BLOCK_DEFS = [
    { w: 2, h: 2 },   // square
    { w: 3, h: 2 },
    { w: 2, h: 3 },
    { w: 1, h: 4 },
    { w: 4, h: 1 },
    { w: 2, h: 2 },   // square
    { w: 3, h: 3 },
    { w: 2, h: 4 },
    { w: 4, h: 2 },
    { w: 1, h: 3 },
    { w: 3, h: 1 },
  ];

  /* ─── Init ─── */
  function init () {
    highScore = parseInt(localStorage.getItem(LS_KEY) || '0', 10);
    bestEl.textContent = highScore + '%';
    rotateBtn.addEventListener('click', rotateDrag);
    resetBtn.addEventListener('click', resetGame);
    restartBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      resetGame();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'r' || e.key === 'R') rotateDrag();
    });
    setupPointer();
    resetGame();
    window.addEventListener('resize', recalcSize);
  }

  /* ─── Sizing ─── */
  function recalcSize () {
    const rect = container.getBoundingClientRect();
    cellSize = rect.width / GRID;
  }

  /* ─── Reset ─── */
  function resetGame () {
    queue = BLOCK_DEFS.map(d => ({ w: d.w, h: d.h, placed: false }));
    placed = [];
    drag = null;
    ghost.classList.remove('active', 'valid', 'invalid');
    modal.classList.remove('active');
    recalcSize();
    renderQueue();
    renderPlaced();
    updateUI();
  }

  /* ─── Pointer Setup ─── */
  function setupPointer () {
    // Queue item mousedown via event delegation
    queueEl.addEventListener('pointerdown', (e) => {
      const item = e.target.closest('.queue-item');
      if (!item) return;
      const idx = parseInt(item.dataset.index, 10);
      if (isNaN(idx)) return;
      if (queue[idx].placed) return;

      startDrag(idx, e.clientX, e.clientY, e);
    });

    container.addEventListener('pointerdown', (e) => {
      // If dragging, do nothing extra; we already have drag from queue
    });

    document.addEventListener('pointermove', (e) => {
      if (!drag) return;
      moveDrag(e.clientX, e.clientY);
    });

    document.addEventListener('pointerup', () => {
      if (!drag) return;
      endDrag();
    });

    document.addEventListener('pointercancel', () => {
      if (!drag) return;
      cancelDrag();
    });
  }

  /* ─── Drag ─── */
  function startDrag (idx, cx, cy, e) {
    const block = queue[idx];
    if (block.placed) return;

    recalcSize();

    const bw = block.w * cellSize;
    const bh = block.h * cellSize;

    // Offset from pointer to top-left of ghost
    const offX = bw / 2;
    const offY = bh / 2;

    drag = {
      index: idx,
      w: block.w,
      h: block.h,
      origW: block.w,
      origH: block.h,
      offX,
      offY,
      valid: false,
    };

    ghost.style.width = bw + 'px';
    ghost.style.height = bh + 'px';

    moveDrag(cx, cy);
    ghost.classList.add('active');

    // Try to capture pointer
    if (e.target && e.target.setPointerCapture) {
      e.target.setPointerCapture(e.pointerId);
    }
  }

  function moveDrag (cx, cy) {
    if (!drag) return;

    const cRect = container.getBoundingClientRect();

    // Position ghost under cursor (centered)
    let gx = cx - drag.offX;
    let gy = cy - drag.offY;

    // Compute snapped grid position
    let snapX = Math.round((gx - cRect.left) / cellSize);
    let snapY = Math.round((gy - cRect.top) / cellSize);

    // Clamp to container grid
    snapX = Math.max(0, Math.min(GRID - drag.w, snapX));
    snapY = Math.max(0, Math.min(GRID - drag.h, snapY));

    // Check validity
    const valid = isValidPlacement(snapX, snapY, drag.w, drag.h);

    drag.valid = valid;
    drag.snapX = snapX;
    drag.snapY = snapY;

    // Position ghost at snapped position
    const px = cRect.left + snapX * cellSize;
    const py = cRect.top + snapY * cellSize;
    ghost.style.left = px + 'px';
    ghost.style.top = py + 'px';
    ghost.style.width = (drag.w * cellSize) + 'px';
    ghost.style.height = (drag.h * cellSize) + 'px';
    ghost.className = 'ghost active ' + (valid ? 'valid' : 'invalid');
  }

  function endDrag () {
    if (!drag) return;

    if (drag.valid) {
      // Place block
      queue[drag.index].placed = true;
      placed.push({ gx: drag.snapX, gy: drag.snapY, gw: drag.w, gh: drag.h, idx: drag.index });
      renderPlaced();
      renderQueue();
      updateUI();

      // Check victory
      if (queue.every(b => b.placed)) {
        victory();
      }
    }

    ghost.classList.remove('active', 'valid', 'invalid');
    drag = null;
  }

  function cancelDrag () {
    if (!drag) return;
    ghost.classList.remove('active', 'valid', 'invalid');
    drag = null;
  }

  /* ─── Rotation ─── */
  function rotateDrag () {
    if (!drag) return;
    // Swap w and h
    const tmp = drag.w;
    drag.w = drag.h;
    drag.h = tmp;
    ghost.style.width = (drag.w * cellSize) + 'px';
    ghost.style.height = (drag.h * cellSize) + 'px';
    // Re-validate with current snap position if available
    if (drag.snapX !== undefined && drag.snapY !== undefined) {
      const snapX = Math.min(drag.snapX, GRID - drag.w);
      const snapY = Math.min(drag.snapY, GRID - drag.h);
      drag.snapX = Math.max(0, snapX);
      drag.snapY = Math.max(0, snapY);
      drag.valid = isValidPlacement(drag.snapX, drag.snapY, drag.w, drag.h);
      ghost.className = 'ghost active ' + (drag.valid ? 'valid' : 'invalid');
      // Reposition
      const cRect = container.getBoundingClientRect();
      ghost.style.left = (cRect.left + drag.snapX * cellSize) + 'px';
      ghost.style.top = (cRect.top + drag.snapY * cellSize) + 'px';
    }
  }

  /* ─── AABB validation ─── */
  function isValidPlacement (gx, gy, gw, gh) {
    // Bounds check
    if (gx < 0 || gy < 0 || gx + gw > GRID || gy + gh > GRID) return false;

    // Collision with placed blocks
    for (const p of placed) {
      if (gx < p.gx + p.gw && gx + gw > p.gx &&
          gy < p.gy + p.gh && gy + gh > p.gy) {
        return false;
      }
    }

    return true;
  }

  /* ─── Render ─── */
  function renderPlaced () {
    // Remove old blocks
    container.querySelectorAll('.block').forEach(el => el.remove());

    for (const p of placed) {
      const el = document.createElement('div');
      el.className = 'block';
      el.style.left = (p.gx * cellSize) + 'px';
      el.style.top = (p.gy * cellSize) + 'px';
      el.style.width = (p.gw * cellSize) + 'px';
      el.style.height = (p.gh * cellSize) + 'px';
      container.appendChild(el);
    }
  }

  function renderQueue () {
    queueEl.innerHTML = '';

    for (let i = 0; i < queue.length; i++) {
      const b = queue[i];
      const item = document.createElement('div');
      item.className = 'queue-item' + (b.placed ? ' empty' : '');
      item.dataset.index = i;

      const ps = 2.4; // scale for queue display
      const iw = b.w * ps;
      const ih = b.h * ps;
      item.style.width = Math.max(ps + 2, iw) + 'vmin';
      item.style.height = Math.max(ps + 2, ih) + 'vmin';
      item.style.minWidth = '12px';
      item.style.minHeight = '12px';

      if (!b.placed) {
        item.textContent = b.w + '×' + b.h;
        item.style.fontSize = '0.4rem';
        item.style.display = 'flex';
        item.style.alignItems = 'center';
        item.style.justifyContent = 'center';
        item.style.color = 'rgba(255,255,255,0.5)';
      }

      queueEl.appendChild(item);
    }
  }

  /* ─── UI ─── */
  function updateUI () {
    const totalCells = GRID * GRID;
    const usedCells = placed.reduce((sum, p) => sum + p.gw * p.gh, 0);
    const pct = Math.round((usedCells / totalCells) * 100);

    volumeEl.textContent = pct + '%';
    placedEl.textContent = placed.length + '/' + queue.length;
    barFill.style.width = pct + '%';
  }

  /* ─── Victory ─── */
  function victory () {
    const totalCells = GRID * GRID;
    const usedCells = placed.reduce((sum, p) => sum + p.gw * p.gh, 0);
    const eff = Math.round((usedCells / totalCells) * 100);

    if (eff > highScore) {
      highScore = eff;
      localStorage.setItem(LS_KEY, String(highScore));
      bestEl.textContent = highScore + '%';
    }

    mEff.textContent = eff + '%';
    mBlocks.textContent = placed.length;
    mBest.textContent = highScore + '%';
    modal.classList.add('active');
  }

  /* ─── Boot ─── */
  init();

})();
