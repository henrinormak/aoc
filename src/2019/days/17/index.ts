import { IntcodeComputer } from '../../../lib/intcode';

function findIntersections(world: string) {
  const chars = world.split('\n').map((line) => line.split(''));
  const intersections: { x: number, y: number }[] = [];

  const lines = chars.length;
  const characters = chars[0].length;

  for (let y = 1; y < lines - 1; y++) {
    for (let x = 1; x < characters - 1; x++) {
      if (![chars[y][x], chars[y][x - 1], chars[y][x + 1], chars[y - 1][x], chars[y + 1][x]].some((val) => val !== '#')) {
        intersections.push({ x, y });
      }
    }
  }

  return intersections;
}

function toInputs(string: string) {
  return string.split('').map((val) => val.charCodeAt(0));
}

function getWorld(computer: IntcodeComputer) {
  computer.overrideMemory(0, 1);

  let result = '';

  while (!computer.isHalted()) {
    const [output] = computer.runUntilOutput();
    const char = String.fromCharCode(output);

    result += char;
  }

  return result;
}

function findRobotIn(world: string) {
  for (const [y, line] of world.split('\n').entries()) {
    for (const [x, char] of line.split('').entries()) {
      switch (char) {
        case '<':
          return { x, y, direction: 'L' };
        case '>':
          return { x, y, direction: 'R' };
        case '^':
          return { x, y, direction: 'U' };
        case 'v':
          return { x, y, direction: 'D' };
      }
    }
  }

  return undefined;
}

function canMoveForward({ x, y, direction }: { x: number; y: number, direction: string }, world: string[][]) {
  switch (direction) {
    case 'L':
      return world[y][x - 1] === '#';
    case 'R':
      return world[y][x + 1] === '#';
    case 'U':
      return (world[y - 1] ?? [])[x] === '#';
    case 'D':
      return (world[y + 1] ?? [])[x] === '#';
  }
}

function moveForward({ x, y, direction }: { x: number; y: number; direction: string }) {
  switch (direction) {
    case 'L':
      return { x: x - 1, y, direction };
    case 'R':
      return { x: x + 1, y, direction };
    case 'U':
      return { x, y: y - 1, direction };
    case 'D':
      return { x, y: y + 1, direction };
  }
}

function turn(direction: string, left: boolean) {
  switch (direction) {
    case 'L':
      return left ? 'D' : 'U';
    case 'R':
      return left ? 'U' : 'D';
    case 'U':
      return left ? 'L' : 'R';
    case 'D':
      return left ? 'R' : 'L';
  }
}

function getSequenceToSolve(world: string) {
  const chars = world.split('\n').map((line) => line.split(''));
  let robot = findRobotIn(world);

  const sequence: string[] = [];
  let forwardCounter = 0;

  while (true) {
    if (canMoveForward(robot, chars)) {
      robot = moveForward(robot);
      forwardCounter++;
    } else if (canMoveForward({ ...robot, direction: turn(robot.direction, true) }, chars)) {
      robot = { ...robot, direction: turn(robot.direction, true) };

      if (forwardCounter > 0) {
        sequence.push(forwardCounter.toString())
      }
      sequence.push('L');

      forwardCounter = 0;
    } else if (canMoveForward({ ...robot, direction: turn(robot.direction, false) }, chars)) {
      robot = { ...robot, direction: turn(robot.direction, false) };

      if (forwardCounter > 0) {
        sequence.push(forwardCounter.toString())
      }
      sequence.push('R');

      forwardCounter = 0;
    } else {
      // Nothing else to do, we are done (just flush out any last forward movements)
      if (forwardCounter > 0) {
        sequence.push(forwardCounter.toString())
      }

      return sequence.join(',');
    }
  }
}

async function partOne() {
  const computer = new IntcodeComputer(() => 0);
  await computer.initialiseFromFile('./input.txt', __dirname);

  const world = getWorld(computer);
  console.log('World');
  console.log(world);

  const intersections = findIntersections(world);
  return intersections.reduce((sum, intersection) => sum + (intersection.x * intersection.y), 0);
}

async function partTwo() {
  const input: number[] = [];
  const computer = new IntcodeComputer(() => input.shift());
  await computer.initialiseFromFile('./input.txt', __dirname);

  const world = getWorld(computer);
  // Find the sequence to solve the path
  const sequence = getSequenceToSolve(world);
  console.log('Sequence', sequence);

  computer.reset();
  computer.overrideMemory(0, 2);

  // From above, we know the sequence of operations we have to take is
  // This can be split into routines by hand (looking at the longest repeating patterns)
  // L,10,L,8,R,8,L,8,R,6, L,10,L,8,R,8,L,8,R,6, R,6,R,8,R,8, R,6,R,6,L,8,L,10, R,6,R,8,R,8, R,6,R,6,L,8,L,10, R,6,R,8,R,8, R,6,R,6,L,8,L,10, R,6,R,8,R,8, L,10,L,8,R,8,L,8,R,6
  // A,A,B,C,B,C,B,C,B,A

  input.push(...toInputs('A,A,B,C,B,C,B,C,B,A\n'));  // Main
  input.push(...toInputs('L,10,L,8,R,8,L,8,R,6\n')); // A
  input.push(...toInputs('R,6,R,8,R,8\n'));          // B
  input.push(...toInputs('R,6,R,6,L,8,L,10\n'));     // C
  input.push(...toInputs('n\n'));                    // video

  while (!computer.isHalted()) {
    const [output] = computer.runUntilOutput();

    // Final output will be waaay beyond ASCII codes, so just check for some large value
    if (output > 1000) {
      return output;
    }
  }

  return 0;
}

async function solve() {
  console.log('Result of part one', await partOne());
  console.log('Result of part two', await partTwo());
}

solve().catch(console.error);
