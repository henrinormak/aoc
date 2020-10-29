import { readInput } from '../../../lib/input';

type Coordinate = [number, number, number];
type Direction = 'n' | 'ne' | 'se' | 's' | 'sw' | 'nw';

function move(coordinate: Coordinate, direction: Direction): Coordinate {
  switch (direction) {
    case 'n':
      return [coordinate[0], coordinate[1] - 1, coordinate[2] + 1];
    case 'ne':
      return [coordinate[0] - 1, coordinate[1], coordinate[2] + 1];
    case 'se':
      return [coordinate[0] - 1, coordinate[1] + 1, coordinate[2]];
    case 's':
      return [coordinate[0], coordinate[1] + 1, coordinate[2] - 1];
    case 'sw':
      return [coordinate[0] + 1, coordinate[1], coordinate[2] - 1];
    case 'nw':
      return [coordinate[0] + 1, coordinate[1] - 1, coordinate[2]];
  }
}

function distanceFromPosition(coordinate: Coordinate, from: Coordinate = [0, 0, 0]) {
  return (Math.abs(coordinate[0] - from[0]) + Math.abs(coordinate[1] - from[2]) + Math.abs(coordinate[2] - from[2])) / 2;
}

async function partOne() {
  const input = await readInput('./input.txt', { relativeTo: __dirname, splitBy: ',' });
  let position: Coordinate = [0, 0, 0];

  input.forEach((movement) => {
    position = move(position, movement as Direction);
  });

  console.log('Position of child', position);
  return distanceFromPosition(position);
}

async function partTwo() {
  const input = await readInput('./input.txt', { relativeTo: __dirname, splitBy: ',' });
  let position: Coordinate = [0, 0, 0];
  let maxDistance = 0;

  input.forEach((movement) => {
    position = move(position, movement as Direction);
    const distance = distanceFromPosition(position);

    if (distance > maxDistance) {
      maxDistance = distance;
    }
  });

  return maxDistance;
}

async function solve() {
  console.log('Result of part one', await partOne());
  console.log('Result of part two', await partTwo());
}

solve().catch(console.error);
