import { readInput } from '../../../lib/input';

interface Portal {
  name: string;
  from: { row: number; col: number };
  inner: boolean;
}

interface State {
  row: number;
  col: number;
  depth: number;
  distance: number;
}

function getNeighbours({ row, col }: { row: number, col: number }) {
  return [
    { row: row + 1, col },
    { row, col: col + 1 },
    { row: row - 1, col },
    { row, col: col - 1 },
  ]
}

async function parseInput(): Promise<{ input: string[][], portals: Portal[] }> {
  const input = (await readInput('./input.txt', { relativeTo: __dirname, splitLines: true })).map((line) => line.split(''));
  const portals: { name: string, from: { row: number; col: number }, inner: boolean }[] = [];

  for (const [r, row] of input.entries()) {
    for (const [c, col] of row.entries()) {
      if (/[A-Z]/.test(col)) {
        const neighbours = getNeighbours({ row: r, col: c });
        const entry = neighbours.find(({ row, col }) => (input[row] ?? [])[col] === '.');
        const letter = neighbours.find(({ row, col }) => /[A-Z]/.test((input[row] ?? [])[col]));

        if (entry === undefined || letter === undefined) {
          continue;
        }

        const outer =
          c === 0 || c === row.length - 1 || letter.col == 0 || letter.col === row.length - 1 ||
          r === 0 || r === input.length - 1 || letter.row === 0 || letter.row === input.length - 1;

        if ((entry.col > c && c > letter.col) || (entry.row > r && r > letter.row)) {
          portals.push({ name: `${input[letter.row][letter.col]}${col}`, from: entry, inner: !outer });
        } else if ((entry.col < c && c < letter.col) || (entry.row < r && r < letter.row)) {
          portals.push({ name: `${col}${input[letter.row][letter.col]}`, from: entry, inner: !outer });
        }
      }
    }
  }

  return { input, portals };
}

function solveMaze(portals: Portal[], input: string[][], recursion: boolean = false) {
  const end = portals.find(({ name }) => name === 'ZZ');
  const start = portals.find(({ name }) => name === 'AA');

  const queue: State[] = [];
  const visited = new Set<string>();
  const keyFn = (state: State) => `${state.row}:${state.col}:${state.depth}`;

  queue.push({ row: start.from.row, col: start.from.col, depth: 0, distance: 0 });

  while (queue.length > 0) {
    const state = queue.shift();
    const key = keyFn(state);
    if (visited.has(key)) {
      continue;
    }

    visited.add(key);

    const { depth, distance, row, col } = state;

    // Check if we have reached our goal
    if (depth === 0 && row === end.from.row && col === end.from.col) {
      return distance;
    }

    // Otherwise add neighbours to explore
    const openNeighbours = getNeighbours({ row, col }).filter(({ row, col }) => (input[row] ?? [])[col] === '.');

    for (const { row: r, col: c } of openNeighbours) {
      queue.push({ depth, distance: distance + 1, row: r, col: c });
    }

    // And any portals we are connected to
    const portalNeighbours = portals.filter(({ from }) => from.col === col && from.row === row);
    const linkedPortals = portalNeighbours.map(({ name, inner }) => portals.find((other) => other.name === name && other.inner !== inner)).filter((val) => val !== undefined);

    for (const portal of linkedPortals) {
      if (depth === 0 && portal.inner && recursion) {
        // In the recursive model, none of the first level outer portals work
        continue;
      }

      queue.push({
        depth: recursion ? (portal.inner ? depth - 1 : depth + 1) : depth,
        distance: distance + 1,
        row: portal.from.row,
        col: portal.from.col,
      });
    }
  }

  return undefined;
}

async function partOne(input: string[][], portals: Portal[]) {
  return solveMaze(portals, input);
}

async function partTwo(input: string[][], portals: Portal[]) {
  return solveMaze(portals, input, true);
}

async function solve() {
  const { input, portals } = await parseInput();
  console.log('Result of part one', await partOne(input, portals));
  console.log('Result of part two', await partTwo(input, portals));
}

solve().catch(console.error);
