import { readInput } from '../../../lib/input';

async function partOne() {
  const input = await readInput('./input.txt', { relativeTo: __dirname, splitBy: '' });

  let currentScore: number = 0;
  let scores: number[] = [];
  let inTrash: boolean = false;
  let cancelled: boolean = false;

  input.forEach((char) => {
    if (cancelled) {
      cancelled = false;
      return;
    }

    switch (char) {
      case '{':
        if (!inTrash) {
          currentScore++;
        }
        break;
      case '}':
        if (!inTrash) {
          scores.push(currentScore);
          currentScore--;
        }
        break;
      case '<':
        inTrash = true;
        break;
      case '>':
        inTrash = false;
        break;
      case '!':
        cancelled = true;
        break;
    }
  });

  return scores.reduce((sum, score) => sum + score, 0);
}

async function partTwo() {
  const input = await readInput('./input.txt', { relativeTo: __dirname, splitBy: '' });

  let inTrash: boolean = false;
  let cancelled: boolean = false;
  let count: number = 0;

  input.forEach((char) => {
    if (cancelled) {
      cancelled = false;
      return;
    }

    switch (char) {
      case '{':
        if (inTrash) {
          count++;
        }
        break;
      case '}':
        if (inTrash) {
          count++;
        }
        break;
      case '<':
        if (!inTrash) {
          inTrash = true;
        } else {
          count++;
        }
        break;
      case '>':
        inTrash = false;
        break;
      case '!':
        cancelled = true;
        break;
      default:
        if (inTrash) {
          count++;
        }
    }
  });

  return count;
}

async function solve() {
  console.log('Result of part one', await partOne());
  console.log('Result of part two', await partTwo());
}

solve().catch(console.error);
