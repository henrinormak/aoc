import { readInput } from '../../lib/input';

function renderWorld(world: Map<string, string>) {
  const values = Array.from(world.entries());
  const levels = values.reduce((memo, [key, val]) => {
    const { level } = getPos(key);
    if (memo[level] === undefined) {
      memo[level] = [];
    }

    memo[level].push({ key, val });

    return memo;
  }, {} as { [key: string]: { key: string, val: string }[] });

  for (const key of Object.keys(levels).sort((a, b) => parseInt(a) - parseInt(b))) {
    const level = levels[key].sort((a, b) => a.key.localeCompare(b.key));
    let result: string[][] = [
      ['?', '?', '?', '?', '?'],
      ['?', '?', '?', '?', '?'],
      ['?', '?', '?', '?', '?'],
      ['?', '?', '?', '?', '?'],
      ['?', '?', '?', '?', '?'],
    ];

    for (const entry of level) {
      const { l, c } = getPos(entry.key);

      if (result[l] === undefined) {
        result[l] = [];
      }

      result[l][c] = entry.val;
    }

    console.log(`Level ${key}`);
    console.log(result.map((line) => line.join('')).join('\n'));
  }
}

function getKey(c: number, l: number, level: number) {
  return `${level}:${l}:${c}`;
}

function getPos(key: string) {
  const [level, l, c] = key.split(':').map((val) => parseInt(val, 10));
  return { level, l, c };
}

async function initaliseWorld(recursive: boolean = false) {
  const input = (await readInput('./input.txt', { relativeTo: __dirname, splitLines: true })).map((line) => line.split(''));
  const world = new Map<string, string>();

  for (const [l, line] of input.entries()) {
    for (const [c, char] of line.entries()) {
      if (recursive && l === 2 && c === 2) {
        continue;
      }

      world.set(getKey(c, l, 0), char);
    }
  }

  if (recursive) {
    for (let l = 0; l < 5; l++) {
      for (let c = 0; c < 5; c++) {
        if (l === 2 && c === 2) {
          continue;
        }

        world.set(getKey(c, l, 1), '.');
        world.set(getKey(c, l, -1), '.');
      }
    }
  }

  return world;
}

function evaluate(world: Map<string, string>, recursive: boolean = false) {
  function getNeighbours(c: number, l: number, level: number) {
    if (!recursive) {
      return [
        { c: c + 1, l, level },
        { c: c, l: l + 1, level },
        { c: c - 1, l, level },
        { c, l: l - 1, level },
      ];
    }

    let top = [{ c, l: l - 1, level }];
    let bottom = [{ c, l: l + 1, level }];

    if (l === 0) {
      top = [{ c: 2, l: 1, level: level - 1 }];
    } else if (l === 4) {
      bottom = [{ c: 2, l: 3, level: level - 1 }];
    } else if (l === 1 && c === 2) {
      bottom = [
        { c: 0, l: 0, level: level + 1 },
        { c: 1, l: 0, level: level + 1 },
        { c: 2, l: 0, level: level + 1 },
        { c: 3, l: 0, level: level + 1 },
        { c: 4 , l: 0, level: level + 1 },
      ];
    } else if (l === 3 && c === 2) {
      top = [
        { c: 0, l: 4, level: level + 1 },
        { c: 1, l: 4, level: level + 1 },
        { c: 2, l: 4, level: level + 1 },
        { c: 3, l: 4, level: level + 1 },
        { c: 4 , l: 4, level: level + 1 },
      ];
    }

    let right = [{ c: c + 1, l, level }];
    let left = [{ c: c - 1, l, level }];

    if (c === 0) {
      left = [{ c: 1, l: 2, level: level - 1 }];
    } else if (c === 4) {
      right = [{ c: 3, l: 2, level: level - 1 }];
    } else if (l === 2 && c === 1) {
      right = [
        { c: 0, l: 0, level: level + 1 },
        { c: 0, l: 1, level: level + 1 },
        { c: 0, l: 2, level: level + 1 },
        { c: 0, l: 3, level: level + 1 },
        { c: 0, l: 4, level: level + 1 },
      ];
    } else if (l === 2 && c === 3) {
      left = [
        { c: 4, l: 0, level: level + 1 },
        { c: 4, l: 1, level: level + 1 },
        { c: 4, l: 2, level: level + 1 },
        { c: 4, l: 3, level: level + 1 },
        { c: 4, l: 4, level: level + 1 },
      ];
    }

    return [
      ...top,
      ...bottom,
      ...left,
      ...right,
    ];
  }

  const nextWorld = new Map(world);

  for (const [key, val] of world.entries()) {
    const { level, l, c } = getPos(key);
    const neighbours = getNeighbours(c, l, level);

    // Initialise neighbours that we don't know about yet (but ones which we do want to track next minute)
    if (recursive) {
      for (const n of neighbours) {
        const key = getKey(n.c, n.l, n.level);
        if (!nextWorld.has(key)) {
          nextWorld.set(key, '.');
        }
      }
    }

    const bugs = neighbours.filter((n) => world.get(getKey(n.c, n.l, n.level)) === '#').length;

    if (val === '#') {
      nextWorld.set(key, bugs === 1 ? '#' : '.');
    } else if (val === '.') {
      nextWorld.set(key, bugs === 1 || bugs === 2 ? '#' : '.');
    }
  }

  return nextWorld;
}

async function partOne() {
  let world = await initaliseWorld();
  let layouts: string[] = [JSON.stringify(Array.from(world.entries()))];

  while (true) {
    world = evaluate(world);

    const flattened = JSON.stringify(Array.from(world.entries()));
    if (layouts.includes(flattened)) {
      return Array.from(world.entries()).reduce((sum, [key, val]) => {
        if (val !== '#') {
          return sum;
        }

        const { l, c } = getPos(key);
        return sum + Math.pow(2, l * 5 + c);
      }, 0);
    }

    layouts.push(flattened);
  }
}

async function partTwo() {
  let world = await initaliseWorld(true);

  for (let i = 0; i < 200; i++) {
    const nextWorld = evaluate(world, true);
    world = nextWorld;
  }

  return Array.from(world.values()).filter((val) => val === '#').length;
}

async function solve() {
  console.log('Result of part one', await partOne());
  console.log('Result of part two', await partTwo());
}

solve().catch(console.error);
