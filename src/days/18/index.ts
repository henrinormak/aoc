import { readInput } from '../../lib/input';

interface Position {
  x: number;
  y: number;
}

interface State {
  position: Position;
  keys: string[];
  distance: number;
}

const MOVEMENT_COLUMN = [-1, 0, 1, 0];
const MOVEMENT_ROW = [0, 1, 0, -1];

function renderCave(cave: string[][]) {
  return cave.map((line) => line.join('')).join('\n');
}

function solveCave(cave: string[][]) {
  const queue: State[] = [];
  const availableKeys: Set<string> = new Set();

  const rows = cave.length;
  const columns = cave[0].length;
  let startPosition: Position = { x: 0, y: 0};

  // Find out starting state
  for (const [y, line] of cave.entries()) {
    for (const [x, char] of line.entries()) {
      if (char === '@') {
        startPosition = { x, y };
      }

      if (/[a-z]/.test(char)) {
        availableKeys.add(char);
      }
    }
  }

  queue.push({ position: startPosition, keys: [], distance: 0 });

  const visited = new Set<string>();
  const keyFn = ({ position: { x, y }, keys }: State) => `${x}:${y}:${Array.from(keys.values()).join(',')}`;

  console.log('All keys', availableKeys);
  console.log('Initial state', queue[0]);

  // BFS over the world until we have all the keys collected
  while (queue.length > 0) {
    const state = queue.shift();
    const { position, keys, distance } = state;
    const { x, y } = position;

    const key = keyFn(state);
    if (visited.has(key)) {
      continue;
    }

    visited.add(key);

    if (visited.size % 10000 === 0) {
      console.log(visited.size);
    }

    if (/[A-Z]/.test(cave[y][x]) && !keys.includes(cave[y][x].toLowerCase()) && availableKeys.has(cave[y][x].toLowerCase())) {
      continue;
    }

    const newKeys = new Set(keys);
    if (/[a-z]/.test(cave[y][x]) && availableKeys.has(cave[y][x])) {
      newKeys.add(cave[y][x]);

      if (newKeys.size === availableKeys.size) {
        return { keys: newKeys, distance };
      }
    }

    for (let i = 0; i < 4; i++) {
      const newX = x + MOVEMENT_ROW[i];
      const newY = y + MOVEMENT_COLUMN[i];

      if (!(newX >= 0 && newX <= columns && newY >= 0 && newY <= rows && cave[newY][newX] !== '#')) {
        continue;
      }

      queue.push({
        position: { x: newX, y: newY }, distance: distance + 1, keys: Array.from(newKeys).sort()
      });
    }
  }

  return undefined;
}

async function partOne() {
  const world = (await readInput('./input.txt', { relativeTo: __dirname, splitLines: true })).map((line) => line.split(''));
  return solveCave(world);
}

async function partTwo() {
  const world = (await readInput('./input.txt', { relativeTo: __dirname, splitLines: true })).map((line) => line.split(''));

  // Modify the world
  world[39][39] = '@'; world[39][40] = '#'; world[39][41] = '@';
  world[40][39] = '#'; world[40][40] = '#'; world[40][41] = '#';
  world[41][39] = '@'; world[41][40] = '#'; world[41][41] = '@';

  // Split the world into 4 caves to be solved separately
  // Assumptions
  // - Robots should just ignore doors they cannot open (puzzle lacks keys for),
  //   as we are not asked for a specific order of keys, just the number of steps it would take to solve all 4 caves
  // - There are no dead-locks in the puzzle, i.e no two robots that depend on one another in a way that would make the puzzle unsolvable
  const a = world.slice(0, 41).map((line) => line.slice(0, 41));
  const b = world.slice(0, 41).map((line) => line.slice(40, 81));
  const c = world.slice(40, 81).map((line) => line.slice(0, 41));
  const d = world.slice(40, 81).map((line) => line.slice(40, 81));

  // Solve each cave independently
  const { distance: aDist } = solveCave(a);
  const { distance: bDist } = solveCave(b);
  const { distance: cDist } = solveCave(c);
  const { distance: dDist } = solveCave(d);

  return aDist + bDist + cDist + dDist;
}

async function solve() {
  console.log('Result of part one', await partOne());
  console.log('Result of part two', await partTwo());
}

solve().catch(console.error);
