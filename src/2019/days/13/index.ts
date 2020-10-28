import { IntcodeComputer } from '../../../lib/intcode';

enum Tile {
  Empty = 0,
  Wall = 1,
  Block = 2,
  HorizontalPaddle = 3,
  Ball = 4,
}

async function initializeGame(inputFn: () => number, playForFree?: boolean) {
  const computer = new IntcodeComputer(inputFn);
  await computer.initialiseFromFile('./input.txt', __dirname);

  if (playForFree) {
    computer.overrideMemory(0, 2);
  }

  return computer;
}

async function partOne() {
  const computer = await initializeGame(() => 0);
  let blocks = 0;

  while (!computer.isHalted()) {
    const [_, __, tile] = computer.runUntilOutput(3);
    if (tile === Tile.Block) {
      blocks++;
    }
  }

  return blocks;
}

async function partTwo() {
  let dir: number = 0;
  const computer = await initializeGame(() => dir, true);

  let score = 0;
  let ballPosition = { x: 0, y: 0 };
  let paddlePosition = { x: 0, y: 0 };

  while (!computer.isHalted()) {
    const [x, y, tile] = computer.runUntilOutput(3);

    // Quite a simple way to beat the game, just move paddle in response
    // to the ball being moved
    if (tile === Tile.HorizontalPaddle || tile === Tile.Ball) {
      switch (tile) {
        case Tile.HorizontalPaddle:
          paddlePosition = { x, y };
          break;
        case Tile.Ball:
          ballPosition = { x, y };
          break;
      }

      if (ballPosition.x === paddlePosition.x) {
        dir = 0;
      } else if (ballPosition.x > paddlePosition.x) {
        dir = 1;
      } else if (ballPosition.x < paddlePosition.x) {
        dir = -1;
      }
    }

    if (x == -1 && y === 0) {
      score = tile;
    }
  }

  return score;
}

async function solve() {
  console.log('Result of part one', await partOne());
  console.log('Result of part two', await partTwo());
}

solve().catch(console.error);
