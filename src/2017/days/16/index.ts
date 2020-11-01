import { readInput } from '../../../lib/input';
import { stat } from 'fs';

function performDance(input: string[], programs: string[]) {
  let result = Array.from(programs);

  input.forEach((instruction) => {
    const type = instruction.charAt(0);
    const args = instruction.substr(1);

    switch (type) {
      case 's':
        const count = parseInt(args, 10);
        const index = result.length - count;
        result = [...result.slice(index), ...result.slice(0, index)];
        break;
      case 'p':
        {
          const [a, b] = args.split('/');
          const fromIndex = result.indexOf(a);
          const toIndex = result.indexOf(b);

          result.splice(fromIndex, 1, b);
          result.splice(toIndex, 1, a);
        }
        break;
      case 'x':
        {
          const [fromIndex, toIndex] = args.split('/').map((val) => parseInt(val, 10));
          const a = result[fromIndex];
          const b = result[toIndex];

          result.splice(fromIndex, 1, b);
          result.splice(toIndex, 1, a);
        }
        break;
      default:
        console.log('Unknown instruction', instruction);
    }
  });

  return result;
}

async function partOne() {
  const input = await readInput('./input.txt', { relativeTo: __dirname, splitBy: ',' });
  const programs = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p'];

  return performDance(input, programs).join('');
}

async function partTwo() {
  const input = await readInput('./input.txt', { relativeTo: __dirname, splitBy: ',' });
  let programs = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p'];

  // Run until we reach initial state, at which point we know how long it takes to go full circle
  const states = [programs.join('')];

  while (true) {
    programs = performDance(input, programs);
    const state = programs.join('');

    if (states[0] === state) {
      break;
    }

    states.push(state);
  }

  // Figure out which state we would be in after 1B iterations
  const index = 1_000_000_000 % states.length;
  return states[index];
}

async function solve() {
  console.log('Result of part one', await partOne());
  console.log('Result of part two', await partTwo());
}

solve().catch(console.error);
