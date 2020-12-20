import { readMappedInput } from '../../../lib/input';

function calculateTurn(target: number, numbers: number[]) {
  let turn = 1;
  const indices = new Map<number, number>();
  for (const number of numbers.slice(0, numbers.length - 1)) {
    indices.set(number, turn++);
  }

  let previousNumber = numbers[numbers.length - 1];
  while (turn < target) {
    if (indices.has(previousNumber)) {
      const previousOccurence = indices.get(previousNumber);
      indices.set(previousNumber, turn);
      previousNumber = turn - previousOccurence;
    } else {
      indices.set(previousNumber, turn);
      previousNumber = 0;
    }

    turn++;
  }

  return previousNumber;
}

async function partOne() {
  const numbers = await readMappedInput('./input.txt', (val) => parseInt(val, 10), { relativeTo: __dirname, splitBy: ',' });
  return calculateTurn(2020, numbers);
}

async function partTwo() {
  const numbers = await readMappedInput('./input.txt', (val) => parseInt(val, 10), { relativeTo: __dirname, splitBy: ',' });
  return calculateTurn(30_000_000, numbers);
}

async function solve() {
  console.log('Result of part one', await partOne());
  console.log('Result of part two', await partTwo());
}

solve().catch(console.error);
