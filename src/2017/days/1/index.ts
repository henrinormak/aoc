import { readInput } from '../../../lib/input';

async function partOne() {
  const numbers = await readInput('./input.txt', { relativeTo: __dirname, splitBy: '' });
  const valuesToAdd: number[] = [];

  numbers.forEach((val, idx) => {
    const comparisonIdx = (idx + 1) % numbers.length;
    if (val === numbers[comparisonIdx]) {
      valuesToAdd.push(parseInt(val, 10));
    }
  });

  return valuesToAdd.reduce((sum, value) => sum + value, 0);
}

async function partTwo() {
  const numbers = await readInput('./input.txt', { relativeTo: __dirname, splitBy: '' });
  const valuesToAdd: number[] = [];
  const addition = numbers.length / 2;

  numbers.forEach((val, idx) => {
    const comparisonIdx = (idx + addition) % numbers.length;
    if (val === numbers[comparisonIdx]) {
      valuesToAdd.push(parseInt(val, 10));
    }
  });

  return valuesToAdd.reduce((sum, value) => sum + value, 0);

}

async function solve() {
  console.log('Result of part one', await partOne());
  console.log('Result of part two', await partTwo());
}

solve().catch(console.error);
