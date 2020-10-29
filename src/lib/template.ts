import { readInput } from '../../../lib/input';

async function partOne() {
  const input = await readInput('./input.txt', { relativeTo: __dirname, splitLines: true });

}

async function partTwo() {
  const input = await readInput('./input.txt', { relativeTo: __dirname, splitLines: true });

}

async function solve() {
  console.log('Result of part one', await partOne());
  console.log('Result of part two', await partTwo());
}

solve().catch(console.error);
