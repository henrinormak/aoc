import { readMappedInput } from '../../../lib/input';

type Instruction = { type: 'mask', value: string[] } | { type: 'mem', value: number, address: number };

function lineToInstruction(line: string): Instruction {
  const [_, instruction] = /^(mem|mask)/.exec(line);

  switch (instruction) {
    case 'mask':
      {
        const [_, value] = /^mask = ((:?\d|X)+)/.exec(line);
        return { type: 'mask', value: value.split('') };
      }
    case 'mem':
      {
        const [_, address, value] = /^mem\[(\d+)] = (\d+)/.exec(line);
        return { type: 'mem', value: parseInt(value, 10), address: parseInt(address, 10) };
      }
    default:
      throw new Error('Unknown instruction');
  }
}

function applyBitMaskToValue(mask: string[], value: number) {
  const number = value.toString(2).padStart(36, '0').split('');
  mask.forEach((value, idx) => {
    number[idx] = value === 'X' ? number[idx] : value;
  });

  return BigInt(parseInt(number.join(''), 2));
}

function applyBitMaskToAddress(mask: string[], address: number) {
  const splitAddress = address.toString(2).padStart(36, '0').split('');
  const xCount = mask.filter((val) => val === 'X').length;
  const resultCount = Math.pow(2, xCount);
  const addresses: number[] = [];

  for (let i = 0; i < resultCount; i++) {
    const value = i.toString(2).padStart(xCount, '0').split('');
    let j = 0;

    addresses.push(parseInt(splitAddress.map((val, idx) => {
      if (mask[idx] === 'X') {
        const result = value[j];
        j++;
        return result;
      }

      if (mask[idx] === '1') {
        return '1';
      }

      return val;
    }).join(''), 2));
  }

  return addresses;
}

async function partOne() {
  const input = await readMappedInput('./input.txt', lineToInstruction, { relativeTo: __dirname, splitLines: true });

  const memory = new Map<number, bigint>();
  let mask: string[];

  input.forEach((instruction) => {
    switch (instruction.type) {
      case 'mask':
        mask = instruction.value;
        break;
      case 'mem':
        memory.set(instruction.address, applyBitMaskToValue(mask, instruction.value));
        break;
    }
  });

  let sum = 0n;
  memory.forEach((value) => sum += value);
  return sum;
}

async function partTwo() {
  const input = await readMappedInput('./input.txt', lineToInstruction, { relativeTo: __dirname, splitLines: true });

  const memory = new Map<number, bigint>();
  let mask: string[];

  input.forEach((instruction) => {
    switch (instruction.type) {
      case 'mask':
        mask = instruction.value;
        break;
      case 'mem':
        const addresses = applyBitMaskToAddress(mask, instruction.address);
        addresses.forEach((address) => memory.set(address, BigInt(instruction.value)));
        break;
    }
  });

  let sum = 0n;
  memory.forEach((value) => sum += value);
  return sum;

}

async function solve() {
  console.log('Result of part one', await partOne());
  console.log('Result of part two', await partTwo());
}

solve().catch(console.error);
