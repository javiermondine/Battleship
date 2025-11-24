const { createGameManager } = require('../src/GameManager');
const { createPlayer } = require('../src/Player');

describe('GameManager', () => {
  let player, computer, gm;

  beforeEach(() => {
    player = createPlayer('human');
    computer = createPlayer('computer');
    gm = createGameManager();
    
    // Place ships on both
    player.gameboard.placeShip(0, 0, 2, 'horizontal');
    computer.gameboard.placeShip(5, 5, 3, 'horizontal');
  });

  test('initializes game with players', () => {
    gm.initGame(player, computer);
    expect(gm.getCurrentPlayer()).toBe(player);
    expect(gm.getOpponentGameboard()).toBe(computer.gameboard);
  });

  test('playerAttack records hit and switches turn', () => {
    gm.initGame(player, computer);
    const result = gm.playerAttack(5, 5);
    expect(result.hit).toBe(true);
  });

  test('game ends when all ships sunk', () => {
    gm.initGame(player, computer);
    const result1 = gm.playerAttack(5, 5);
    expect(result1.hit).toBe(true);
    // After player attack, turn switches to computer
    gm.computerAttack(); // Computer plays
    // Now back to player turn
    const result2 = gm.playerAttack(6, 5);
    expect(result2.hit).toBe(true);
    gm.computerAttack();
    const result3 = gm.playerAttack(7, 5);
    expect(result3.gameOver).toBe(true);
    expect(result3.winner).toBe('player');
    expect(gm.isGameOver()).toBe(true);
  });

  test('getWinner returns null until game over', () => {
    gm.initGame(player, computer);
    expect(gm.getWinner()).toBeNull();
  });
});
