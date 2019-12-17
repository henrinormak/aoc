import { IntcodeComputer } from '../../lib/intcode';

enum Element {
  Scaffold = '#',
  Open = '.',
  RobotUp = '^',
  RobotDown = 'v',
  RobotLeft = '<',
  RobotRight = '>',
  RobotDead = 'X',
}

function findIntersections(image: string) {
  const chars = image.split('\n').map((line) => line.split(''));
  const intersections: { x: number, y: number }[] = [];

  const lines = chars.length;
  const characters = chars[0].length;

  for (let y = 1; y < lines - 1; y++) {
    for (let x = 1; x < characters - 1; x++) {
      if (chars[y][x] === '#' && chars[y][x - 1] === '#' && chars[y][x + 1] === '#' && chars[y - 1][x] === '#' && chars[y + 1][x] === '#') {
        intersections.push({ x, y });
      }
    }
  }

  return intersections;
}

function isElement(value: string): value is Element {
  return [
    Element.Scaffold, Element.Open, Element.RobotUp, Element.RobotDown, Element.RobotLeft, Element.RobotRight, Element.RobotDead
  ].includes(value as Element);
}

function toInputs(string: string) {
  return string.split('').map((val) => val.charCodeAt(0));
}

async function partOne() {
  const computer = new IntcodeComputer();
  await computer.initialiseFromFile('./input.txt', __dirname);

  let result = '';

  while (!computer.isHalted()) {
    const [output] = computer.runUntilOutput();
    const char = String.fromCharCode(output);

    result += char;
  }

  console.log('World');
  console.log(result);

  const intersections = findIntersections(result);
  return intersections.reduce((sum, intersection) => sum + (intersection.x * intersection.y), 0);
}

async function partTwo() {
  const computer = new IntcodeComputer([]);
  await computer.initialiseFromFile('./input.txt', __dirname);
  computer.overrideMemory(0, 2);

  // From part one, we know the sequence of operations we have to take is
  // L,10,L,8,R,8,L,8,R,6,L,10,L,8,R,8,L,8,R,6,L,6,R,8,R,8,R,6,R,6,L,8,L,10,R,6,R,8,R,8,R,6,R,6,L,8,L,10,R,6,R,8,R,8,R,6,R,6,L,8,L,10,R,6,R,8,R,8,L,10,L,8,R,8,L,8,R,6
  // This can be split into routines by hand (looking at the longest repeating patterns)

  // Main routine
  computer.addInputs(toInputs('A,A,B,C,B,C,B,C,B,A\n'));

  // A
  computer.addInputs(toInputs('L,10,L,8,R,8,L,8,R,6\n'));

  // B
  computer.addInputs(toInputs('R,6,R,8,R,8\n'));

  // C
  computer.addInputs(toInputs('R,6,R,6,L,8,L,10\n'));

  // Video
  computer.addInputs(toInputs('n\n'));

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
