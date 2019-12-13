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
  SET_RELATIVE_BASE = 9,
  HALT = 99
}

enum ParameterMode {
  POSITION = 0,
  IMMEDIATE = 1,
  RELATIVE = 2,
}

export class IntcodeComputer {
  private memory: number[]
  private instructionPointer: number;
  private originalMemory: number[];
  private output: number[];
  private input: number[];
  private currentInput: number;
  private relativeBase: number;

  constructor(inputs: number[] = [0]) {
    this.memory = [];
    this.output = [];
    this.instructionPointer = 0;
    this.relativeBase = 0;
    this.setInput(inputs);
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

  private getParameter(mode: ParameterMode | undefined, value: number) {
    if (mode === undefined) {
      return this.memory[value] ?? 0;
    }

    switch (mode) {
      case ParameterMode.POSITION:
        return this.memory[value] ?? 0;
      case ParameterMode.IMMEDIATE:
        return value;
      case ParameterMode.RELATIVE:
        return this.memory[value + this.relativeBase] ?? 0;
    }
  }

  private getParameterWriteAddress(mode: ParameterMode | undefined, value: number) {
    if (mode === undefined) {
      return value;
    }

    switch (mode) {
      case ParameterMode.POSITION:
      case ParameterMode.IMMEDIATE:
        return value;
      case ParameterMode.RELATIVE:
        return value + this.relativeBase;
    }
  }

  private handleOpCode(opCode: OpCode, parameterModes: ParameterMode[], memory: number[], position: number): { position: number, memory: number[] } {
    const result = [...memory];

    // At most 3 arguments (a, b, target)
    const [r1Val, r2Val, r3Val] = memory.slice(position + 1, position + 4);
    const r1 = this.getParameter(parameterModes[0], r1Val);
    const r2 = this.getParameter(parameterModes[1], r2Val);
    const r3 = this.getParameter(parameterModes[2], r3Val);

    // For commands that are shorter
    let length = 4;

    switch (opCode) {
      case OpCode.ADD:
        result[this.getParameterWriteAddress(parameterModes[2], r3Val)] = r1 + r2;
        break;
      case OpCode.MULTIPLY:
        result[this.getParameterWriteAddress(parameterModes[2], r3Val)] = r1 * r2;
        break;
      case OpCode.STORE:
        result[this.getParameterWriteAddress(parameterModes[0], r1Val)] = this.input[this.currentInput];
        this.currentInput++;
        length = 2;
        break;
      case OpCode.OUTPUT:
        this.output.push(r1);
        length = 2;
        break;
      case OpCode.JUMP_TRUE:
        if (r1 !== 0) {
          return { position: r2, memory: result };
        }

        length = 3;
        break;
      case OpCode.JUMP_FALSE:
        if (r1 === 0) {
          return { position: r2, memory: result };
        }

        length = 3;
        break;
      case OpCode.LESS_THAN:
        result[this.getParameterWriteAddress(parameterModes[2], r3Val)] = r1 < r2 ? 1 : 0;
        break;
      case OpCode.EQUALS:
        result[this.getParameterWriteAddress(parameterModes[2], r3Val)] = r1 === r2 ? 1 : 0;
        break;
      case OpCode.SET_RELATIVE_BASE:
        this.relativeBase += r1;
        length = 2;
        break;
      case OpCode.HALT:
        length = 1;
        break;
    }

    return { position: position + length, memory: result };
  }

  private nextOpCode(): { opCode: OpCode, parameterModes: ParameterMode[] } {
    const opCode = this.memory[this.instructionPointer];
    const stringOpCode = opCode.toString();

    if (stringOpCode.length <= 2) {
      if (!isOpCode(opCode)) {
        throw new Error(`Unknown opcode ${opCode}`);
      }

      return { opCode, parameterModes: [ParameterMode.POSITION, ParameterMode.POSITION, ParameterMode.POSITION] };
    }

    // Parse out the parameter modes
    const parameterModes = stringOpCode.slice(0, stringOpCode.length - 2).split('').map((val) => parseInt(val, 10)).reverse();
    const pureOpCode = parseInt(stringOpCode.slice(stringOpCode.length - 2), 10);
    return { opCode: pureOpCode, parameterModes: parameterModes };
  }

  setInput(numbers: number[]) {
    this.input = numbers;
    this.currentInput = 0;
  }

  addInput(number: number) {
    this.input = [...this.input, number];
  }

  getOutput() {
    return [...this.output];
  }

  isHalted() {
    return this.nextOpCode().opCode === OpCode.HALT;
  }

  overrideMemory(address: number, value: number) {
    this.memory[address] = value;
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

    return this.output;
  }

  runUntilOutput() {
    let { opCode } = this.nextOpCode();
    let lastOpCode: OpCode | undefined = undefined;

    while (opCode !== OpCode.HALT && lastOpCode !== OpCode.OUTPUT) {
      this.step();
      lastOpCode = opCode;
      opCode = this.nextOpCode().opCode;
    }

    return this.output;
  }

  reset() {
    this.memory = [...this.originalMemory];
    this.output = [];
    this.instructionPointer = 0;
    this.currentInput = 0;
    this.relativeBase = 0;
    this.input = [];
  }
}

function isOpCode(value: unknown): value is OpCode {
  return Object.values(OpCode).includes(value as OpCode);
}
