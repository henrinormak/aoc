import { readInput } from '../../../lib/input';

async function partOne() {
  const input = await readInput('./input.txt', { relativeTo: __dirname, splitLines: true });
  const numbers = input.map((line) => parseInt(line, 10));

  for (let i = 0; i < numbers.length; i++) {
    for (let j = i + 1; j < numbers.length; j++) {
      if (numbers[i] + numbers[j] === 2020) {
        return numbers[i] * numbers[j];
      }
    }
  }

  throw new Error('Did not find matches');
}

async function partTwo() {
  const input = await readInput('./input.txt', { relativeTo: __dirname, splitLines: true });
  const numbers = input.map((line) => parseInt(line, 10));

  for (let i = 0; i < numbers.length; i++) {
    for (let j = i + 1; j < numbers.length; j++) {
      for (let k = j + 1; k < numbers.length; k++) {
        if (numbers[i] + numbers[j] + numbers[k] === 2020) {
          return numbers[i] * numbers[j] * numbers[k];
        }
      }
    }
  }

  throw new Error('Did not find matches');
}

async function solve() {
  console.log('Result of part one', await partOne());
  console.log('Result of part two', await partTwo());
}

solve().catch(console.error);
