function createGameManager() {
  let player = null;
  let computer = null;
  let currentPlayer = 'player';
  let gameOver = false;
  let winner = null;

  function initGame(player1, computer1) {
    player = player1;
    computer = computer1;
    currentPlayer = 'player';
    gameOver = false;
    winner = null;
  }

  function switchTurn() {
    currentPlayer = currentPlayer === 'player' ? 'computer' : 'player';
  }

  function getCurrentPlayer() {
    return currentPlayer === 'player' ? player : computer;
  }

  function getOpponentGameboard() {
    return currentPlayer === 'player' ? computer.gameboard : player.gameboard;
  }

  function playerAttack(x, y) {
    if (currentPlayer !== 'player') throw new Error('Not player turn');
    if (gameOver) throw new Error('Game already over');
    
    const opponent = computer;
    const result = opponent.gameboard.receiveAttack(x, y);
    player.makeMove(x, y);

    if (opponent.gameboard.allShipsSunk()) {
      gameOver = true;
      winner = 'player';
      return { ...result, gameOver: true, winner: 'player' };
    }

    switchTurn();
    return result;
  }

  function computerAttack() {
    if (currentPlayer !== 'computer') throw new Error('Not computer turn');
    if (gameOver) throw new Error('Game already over');

    const move = computer.playComputerMove();
    const result = player.gameboard.receiveAttack(move.x, move.y);

    if (player.gameboard.allShipsSunk()) {
      gameOver = true;
      winner = 'computer';
      return { ...result, gameOver: true, winner: 'computer' };
    }

    switchTurn();
    return result;
  }

  function isGameOver() {
    return gameOver;
  }

  function getWinner() {
    return winner;
  }

  return {
    initGame,
    getCurrentPlayer,
    getOpponentGameboard,
    playerAttack,
    computerAttack,
    switchTurn,
    isGameOver,
    getWinner
  };
}

module.exports = { createGameManager };
