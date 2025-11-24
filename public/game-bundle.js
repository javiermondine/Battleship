// game-bundle.js - All game logic bundled for browser use
// This combines all modules into a single file for use without bundling tools

function createShip(length) {
  if (!Number.isInteger(length) || length <= 0) throw new TypeError('Length must be positive integer');
  let hits = 0;
  return {
    length,
    hits() {
      return hits;
    },
    hit() {
      hits += 1;
    },
    isSunk() {
      return hits >= length;
    }
  };
}

function createGameboard(size = 10) {
  if (!Number.isInteger(size) || size <= 0) throw new TypeError('Size must be positive integer');
  const ships = [];
  const shipPositions = {};
  const missed = new Set();

  function inBounds(x, y) {
    return x >= 0 && x < size && y >= 0 && y < size;
  }

  function placeShip(startX, startY, length, direction) {
    if (!['horizontal', 'vertical'].includes(direction)) throw new TypeError('Invalid direction');
    if (!Number.isInteger(length) || length <= 0) throw new TypeError('Invalid length');
    const coords = [];
    for (let i = 0; i < length; i++) {
      const x = startX + (direction === 'horizontal' ? i : 0);
      const y = startY + (direction === 'vertical' ? i : 0);
      if (!inBounds(x, y)) throw new RangeError('Ship out of bounds');
      const key = `${x},${y}`;
      if (shipPositions[key]) throw new Error('Overlap with existing ship');
      coords.push({ x, y, key });
    }
    const ship = createShip(length);
    const shipId = ships.length;
    ships.push({ ship, coords: coords.map(c => c.key) });
    coords.forEach((c, idx) => {
      shipPositions[c.key] = { shipId, index: idx };
    });
    return shipId;
  }

  function receiveAttack(x, y) {
    if (!inBounds(x, y)) throw new RangeError('Attack out of bounds');
    const key = `${x},${y}`;
    if (shipPositions[key]) {
      const { shipId } = shipPositions[key];
      const target = ships[shipId];
      target.ship.hit();
      return { hit: true, shipId };
    }
    missed.add(key);
    return { hit: false };
  }

  function allShipsSunk() {
    return ships.length > 0 && ships.every(s => s.ship.isSunk());
  }

  function getMissedShots() {
    return Array.from(missed).map(k => {
      const [x, y] = k.split(',').map(Number);
      return { x, y };
    });
  }

  function getShips() {
    return ships.map((s, id) => ({ id, length: s.ship.length, hits: s.ship.hits(), sunk: s.ship.isSunk(), coords: s.coords }));
  }

  return { placeShip, receiveAttack, allShipsSunk, getMissedShots, getShips, size };
}

function createPlayer(type = 'human') {
  if (!['human', 'computer'].includes(type)) throw new TypeError('Player type must be human or computer');
  const gameboard = createGameboard(10);
  const movesMade = new Set();

  function randomMove() {
    for (let attempts = 0; attempts < 1000; attempts++) {
      const x = Math.floor(Math.random() * gameboard.size);
      const y = Math.floor(Math.random() * gameboard.size);
      const key = `${x},${y}`;
      if (!movesMade.has(key)) return { x, y };
    }
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

function autoPlaceShips(gameboard) {
  const sizes = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
  sizes.forEach(size => {
    let placed = false;
    for (let attempts = 0; attempts < 100 && !placed; attempts++) {
      const direction = Math.random() > 0.5 ? 'horizontal' : 'vertical';
      const x = direction === 'horizontal' 
        ? Math.floor(Math.random() * (11 - size))
        : Math.floor(Math.random() * 10);
      const y = direction === 'vertical'
        ? Math.floor(Math.random() * (11 - size))
        : Math.floor(Math.random() * 10);
      try {
        gameboard.placeShip(x, y, size, direction);
        placed = true;
      } catch (e) {
        // retry
      }
    }
  });
}
