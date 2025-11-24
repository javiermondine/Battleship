const { createPlayer } = require('./Player');

function autoPlaceShips(gameboard) {
  const sizes = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
  sizes.forEach(size => {
    let placed = false;
    for (let attempts = 0; attempts < 100 && !placed; attempts++) {
      const direction = Math.random() > 0.5 ? 'horizontal' : 'vertical';
      // For horizontal: x can be 0 to (10 - size), y can be 0 to 9
      // For vertical: x can be 0 to 9, y can be 0 to (10 - size)
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
