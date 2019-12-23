import { IntcodeComputer } from '../../lib/intcode';

async function partOne() {
  const computer = new IntcodeComputer(() => 1);
  await computer.initialiseFromFile('./input.txt', __dirname);
  return computer.run();
}

async function partTwo() {
  const computer = new IntcodeComputer(() => 2);
  await computer.initialiseFromFile('./input.txt', __dirname);
  return computer.run();
}

async function solve() {
  console.log('Result of part one', await partOne());
  console.log('Result of part two', await partTwo());
}

solve().catch(console.error);
