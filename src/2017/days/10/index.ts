import { readInput } from '../../../lib/input';
import { buildArray, chunkArray } from '../../../lib/util';

async function partOne() {
  const input = await readInput('./input.txt', { relativeTo: __dirname, splitBy: ',' });

  const lengths = input.map((val) => parseInt(val, 10));
  const listSize = 256;
  const list = buildArray(listSize, (idx) => idx);
  let currentIndex = 0;
  let skip = 0;

  lengths.forEach((length) => {
    if (length > listSize) {
      throw new Error('Invalid length');
    }

    // Grab the part of the list to be reversed
    const available = listSize - currentIndex;
    const tail = Math.min(available, length);
    const head = Math.max(length - available, 0);
    const reversed = [...list.slice(currentIndex, currentIndex + tail), ...list.slice(0, head)].reverse();

    if (head > 0) {
      list.splice(0, head, ...reversed.slice(length - head));
    }

    list.splice(currentIndex, tail, ...reversed.slice(0, tail));

    currentIndex = (currentIndex + (length + skip)) % listSize;
    skip++;
  });

  return list[0] * list[1];
}

async function partTwo() {
  const input = await readInput('./input.txt', { relativeTo: __dirname, splitBy: '' });

  const lengths = [...input.map((char) => char.charCodeAt(0)), 17, 31, 73, 47, 23];
  const listSize = 256;
  const list = buildArray(listSize, (idx) => idx);
  let currentIndex = 0;
  let skip = 0;

  for (let i = 0; i < 64; i++) {
    lengths.forEach((length) => {
      if (length > listSize) {
        throw new Error('Invalid length');
      }

      // Grab the part of the list to be reversed
      const available = listSize - currentIndex;
      const tail = Math.min(available, length);
      const head = Math.max(length - available, 0);
      const reversed = [...list.slice(currentIndex, currentIndex + tail), ...list.slice(0, head)].reverse();

      if (head > 0) {
        list.splice(0, head, ...reversed.slice(length - head));
      }

      list.splice(currentIndex, tail, ...reversed.slice(0, tail));

      currentIndex = (currentIndex + (length + skip)) % listSize;
      skip++;
    });
  }

  return chunkArray(list, 16).map((chunk) => chunk.reduce((hash, val) => hash ^ val, 0)).map((val) => val.toString(16).padStart(2, '0')).join('');
}

async function solve() {
  console.log('Result of part one', await partOne());
  console.log('Result of part two', await partTwo());
}

solve().catch(console.error);
