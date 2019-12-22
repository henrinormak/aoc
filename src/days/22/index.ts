import BigNumber from 'bignumber.js';

import { readInput } from '../../lib/input';

async function partOne() {
  const input = await readInput('./input.txt', { relativeTo: __dirname, splitLines: true });

  const cardCount = 10007;
  let cards = new Array(cardCount).fill(0, 0, cardCount).map((_, idx) => idx);

  for (const command of input) {
    // Deal into new
    if (command === 'deal into new stack') {
      cards = cards.reverse();
    } else if (/cut ([0-9]*)/.test(command)) {
      const [_, count] = /cut (-?[0-9]*)/.exec(command);
      const cut = parseInt(count, 10);

      if (cut < 0) {
        cards = [...cards.slice(cut), ...cards.slice(0, cut)];
      } else {
        cards = [...cards.slice(cut, cards.length), ...cards.slice(0, cut)];
      }
    } else if (/deal with increment ([0-9]*)/.test(command)) {
      const [_, count] = /deal with increment ([0-9]*)/.exec(command);
      const increment = parseInt(count);

      const remaining = [...cards];
      let idx = 0;

      while (remaining.length > 0) {
        const card = remaining.shift();
        cards[idx % cards.length] = card;
        idx += increment;
      }
    }
  }

  return cards.findIndex((val) => val === 2019);
}

async function partTwo() {
  const input = (await readInput('./input.txt', { relativeTo: __dirname, splitLines: true })).reverse();

  // Some next level math-wizardry with big numbers. Took the math from the solutions thread on Reddit:
  // https://www.reddit.com/r/adventofcode/comments/ee0rqi/2019_day_22_solutions/

  const deckSize = new BigNumber(119315717514047);
  const count = new BigNumber(101741582076661);
  const card = new BigNumber(2020);

  BigNumber.config({
    // So that negative number modulo returns positive value
    MODULO_MODE: BigNumber.EUCLID,
  });

  let a = new BigNumber(1);
  let b = new BigNumber(0);

  for (const command of input) {
    if (command === 'deal into new stack') {
      // Dealing into a new stack is reversing the existing stack, so an index i becomes -i+deckSize-1
      a = a.times(-1);
      b = b.times(-1).plus(deckSize.minus(1));
    } else if (/cut ([0-9]*)/.test(command)) {
      const [_, cut] = /cut (-?[0-9]*)/.exec(command);
      // Cutting is just offsetting the index
      b = b.plus(new BigNumber(cut));
    } else if (/deal with increment ([0-9]*)/.test(command)) {
      const [_, increment] = /deal with increment ([0-9]*)/.exec(command);
      // As long as deckSize is a prime, p is increment modinv deckSize, which is (increment^deckSize-2) % deckSize
      const p = new BigNumber(increment).pow(deckSize.minus(2), deckSize);
      a = a.times(p);
      b = b.times(p);
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
