import { readInput } from '../../../lib/input';

const PASSWORD_REGEX = /^(\d+)-(\d+) ([a-z]): ([a-z]*)$/

async function partOne() {
  const input = await readInput('./input.txt', { relativeTo: __dirname, splitLines: true });
  const validRows = input.filter((row) => {
    const [_, min, max, char, password] = PASSWORD_REGEX.exec(row);
    const limitMin = parseInt(min);
    const limitMax = parseInt(max);
    const count = password.split('').filter((c) => c === char).length;

    return count >= limitMin && count <= limitMax;
  });

  return validRows.length;
}

async function partTwo() {
  const input = await readInput('./input.txt', { relativeTo: __dirname, splitLines: true });
  const validRows = input.filter((row) => {
    const [_, min, max, char, password] = PASSWORD_REGEX.exec(row);
    const minIndex = parseInt(min);
    const maxIndex = parseInt(max);
    const chars = password.split('');

    return (
      chars[minIndex - 1] === char && chars[maxIndex - 1] !== char
    ) || (
      chars[minIndex - 1] !== char && chars[maxIndex - 1] === char
    );
  });

  return validRows.length;
}

async function solve() {
  console.log('Result of part one', await partOne());
  console.log('Result of part two', await partTwo());
}

solve().catch(console.error);
