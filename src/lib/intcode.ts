import { readInput, InputOptions } from './input';

enum OpCode {
  ADD = 1,
  MULTIPLY = 2,
  SUBTRACT = -1,
  DIVIDE = -2,
  HALT = 99
}

export class IntcodeComputer {
  private memory: number[]
  private instructionPointer: number;
  private noun: number;
  private verb: number;
  private originalMemory: number[];

  constructor(input: { noun: number; verb: number } = { noun: 12, verb: 2 }) {
    this.memory = [];
    this.instructionPointer = 0;
    this.setInput(input);
  }

  async initialiseFromFile(filePath: string, relativeTo: string) {
    this.memory = (await readInput(filePath, { relativeTo, splitLines: false }))[0].split(',').map((value) => parseInt(value, 10));
    this.originalMemory = [...this.memory];
    this.instructionPointer = 0;
    this.memory[1] = this.noun;
    this.memory[2] = this.verb;
  }

  private handleOpCode(opCode: OpCode, memory: number[], position: number): { position: number, memory: number[] } {
    const result = [...memory];

    switch (opCode) {
      case OpCode.ADD: {
        const length = 4;
        const [aAddr, bAddr, targetAddr] = memory.slice(position + 1, position + length);
        result[targetAddr] = result[aAddr] + result[bAddr];
        return { position: position + length, memory: result };
      }
      case OpCode.MULTIPLY: {
        const length = 4;
        const [aAddr, bAddr, targetAddr] = memory.slice(position + 1, position + length);
        result[targetAddr] = result[aAddr] * result[bAddr];
        return { position: position + length, memory: result };
      }
      case OpCode.SUBTRACT: {
        const length = 4;
        const [aAddr, bAddr, targetAddr] = memory.slice(position + 1, position + length);
        result[targetAddr] = result[aAddr] - result[bAddr];
        return { position: position + length, memory: result };
      }
      case OpCode.DIVIDE: {
        const length = 4;
        const [aAddr, bAddr, targetAddr] = memory.slice(position + 1, position + length);
        result[targetAddr] = result[aAddr] / result[bAddr];
        return { position: position + length, memory: result };
      }
      case OpCode.HALT:
        return { position, memory };
    }
  }

  private nextOpCode() {
    const opCode = this.memory[this.instructionPointer];

    if (!isOpCode(opCode)) {
      throw new Error('Unknown opcode');
    }

    return opCode;
  }

  setInput({ verb, noun }: { verb: number; noun: number }) {
    this.verb = verb;
    this.noun = noun;
  }

  step() {
    const opCode = this.nextOpCode();
    const { position, memory } = this.handleOpCode(opCode, this.memory, this.instructionPointer);
    this.instructionPointer = position;
    this.memory = memory;

    return this.memory;
  }

  run() {
    let opCode = this.nextOpCode();

    while (opCode !== OpCode.HALT) {
      this.step();
      opCode = this.nextOpCode();
    }

    return this.memory;
  }

  reset() {
    this.memory = [...this.originalMemory];
    this.memory[1] = this.noun;
    this.memory[2] = this.verb;
    this.instructionPointer = 0;
  }
}

function isOpCode(value: unknown): value is OpCode {
  return Object.values(OpCode).includes(value as OpCode);
}
