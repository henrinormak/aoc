import { readInput } from '../../lib/input';
import { IntcodeComputer } from '../../lib/intcode';

async function initialiseNetwork(): Promise<{ computers: IntcodeComputer[], idle: boolean[], messageQueue: number[][] }> {
  const computers: IntcodeComputer[] = [];
  const messageQueue: number[][] = [];
  const idle: boolean[] = [];

  const input = await readInput('./input.txt', { relativeTo: __dirname });

  for (let i = 0; i < 50; i++) {
    const computer = new IntcodeComputer(() => {
      idle[i] = messageQueue[i].length === 0;
      return messageQueue[i].shift() ?? -1;
    });

    computer.initialiseFromString(input[0]);

    computers.push(computer);
    messageQueue.push([i]);
  }

  return { messageQueue, idle, computers };
}

async function partOne() {
  const { computers, messageQueue } = await initialiseNetwork();
  const outputIndices: number[] = new Array(computers.length).fill(0);

  while (true) {
    for (const [src, computer] of computers.entries()) {
      const output = computer.getOutput();

      if (output.length >= outputIndices[src] + 3) {
        const idx = outputIndices[src];
        const [dest, x, y] = output.slice(idx, idx + 3);
        outputIndices[src] += 3;

        console.log('Advance output index of', src, idx, '->', outputIndices[src]);

        if (dest === 255) {
          return y;
        }

        console.log('New message', dest, x, y);
        messageQueue[dest].push(x);
        messageQueue[dest].push(y);
      }

      computer.step();
    }
  }
}

async function partTwo() {
  const { computers, idle, messageQueue } = await initialiseNetwork();
  const outputIndices: number[] = new Array(computers.length).fill(0);

  let deliveredNat: { x: number, y: number } | undefined = undefined;
  let nat: { x: number, y: number } | undefined = undefined;

  while (true) {
    for (const [src, computer] of computers.entries()) {
      const output = computer.getOutput();

      if (output.length >= outputIndices[src] + 3) {
        const idx = outputIndices[src];
        const [dest, x, y] = output.slice(idx, idx + 3);
        outputIndices[src] += 3;

        if (dest === 255) {
          nat = { x, y };
          console.log('NAT updated', nat);
        } else {
          messageQueue[dest].push(x);
          messageQueue[dest].push(y);
        }
      }

      computer.step();
    }

    // Idle check
    if (!messageQueue.some((queue) => queue.length !== 0) && !idle.some((val) => !val)) {
      console.log('Idle');

      // Check if delivering the same as previously
      if (nat !== undefined && deliveredNat !== undefined && deliveredNat.x === nat.x && deliveredNat.y === nat.y) {
        return deliveredNat.y;
      }

      if (nat !== undefined) {
        messageQueue[0].push(nat.x);
        messageQueue[0].push(nat.y);
        deliveredNat = nat;
      }
    }
  }
}

async function solve() {
  console.log('Result of part one', await partOne());
  console.log('Result of part two', await partTwo());
}

solve().catch(console.error);
