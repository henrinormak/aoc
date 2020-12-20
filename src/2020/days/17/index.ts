import { readInput } from '../../../lib/input';

function keyForCoordinate(coords: number[]) {
  return coords.join(':');
}

function coordinateForKey(key: string): number[] {
  return key.split(':').map((val) => parseInt(val, 10));
}

function getBounds(coordinates: number[][]) {
  const bounds: [number, number][] = coordinates[0].map((val) => [val, val]);

  coordinates.forEach((key) => {
    key.forEach((val, dimension) => {
      bounds[dimension][0] = Math.min(val - 1, bounds[dimension][0]);
      bounds[dimension][1] = Math.max(val + 1, bounds[dimension][1]);
    });
  });

  return bounds;
}

function getNeighbourCoordinates(coordinate: number[]): number[][] {
  const result: number[][] = [];
  let aggregator = (coordinate: number[]) => { result.push(coordinate) };

  coordinate.forEach((val, dimension) => {
    const nested = aggregator;

    aggregator = (coordinate: number[]) => {
      nested([...coordinate.slice(0, dimension), val - 1, ...coordinate.slice(dimension + 1)]);
      nested(coordinate);
      nested([...coordinate.slice(0, dimension), val + 1, ...coordinate.slice(dimension + 1)]);
    };
  });

  aggregator(coordinate);
  return result.filter((coord) => !coord.every((val, idx) => coordinate[idx] === val));
}

function evaluate(pocket: Map<string, boolean>): Map<string, boolean> {
  const keys = Array.from(pocket.keys()).map(coordinateForKey);
  const bounds = getBounds(keys);

  const newPocket = new Map<string, boolean>();

  let evaluator = (coordinate: number[]) => {
    const key = keyForCoordinate(coordinate);
    const currentState = pocket.get(key);
    const activeNeighbours = getNeighbourCoordinates(coordinate).filter((coord) => pocket.get(keyForCoordinate(coord))).length;
    newPocket.set(key, (currentState && (activeNeighbours === 2 || activeNeighbours === 3) || (!currentState && activeNeighbours === 3)));
  };

  bounds.forEach(([min, max]) => {
    const nested = evaluator;

    evaluator = (coordinate: number[]) => {
      for (let i = min; i <= max; i++) {
        nested([i, ...coordinate]);
      }
    };
  });

  evaluator([]);
  return newPocket;
}

async function partOne() {
  const input = await readInput('./input.txt', { relativeTo: __dirname, splitLines: true });
  let pocket = new Map<string, boolean>();

  input.forEach((line, y) => {
    line.split('').forEach((char, x) => {
      pocket.set(keyForCoordinate([x, y, 0]), char === '#');
    });
  });

  for (let i = 0; i < 6; i++) {
    pocket = evaluate(pocket);
  }

  return Array.from(pocket.entries()).filter(([_, value]) => value).length;
}

async function partTwo() {
  const input = await readInput('./input.txt', { relativeTo: __dirname, splitLines: true });
  let pocket = new Map<string, boolean>();

  input.forEach((line, y) => {
    line.split('').forEach((char, x) => {
      pocket.set(keyForCoordinate([x, y, 0, 0]), char === '#');
    });
  });

  for (let i = 0; i < 6; i++) {
    pocket = evaluate(pocket);
  }

  return Array.from(pocket.entries()).filter(([_, value]) => value).length;
}

async function solve() {
  console.log('Result of part one', await partOne());
  console.log('Result of part two', await partTwo());
}

solve().catch(console.error);
