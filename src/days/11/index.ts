import { readInput } from '../../lib/input';
import { IntcodeComputer } from '../../lib/intcode';

enum Direction {
  Up = 0,
  Right = 90,
  Down = 180,
  Left = 270,
}

enum Color {
  Black = 0,
  White = 1,
}

interface Robot {
  position: { x: number; y: number };
  direction: Direction;
}

function turn(direction: Direction, input: number) {
  switch (direction) {
    case Direction.Up:
      return input === 0 ? Direction.Left : Direction.Right;
    case Direction.Right:
      return input === 0 ? Direction.Up : Direction.Down;
    case Direction.Down:
      return input === 0 ? Direction.Right : Direction.Left;
    case Direction.Left:
      return input === 0 ? Direction.Down : Direction.Up;
  }
}

function move(robot: Robot) {
  const newPosition = { ...robot.position };

  switch (robot.direction) {
    case Direction.Up:
      newPosition.y -= 1;
      break;
    case Direction.Right:
      newPosition.x += 1;
      break;
    case Direction.Down:
      newPosition.y += 1;
      break;
    case Direction.Left:
      newPosition.x -= 1;
      break;
  }

  return {
    direction: robot.direction,
    position: newPosition,
  };
}

function renderHull(hull: Map<string, Color>, robot: Robot) {
  const positions = Array.from(hull.keys()).map((key) => {
    const [x, y] = key.split(':').map((val) => parseInt(val, 10));
    return { x, y };
  });

  const minX = Math.min(...positions.map(({ x }) => x), robot.position.x);
  const maxX = Math.max(...positions.map(({ x }) => x), robot.position.x)
  const minY = Math.min(...positions.map(({ y }) => y), robot.position.y);
  const maxY = Math.max(...positions.map(({ y }) => y), robot.position.y);

  let result = '';

  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const key = `${x}:${y}`;
      const panel = hull.has(key) ? hull.get(key) : Color.Black;

      if (robot.position.x === x && robot.position.y === y) {
        switch (robot.direction) {
          case Direction.Up:
            result += '^'
            break;
          case Direction.Right:
            result += '>'
            break;
          case Direction.Down:
            result += 'v'
            break;
          case Direction.Left:
            result += '<'
            break;
        }
      } else {
        result += panel === Color.Black ? '.' : '#';
      }
    }

    result += '\n';
  }

  return result;
}

async function runRobot(initialHull?: Map<string, Color>): Promise<{ hull: Map<string, Color>, robot: Robot }> {
  const hull = new Map<string, Color>(initialHull);
  let robot = { position: { x: 0, y: 0 }, direction: Direction.Up };
  const computer = new IntcodeComputer();
  await computer.initialiseFromFile('./input.txt', __dirname);

  while (!computer.isHalted()) {
    const key = `${robot.position.x}:${robot.position.y}`;
    const currentColor = hull.has(key) ? hull.get(key) : Color.Black;

    computer.setInput([currentColor]);
    const [color, movement] = computer.runUntilOutput(2);

    hull.set(key, color);

    robot.direction = turn(robot.direction, movement);
    robot = move(robot);
  }

  return { hull, robot };
}

async function partOne() {
  const { hull } = await runRobot();
  return Array.from(hull.entries()).length;
}

async function partTwo() {
  const { hull, robot } = await runRobot(new Map<string, Color>([['0:0', Color.White]]));
  return renderHull(hull, robot);
}

async function solve() {
  console.log('Result of part one', await partOne());
  console.log('Result of part two');
  console.log(await partTwo());
}

solve().catch(console.error);
