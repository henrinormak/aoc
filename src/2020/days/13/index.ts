import { readInput } from '../../../lib/input';
import { calculateChineseRemainder, modulo } from '../../../lib/math';

async function partOne() {
  const [timestampStr, busIdsStr] = await readInput('./input.txt', { relativeTo: __dirname, splitLines: true });
  const timestamp = parseInt(timestampStr, 10);
  const busIds = busIdsStr.split(',').filter((val) => val !== 'x').map((id) => parseInt(id));
  const diffs = busIds.map((id) => ({ id, diff: id - (timestamp % id) })).sort((a, b) => a.diff - b.diff);

  return diffs[0].id * diffs[0].diff;
}

async function partTwo() {
  const [_, busIdsStr] = await readInput('./input.txt', { relativeTo: __dirname, splitLines: true });
  const busIds = busIdsStr.split(',');
  const factors = busIds.map((id, idx) => {
    if (id === 'x') {
      return undefined;
    }

    return { id: BigInt(id), a: modulo(BigInt(-idx), BigInt(id)) };
  }).filter((val) => val !== undefined);

  // This was new, had to look it up via the Reddit thread discussing it
  return calculateChineseRemainder(factors.map(({ a }) => a), factors.map(({ id }) => id)).toString();
}

async function solve() {
  console.log('Result of part one', await partOne());
  console.log('Result of part two', await partTwo());
}

solve().catch(console.error);
