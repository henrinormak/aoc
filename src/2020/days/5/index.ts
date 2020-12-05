import { readInput } from '../../../lib/input';

function findRow(chars: string[]): number {
  let lower = 0;
  let upper = 127;

  chars.forEach((char) => {
    const change = Math.ceil((upper - lower) / 2);

    if (char === 'F') {
      upper -= change;
    } else {
      lower += change;
    }
  });

  return lower;
}

function findColumn(chars: string[]): number {
  let lower = 0;
  let upper = 7;

  chars.forEach((char) => {
    const change = Math.ceil((upper - lower) / 2);

    if (char === 'L') {
      upper -= change;
    } else {
      lower += change;
    }
  });

  return lower;
}

function getSeatId(row: number, column: number): number {
  return row * 8 + column;
}

async function partOne() {
  const input = await readInput('./input.txt', { relativeTo: __dirname, splitLines: true });
  const seatIds = input.map((line) => {
    const chars = line.split('');
    const row = findRow(chars.slice(0, 7));
    const column = findColumn(chars.slice(7));

    return getSeatId(row, column);
  });

  return Math.max(...seatIds);
}

async function partTwo() {
  const input = await readInput('./input.txt', { relativeTo: __dirname, splitLines: true });
  const seatIds = new Set(input.map((line) => {
    const chars = line.split('');
    const row = findRow(chars.slice(0, 7));
    const column = findColumn(chars.slice(7));

    return getSeatId(row, column);
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
