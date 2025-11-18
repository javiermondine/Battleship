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

module.exports = { createShip };
