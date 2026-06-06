/* ═══════════════════════════════════════════════════════
   Neo-Voxel Font Generator — Data Engine
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── DOM ─── */
  const gridEl = document.getElementById('grid');
  const previewEl = document.getElementById('preview');
  const hexOut = document.getElementById('hex-output');
  const binOut = document.getElementById('bin-output');
  const vecOut = document.getElementById('vec-output');
  const copyBtn = document.getElementById('copy-btn');
  const clearBtn = document.getElementById('clear-btn');
  const invertBtn = document.getElementById('invert-btn');

  /* ─── State ─── */
  const SIZE = 8;
  const grid = Array.from({ length: SIZE }, () => Array(SIZE).fill(false));
  let isDrawing = false;
  let drawState = false;    // true = painting, false = erasing

  /* ─── Build Grid ─── */
  function buildGrid () {
    gridEl.innerHTML = '';
    previewEl.innerHTML = '';

    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        // Main cell
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.r = r;
        cell.dataset.c = c;
        cell.addEventListener('pointerdown', onPointerDown);
        cell.addEventListener('pointerenter', onPointerEnter);
        gridEl.appendChild(cell);

        // Preview cell
        const pc = document.createElement('div');
        pc.className = 'p-cell off';
        pc.dataset.r = r;
        pc.dataset.c = c;
        previewEl.appendChild(pc);
      }
    }

    // Global pointer release
    document.addEventListener('pointerup', onPointerUp);
    document.addEventListener('pointercancel', onPointerUp);

    syncAll();
  }

  /* ─── Pointer handlers ─── */

  function onPointerDown (e) {
    e.preventDefault();
    e.target.setPointerCapture(e.pointerId);
    const r = parseInt(e.target.dataset.r, 10);
    const c = parseInt(e.target.dataset.c, 10);
    isDrawing = true;
    drawState = !grid[r][c];   // toggle at start
    setCell(r, c, drawState);
  }

  function onPointerEnter (e) {
    if (!isDrawing) return;
    const r = parseInt(e.target.dataset.r, 10);
    const c = parseInt(e.target.dataset.c, 10);
    setCell(r, c, drawState);
  }

  function onPointerUp () {
    isDrawing = false;
  }

  /* ─── Cell state ─── */

  function setCell (r, c, val) {
    if (r < 0 || r >= SIZE || c < 0 || c >= SIZE) return;
    if (grid[r][c] === val) return;
    grid[r][c] = val;
    syncCell(r, c);
    syncAll();
  }

  function syncCell (r, c) {
    const cells = document.querySelectorAll(`.cell[data-r="${r}"][data-c="${c}"]`);
    cells.forEach(el => el.classList.toggle('on', grid[r][c]));

    const pCells = document.querySelectorAll(`.p-cell[data-r="${r}"][data-c="${c}"]`);
    pCells.forEach(el => {
      el.className = 'p-cell ' + (grid[r][c] ? 'on' : 'off');
    });
  }

  /* ─── Sync all displays ─── */

  function syncAll () {
    renderHex();
    renderBin();
    renderVec();
    syncAllCells();
  }

  function syncAllCells () {
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        syncCell(r, c);
      }
    }
  }

  /* ─── Serialisation ─── */

  function rowToByte (r) {
    let byte = 0;
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c]) byte |= (1 << (SIZE - 1 - c));
    }
    return byte;
  }

  function renderHex () {
    const bytes = [];
    for (let r = 0; r < SIZE; r++) {
      bytes.push('0x' + rowToByte(r).toString(16).toUpperCase().padStart(2, '0'));
    }
    hexOut.textContent = '[' + bytes.join(', ') + ']';
  }

  function renderBin () {
    const lines = [];
    for (let r = 0; r < SIZE; r++) {
      let bin = '';
      for (let c = 0; c < SIZE; c++) {
        bin += grid[r][c] ? '1' : '0';
      }
      lines.push(bin);
    }
    binOut.textContent = lines.join('\n');
  }

  function renderVec () {
    const points = [];
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (grid[r][c]) points.push({ x: c, y: r });
      }
    }
    const str = points.map(p => '{x:' + p.x + ', y:' + p.y + '}');
    vecOut.textContent = '[' + str.join(', ') + ']';
  }

  /* ─── Clear ─── */

  function clearGrid () {
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        grid[r][c] = false;
      }
    }
    syncAll();
  }

  /* ─── Invert ─── */

  function invertGrid () {
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        grid[r][c] = !grid[r][c];
      }
    }
    syncAll();
  }

  /* ─── Copy Hex ─── */

  function copyHex () {
    const text = hexOut.textContent;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy (text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (_) {}
    document.body.removeChild(ta);
  }

  /* ─── Events ─── */
  copyBtn.addEventListener('click', copyHex);
  clearBtn.addEventListener('click', clearGrid);
  invertBtn.addEventListener('click', invertGrid);

  /* ─── Boot ─── */
  buildGrid();
  // Seed a sample 'A' character
  function seedSample () {
    const sample = [
      [0,0,1,1,1,1,0,0],
      [0,1,1,0,0,1,1,0],
      [1,1,0,0,0,0,1,1],
      [1,1,0,0,0,0,1,1],
      [1,1,1,1,1,1,1,1],
      [1,1,0,0,0,0,1,1],
      [1,1,0,0,0,0,1,1],
      [1,1,0,0,0,0,1,1],
    ];
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        grid[r][c] = !!sample[r][c];
      }
    }
    syncAll();
  }
  seedSample();

})();
