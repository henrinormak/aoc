import { readInput } from '../../../lib/input';

function round(a: number[], b: number[]) {
  const topA = a.shift();
  const topB = b.shift();

  if (topA > topB) {
    a.push(topA, topB);
  } else {
    b.push(topB, topA);
  }
}
function score(deck: number[]) {
  return deck.reduce((sum, next, idx) => sum + (next * (deck.length - idx)), 0);
}

function playRecursiveCombat(a: number[], b: number[]): 'a' | 'b' {
  const seen = new Set();

  while (a.length > 0 && b.length > 0) {
    const config = `${a.join(',')}:${b.join(',')}`;
    if (seen.has(config)) {
      // Player 1 wins as we have already been here
      return 'a';
    }

    seen.add(config);

    const topA = a.shift();
    const topB = b.shift();

    if (topA <= a.length && topB <= b.length) {
      // Recurse
      const subgameWinner = playRecursiveCombat(a.slice(0, topA), b.slice(0, topB));

      if (subgameWinner === 'a') {
        a.push(topA, topB);
      } else {
        b.push(topB, topA);
      }

      continue;
    }

    // Regular combat
    if (topA > topB) {
      a.push(topA, topB);
    } else {
      b.push(topB, topA);
    }
  }

  return a.length === 0 ? 'b' : 'a';
}


async function partOne() {
  const [a, b] = await readInput('./input.txt', { relativeTo: __dirname, splitBy: '\n\n' });
  const [, ...deckA] = a.split('\n').map((val) => parseInt(val, 10));
  const [, ...deckB] = b.split('\n').map((val) => parseInt(val, 10));

  while (deckA.length > 0 && deckB.length > 0) {
    round(deckA, deckB);
  }

  return score(deckA.length > deckB.length ? deckA : deckB);
}

async function partTwo() {
  const [a, b] = await readInput('./input.txt', { relativeTo: __dirname, splitBy: '\n\n' });
  const [, ...deckA] = a.split('\n').map((val) => parseInt(val, 10));
  const [, ...deckB] = b.split('\n').map((val) => parseInt(val, 10));

  const winner = playRecursiveCombat(deckA, deckB);
  return winner === 'a' ? score(deckA) : score(deckB);
}

async function solve() {
  console.log('Result of part one', await partOne());
  console.log('Result of part two', await partTwo());
}

solve().catch(console.error);
