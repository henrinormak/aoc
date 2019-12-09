import { IntcodeComputer } from '../../lib/intcode';

async function partOne() {
  const computer = new IntcodeComputer();
  await computer.initialiseFromFile('./input.txt', __dirname);
  computer.setInput([1]);
  return computer.run();
}

async function partTwo() {
  const computer = new IntcodeComputer();
  await computer.initialiseFromFile('./input.txt', __dirname);
  computer.setInput([2]);
  return computer.run();
}

async function solve() {
  console.log('Result of part one', await partOne());
  console.log('Result of part two', await partTwo());
}

solve().catch(console.error);
