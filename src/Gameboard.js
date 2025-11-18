const { createShip } = require('./Ship');

function createGameboard(size = 10) {
  if (!Number.isInteger(size) || size <= 0) throw new TypeError('Size must be positive integer');
  // board will track ships by id and store positions mapping
  const ships = [];
  const shipPositions = {}; // key: "x,y" -> { shipId, index }
  const missed = new Set();

  function inBounds(x, y) {
    return x >= 0 && x < size && y >= 0 && y < size;
  }

  function placeShip(startX, startY, length, direction) {
    // direction: 'horizontal' or 'vertical'
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

module.exports = { createGameboard };
