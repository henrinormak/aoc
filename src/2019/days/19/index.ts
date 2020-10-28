import { IntcodeComputer } from '../../../lib/intcode';

function emptySpace(length: number) {
  if (length === 0) {
    return new Array<number>();
  }

  return new Array<number>(length).fill(0, 0, length);
}

async function partOne() {
  const input: number[] = [];
  const computer = new IntcodeComputer(() => input.shift());
  await computer.initialiseFromFile('./input.txt', __dirname);

  const map: string[][] = [];
  let affected = 0;

  for (let y = 0; y < 50; y++) {
    map.push([]);

    for (let x = 0; x < 50; x++) {
      input.push(x, y);
      const [output] = computer.runUntilOutput();
      map[y][x] = output === 1 ? '#' : '.';

      if (output === 1) {
        affected++;
      }

      computer.reset();
    }
  }

  console.log(map.map((line) => line.join('')).join('\n'));
  return affected;
}

async function partTwo() {
  const input: number[] = [];
  const computer = new IntcodeComputer(() => input.shift());
  await computer.initialiseFromFile('./input.txt', __dirname);

  const squareSize = 100;
  let lastX = 0;

  for (let y = 0; y < 100_000; y++) {
    let previousOutput = 0;
    let x = lastX;

    // Compute two rows
    const topRow = emptySpace(lastX);

    while (true) {
      input.push(x, y);
      const [output] = computer.runUntilOutput();
      topRow[x] = output;
      computer.reset();

      if (previousOutput === 1 && output === 0) {
        break;
      }

      x++;
      previousOutput = output;
    }

    x = topRow.indexOf(1);

    if (x === -1) {
      continue;
    }

    lastX = x;

    const bottomRow = emptySpace(x);
    previousOutput = 0;

    while (true) {
      input.push(x, y + squareSize - 1);
      const [output] = computer.runUntilOutput();
      bottomRow[x] = output;
      computer.reset();

      if (previousOutput === 1 && output === 0) {
        break;
      }

      x++;
      previousOutput = output;
    }

    const endX = topRow.lastIndexOf(1) + 1;
    const bottomStartX = bottomRow.indexOf(1);
    const overlap = endX - bottomStartX;

    if (endX - bottomStartX >= squareSize) {
      // We have found a solution
      return bottomStartX * 10000 + y;
    } else if (bottomStartX > endX) {
      // No overlap, skip more rows
      y += squareSize;
    } else {
      // Assumption, each row grows at most by 2, so if we are off by 50, we can skip at least 25 rows
      y += Math.max(0, Math.floor((squareSize - overlap) / 2));
    }
  }
}

async function solve() {
  console.log('Result of part one', await partOne());
  console.log('Result of part two', await partTwo());
}

solve().catch(console.error);
