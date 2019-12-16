import { readInput } from '../../lib/input';

function getCoefficient(index: number, repeats: number) {
  const pattern = [0, 1, 0, -1];
  return pattern[Math.floor((index + 1) / repeats) % pattern.length];
}

function repeat(numbers: number[], times: number) {
  const result = new Array(numbers.length * times);

  for (let i = 0; i < numbers.length * times; i++) {
    result[i] = numbers[i % numbers.length];
  }

  return result;
}

function calculateFFT(input: number[]) {
  return input.map((_, index) => {
    // Anything before the index itself is 0 in the pattern, so we can
    // simply skip those and focus on the rest of the input
    const value = input.slice(index).reduce((sum, value, idx) => {
      return sum + getCoefficient(index + idx, index + 1) * value
    }, 0);

    return Math.abs(value % 10);
  });
}

async function partOne() {
  const numbers = (await readInput('./input.txt', { relativeTo: __dirname, splitBy: '' })).map((val) => parseInt(val, 10));
  let output: number[] = [...numbers];

  for (let phase = 1; phase <= 100; phase++) {
    output = calculateFFT(output);
  }

  return output.slice(0, 8).join('');
}

async function partTwo() {
  const numbers = (await readInput('./input.txt', { relativeTo: __dirname, splitBy: '' })).map((val) => parseInt(val, 10));
  const output = repeat(numbers, 10_000);
  const offset = parseInt(numbers.slice(0, 7).join(''), 10);
  const length = output.length;

  if (offset < output.length / 2) {
    throw new Error('The offset is not larger than 1/2 of the length of the input, the logic will not work');
  }

  // We are relying on the fact that a 7 digit offset is likely much larger than 1/2 of
  // the length of our input. As such, those digits are always just a partial
  // sum of the tail of the previous phase (because the pattern for them ends up being 00000.11111 where
  // it never reaches the third 0 in the base pattern)
  for (let phase = 1; phase <= 100; phase++) {
    let partialSum = output.slice(offset, length).reduce((sum, val) => sum + val, 0);

    for (let j = offset; j < length; j++) {
      const val = Math.abs(partialSum % 10);
      partialSum -= output[j];
      output[j] = val;
    }
  }

  return output.slice(offset, offset + 8).join('');
}

async function solve() {
  console.log('Result of part one', await partOne());
  console.log('Result of part two', await partTwo());
}

solve().catch(console.error);
