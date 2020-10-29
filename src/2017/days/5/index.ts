import { readInput } from '../../../lib/input';

async function partOne() {
  const input = await readInput('./input.txt', { relativeTo: __dirname, splitLines: true });
  const numbers = input.map((val) => parseInt(val, 10));

  let offset = 0;
  let step = 0;
  while (numbers[offset] !== undefined) {
    const increment = numbers[offset];
    numbers[offset] = increment + 1;

    step++;
    offset += increment;
  }

  return step;
}

async function partTwo() {
  const input = await readInput('./input.txt', { relativeTo: __dirname, splitLines: true });
  const numbers = input.map((val) => parseInt(val, 10));

  let offset = 0;
  let step = 0;
  while (numbers[offset] !== undefined) {
    const increment = numbers[offset];
    numbers[offset] = increment >= 3 ? increment - 1 : increment + 1;

    step++;
    offset += increment;
  }

  return step;

}

async function solve() {
  console.log('Result of part one', await partOne());
  console.log('Result of part two', await partTwo());
}

solve().catch(console.error);
