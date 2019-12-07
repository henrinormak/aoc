import { readInput } from '../../lib/input';
import { IntcodeComputer } from '../../lib/intcode';

async function partOne() {
  const computer = new IntcodeComputer([1]);
  await computer.initialiseFromFile('./input.txt', __dirname);
  computer.run();
  return computer.getOutput();
}

async function partTwo() {
  const computer = new IntcodeComputer([5]);
  await computer.initialiseFromFile('./input.txt', __dirname);
  computer.run();
  return computer.getOutput();
}

async function solve() {
  console.log('Result of part one', await partOne());
  console.log('Result of part two', await partTwo());
}

solve().catch(console.error);
