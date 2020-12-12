import { readMappedInput } from '../../../lib/input';
import { flatten } from '../../../lib/util';

function occupiedAdjacentSeatsSimple(state: string[][], row: number, col: number) {
  return [
    state[row - 1]?.[col - 1],
    state[row - 1]?.[col],
    state[row - 1]?.[col + 1],
    state[row]?.[col - 1],
    state[row]?.[col + 1],
    state[row + 1]?.[col - 1],
    state[row + 1]?.[col],
    state[row + 1]?.[col + 1],
  ].filter((val) => val === '#').length;
}

function occupiedAdjacentSeatsComplex(state: string[][], row: number, col: number) {
  return [
    findFirstSeat(state, row, col, (r, c) => ({ row: r - 1, col: c - 1 })),
    findFirstSeat(state, row, col, (r, c) => ({ row: r - 1, col: c })),
    findFirstSeat(state, row, col, (r, c) => ({ row: r - 1, col: c + 1 })),
    findFirstSeat(state, row, col, (r, c) => ({ row: r, col: c - 1 })),
    findFirstSeat(state, row, col, (r, c) => ({ row: r, col: c + 1 })),
    findFirstSeat(state, row, col, (r, c) => ({ row: r + 1, col: c - 1 })),
    findFirstSeat(state, row, col, (r, c) => ({ row: r + 1, col: c })),
    findFirstSeat(state, row, col, (r, c) => ({ row: r + 1, col: c + 1 })),
  ].filter((val) => val === '#').length;
}

function findFirstSeat(state: string[][], row: number, col: number, increment: (row: number, col: number) => { row: number; col: number }) {
  let { row: r, col: c } = increment(row, col);
  let current = state[r]?.[c];

  while (current === '.') {
    const { row: nextR, col: nextC } = increment(r, c);
    r = nextR;
    c = nextC;

    current = state[r]?.[c];
  }

  return current;
}

function generateNextStateSimple(state: string[][]) {
  const result: string[][] = [];
  const lineLength = state[0].length;

  for (let row = 0; row < state.length; row++) {
    result.push([]);
    for (let col = 0; col < lineLength; col++) {
      const prev = state[row][col];

      switch (prev) {
        case '.':
          result[row][col] = '.';
          break;
        case 'L':
          result[row][col] = occupiedAdjacentSeatsSimple(state, row, col) === 0 ? '#' : 'L';
          break;
        case '#':
          result[row][col] = occupiedAdjacentSeatsSimple(state, row, col) >= 4 ? 'L' : '#';
          break;
      }
    }
  }

  return result;
}

function generateNextStateComplex(state: string[][]) {
  const result: string[][] = [];
  const lineLength = state[0].length;

  for (let row = 0; row < state.length; row++) {
    result.push([]);
    for (let col = 0; col < lineLength; col++) {
      const prev = state[row][col];

      switch (prev) {
        case '.':
          result[row][col] = '.';
          break;
        case 'L':
          result[row][col] = occupiedAdjacentSeatsComplex(state, row, col) === 0 ? '#' : 'L';
          break;
        case '#':
          result[row][col] = occupiedAdjacentSeatsComplex(state, row, col) >= 5 ? 'L' : '#';
          break;
      }
    }
  }

  return result;
}

async function partOne() {
  const input = await readMappedInput('./input.txt', (line) => line.split(''), { relativeTo: __dirname, splitLines: true });
  let currentState = input;
  let nextState = generateNextStateSimple(currentState);

  while (flatten(currentState).join('') !== flatten(nextState).join('')) {
    currentState = nextState;
    nextState = generateNextStateSimple(currentState);
  }

  return flatten(currentState).filter((val) => val === '#').length;
}

async function partTwo() {
  const input = await readMappedInput('./input.txt', (line) => line.split(''), { relativeTo: __dirname, splitLines: true });
  let currentState = input;
  let nextState = generateNextStateComplex(currentState);

  while (flatten(currentState).join('') !== flatten(nextState).join('')) {
    currentState = nextState;
    nextState = generateNextStateComplex(currentState);
  }

  return flatten(currentState).filter((val) => val === '#').length;
}

async function solve() {
  console.log('Result of part one', await partOne());
  console.log('Result of part two', await partTwo());
}

solve().catch(console.error);
