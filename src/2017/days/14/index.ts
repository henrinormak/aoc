import { readInput } from '../../../lib/input';
import { buildArray, chunkArray } from '../../../lib/util';

function calculateKnotHash(input: string) {
  const lengths = [...input.split('').map((char) => char.charCodeAt(0)), 17, 31, 73, 47, 23];
  const listSize = 256;
  const list = buildArray(listSize, (idx) => idx);
  let currentIndex = 0;
  let skip = 0;

  for (let i = 0; i < 64; i++) {
    lengths.forEach((length) => {
      if (length > listSize) {
        throw new Error('Invalid length');
      }

      // Grab the part of the list to be reversed
      const available = listSize - currentIndex;
      const tail = Math.min(available, length);
      const head = Math.max(length - available, 0);
      const reversed = [...list.slice(currentIndex, currentIndex + tail), ...list.slice(0, head)].reverse();

      if (head > 0) {
        list.splice(0, head, ...reversed.slice(length - head));
      }

      list.splice(currentIndex, tail, ...reversed.slice(0, tail));

      currentIndex = (currentIndex + (length + skip)) % listSize;
      skip++;
    });
  }

  return chunkArray(list, 16).map((chunk) => chunk.reduce((hash, val) => hash ^ val, 0)).map((val) => val.toString(16).padStart(2, '0')).join('');
}

async function partOne() {
  const input = await readInput('./input.txt', { relativeTo: __dirname, splitLines: false });
  const key = input[0];
  const rows = 128;
  let used = 0;

  for (let i = 0; i < rows; i++) {
    const state = calculateKnotHash(`${key}-${i}`);
    const binaryState = state.split('').map((val) => parseInt(val, 16).toString(2).padStart(4, '0')).join('');
    used += binaryState.split('').filter((val) => val === '1').length;
  }

  return used;
}

function findConnectedPoints(grid: number[][], coordinate: { row: number; column: number }, seen: Set<string> = new Set<string>()): { row: number; column: number }[] {
  const neighbours = [
    { row: coordinate.row - 1, column: coordinate.column },
    { row: coordinate.row, column: coordinate.column + 1 },
    { row: coordinate.row + 1, column: coordinate.column },
    { row: coordinate.row, column: coordinate.column - 1 },
  ];

  seen.add(`${coordinate.row}:${coordinate.column}`);
  const connectedNeighbours = neighbours.filter(({ row, column }) => grid[row] !== undefined ? grid[row][column] === 1 : false);

  return connectedNeighbours.map(({ row, column }) => {
    if (seen.has(`${row}:${column}`)) {
      return [];
    }

    return [
      { row, column },
      ...findConnectedPoints(grid, { row, column }, seen),
    ];
  }).reduce((memo, val) => memo.concat(val), []);
}

async function partTwo() {
  const input = await readInput('./input.txt', { relativeTo: __dirname, splitLines: false });
  const key = input[0];
  const rows = 128;
  const grid: number[][] = [];

  for (let i = 0; i < rows; i++) {
    const state = calculateKnotHash(`${key}-${i}`);
    const binaryState = state.split('').map((val) => parseInt(val, 16).toString(2).padStart(4, '0')).join('');
    grid.push(binaryState.split('').map((val) => parseInt(val, 10)));
  }

  // Go over all coordinates in the space, when we find any that is active, chase down all connected neighbours and mark them also as seen
  // Count the number of iterations we do as the number of regions we have
  const seen = new Set<string>();
  let regions = 0;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < rows; j++) {
      if (seen.has(`${i}:${j}`)) {
        continue;
      }

      if (grid[i][j] !== 1) {
        continue;
      }

      findConnectedPoints(grid, { row: i, column: j }, seen);
      regions++;
    }
  }

  return regions;
}

async function solve() {
  console.log('Result of part one', await partOne());
  console.log('Result of part two', await partTwo());
}

solve().catch(console.error);
