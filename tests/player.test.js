const { createPlayer } = require('../src/Player');

describe('Player', () => {
  test('create human player with gameboard', () => {
    const p = createPlayer('human');
    expect(p.type).toBe('human');
    expect(p.gameboard).toBeDefined();
  });

  test('computer play move and not repeat', () => {
    const cpu = createPlayer('computer');
    const mv1 = cpu.playComputerMove();
    expect(mv1).toHaveProperty('x');
    expect(mv1).toHaveProperty('y');
    // ensure move recorded
    expect(cpu.movesMade.size).toBe(1);
    // next move different
    const mv2 = cpu.playComputerMove();
    expect(cpu.movesMade.size).toBe(2);
  });

  test('makeMove throws if repeated', () => {
    const p = createPlayer('human');
    p.makeMove(0,0);
    expect(() => p.makeMove(0,0)).toThrow(Error);
  });
});
