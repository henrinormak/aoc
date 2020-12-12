import { readInput } from '../../../lib/input';

function canSumTo(numbers: number[], sum: number) {
  for (let i = 0; i < numbers.length; i++) {
    for (let j = i + 1; j < numbers.length; j++) {
      if (numbers[i] + numbers[j] === sum) {
        return true;
      }
    }
  }

  return false;
}

function findSumSequence(numbers: number[], target: number) {
  const targetIdx = numbers.indexOf(target);

  for (let i = 0; i < numbers.length; i++) {
    for (let j = i + 2; j < numbers.length; j++) {
      if (j === targetIdx) {
        // Can't include the number itself
        break;
      }

      const slice = numbers.slice(i, j);
      const test = slice.reduce((sum, val) => sum + val, 0);

      if (test === target) {
        return slice;
      }

      if (test > target) {
        // There are no negative numbers in the list, we can't possibly get smaller with this sequence
        break;
      }
    }
  }

  throw new Error('No sequence found');
}

async function partOne() {
  const input = await readInput('./input.txt', { relativeTo: __dirname, splitLines: true });
  const numbers = input.map((val) => parseInt(val, 10));

  for (let i = 25; i < numbers.length; i++) {
    if (!canSumTo(numbers.slice(i - 25, i), numbers[i])) {
      return numbers[i];
    }
  }
}

async function partTwo(target: number) {
  const input = await readInput('./input.txt', { relativeTo: __dirname, splitLines: true });
  const numbers = input.map((val) => parseInt(val, 10));
  const sequence = findSumSequence(numbers, target);
  return Math.min(...sequence) + Math.max(...sequence);
}

async function solve() {
  const target = await partOne();
  console.log('Result of part one', target);
  console.log('Result of part two', await partTwo(target));
}

solve().catch(console.error);
