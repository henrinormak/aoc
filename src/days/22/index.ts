import BigNumber from 'bignumber.js';

import { readInput } from '../../lib/input';

interface Operation {
  op: 'cut' | 'new' | 'increment';
  value?: number;
}

async function getOperations(): Promise<Operation[]> {
  const input = await readInput('./input.txt', { relativeTo: __dirname, splitLines: true });

  return input.map((line) => {
    if (line.startsWith('deal into')) {
      return { op: 'new', value: undefined };
    }

    if (line.startsWith('deal with increment')) {
      return { op: 'increment', value: parseInt(line.slice(20), 10) };
    }

    if (line.startsWith('cut')) {
      return { op: 'cut', value: parseInt(line.slice(4), 10) };
    }
  });
}

async function partOne() {
  const operations = await getOperations();

  const deckSize = 10007;
  let idx = 2019;

  for (const { op: command, value } of operations) {
    switch (command) {
      case 'new':
        // Reversing is just going to the index on the opposite side
        idx = deckSize - idx - 1;
        break;
      case 'cut':
        // Cutting is to offset our existing index by the cut (positive cut brings us to the front)
        // Need the additional deckSize to avoid JS returning a negative result
        idx = (idx - value + deckSize) % deckSize;
        break;
      case 'increment':
        // Dealing with increment is equivalent to multiplying by the increment
        idx = (idx * value) % deckSize;
        break;
    }
  }

  return idx;
}

async function partTwo() {
  // Some next level math-wizardry with big numbers. Took the math from the solutions thread on Reddit:
  // https://www.reddit.com/r/adventofcode/comments/ee0rqi/2019_day_22_solutions/
  // The gist is that each of the operations can be described as a mathematical function,
  // which we can also "revert" - allowing us to start from the "index we want to track" and execute the operations in reverse
  // In addition, the iterations count is used as a power of the resulting function to get the answer
  // after that many iterations
  const operations = (await getOperations()).reverse();

  const deckSize = new BigNumber(119315717514047);
  const count = new BigNumber(101741582076661);
  const card = new BigNumber(2020);

  BigNumber.config({
    // So that negative number modulo returns positive value
    MODULO_MODE: BigNumber.EUCLID,
  });

  let a = new BigNumber(1);
  let b = new BigNumber(0);

  for (const { op: command, value } of operations) {
    switch (command) {
      case 'new':
        // Opposite of deckSize - idx - 1 is still that
        a = a.times(-1);
        b = b.times(-1).plus(deckSize.minus(1));
        break;
      case 'cut':
        // Opposite of (idx - value) is idx + value
        b = b.plus(value);
        break;
      case 'increment':
        // Opposite of (idx * value) is (idx * (value^deckSize-2) % deckSize), as long as deckSize is a prime
        const p = new BigNumber(value).pow(deckSize.minus(2), deckSize);
        a = a.times(p);
        b = b.times(p);
        break;
    }
  }

  return (a.pow(count, deckSize).times(card))
    .plus(
      (b.times(a.pow(count, deckSize).plus(deckSize.minus(1))).times(a.minus(1).pow(deckSize.minus(2), deckSize)))
    )
    .mod(deckSize)
    .toFixed();
}

async function solve() {
  console.log('Result of part one', await partOne());
  console.log('Result of part two', await partTwo());
}

solve().catch(console.error);
