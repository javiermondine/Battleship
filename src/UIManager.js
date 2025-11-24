function createUIManager() {
  function renderBoard(gameboard, boardId, isOpponent = false) {
    const container = document.getElementById(boardId);
    if (!container) return;
    container.innerHTML = '';

    const grid = document.createElement('div');
    grid.className = 'game-grid';
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = `repeat(10, 1fr)`;
    grid.style.gap = '2px';
    grid.style.padding = '10px';
    grid.style.backgroundColor = '#1a1a2e';
    grid.style.borderRadius = '4px';

    const ships = gameboard.getShips();
    const shipMap = {};
    ships.forEach(s => {
      s.coords.forEach(coord => {
        shipMap[coord] = s;
      });
    });

    const missed = gameboard.getMissedShots();
    const missedMap = {};
    missed.forEach(m => {
      missedMap[`${m.x},${m.y}`] = true;
    });

    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        const cell = document.createElement('div');
        const key = `${x},${y}`;
        cell.className = 'board-cell';
        cell.style.width = '30px';
        cell.style.height = '30px';
        cell.style.border = '1px solid #0f3460';
        cell.style.backgroundColor = '#16213e';
        cell.style.cursor = 'pointer';
        cell.style.display = 'flex';
        cell.style.alignItems = 'center';
        cell.style.justifyContent = 'center';
        cell.dataset.x = x;
        cell.dataset.y = y;

        if (missedMap[key]) {
          cell.style.backgroundColor = '#4a4a6a';
          cell.textContent = '○';
          cell.style.color = '#aaa';
          cell.style.fontSize = '12px';
        } else if (shipMap[key]) {
          if (isOpponent) {
            cell.style.backgroundColor = '#16213e';
          } else {
            cell.style.backgroundColor = '#0f4c75';
            cell.textContent = '■';
            cell.style.color = '#3282b8';
            cell.style.fontSize = '12px';
          }
          if (shipMap[key].hits > 0) {
            cell.style.backgroundColor = '#c1121f';
            cell.textContent = '✕';
            cell.style.color = '#fff';
            cell.style.fontSize = '14px';
          }
        }

        grid.appendChild(cell);
      }
    }

    container.appendChild(grid);
  }

  function showMessage(text, type = 'info') {
    const msg = document.getElementById('message');
    if (msg) {
      msg.textContent = text;
      msg.style.color = type === 'error' ? '#c1121f' : type === 'success' ? '#06a77d' : '#e0e0e0';
    }
  }

  function disableBoardClicks(boardId) {
    const container = document.getElementById(boardId);
    if (container) {
      const cells = container.querySelectorAll('.board-cell');
      cells.forEach(cell => {
        cell.style.pointerEvents = 'none';
        cell.style.opacity = '0.6';
      });
    }
  }

  function enableBoardClicks(boardId) {
    const container = document.getElementById(boardId);
    if (container) {
      const cells = container.querySelectorAll('.board-cell');
      cells.forEach(cell => {
        cell.style.pointerEvents = 'auto';
        cell.style.opacity = '1';
      });
    }
  }

  return { renderBoard, showMessage, disableBoardClicks, enableBoardClicks };
}

module.exports = { createUIManager };
