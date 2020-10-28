import { IntcodeComputer } from '../../../lib/intcode';

async function partOne() {
  const computer = new IntcodeComputer(() => 0);
  await computer.initialiseFromFile('./input.txt', __dirname);
  computer.run();

  return computer.readMemory(0);
}

async function partTwo() {
  const computer = new IntcodeComputer(() => 0);
  await computer.initialiseFromFile('./input.txt', __dirname);

  for (let noun = 0; noun <= 99; noun++) {
    for (let verb = 0; verb <= 99; verb++) {
      computer.reset();
      computer.overrideMemory(1, noun);
      computer.overrideMemory(2, verb);
      computer.run();

      if (computer.readMemory(0) === 19690720) {
        return 100 * noun + verb;
      }
    }
  }
}

async function solve() {
  console.log('Result of part one', await partOne());
  console.log('Result of part two', await partTwo());
}

solve().catch(console.error);
