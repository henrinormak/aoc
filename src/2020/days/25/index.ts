import { readMappedInput } from '../../../lib/input';

function determineLoopSize(subject: number, value: number) {
  let result = 1;
  let loop = 0;

  while (result !== value) {
    result = (result * subject) % 20201227;
    loop++;
  }

  return loop;
}

function calculateKey(subject: number, loops: number) {
  let result = 1;
  for (let i = 0; i < loops; i++) {
    result = (result * subject) % 20201227;
  }

  return result;
}

async function partOne() {
  const [card, door] = await readMappedInput('./input.txt', (val) => parseInt(val, 10), { relativeTo: __dirname, splitLines: true });
  const cardLoopSize = determineLoopSize(7, card);
  const encryptionKey = calculateKey(door, cardLoopSize);

  return encryptionKey;
}

async function partTwo() {
  const [card, door] = await readMappedInput('./input.txt', (val) => parseInt(val, 10), { relativeTo: __dirname, splitLines: true });

}

async function solve() {
  console.log('Result of part one', await partOne());
  console.log('Result of part two', await partTwo());
}

solve().catch(console.error);
