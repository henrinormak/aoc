import { readInput } from '../../lib/input';

enum OpCode {
  ADD = 1,
  MULTIPLY = 2,
  HALT = 99
}

function isOpCode(value: unknown): value is OpCode {
  return Object.values(OpCode).includes(value as OpCode);
}

function handleOpCode(opCode: OpCode, data: number[], position: number): { position: number, data: number[] } {
  const result = [...data];

  switch (opCode) {
    case OpCode.ADD: {
      const a = data[data[position + 1]];
      const b = data[data[position + 2]];
      const target = data[position + 3];

      result[target] = a + b;

      return { position: position + 4, data: result };
    }
    case OpCode.MULTIPLY: {
      const a = data[data[position + 1]];
      const b = data[data[position + 2]];
      let target = data[position + 3];
      result[target] = a * b;

      return { position: position + 4, data: result };
    }
    case OpCode.HALT:
      return { position, data };
  }
}

async function partOne({ verb, noun }: { verb?: number; noun?: number } = {}) {
  let data = (await readInput('./input.txt', { relativeTo: __dirname }))[0].split(',').map((value) => parseInt(value, 10));
  let position = 0;
  let opCode: OpCode = data[position];

  data[1] = noun || 12;
  data[2] = verb || 2;

  while (opCode !== OpCode.HALT) {
    if (!isOpCode(opCode)) {
      throw new Error('Unknown opcode');
    }

    const result = handleOpCode(opCode, data, position);

    data = result.data;
    position = result.position;
    opCode = data[position];
  }

  return data[0];
}

async function partTwo() {
  for (let noun = 0; noun <= 99; noun++) {
    for (let verb = 0; verb <= 99; verb++) {
      const output = await partOne({ verb, noun });
      if (output === 19690720) {
        return 100 * noun + verb;
      }
    }
  }
}

async function solve() {
  console.log('Result of part one', await partOne());
  console.log('Result of part two', await partTwo());
}

solve().catch(console.error);
