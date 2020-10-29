import { readInput } from '../../../lib/input';

function getWithDefault<K, V>(map: Map<K, V>, key: K, defaultValue: V): V {
  return map.get(key) ?? defaultValue;
}

function evaluate(instructions: string[], iterationCallback?: (registers: Map<string, number>) => void): Map<string, number> {
  const registers = new Map<string, number>();

  instructions.forEach((instruction) => {
    const [_, register, operation, incrementStr, comparisonRegister, comparator, comparisonStr] = instruction.match(/([a-z]+) (inc|dec) (-?\d+) if ([a-z]+) (<|<=|>|>=|!=|==) (-?\d+)/);
    const comparison = parseInt(comparisonStr, 10);
    const increment = parseInt(incrementStr, 10);

    // Check condition
    switch (comparator) {
      case '>':
        if (getWithDefault(registers, comparisonRegister, 0) <= comparison) {
          return;
        }
        break;
      case '>=':
        if (getWithDefault(registers, comparisonRegister, 0) < comparison) {
          return;
        }
        break;
      case '<':
        if (getWithDefault(registers, comparisonRegister, 0) >= comparison) {
          return;
        }
        break;
      case '<=':
        if (getWithDefault(registers, comparisonRegister, 0) > comparison) {
          return;
        }
        break;
      case '!=':
        if (getWithDefault(registers, comparisonRegister, 0) === comparison) {
          return;
        }
        break;
      case '==':
        if (getWithDefault(registers, comparisonRegister, 0) !== comparison) {
          return;
        }
        break;
      default:
        console.log('Unknown comparison, ignoring', comparator);
        return;
    }

    const currentValue = getWithDefault(registers, register, 0);
    registers.set(register, operation === 'inc' ? currentValue + increment : currentValue - increment);

    if (iterationCallback !== undefined) {
      iterationCallback(registers);
    }
  });

  return registers;
}

async function partOne() {
  const input = await readInput('./input.txt', { relativeTo: __dirname, splitLines: true });
  const registers = evaluate(input);
  return Math.max(...registers.values());
}

async function partTwo() {
  const input = await readInput('./input.txt', { relativeTo: __dirname, splitLines: true });
  let maxSeen: number | undefined = undefined;
  evaluate(input, (registers) => {
    const max = Math.max(...registers.values());
    if (maxSeen === undefined) {
      maxSeen = max;
    } else if (maxSeen < max) {
      maxSeen = max;
    }
  });

  return maxSeen;
}

async function solve() {
  console.log('Result of part one', await partOne());
  console.log('Result of part two', await partTwo());
}

solve().catch(console.error);
