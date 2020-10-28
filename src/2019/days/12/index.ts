import { readInput } from '../../../lib/input';

interface Moon {
  position: { x: number; y: number; z: number };
  velocity: { x: number; y: number; z: number };
}

function simulate(moons: Moon[]): Moon[] {
  let result = moons.map((moon) => ({ position: { ...moon.position }, velocity: { ...moon.velocity } }));

  // First apply gravity to update velocity
  for (let i = 0; i < result.length; i++) {
    for (let j = i + 1; j < result.length; j++) {
      const moon = result[i];
      const otherMoon = result[j];

      // Update each axis separately
      if (moon.position.x !== otherMoon.position.x) {
        moon.velocity.x += moon.position.x < otherMoon.position.x ? 1 : -1;
        otherMoon.velocity.x += moon.position.x > otherMoon.position.x ? 1 : -1;
      }

      if (moon.position.y !== otherMoon.position.y) {
        moon.velocity.y += moon.position.y < otherMoon.position.y ? 1 : -1;
        otherMoon.velocity.y += moon.position.y > otherMoon.position.y ? 1 : -1;
      }

      if (moon.position.z !== otherMoon.position.z) {
        moon.velocity.z += moon.position.z < otherMoon.position.z ? 1 : -1;
        otherMoon.velocity.z += moon.position.z > otherMoon.position.z ? 1 : -1;
      }
    }
  }

  // Then apply velocity to update position
  for (const moon of result) {
    moon.position.x += moon.velocity.x;
    moon.position.y += moon.velocity.y;
    moon.position.z += moon.velocity.z;
  }

  return result;
}

function energy(moon: Moon) {
  const potential = Math.abs(moon.position.x) + Math.abs(moon.position.y) + Math.abs(moon.position.z);
  const kinetic = Math.abs(moon.velocity.x) + Math.abs(moon.velocity.y) + Math.abs(moon.velocity.z);

  return potential * kinetic;
}

async function getMoons() {
  const input = await readInput('./input.txt', { relativeTo: __dirname, splitBy: '\n' });
  return input.map((line) => {
    const regex = /<x=(-?[0-9]+), y=(-?[0-9]+), z=(-?[0-9]+)>/;
    const matches = line.match(regex);
    const [x, y, z] = matches.slice(1, 4).map((val) => parseInt(val, 10));

    return {
      position: { x, y, z },
      velocity: { x: 0, y: 0, z: 0 },
    }
  });
}

function findCycle(moons: Moon[], axis: 'x' | 'y' | 'z'): number {
  let previousStates: Map<string, boolean> = new Map<string, boolean>();
  let matches = false;
  let steps = 1;

  const getKey = (moons: Moon[]) => {
    return `pos:${moons.map((moon) => moon.position[axis]).join(',')};vel:${moons.map((moon) => moon.velocity[axis]).join(',')}`;
  };

  previousStates.set(getKey(moons), true);

  while (!matches) {
    moons = simulate(moons);
    const key = getKey(moons);
    matches = previousStates.has(key);

    if (!matches) {
      previousStates.set(key, true);
      steps++;
    }
  }

  return steps;
}

async function partOne() {
  let moons = await getMoons();
  for (let i = 0; i < 1000; i++) {
    moons = simulate(moons);
  }

  return moons.reduce((totalEnergy, moon) => totalEnergy + energy(moon), 0);
}

function leastCommonMultiple(numbers: number[]) {
  function gcd2(x: number, y: number) {
    x = Math.abs(x);
    y = Math.abs(y);
    while (y) {
      var t = y;
      y = x % y;
      x = t;
    }
    return x;
  }

  function lcm2(x: number, y: number) {
    return (!x || !y) ? 0 : Math.abs((x * y) / gcd2(x, y))
  }

  let n = 1;

  for (const number of numbers) {
    n = lcm2(number, n);
  }

  return n;
}

async function partTwo() {
  let moons = await getMoons();

  // Find how long it takes to cycle each axis, then find the smallest
  // common multiple to figure out when these cycles all align
  const x = findCycle(moons, 'x');
  const y = findCycle(moons, 'y');
  const z = findCycle(moons, 'z');

  return leastCommonMultiple([x, y, z]);
}

async function solve() {
  console.log('Result of part one', await partOne());
  console.log('Result of part two', await partTwo());
}

solve().catch(console.error);
