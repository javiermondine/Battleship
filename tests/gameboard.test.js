const { createGameboard } = require('../src/Gameboard');

describe('Gameboard', () => {
  test('place and get ships', () => {
    const gb = createGameboard(10);
    const id = gb.placeShip(0,0,3,'horizontal');
    const ships = gb.getShips();
    expect(ships.length).toBe(1);
    expect(ships[0].id).toBe(id);
    expect(ships[0].length).toBe(3);
  });

  test('placing overlapping ship throws', () => {
    const gb = createGameboard(5);
    gb.placeShip(0,0,3,'horizontal');
    expect(() => gb.placeShip(0,0,2,'vertical')).toThrow(Error);
  });

  test('receiveAttack hits and records misses', () => {
    const gb = createGameboard(5);
    const id = gb.placeShip(1,1,2,'vertical');
    const res1 = gb.receiveAttack(1,1);
    expect(res1.hit).toBe(true);
    const res2 = gb.receiveAttack(0,0);
    expect(res2.hit).toBe(false);
    const missed = gb.getMissedShots();
    expect(missed).toEqual(expect.arrayContaining([{ x:0, y:0 }]));
  });

  test('allShipsSunk reports correctly', () => {
    const gb = createGameboard(5);
    gb.placeShip(0,0,2,'horizontal');
    gb.placeShip(2,2,1,'vertical');
    gb.receiveAttack(0,0);
    gb.receiveAttack(1,0);
    gb.receiveAttack(2,2);
    expect(gb.allShipsSunk()).toBe(true);
  });
});
