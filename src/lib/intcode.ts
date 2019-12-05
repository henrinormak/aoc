import { readInput, InputOptions } from './input';

enum OpCode {
  ADD = 1,
  MULTIPLY = 2,
  STORE = 3,
  OUTPUT = 4,
  JUMP_TRUE = 5,
  JUMP_FALSE = 6,
  LESS_THAN = 7,
  EQUALS = 8,
  HALT = 99
}

enum ParameterMode {
  POSITION = 0,
  IMMEDIATE = 1,
}

export class IntcodeComputer {
  private memory: number[]
  private instructionPointer: number;
  private originalMemory: number[];
  private output: number[];
  private input: number;

  constructor(input: number = 0) {
    this.memory = [];
    this.output = [];
    this.instructionPointer = 0;
    this.setInput(input);
  }

  async initialiseFromFile(filePath: string, relativeTo: string) {
    this.memory = (await readInput(filePath, { relativeTo, splitLines: false }))[0].split(',').map((value) => parseInt(value, 10));
    this.originalMemory = [...this.memory];
    this.instructionPointer = 0;
  }

  async initialiseFromString(string: string) {
    this.memory = string.split(',').map((value) => parseInt(value, 10));
    this.originalMemory = [...this.memory];
    this.instructionPointer = 0;
  }

  private handleOpCode(opCode: OpCode, parameterModes: ParameterMode[], memory: number[], position: number): { position: number, memory: number[] } {
    const result = [...memory];

    console.log('Handle', opCode, parameterModes);

    switch (opCode) {
      case OpCode.ADD: {
        const length = 4;
        const [aAddr, bAddr, targetAddr] = memory.slice(position + 1, position + length);
        const a = parameterModes[0] === ParameterMode.IMMEDIATE ? aAddr : result[aAddr];
        const b = parameterModes[1] === ParameterMode.IMMEDIATE ? bAddr : result[bAddr];

        result[targetAddr] = a + b;
        return { position: position + length, memory: result };
      }
      case OpCode.MULTIPLY: {
        const length = 4;
        const [aAddr, bAddr, targetAddr] = memory.slice(position + 1, position + length);
        const a = parameterModes[0] === ParameterMode.IMMEDIATE ? aAddr : result[aAddr];
        const b = parameterModes[1] === ParameterMode.IMMEDIATE ? bAddr : result[bAddr];

        result[targetAddr] = a * b;
        return { position: position + length, memory: result };
      }
      case OpCode.STORE: {
        const length = 2;
        const [addr] = memory.slice(position + 1, position + length);
        result[addr] = this.input;
        return { position: position + length, memory: result };
      }
      case OpCode.OUTPUT: {
        const length = 2;
        const [addr] = memory.slice(position + 1, position + length);
        const a = parameterModes[0] === ParameterMode.IMMEDIATE ? addr : result[addr];
        this.output.push(a);
        return { position: position + length, memory: result };
      }
      case OpCode.JUMP_TRUE: {
        const length = 3;
        const [aAddr, bAddr] = memory.slice(position + 1, position + length);
        const a = parameterModes[0] === ParameterMode.IMMEDIATE ? aAddr : result[aAddr];
        const b = parameterModes[1] === ParameterMode.IMMEDIATE ? bAddr : result[bAddr];

        if (a !== 0) {
          return { position: b, memory: result };
        }

        return { position: position + length, memory: result };
      }
      case OpCode.JUMP_FALSE: {
        const length = 3;
        const [aAddr, bAddr] = memory.slice(position + 1, position + length);
        const a = parameterModes[0] === ParameterMode.IMMEDIATE ? aAddr : result[aAddr];
        const b = parameterModes[1] === ParameterMode.IMMEDIATE ? bAddr : result[bAddr];

        if (a === 0) {
          return { position: b, memory: result };
        }

        return { position: position + length, memory: result };
      }
      case OpCode.LESS_THAN: {
        const length = 4;
        const [aAddr, bAddr, targetAddr] = memory.slice(position + 1, position + length);
        const a = parameterModes[0] === ParameterMode.IMMEDIATE ? aAddr : result[aAddr];
        const b = parameterModes[1] === ParameterMode.IMMEDIATE ? bAddr : result[bAddr];

        result[targetAddr] = a < b ? 1 : 0;
        return { position: position + length, memory: result };
      }
      case OpCode.EQUALS: {
        const length = 4;
        const [aAddr, bAddr, targetAddr] = memory.slice(position + 1, position + length);
        const a = parameterModes[0] === ParameterMode.IMMEDIATE ? aAddr : result[aAddr];
        const b = parameterModes[1] === ParameterMode.IMMEDIATE ? bAddr : result[bAddr];

        result[targetAddr] = a === b ? 1 : 0;
        return { position: position + length, memory: result };
      }
      case OpCode.HALT:
        return { position, memory };
    }
  }

  private nextOpCode(): { opCode: OpCode, parameterModes: ParameterMode[] } {
    const opCode = this.memory[this.instructionPointer];
    const stringOpCode = opCode.toString();

    if (stringOpCode.length <= 2) {
      if (!isOpCode(opCode)) {
        throw new Error('Unknown opcode');
      }

      return { opCode, parameterModes: [ParameterMode.POSITION, ParameterMode.POSITION, ParameterMode.POSITION] };
    }

    // Parse out the parameter modes
    const parameterModes = stringOpCode.slice(0, stringOpCode.length - 2).split('').map((val) => parseInt(val, 10)).reverse();
    const pureOpCode = parseInt(stringOpCode.slice(stringOpCode.length - 2), 10);
    return { opCode: pureOpCode, parameterModes: parameterModes };
  }

  setInput(number: number) {
    this.input = number;
  }

  getOutput() {
    return [...this.output];
  }

  step() {
    const { opCode, parameterModes } = this.nextOpCode();
    const { position, memory } = this.handleOpCode(opCode, parameterModes, this.memory, this.instructionPointer);
    this.instructionPointer = position;
    this.memory = memory;

    return this.memory;
  }

  run() {
    let { opCode } = this.nextOpCode();

    while (opCode !== OpCode.HALT) {
      this.step();
      opCode = this.nextOpCode().opCode;
    }

    return this.memory;
  }

  reset() {
    this.memory = [...this.originalMemory];
    this.output = [];
    this.instructionPointer = 0;
  }
}

function isOpCode(value: unknown): value is OpCode {
  return Object.values(OpCode).includes(value as OpCode);
}
