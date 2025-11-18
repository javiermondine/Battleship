// Minimal entry point, not used by tests. Exports factories for UI use.
const { createShip } = require('./Ship');
const { createGameboard } = require('./Gameboard');
const { createPlayer } = require('./Player');

module.exports = { createShip, createGameboard, createPlayer };
