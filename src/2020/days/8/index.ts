import { readInput } from '../../../lib/input';

interface Instruction {
  type: 'nop' | 'jmp' | 'acc';
  value: number;
}

function runInstructionsUntilEnd(instructions: Instruction[]) {
  let accumulator = 0;
  let idx = 0;
  const executedInstructions = new Set<number>();

  while (!executedInstructions.has(idx)) {
    executedInstructions.add(idx);
    const instruction = instructions[idx];

    if (instruction === undefined) {
      if (idx === instructions.length) {
        return { terminates: true, accumulator };
      }

      throw new Error('Out of range');
    }

    switch (instruction.type) {
      case 'acc':
        accumulator += instruction.value;
        idx++;
        break;
      case 'jmp':
        idx += instruction.value;
        break;
      default:
        idx++;
        break;
    }
  }

  return { terminates: false, accumulator };
}

async function partOne() {
  const input = await readInput('./input.txt', { relativeTo: __dirname, splitLines: true });
  const instructions: Instruction[] = input.map((line) => {
    const [_, instruction, value] = line.match(/(nop|jmp|acc) ((?:\+|-)\d+)/);
    return { type: instruction as 'nop' | 'jmp' | 'acc', value: parseInt(value, 10) };
  });

  const { accumulator } = runInstructionsUntilEnd(instructions);
  return accumulator;
}

async function partTwo() {
  const input = await readInput('./input.txt', { relativeTo: __dirname, splitLines: true });
  const instructions: Instruction[] = input.map((line) => {
    const [_, instruction, value] = line.match(/(nop|jmp|acc) ((?:\+|-)\d+)/);
    return { type: instruction as 'nop' | 'jmp' | 'acc', value: parseInt(value, 10) };
  });

  for (let i = 0; i <= instructions.length; i++) {
    if (instructions[i].type === 'acc') {
      continue;
    }

    const originalType = instructions[i].type;
    instructions[i].type = originalType === 'jmp' ? 'nop' : 'jmp';

    const { accumulator, terminates } = runInstructionsUntilEnd(instructions);
    if (terminates) {
      return accumulator;
    }

    instructions[i].type = originalType;
  }

  throw new Error('Failed to find successful sequence');
}

async function solve() {
  console.log('Result of part one', await partOne());
  console.log('Result of part two', await partTwo());
}

solve().catch(console.error);
