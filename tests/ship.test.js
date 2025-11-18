const { createShip } = require('../src/Ship');

describe('Ship', () => {
  test('creates ship with length and zero hits', () => {
    const ship = createShip(3);
    expect(ship.length).toBe(3);
    expect(ship.hits()).toBe(0);
    expect(ship.isSunk()).toBe(false);
  });

  test('hit increases hits and eventually sinks', () => {
    const ship = createShip(2);
    ship.hit();
    expect(ship.hits()).toBe(1);
    expect(ship.isSunk()).toBe(false);
    ship.hit();
    expect(ship.isSunk()).toBe(true);
  });

  test('invalid length throws', () => expect(() => createShip(0)).toThrow(TypeError));
});
