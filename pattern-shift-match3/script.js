// ============================================================
//  PATTERN-SHIFT — Match-3 Recursive Grid Evacuation (#840)
//  Pure vanilla JS. No external libraries.
// ============================================================

const ROWS = 6;
const COLS = 6;
const NUM_TYPES = 6;
const INITIAL_MOVES = 20;
const SCORE_PER_TILE = 10;

// ── DOM refs ──

const gridEl = document.getElementById('grid-container');
const scoreEl = document.getElementById('score-display');
const movesEl = document.getElementById('moves-display');
const statusEl = document.getElementById('status-text');
const resetBtn = document.getElementById('reset-btn');

// ── Game state ──

let grid = [];
let score = 0;
let movesLeft = INITIAL_MOVES;
let selectedCell = null;    // { r, c } | null
let isProcessing = false;
let gameOver = false;

// ── Grid generation (no initial matches) ──

function randomType() {
  return Math.floor(Math.random() * NUM_TYPES);
}

function generateGrid() {
  grid = [];
  for (let r = 0; r < ROWS; r++) {
    grid[r] = [];
    for (let c = 0; c < COLS; c++) {
      let type;
      let attempts = 0;
      do {
        type = randomType();
        attempts++;
        if (attempts > 50) break;
      } while (
        (r >= 2 && grid[r - 1][c] === type && grid[r - 2][c] === type) ||
        (c >= 2 && grid[r][c - 1] === type && grid[r][c - 2] === type)
      );
      grid[r][c] = type;
    }
  }
}

// ── Match detection ──

function findMatches() {
  const matched = new Set();

  for (let r = 0; r < ROWS; r++) {
    let c = 0;
    while (c < COLS) {
      const type = grid[r][c];
      if (type === null) { c++; continue; }
      let end = c + 1;
      while (end < COLS && grid[r][end] === type) end++;
      if (end - c >= 3) {
        for (let i = c; i < end; i++) matched.add(r + ',' + i);
      }
      c = end;
    }
  }

  for (let c = 0; c < COLS; c++) {
    let r = 0;
    while (r < ROWS) {
      const type = grid[r][c];
      if (type === null) { r++; continue; }
      let end = r + 1;
      while (end < ROWS && grid[end][c] === type) end++;
      if (end - r >= 3) {
        for (let i = r; i < end; i++) matched.add(i + ',' + c);
      }
      r = end;
    }
  }

  return matched;
}

// ── Gravity & refill ──

function applyGravity() {
  for (let c = 0; c < COLS; c++) {
    const values = [];
    for (let r = ROWS - 1; r >= 0; r--) {
      if (grid[r][c] !== null) values.push(grid[r][c]);
    }
    for (let r = ROWS - 1; r >= 0; r--) {
      const idx = ROWS - 1 - r;
      grid[r][c] = idx < values.length ? values[idx] : null;
    }
  }
}

function refillGrid() {
  let refilled = false;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (grid[r][c] === null) {
        grid[r][c] = randomType();
        refilled = true;
      }
    }
  }
  return refilled;
}

function tagNewTiles() {
  const els = gridEl.children;
  for (let i = 0; i < els.length; i++) {
    const gem = els[i].querySelector('.gem');
    if (gem) gem.classList.add('dropping');
  }
  setTimeout(() => {
    for (let i = 0; i < els.length; i++) {
      const gem = els[i].querySelector('.gem');
      if (gem) gem.classList.remove('dropping');
    }
  }, 300);
}

// ── Cascade processor ──

function processMatches(cascadeLevel) {
  if (cascadeLevel === undefined) cascadeLevel = 0;

  const matches = findMatches();

  if (matches.size === 0) {
    if (cascadeLevel === 0) {
      isProcessing = false;
      selectedCell = null;
      setStatus('SELECT A TILE');
      render();
    } else {
      addLog('CHAIN COMPLETE');
      finishTurn();
    }
    return;
  }

  const level = cascadeLevel + 1;
  const tileCount = matches.size;
  const points = tileCount * SCORE_PER_TILE * level;
  score += points;
  updateUI();

  if (level === 1) {
    addLog('MATCH: ' + tileCount + ' tiles  (+' + points + ')');
  } else {
    addLog('CASCADE x' + level + ': ' + tileCount + ' tiles  (+' + points + ')');
  }

  const matchKeys = [...matches];
  for (const key of matchKeys) {
    const [r, c] = key.split(',').map(Number);
    const idx = r * COLS + c;
    const cell = gridEl.children[idx];
    if (cell) cell.classList.add('removing');
  }

  setTimeout(() => {
    for (const key of matchKeys) {
      const [r, c] = key.split(',').map(Number);
      grid[r][c] = null;
    }

    applyGravity();
    const hadRefill = refillGrid();
    render();
    if (hadRefill) tagNewTiles();

    setTimeout(() => processMatches(level), 280);
  }, 400);
}

function finishTurn() {
  if (movesLeft <= 0) {
    gameOver = true;
    isProcessing = false;
    setStatus('GAME OVER  —  FINAL SCORE: ' + score);
    addLog('GAME OVER');
    render();
    return;
  }

  const anyPossible = hasAnyMatch();
  if (!anyPossible) {
    addLog('NO VALID MOVES — RESHUFFLING');
    reshuffleGrid();
    setTimeout(() => {
      if (findMatches().size > 0) {
        addLog('RESHUFFLE CREATED MATCHES — CASCADING');
        processMatches(0);
      } else {
        isProcessing = false;
        setStatus('SELECT A TILE');
        render();
      }
    }, 300);
    return;
  }

  isProcessing = false;
  selectedCell = null;
  setStatus('SELECT A TILE');
  render();
}

function reshuffleGrid() {
  const values = [];
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      values.push(grid[r][c]);

  for (let i = values.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [values[i], values[j]] = [values[j], values[i]];
  }

  let idx = 0;
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      grid[r][c] = values[idx++];
}

function hasAnyMatch() {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (c + 1 < COLS) {
        [grid[r][c], grid[r][c + 1]] = [grid[r][c + 1], grid[r][c]];
        if (findMatches().size > 0) {
          [grid[r][c], grid[r][c + 1]] = [grid[r][c + 1], grid[r][c]];
          return true;
        }
        [grid[r][c], grid[r][c + 1]] = [grid[r][c + 1], grid[r][c]];
      }
      if (r + 1 < ROWS) {
        [grid[r][c], grid[r + 1][c]] = [grid[r + 1][c], grid[r][c]];
        if (findMatches().size > 0) {
          [grid[r][c], grid[r + 1][c]] = [grid[r + 1][c], grid[r][c]];
          return true;
        }
        [grid[r][c], grid[r + 1][c]] = [grid[r + 1][c], grid[r][c]];
      }
    }
  }
  return false;
}

// ── Swap mechanics ──

function onCellClick(r, c) {
  if (isProcessing || gameOver) return;

  if (selectedCell === null) {
    selectedCell = { r, c };
    addLog('SELECTED  (' + (r + 1) + ',' + (c + 1) + ')');
    render();
    return;
  }

  if (selectedCell.r === r && selectedCell.c === c) {
    selectedCell = null;
    setStatus('SELECT A TILE');
    render();
    return;
  }

  const dr = Math.abs(selectedCell.r - r);
  const dc = Math.abs(selectedCell.c - c);

  if (dr + dc !== 1) {
    selectedCell = { r, c };
    addLog('SELECTED  (' + (r + 1) + ',' + (c + 1) + ')');
    render();
    return;
  }

  attemptSwap(selectedCell.r, selectedCell.c, r, c);
}

function attemptSwap(r1, c1, r2, c2) {
  isProcessing = true;

  [grid[r1][c1], grid[r2][c2]] = [grid[r2][c2], grid[r1][c1]];
  render();

  const matches = findMatches();

  if (matches.size === 0) {
    [grid[r1][c1], grid[r2][c2]] = [grid[r2][c2], grid[r1][c1]];
    render();
    flashInvalid(r1, c1, r2, c2);
    addLog('NO MATCH — REVERSED');
    isProcessing = false;
    selectedCell = null;
    setStatus('SELECT A TILE');
    return;
  }

  movesLeft--;
  selectedCell = null;
  updateUI();

  if (movesLeft <= 0) {
    addLog('FINAL MOVE');
  }

  setTimeout(() => processMatches(0), 80);
}

function flashInvalid(r1, c1, r2, c2) {
  const idx1 = r1 * COLS + c1;
  const idx2 = r2 * COLS + c2;
  const c1El = gridEl.children[idx1];
  const c2El = gridEl.children[idx2];
  if (c1El) c1El.classList.add('invalid');
  if (c2El) c2El.classList.add('invalid');
  setTimeout(() => {
    if (c1El) c1El.classList.remove('invalid');
    if (c2El) c2El.classList.remove('invalid');
  }, 380);
}

// ── UI helpers ──

function setStatus(msg) {
  if (statusEl) statusEl.textContent = msg;
}

function addLog(msg) {
  setStatus(msg);
}

function updateUI() {
  if (scoreEl) scoreEl.textContent = score;
  if (movesEl) movesEl.textContent = movesLeft;
}

// ── Rendering ──

function createGridElements() {
  gridEl.innerHTML = '';
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.addEventListener('click', () => onCellClick(r, c));
      const gem = document.createElement('div');
      gem.className = 'gem';
      cell.appendChild(gem);
      gridEl.appendChild(cell);
    }
  }
}

function render() {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const idx = r * COLS + c;
      const cellEl = gridEl.children[idx];
      if (!cellEl) continue;

      const gemEl = cellEl.querySelector('.gem');
      const type = grid[r][c];

      cellEl.classList.toggle('selected', selectedCell !== null && selectedCell.r === r && selectedCell.c === c);

      gemEl.className = 'gem';
      if (type !== null && type >= 0 && type < NUM_TYPES) {
        gemEl.classList.add('gem-' + type);
      }
    }
  }
}

// ── Game lifecycle ──

function resetGame() {
  grid = [];
  score = 0;
  movesLeft = INITIAL_MOVES;
  selectedCell = null;
  isProcessing = false;
  gameOver = false;
  generateGrid();
  updateUI();
  setStatus('SELECT A TILE');
  render();
}

// ── Events ──

if (resetBtn) resetBtn.addEventListener('click', resetGame);

document.addEventListener('keydown', (e) => {
  if (e.key === 'r' || e.key === 'R') resetGame();
});

// ── Boot ──

document.addEventListener('DOMContentLoaded', () => {
  createGridElements();
  resetGame();
});
