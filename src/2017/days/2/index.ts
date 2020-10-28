import { readInput } from '../../../lib/input';

async function partOne() {
  const rows = await readInput('./input.txt', { relativeTo: __dirname, splitLines: true });
  const diffs = rows.map((row) => {
    const numbers = row.split('\t').map((val) => parseInt(val, 10));
    return Math.max(...numbers) - Math.min(...numbers);
  });

  return diffs.reduce((sum, value) => sum + value, 0);
}

async function partTwo() {
  const rows = await readInput('./input.txt', { relativeTo: __dirname, splitLines: true });
  const divisors = rows.map((row) => {
    const numbers = row.split('\t').map((val) => parseInt(val, 10));

    for (let i = 0; i < numbers.length; i++) {
      for (let j = i + 1; j < numbers.length; j++) {
        const result = numbers[i] > numbers[j] ? numbers[i] / numbers[j] : numbers[j] / numbers[i];
        if (result === Math.floor(result)) {
          return result;
        }
      }
    }

    return 0;
  });

  console.log('rows', rows.length, rows);
  console.log('Divisors', divisors.length, divisors);

  return divisors.reduce((sum, value) => sum + value, 0);

}

async function solve() {
  console.log('Result of part one', await partOne());
  console.log('Result of part two', await partTwo());
}

solve().catch(console.error);
