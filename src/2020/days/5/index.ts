import { readInput } from '../../../lib/input';

function getSeatId(row: number, column: number): number {
  return row * 8 + column;
}

async function partOne() {
  const input = await readInput('./input.txt', { relativeTo: __dirname, splitLines: true });
  const seatIds = input.map((line) => {
    const binary = line.replace(/B|R/g, '1').replace(/F|L/g, '0');
    return parseInt(binary, 2);
  });

  return Math.max(...seatIds);
}

async function partTwo() {
  const input = await readInput('./input.txt', { relativeTo: __dirname, splitLines: true });
  const seatIds = new Set(input.map((line) => {
    const binary = line.replace(/B|R/g, '1').replace(/F|L/g, '0');
    return parseInt(binary, 2);
  }));

  for (let row = 0; row <= 127; row++) {
    for (let column = 0; column <= 8; column++) {
      const seatId = getSeatId(row, column);
      if (seatIds.has(seatId)) {
        continue;
      }

      if (seatIds.has(seatId - 1) && seatIds.has(seatId + 1)) {
        return seatId;
      }
    }
  }

  throw new Error('Did not find seat');
}

async function solve() {
  console.log('Result of part one', await partOne());
  console.log('Result of part two', await partTwo());
}

solve().catch(console.error);
