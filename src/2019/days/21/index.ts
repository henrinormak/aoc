import { IntcodeComputer } from '../../../lib/intcode';

function toInputs(string: string) {
  return string.split('').map((val) => val.charCodeAt(0));
}

function toString(output: number[]) {
  return output.map((val) => String.fromCharCode(val)).join('');
}

async function partOne() {
  const input = toInputs([
    // Hole is 2 tiles away
    // And 4 tiles away is ground
    'NOT B T',
    'AND D T',
    // Store the choice
    'OR T J',

    // Immediately in front of us is not ground
    // Unless 4 tiles away is a hole
    'NOT A T',
    'AND D T',
    // Store the choice
    'OR T J',

    // Hole is 3 tiles away
    // And 4 tiles away is ground
    'NOT C T',
    'AND D T',
    // Store the choice
    'OR T J',
    'WALK\n'
  ].join('\n'));

  const computer = new IntcodeComputer(() => input.shift());
  await computer.initialiseFromFile('./input.txt', __dirname);
  const output = computer.run();

  if (output[output.length - 1] <= 200) {
    console.log('Output', toString(output));
  }

  return output[output.length - 1];
}

async function partTwo() {
  const input = toInputs([
    // Hole is 2 tiles away
    // And 4 tiles away is ground
    'NOT B T',
    'AND D T',
    // Store the choice
    'OR T J',

    // Immediately in front of us is not ground
    'NOT A T',
    // Store the choice
    'OR T J',

    // Hole is 3 tiles away
    // And 4 and 8 away is ground
    'NOT C T',
    'AND D T',
    'AND H T',
    // Store the choice
    'OR T J',

    'RUN\n'
  ].join('\n'));

  const computer = new IntcodeComputer(() => input.shift());
  await computer.initialiseFromFile('./input.txt', __dirname);
  const output = computer.run();

  if (output[output.length - 1] <= 200) {
    console.log('Output', toString(output));
  }

  return output[output.length - 1];
}

async function solve() {
  console.log('Result of part one', await partOne());
  console.log('Result of part two', await partTwo());
}

solve().catch(console.error);
