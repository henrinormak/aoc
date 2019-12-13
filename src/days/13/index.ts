import { IntcodeComputer } from '../../lib/intcode';

enum Tile {
  Empty = 0,
  Wall = 1,
  Block = 2,
  HorizontalPaddle = 3,
  Ball = 4,
}

async function initializeGame(playForFree?: boolean) {
  const computer = new IntcodeComputer();
  await computer.initialiseFromFile('./input.txt', __dirname);

  if (playForFree) {
    computer.overrideMemory(0, 2);
  }

  return computer;
}

function keyForCoordinate({ x, y }: { x: number; y: number }) {
  return `${x}:${y}`;
}

async function partOne() {
  const computer = await initializeGame();
  const screen = new Map<string, Tile>();

  while (!computer.isHalted()) {
    const [x, y, tile] = computer.runUntilOutput(3);
    screen.set(keyForCoordinate({ x, y }), tile);
  }

  return Array.from(screen.values()).filter((tile) => tile === Tile.Block).length;
}

async function partTwo() {
  const computer = await initializeGame(true);

  let score = 0;
  let ballPosition = { x: 0, y: 0 };
  let paddlePosition = { x: 0, y: 0 };
  const screen = new Map<string, Tile>();

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
        computer.setInput([0]);
      } else if (ballPosition.x > paddlePosition.x) {
        computer.setInput([1]);
      } else if (ballPosition.x < paddlePosition.x) {
        computer.setInput([-1]);
      }
    }

    if (x == -1 && y === 0) {
      score = tile;
    } else {
      screen.set(keyForCoordinate({ x, y }), tile);
    }
  }

  return score;
}

async function solve() {
  console.log('Result of part one', await partOne());
  console.log('Result of part two', await partTwo());
}

solve().catch(console.error);
