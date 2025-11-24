// Main entry point - Exports all game modules
const { createShip } = require('./Ship');
const { createGameboard } = require('./Gameboard');
const { createPlayer } = require('./Player');
const { createGameManager } = require('./GameManager');
const { createUIManager } = require('./UIManager');
const { autoPlaceShips, createShipPlacer } = require('./ShipPlacer');

module.exports = {
  createShip,
  createGameboard,
  createPlayer,
  createGameManager,
  createUIManager,
  autoPlaceShips,
  createShipPlacer
};
