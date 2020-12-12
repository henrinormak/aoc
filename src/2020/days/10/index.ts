import { readMappedInput } from '../../../lib/input';

async function partOne() {
  const adapters = await readMappedInput('./input.txt', (val) => parseInt(val, 10), { relativeTo: __dirname, splitLines: true });
  const orderedAdapters = adapters.sort((a, b) => a - b);
  orderedAdapters.push(orderedAdapters[orderedAdapters.length - 1] + 3);
  const jumps = orderedAdapters.map((val, idx) => {
    return val - (orderedAdapters[idx - 1] ?? 0);
  });

  const { ones, threes } = jumps.reduce((memo, jump) => {
    if (jump === 1) {
      memo.ones++;
    } else if (jump === 3) {
      memo.threes++;
    }

    return memo;
  }, { ones: 0, threes: 0 });

  return ones * threes;
}

async function partTwo() {
  // Feeling bad, but ended up reading the solution thread:
  // https://www.reddit.com/r/adventofcode/comments/ka8z8x/2020_day_10_solutions/
  // For all sequences of 1 jumps (separated by those of 3 jolt jump),
  // we can use the tribonacci number corresponding to the length as a multiplier
  const adapters = await readMappedInput('./input.txt', (val) => parseInt(val, 10), { relativeTo: __dirname, splitLines: true });
  const orderedAdapters = adapters.sort((a, b) => a - b);
  orderedAdapters.push(orderedAdapters[orderedAdapters.length - 1] + 3);

  const reorderableSequences = orderedAdapters.map((val, idx) => {
    return val - (orderedAdapters[idx - 1] ?? 0);
  }).join('').split('3').filter((val) => val.length !== 0);

  const tribonacci = [1, 1, 2, 4, 7, 13, 24, 44, 81];
  return reorderableSequences.reduce((total, val) => total * tribonacci[val.length], 1);
}

async function solve() {
  console.log('Result of part one', await partOne());
  console.log('Result of part two', await partTwo());
}

solve().catch(console.error);
