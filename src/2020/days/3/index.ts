import { readInput } from '../../../lib/input';

async function partOne() {
  const input = await readInput('./input.txt', { relativeTo: __dirname, splitLines: true });
  let position = 0;
  let trees = 0;

  input.forEach((row) => {
    const character = row[position % row.length];
    if (character === '#') {
      trees++;
    }

    position += 3;
  });

  return trees;
}

async function partTwo() {
  const input = await readInput('./input.txt', { relativeTo: __dirname, splitLines: true });
  const slopes = [
    { position: 0, trees: 0, x: 1, y: 1 },
    { position: 0, trees: 0, x: 3, y: 1 },
    { position: 0, trees: 0, x: 5, y: 1 },
    { position: 0, trees: 0, x: 7, y: 1 },
    { position: 0, trees: 0, x: 1, y: 2 },
  ];

  input.forEach((row, idx) => {
    slopes.forEach((slope) => {
      if (idx % slope.y !== 0) {
        return;
      }

      const pos = slope.position;
      slope.position += slope.x;
      const char = row[pos % row.length];
      if (char === '#') {
        slope.trees++;
      }
    });
  });

  console.log('Slopes', slopes);
  return slopes.reduce((memo, slope) => memo * slope.trees, 1);
}

async function solve() {
  console.log('Result of part one', await partOne());
  console.log('Result of part two', await partTwo());
}

solve().catch(console.error);
