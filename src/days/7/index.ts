import { IntcodeComputer } from '../../lib/intcode';

function generatePhaseCombinations(min: number, steps: number) {
  const phases = [...Array(steps).keys()].map((val) => val + min);
  const result: number[][] = [];

  const permute = (arr: number[], m: number[] = []) => {
    if (arr.length === 0) {
      result.push(m)
    } else {
      for (let i = 0; i < arr.length; i++) {
        const curr = arr.slice();
        const next = curr.splice(i, 1);
        permute(curr.slice(), m.concat(next))
      }
    }
  }

  permute(phases)
  return result;
}

async function partOne() {
  const computer = new IntcodeComputer();
  await computer.initialiseFromFile('./input.txt', __dirname);
  let maxThrust = 0;
  let bestPhases: number[] = [0, 0, 0, 0, 0];
  const phaseCombinations = generatePhaseCombinations(0, 5);

  for (const [a, b, c, d, e] of phaseCombinations) {
    computer.reset();
    computer.setInput([a, 0]);
    let output = computer.run();

    computer.reset();
    computer.setInput([b, output[0]]);
    output = computer.run();

    computer.reset();
    computer.setInput([c, output[0]]);
    output = computer.run();

    computer.reset();
    computer.setInput([d, output[0]]);
    output = computer.run();

    computer.reset();
    computer.setInput([e, output[0]]);
    output = computer.run();

    if (output[0] > maxThrust) {
      bestPhases = [a, b, c, d, e];
      maxThrust = output[0];
    }
  }

  return { maxThrust, bestPhases };
}

async function partTwo() {
  const ampA = new IntcodeComputer();
  await ampA.initialiseFromFile('./input.txt', __dirname);

  const ampB = new IntcodeComputer();
  await ampB.initialiseFromFile('./input.txt', __dirname);

  const ampC = new IntcodeComputer();
  await ampC.initialiseFromFile('./input.txt', __dirname);

  const ampD = new IntcodeComputer();
  await ampD.initialiseFromFile('./input.txt', __dirname);

  const ampE = new IntcodeComputer();
  await ampE.initialiseFromFile('./input.txt', __dirname);

  let maxThrust = 0;
  let bestPhases: number[] = [0, 0, 0, 0, 0];
  const phaseCombinations = generatePhaseCombinations(5, 5);

  for (const [a, b, c, d, e] of phaseCombinations) {
    // Reset all amps
    ampA.reset();
    ampB.reset();
    ampC.reset();
    ampD.reset();
    ampE.reset();

    // First input for each is the phase setting
    ampA.addInput(a);
    ampB.addInput(b);
    ampC.addInput(c);
    ampD.addInput(d);
    ampE.addInput(e);

    // A gets an additional input to start the process
    ampA.addInput(0);
    let output: number = 0;

    // Run until E has halted
    while (!ampE.isHalted()) {
      output = ampA.runUntilOutput()[0];
      ampB.addInput(output);

      output = ampB.runUntilOutput()[0];
      ampC.addInput(output);

      output = ampC.runUntilOutput()[0];
      ampD.addInput(output);

      output = ampD.runUntilOutput()[0];
      ampE.addInput(output);

      output = ampE.runUntilOutput()[0];
      ampA.addInput(output);
    }

    if (output > maxThrust) {
      maxThrust = output;
      bestPhases = [a, b, c, d, e];
    }
  }

  return { maxThrust, bestPhases };
}

async function solve() {
  console.log('Result of part one', await partOne());
  console.log('Result of part two', await partTwo());
}

solve().catch(console.error);
