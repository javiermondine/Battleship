const { createGameboard } = require('./Gameboard');

function createPlayer(type = 'human') {
  if (!['human', 'computer'].includes(type)) throw new TypeError('Player type must be human or computer');
  const gameboard = createGameboard(10);
  const movesMade = new Set();

  function randomMove() {
    // pick random coordinate not already used
    for (let attempts = 0; attempts < 1000; attempts++) {
      const x = Math.floor(Math.random() * gameboard.size);
      const y = Math.floor(Math.random() * gameboard.size);
      const key = `${x},${y}`;
      if (!movesMade.has(key)) return { x, y };
    }
    // fallback sequential
    for (let x = 0; x < gameboard.size; x++) {
      for (let y = 0; y < gameboard.size; y++) {
        const key = `${x},${y}`;
        if (!movesMade.has(key)) return { x, y };
      }
    }
    return null;
  }

  function makeMove(x, y) {
    const key = `${x},${y}`;
    if (movesMade.has(key)) throw new Error('Move already made');
    movesMade.add(key);
    return { x, y };
  }

  function playComputerMove() {
    if (type !== 'computer') throw new Error('Not a computer player');
    const mv = randomMove();
    if (!mv) throw new Error('No moves left');
    makeMove(mv.x, mv.y);
    return mv;
  }

  return { type, gameboard, makeMove, playComputerMove, movesMade };
}

module.exports = { createPlayer };
