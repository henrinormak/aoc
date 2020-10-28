import { readInput } from '../../../lib/input';

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

function movePoint(point: Point, direction: Direction, distance: number = 1): Point {
  switch (direction) {
    case Direction.Right:
      return { x: point.x + distance, y: point.y };
    case Direction.Left:
      return { x: point.x - distance, y: point.y };
    case Direction.Up:
      return { x: point.x, y: point.y - distance };
    case Direction.Down:
      return { x: point.x, y: point.y + distance };
  }
}

function pointsForInstruction(instruction: string, startingPoint: Point): Point[] {
  const instructionRegex = /(R|U|L|D)([0-9]+)/;
  const parts = instruction.match(instructionRegex);
  const [direction, distance] = parts.slice(1, 3);
  const distanceAsNumber = parseInt(distance, 10);

  let result: Point[] = [];

  for (let i = 0; i < distanceAsNumber; i++) {
    result.push(movePoint(startingPoint, direction as Direction, i + 1));
  }

  return result;
}

function manhattanDistance(point: Point) {
  return Math.abs(point.x) + Math.abs(point.y);
}

async function getLines(): Promise<Point[][]> {
  const lines = await readInput('./input.txt', { relativeTo: __dirname, splitLines: true });
  return lines.map((line) => {
    // Parse line into a list of points
    const instructions = line.split(',');
    let startingPoint = { x: 0, y: 0 };

    return instructions.reduce((memo, instruction) => {
      const points = pointsForInstruction(instruction, startingPoint);
      startingPoint = points[points.length - 1];
      return [...memo, ...points];
    }, [] as Point[]);
  });
}

function getCommonPoints(lines: Point[][]): { point: Point, steps: number }[] {
  const map = new Map<string, { index: number, steps: number }[]>();
  const lineCount = lines.length;

  for (const [index, line] of lines.entries()) {
    for (const [steps, point] of line.entries()) {
      const key = `${point.x}:${point.y}`;
      const existing = map.get(key) || [];

      if (existing.some(({ index: idx }) => index === idx)) {
        continue;
      }

      map.set(key, [...existing, { steps, index }]);
    }
  }

  return Array.from(map.entries()).filter(([_, indices]) => indices.length === lineCount).map(([key, value]) => {
    const [x, y] = key.split(':');
    const steps = value.reduce((memo, { steps }) => memo + steps, lineCount);

    return { point: { x: parseInt(x, 10), y: parseInt(y, 10) }, steps };
  });
}

async function partOne() {
  const lines = await getLines();
  const commonPoints = getCommonPoints(lines).map(({ point }) => point);
  const sortedPoints = commonPoints.sort((a, b) => {
    return manhattanDistance(a) - manhattanDistance(b);
  });

  return manhattanDistance(sortedPoints[0]);
}

async function partTwo() {
  const lines = await getLines();
  const commonPoints = getCommonPoints(lines);
  const sortedPoints = commonPoints.sort((a, b) => {
    return a.steps - b.steps
  });

  return sortedPoints[0].steps;
}

async function solve() {
  console.log('Result of part one', await partOne());
  console.log('Result of part two', await partTwo());
}

solve().catch(console.error);
