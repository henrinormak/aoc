import { readInput } from '../../lib/input';

interface Point {
  x: number;
  y: number;
}

enum Direction {
  Up = 'U',
  Down = 'D',
  Left = 'L',
  Right = 'R',
}

function movePoint(point: Point, direction: Direction): Point {
  switch (direction) {
    case Direction.Right:
      return { x: point.x + 1, y: point.y };
    case Direction.Left:
      return { x: point.x - 1, y: point.y };
    case Direction.Up:
      return { x: point.x, y: point.y - 1 };
    case Direction.Down:
      return { x: point.x, y: point.y + 1 };
  }
}

function pointsForInstruction(instruction: string, startingPoint: Point): Point[] {
  const instructionRegex = /(R|U|L|D)([0-9]+)/;
  const parts = instruction.match(instructionRegex);
  const [direction, distance] = parts.slice(1, 3);
  const distanceAsNumber = parseInt(distance, 10);

  let result: Point[] = [];
  let point = startingPoint;

  for (let i = 0; i < distanceAsNumber; i++) {
    point = movePoint(point, direction as Direction);
    result.push(point);
  }

  return result;
}

function manhattanDistance(point: Point) {
  return Math.abs(point.x) + Math.abs(point.y);
}

function notUndefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

async function partOne() {
  const lines = await readInput('./input.txt', { relativeTo: __dirname, splitLines: true });
  const points = lines.map((line) => {
    // Parse line into a list of points
    const instructions = line.split(',');
    let startingPoint = { x: 0, y: 0 };

    return instructions.reduce((memo, instruction) => {
      const points = pointsForInstruction(instruction, startingPoint);
      startingPoint = points[points.length - 1];
      return [...memo, ...points];
    }, [] as Point[]);
  });

  let commonPoints: Point[] = [];

  // Find all common points between the two lines
  const firstLine = points[0];
  const secondLine = points[1];

  const matches = firstLine.filter((point) => {
    return secondLine.find((comparison) => point.x == comparison.x && point.y == comparison.y);
  });

  commonPoints = [...commonPoints, ...matches];

  const sortedPoints = commonPoints.sort((a, b) => {
    return manhattanDistance(a) - manhattanDistance(b);
  });

  return manhattanDistance(sortedPoints[0]);
}

async function partTwo() {
  const lines = await readInput('./input.txt', { relativeTo: __dirname, splitLines: true });
  const points = lines.map((line) => {
    // Parse line into a list of points
    const instructions = line.split(',');
    let startingPoint = { x: 0, y: 0 };

    return instructions.reduce((memo, instruction) => {
      const points = pointsForInstruction(instruction, startingPoint);
      startingPoint = points[points.length - 1];
      return [...memo, ...points];
    }, [] as Point[]);
  });

  let commonPoints: { point: Point, steps: number }[] = [];

  // Find all common points between the two lines
  const firstLine = points[0];
  const secondLine = points[1];

  const matches = firstLine.map((point, index) => {
    const firstMatch = secondLine.findIndex((comparison) => point.x == comparison.x && point.y == comparison.y);
    if (firstMatch === -1) {
      return undefined;
    }

    return { steps: index + firstMatch, point };
  }).filter(notUndefined);

  commonPoints = [...commonPoints, ...matches];

  const sortedPoints = commonPoints.sort((a, b) => {
    return a.steps - b.steps
  });

  // +2 to account for indices starting from 0, although being the "first step"
  return sortedPoints[0].steps + 2;
}

async function solve() {
  // console.log('Result of part one', await partOne());
  console.log('Result of part two', await partTwo());
}

solve().catch(console.error);
