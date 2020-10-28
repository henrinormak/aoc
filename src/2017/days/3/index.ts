import { readInput } from '../../../lib/input';

async function partOne() {
  const input = parseInt((await readInput('./input.txt', { relativeTo: __dirname, splitLines: true }))[0], 10);
  const circle = Math.floor(Math.ceil(Math.sqrt(input)) / 2);
  const zero = Math.pow(circle * 2 - 1, 2);
  const centers = [1, 3, 5, 7].map((x) => zero + x * circle);
  return circle + Math.min(...centers.map((x) => Math.abs(input - x)));
}

async function partTwo() {
  return 'Look for numbers in the sequence posted at https://oeis.org/A141481/b141481.txt';
}

async function solve() {
  console.log('Result of part one', await partOne());
  console.log('Result of part two', await partTwo());
}

solve().catch(console.error);
