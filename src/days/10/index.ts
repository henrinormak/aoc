import { readInput } from '../../lib/input';

interface Asteroid {
  x: number;
  y: number;
}

function notNil<T>(value: T | undefined): value is T {
  return value !== undefined;
}

function isBetween(a: number, b: number, c: number) {
  return b > a && b < c;
}

function isPointOnLine(a: { x: number; y: number }, b: { x: number; y: number }, point: { x: number; y: number }) {
  if (a.x === b.x) {
    if (a.y < b.y) {
      return point.x === a.x && isBetween(a.y, point.y, b.y);
    }

    return point.x === a.x && isBetween(b.y, point.y, a.y);
  }

  if (a.y === b.y) {
    if (a.x < b.x) {
      return point.y === a.y && isBetween(a.x, point.x, b.x);
    }

    return point.y === a.y && isBetween(b.x, point.x, a.x);
  }

  const y = (point.y - a.y) / (b.y - a.y);
  const x = (point.x - a.x) / (b.x - a.x);

  if (a.x < b.x) {
    return x === y && point.x >= a.x && point.x <= b.x;
  }

  return x === y && point.x >= b.x && point.x <= a.x;
}

function angle(a: { x: number; y: number }, b: { x: number; y: number }) {
  const relative = { x: b.x - a.x, y: b.y - a.y };
  return Math.atan2(-relative.x, relative.y);
}

function renderAsteroids(asteroids: Asteroid[], focus: Asteroid, visible: Asteroid[]) {
  const width = Math.max(...asteroids.map(({ x }) => x));
  const height = Math.max(...asteroids.map(({ y }) => y));

  let result = '';
  for (let y = 0; y <= height; y++) {
    for (let x = 0; x <= width; x++) {
      const isAsteroid = asteroids.some((asteroid) => asteroid.x === x && asteroid.y === y);
      const isVisible = visible.some((asteroid) => asteroid.x === x && asteroid.y === y);
      const isFocused = focus.x === x && focus.y === y;

      if (isFocused) {
        result += 'F';
      } else {
        if (isAsteroid) {
          if (isVisible) {
            result += '*';
          } else {
            result += '#';
          }
        } else {
          result += '.';
        }
      }
    }

    result += '\n';
  }

  return result;
}

async function getAsteroids() {
  const input = await readInput('./input.txt', { relativeTo: __dirname, splitLines: true });
  return input.reduce((memo, line, y) => {
    const asteroids = line.split('').map((char, x) => {
      if (char === '#') {
        return { x, y };
      }

      return undefined;
    }).filter(notNil);

    return [...memo, ...asteroids];
  }, [] as Asteroid[]);
}

function getVisibleAsteroids(center: Asteroid, asteroids: Asteroid[]) {
  const others = asteroids.filter((asteroid) => asteroid.x !== center.x || asteroid.y !== center.y);

  const visible = others.filter((visible, visibleIdx) => {
    return !others.some((blocker, blockerIdx) => visibleIdx !== blockerIdx && isPointOnLine(center, visible, blocker));
  });

  return visible;
}

async function partOne() {
  const asteroids = await getAsteroids();
  let mostVisible = 0;
  let bestIndex = 0;

  for (const [idx, asteroid] of asteroids.entries()) {
    const visible = getVisibleAsteroids(asteroid, asteroids);

    if (visible.length > mostVisible) {
      mostVisible = visible.length;
      bestIndex = idx;
    }
  }

  return { asteroids, station: asteroids[bestIndex], visible: mostVisible };
}

async function partTwo(station: Asteroid, asteroids: Asteroid[]) {
  let destroyed: Asteroid[] = [];
  let remaining = [...asteroids].filter((asteroid) => asteroid.x !== station.x || asteroid.y !== station.y);

  while (remaining.length > 0) {
    const visible = getVisibleAsteroids(station, remaining).sort((a, b) => angle(station, a) - angle(station, b));
    destroyed = destroyed.concat(visible);
    remaining = remaining.filter((asteroid) => !visible.some((other) => other.x === asteroid.x && other.y === asteroid.y));
  }

  const bet = destroyed[199];
  return bet.x * 100 + bet.y;
}

async function solve() {
  const { station, asteroids, visible } = await partOne();
  console.log('Result of part one', station, visible);
  console.log('Result of part two', await partTwo(station, asteroids));
}

solve().catch(console.error);
