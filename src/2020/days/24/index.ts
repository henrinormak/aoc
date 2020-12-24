import { readMappedInput } from '../../../lib/input';

enum Direction {
  East = 'e',
  NorthEast = 'ne',
  NorthWest = 'nw',
  West = 'w',
  SouthWest = 'sw',
  SouthEast = 'se',
}

interface Coordinate {
  x: number;
  y: number;
  z: number;
}

const DIRECTION_REGEX = new RegExp(`(${Object.values(Direction).map((val) => `(?:${val})`).join('|')})`, 'g');

function parseLineToDirections(line: string): Direction[] {
  const matches = Array.from(line.matchAll(DIRECTION_REGEX));
  return matches.map((match) => match[0] as Direction);
}

function move(coordinate: Coordinate, directions: Direction[]): Coordinate {
  let result = { ...coordinate };

  directions.forEach((direction) => {
    switch (direction) {
      case Direction.NorthWest:
        result.z -= 1;
        result.y += 1;
        break;
      case Direction.NorthEast:
        result.z -= 1;
        result.x += 1;
        break;
      case Direction.East:
        result.x += 1;
        result.y -= 1;
        break;
      case Direction.SouthEast:
        result.z += 1;
        result.y -= 1;
        break;
      case Direction.SouthWest:
        result.z += 1;
        result.x -= 1;
        break;
      case Direction.West:
        result.x -= 1;
        result.y += 1;
    }
  });

  return result;
}

function getNeighbours(coordinate: Coordinate): Coordinate[] {
  return [
    move(coordinate, [Direction.West]),
    move(coordinate, [Direction.NorthWest]),
    move(coordinate, [Direction.NorthEast]),
    move(coordinate, [Direction.East]),
    move(coordinate, [Direction.SouthEast]),
    move(coordinate, [Direction.SouthWest]),
  ];
}

function keyForCoordinate(coordinate: Coordinate): string {
  return `${coordinate.x}:${coordinate.y}:${coordinate.z}`;
}

function coordinateForKey(key: string): Coordinate {
  const [x, y, z] = key.split(':');
  return { x: parseInt(x), y: parseInt(y), z: parseInt(z) };
}

function evaluate(starting: Map<string, boolean>): Map<string, boolean> {
  const tilesToEvaluate = Array.from(Array.from(starting.keys()).reduce((memo, key) => {
    memo.add(key);
    getNeighbours(coordinateForKey(key)).forEach((neighbour) => {
      memo.add(keyForCoordinate(neighbour));
    });

    return memo;
  }, new Set<string>()));

  const result = new Map<string, boolean>();
  for (const tile of tilesToEvaluate) {
    const coordinate = coordinateForKey(tile);
    let isBlack = starting.get(tile) || false;
    const neighbours = getNeighbours(coordinate).filter((neighbour) => starting.get(keyForCoordinate(neighbour))).length;

    if (isBlack) {
      if (neighbours === 0 || neighbours > 2) {
        isBlack = false;
      }
    } else {
      if (neighbours === 2) {
        isBlack = true;
      }
    }

    result.set(tile, isBlack);
  }

  return result;
}

function buildInitialState(directions: Direction[][]): Map<string, boolean> {
  const blackTiles = new Map<string, boolean>();

  directions.forEach((directions) => {
    const target = move({ x: 0, y: 0, z: 0 }, directions);
    const key = `${target.x}:${target.y}:${target.z}`;
    const isBlack = blackTiles.get(key) || false;
    blackTiles.set(key, !isBlack);
  });

  return blackTiles;
}

async function partOne() {
  const input = await readMappedInput('./input.txt', parseLineToDirections, { relativeTo: __dirname, splitLines: true });
  const floor = buildInitialState(input);
  return Array.from(floor.keys()).filter((key) => floor.get(key)).length;
}

async function partTwo() {
  const input = await readMappedInput('./input.txt', parseLineToDirections, { relativeTo: __dirname, splitLines: true });
  let floor = buildInitialState(input);

  for (let i = 0; i < 100; i++) {
    floor = evaluate(floor);
  }

  return Array.from(floor.keys()).filter((key) => floor.get(key)).length;
}

async function solve() {
  console.log('Result of part one', await partOne());
  console.log('Result of part two', await partTwo());
}

solve().catch(console.error);
