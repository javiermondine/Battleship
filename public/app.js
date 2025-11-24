// app.js - Game Controller (runs in browser, requires bundled modules or can be adapted)
// For now, this is pseudocode showing the intended UI flow
// A proper implementation would need module bundling or vanilla JS imports

(function() {
  'use strict';

  // Mock object holders - in production these would come from proper imports
  let player = null;
  let computer = null;
  let gameManager = null;
  let uiManager = null;
  let gameStarted = false;

  // Simple module imports (would use proper bundling in production)
  const mockGameState = {
    shipsPlaced: false,
    gameInProgress: false,
    gameOver: false
  };

  // UI Functions
  function showMessage(text, type = 'info') {
    const msg = document.getElementById('message');
    if (msg) {
      msg.textContent = text;
      msg.className = 'message';
      if (type === 'success') msg.classList.add('success-message');
      if (type === 'error') msg.classList.add('error-message');
      if (type === 'info') msg.classList.add('info-message');
    }
  }

  function renderPlayerBoard() {
    const container = document.getElementById('playerBoard');
    container.innerHTML = '';
    renderBoard(player.gameboard, container, false);
  }

  function renderEnemyBoard() {
    const container = document.getElementById('enemyBoard');
    container.innerHTML = '';
    const grid = renderBoard(player.gameboard, container, true, true);
    
    // Add click handlers to enemy board
    const cells = grid.querySelectorAll('.board-cell');
    cells.forEach(cell => {
      cell.addEventListener('click', () => {
        if (!gameStarted || mockGameState.gameOver) return;
        const x = parseInt(cell.dataset.x);
        const y = parseInt(cell.dataset.y);
        playerAttack(x, y);
      });
    });
  }

  function renderBoard(gameboard, container, isEnemy = false, interactive = false) {
    const grid = document.createElement('div');
    grid.className = 'game-grid';

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
        cell.dataset.x = x;
        cell.dataset.y = y;

        if (missedMap[key]) {
          cell.classList.add('miss');
          cell.textContent = '○';
        } else if (shipMap[key]) {
          const ship = shipMap[key];
          if (!isEnemy) {
            cell.classList.add('ship');
            if (ship.hits > 0) {
              cell.classList.add('hit');
              cell.textContent = '✕';
            } else {
              cell.textContent = '■';
            }
          } else {
            if (ship.hits > 0) {
              cell.classList.add('hit');
              cell.textContent = '✕';
            }
          }
        }

        grid.appendChild(cell);
      }
    }

    container.appendChild(grid);
    return grid;
  }

  function updateGameInfo() {
    const turn = document.getElementById('turn');
    const enemySunk = document.getElementById('enemySunkCount');
    const playerSunk = document.getElementById('playerSunkCount');

    if (gameStarted && !mockGameState.gameOver) {
      turn.textContent = 'Tu turno (haz clic en el tablero enemigo)';
    } else if (mockGameState.gameOver) {
      turn.textContent = 'Juego terminado';
    } else {
      turn.textContent = 'Preparación - Coloca tus barcos';
    }

    // Count sunk ships
    const enemyShips = computer.gameboard.getShips();
    const playerShips = player.gameboard.getShips();
    const enemySunkCount = enemyShips.filter(s => s.sunk).length;
    const playerSunkCount = playerShips.filter(s => s.sunk).length;

    enemySunk.textContent = `${enemySunkCount}/${enemyShips.length}`;
    playerSunk.textContent = `${playerSunkCount}/${playerShips.length}`;
  }

  function playerAttack(x, y) {
    try {
      const result = computer.gameboard.receiveAttack(x, y);
      player.makeMove(x, y);

      if (result.hit) {
        showMessage(`¡Impacto en (${x}, ${y})!`, 'success');
      } else {
        showMessage(`Agua en (${x}, ${y})...`, 'info');
      }

      // Check win condition
      if (computer.gameboard.allShipsSunk()) {
        mockGameState.gameOver = true;
        showMessage('¡Ganaste! Hundiste todos los barcos enemigos.', 'success');
        updateGameInfo();
        renderPlayerBoard();
        renderEnemyBoard();
        return;
      }

      // Computer's turn after a delay
      setTimeout(() => {
        computerAttack();
        updateGameInfo();
        renderPlayerBoard();
        renderEnemyBoard();
      }, 1000);
    } catch (e) {
      showMessage(`Error: ${e.message}`, 'error');
    }
  }

  function computerAttack() {
    try {
      const move = computer.playComputerMove();
      const result = player.gameboard.receiveAttack(move.x, move.y);

      if (result.hit) {
        showMessage(`Computadora impactó en (${move.x}, ${move.y})`, 'error');
      } else {
        showMessage(`Computadora disparó a agua`, 'info');
      }

      // Check lose condition
      if (player.gameboard.allShipsSunk()) {
        mockGameState.gameOver = true;
        showMessage('Perdiste. La computadora hundió todos tus barcos.', 'error');
      }
    } catch (e) {
      showMessage(`Error en turno computadora: ${e.message}`, 'error');
    }
  }

  function autoPlaceShips() {
    const sizes = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
    try {
      sizes.forEach(size => {
        let placed = false;
        for (let attempts = 0; attempts < 100 && !placed; attempts++) {
          const direction = Math.random() > 0.5 ? 'horizontal' : 'vertical';
          const x = Math.floor(Math.random() * (direction === 'horizontal' ? 10 - size + 1 : 10));
          const y = Math.floor(Math.random() * (direction === 'vertical' ? 10 - size + 1 : 10));
          try {
            player.gameboard.placeShip(x, y, size, direction);
            placed = true;
          } catch (e) {
            // retry
          }
        }
        if (!placed) throw new Error(`No se pudo colocar barco de tamaño ${size}`);
      });
      mockGameState.shipsPlaced = true;
      showMessage('✓ Barcos colocados. ¡Haz clic en "Comenzar Juego"!', 'success');
      document.getElementById('startGameBtn').disabled = false;
      renderPlayerBoard();
    } catch (e) {
      showMessage(`Error al colocar barcos: ${e.message}`, 'error');
    }
  }

  function startGame() {
    if (!mockGameState.shipsPlaced) {
      showMessage('Coloca tus barcos primero', 'error');
      return;
    }
    gameStarted = true;
    mockGameState.gameInProgress = true;
    showMessage('¡Juego iniciado! Haz clic en el tablero enemigo para disparar.', 'info');
    document.getElementById('randomPlacementBtn').disabled = true;
    document.getElementById('startGameBtn').disabled = true;
    updateGameInfo();
    renderPlayerBoard();
    renderEnemyBoard();
  }

  function resetGame() {
    gameStarted = false;
    mockGameState.shipsPlaced = false;
    mockGameState.gameInProgress = false;
    mockGameState.gameOver = false;
    showMessage('Nuevo juego. Coloca tus barcos.', 'info');
    document.getElementById('randomPlacementBtn').disabled = false;
    document.getElementById('startGameBtn').disabled = true;
    
    // Would reinitialize player and computer objects here
    // player = createPlayer('human');
    // computer = createPlayer('computer');
    // Then auto-place computer ships
  }

  // Event Listeners
  document.getElementById('randomPlacementBtn')?.addEventListener('click', autoPlaceShips);
  document.getElementById('startGameBtn')?.addEventListener('click', startGame);
  document.getElementById('resetBtn')?.addEventListener('click', resetGame);

  // Initialize game on load
  window.addEventListener('DOMContentLoaded', () => {
    showMessage('Bienvenido a Battleship. Coloca tus barcos para comenzar.', 'info');
    // Initialize would happen here
    // player = createPlayer('human');
    // computer = createPlayer('computer');
    // Then auto-place computer ships
  });
})();
