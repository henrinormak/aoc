import { IntcodeComputer } from '../../lib/intcode';

async function partOne() {
  const computer = new IntcodeComputer();
  await computer.initialiseFromFile('./input.txt', __dirname);
  return computer.run()[0];
}

async function partTwo() {
  const computer = new IntcodeComputer();
  await computer.initialiseFromFile('./input.txt', __dirname);

  for (let noun = 0; noun <= 99; noun++) {
    for (let verb = 0; verb <= 99; verb++) {
      computer.setInput({ verb, noun });
      computer.reset();
      const output = computer.run();

      if (output[0] === 19690720) {
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
