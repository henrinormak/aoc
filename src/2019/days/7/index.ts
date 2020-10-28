import { IntcodeComputer } from '../../../lib/intcode';

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
  const input: number[] = [];
  const computer = new IntcodeComputer(() => input.shift());
  await computer.initialiseFromFile('./input.txt', __dirname);
  let maxThrust = 0;
  let bestPhases: number[] = [0, 0, 0, 0, 0];
  const phaseCombinations = generatePhaseCombinations(0, 5);

  for (const [a, b, c, d, e] of phaseCombinations) {
    computer.reset();
    input.push(a, 0);
    let output = computer.run();

    computer.reset();
    input.push(b, output[0]);
    output = computer.run();

    computer.reset();
    input.push(c, output[0]);
    output = computer.run();

    computer.reset();
    input.push(d, output[0]);
    output = computer.run();

    computer.reset();
    input.push(d, output[0]);
    output = computer.run();

    if (output[0] > maxThrust) {
      bestPhases = [a, b, c, d, e];
      maxThrust = output[0];
    }
  }

  return { maxThrust, bestPhases };
}

async function partTwo() {
  const inputs: number[][] = [
    [],
    [],
    [],
    [],
    []
  ];

  const ampA = new IntcodeComputer(() => inputs[0].shift());
  await ampA.initialiseFromFile('./input.txt', __dirname);

  const ampB = new IntcodeComputer(() => inputs[1].shift());
  await ampB.initialiseFromFile('./input.txt', __dirname);

  const ampC = new IntcodeComputer(() => inputs[2].shift());
  await ampC.initialiseFromFile('./input.txt', __dirname);

  const ampD = new IntcodeComputer(() => inputs[3].shift());
  await ampD.initialiseFromFile('./input.txt', __dirname);

  const ampE = new IntcodeComputer(() => inputs[4].shift());
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
    inputs[0].push(a);
    inputs[1].push(b);
    inputs[2].push(c);
    inputs[3].push(d);
    inputs[4].push(e);

    // A gets an additional input to start the process
    inputs[0].push(0);
    let output: number = 0;

    // Run until E has halted
    while (!ampE.isHalted()) {
      output = ampA.runUntilOutput()[0];
      inputs[1].push(output);

      output = ampB.runUntilOutput()[0];
      inputs[2].push(output);

      output = ampC.runUntilOutput()[0];
      inputs[3].push(output);

      output = ampD.runUntilOutput()[0];
      inputs[4].push(output);

      output = ampE.runUntilOutput()[0];
      inputs[0].push(output);
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
