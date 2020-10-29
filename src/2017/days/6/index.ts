import { readInput } from '../../../lib/input';

async function partOne() {
  const input = await readInput('./input.txt', { relativeTo: __dirname, splitBy: '\t' });
  const banks = input.map((val) => parseInt(val, 10));

  let currentConfig: string | undefined = undefined;
  const configs = new Set<string>(banks.join(','));
  let cycles = 0;

  while (true) {
    const largestBankIdx = banks.indexOf(Math.max(...banks));
    let remainder = banks[largestBankIdx];
    banks[largestBankIdx] = 0;
    let index = largestBankIdx + 1;

    while (remainder > 0) {
      banks[index % banks.length] = banks[index % banks.length] + 1;
      remainder--;
      index++;
    }

    cycles++;
    currentConfig = banks.join(',');
    if (configs.has(currentConfig)) {
      break;
    }

    configs.add(currentConfig);
  }

  return cycles;
}

async function partTwo() {
  const input = await readInput('./input.txt', { relativeTo: __dirname, splitBy: '\t' });
  const banks = input.map((val) => parseInt(val, 10));

  let currentConfig: string | undefined = undefined;
  const configs = new Map<string, number[]>([[banks.join(','), [1]]]);
  let cycles = 0;

  while (true) {
    const largestBankIdx = banks.indexOf(Math.max(...banks));
    let remainder = banks[largestBankIdx];
    banks[largestBankIdx] = 0;
    let index = largestBankIdx + 1;

    while (remainder > 0) {
      banks[index % banks.length] = banks[index % banks.length] + 1;
      remainder--;
      index++;
    }

    cycles++;
    currentConfig = banks.join(',');
    const seenCycles = configs.get(currentConfig) ?? [];

    if (seenCycles.length > 2) {
      return seenCycles[2] - seenCycles[1];
    }

    configs.set(currentConfig, [...seenCycles, cycles]);
  }
}

async function solve() {
  console.log('Result of part one', await partOne());
  console.log('Result of part two', await partTwo());
}

solve().catch(console.error);
