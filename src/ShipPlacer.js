const { createPlayer } = require('./Player');

function autoPlaceShips(gameboard) {
  const sizes = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
  sizes.forEach(size => {
    let placed = false;
    for (let attempts = 0; attempts < 100 && !placed; attempts++) {
      const direction = Math.random() > 0.5 ? 'horizontal' : 'vertical';
      const x = Math.floor(Math.random() * (direction === 'horizontal' ? 10 - size + 1 : 10));
      const y = Math.floor(Math.random() * (direction === 'vertical' ? 10 - size + 1 : 10));
      try {
        gameboard.placeShip(x, y, size, direction);
        placed = true;
      } catch (e) {
        // retry
      }
    }
  });
}

function createShipPlacer() {
  let selectedShips = [];

  function placeShipManually(gameboard, x, y, length, direction) {
    try {
      gameboard.placeShip(x, y, length, direction);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  function resetShips(gameboard) {
    // Create new gameboard since we can't "unplace" ships
    return gameboard;
  }

  return { placeShipManually, autoPlaceShips, resetShips };
}

module.exports = { autoPlaceShips, createShipPlacer };
