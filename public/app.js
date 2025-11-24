// app.js - Game Controller
(function() {
  'use strict';

  let player = null;
  let computer = null;
  let gameStarted = false;

  const gameState = {
    shipsPlaced: false,
    gameInProgress: false,
    gameOver: false
  };

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

  function renderBoard(gameboard, container, isEnemy = false) {
    container.innerHTML = '';
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

    if (gameStarted && !gameState.gameOver) {
      turn.textContent = 'Tu turno (haz clic en el tablero enemigo)';
    } else if (gameState.gameOver) {
      turn.textContent = 'Juego terminado';
    } else {
      turn.textContent = 'Preparación - Coloca tus barcos';
    }

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

      if (computer.gameboard.allShipsSunk()) {
        gameState.gameOver = true;
        showMessage('¡Ganaste! Hundiste todos los barcos enemigos.', 'success');
        updateGameInfo();
        renderBoard(player.gameboard, document.getElementById('playerBoard'), false);
        renderBoard(computer.gameboard, document.getElementById('enemyBoard'), true);
        document.getElementById('enemyBoard').style.pointerEvents = 'none';
        return;
      }

      setTimeout(() => {
        computerAttack();
      }, 800);
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

      if (player.gameboard.allShipsSunk()) {
        gameState.gameOver = true;
        showMessage('Perdiste. La computadora hundió todos tus barcos.', 'error');
        updateGameInfo();
        renderBoard(player.gameboard, document.getElementById('playerBoard'), false);
        renderBoard(computer.gameboard, document.getElementById('enemyBoard'), true);
        document.getElementById('enemyBoard').style.pointerEvents = 'none';
        return;
      }

      updateGameInfo();
      renderBoard(player.gameboard, document.getElementById('playerBoard'), false);
      renderBoard(computer.gameboard, document.getElementById('enemyBoard'), true);
      attachEnemyBoardListeners();
    } catch (e) {
      showMessage(`Error: ${e.message}`, 'error');
    }
  }

  function attachEnemyBoardListeners() {
    const container = document.getElementById('enemyBoard');
    const cells = container.querySelectorAll('.board-cell');
    cells.forEach(cell => {
      cell.onclick = function() {
        if (!gameStarted || gameState.gameOver) return;
        const x = parseInt(this.dataset.x);
        const y = parseInt(this.dataset.y);
        if (player.movesMade.has(`${x},${y}`)) {
          showMessage('Ya disparaste a esa posición', 'error');
          return;
        }
        playerAttack(x, y);
      };
    });
  }

  function placePlayerShips() {
    try {
      autoPlaceShips(player.gameboard);
      gameState.shipsPlaced = true;
      showMessage('✓ Barcos colocados. ¡Haz clic en "Comenzar Juego"!', 'success');
      document.getElementById('startGameBtn').disabled = false;
      renderBoard(player.gameboard, document.getElementById('playerBoard'), false);
    } catch (e) {
      showMessage(`Error: ${e.message}`, 'error');
    }
  }

  function startGame() {
    if (!gameState.shipsPlaced) {
      showMessage('Coloca tus barcos primero', 'error');
      return;
    }
    gameStarted = true;
    gameState.gameInProgress = true;
    showMessage('¡Juego iniciado! Haz clic en el tablero enemigo para disparar.', 'info');
    document.getElementById('randomPlacementBtn').disabled = true;
    document.getElementById('startGameBtn').disabled = true;
    updateGameInfo();
    attachEnemyBoardListeners();
  }

  function resetGame() {
    gameStarted = false;
    gameState.shipsPlaced = false;
    gameState.gameInProgress = false;
    gameState.gameOver = false;
    
    player = createPlayer('human');
    computer = createPlayer('computer');
    autoPlaceShips(computer.gameboard);
    
    showMessage('Nuevo juego. Coloca tus barcos.', 'info');
    document.getElementById('randomPlacementBtn').disabled = false;
    document.getElementById('startGameBtn').disabled = true;
    document.getElementById('enemyBoard').style.pointerEvents = 'auto';
    
    renderBoard(player.gameboard, document.getElementById('playerBoard'), false);
    renderBoard(computer.gameboard, document.getElementById('enemyBoard'), true);
  }

  document.getElementById('randomPlacementBtn').addEventListener('click', placePlayerShips);
  document.getElementById('startGameBtn').addEventListener('click', startGame);
  document.getElementById('resetBtn').addEventListener('click', resetGame);

  window.addEventListener('DOMContentLoaded', () => {
    player = createPlayer('human');
    computer = createPlayer('computer');
    autoPlaceShips(computer.gameboard);
    
    showMessage('Bienvenido a Battleship. Haz clic en "Colocar Barcos" para comenzar.', 'info');
    updateGameInfo();
    renderBoard(player.gameboard, document.getElementById('playerBoard'), false);
    renderBoard(computer.gameboard, document.getElementById('enemyBoard'), true);
  });
})();
