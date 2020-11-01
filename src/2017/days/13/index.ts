import { readInput } from '../../../lib/input';

function indexAtTick(length: number, tick: number) {
  const cycle = length - 1;
  return (tick / cycle) & 1 ? cycle - tick % cycle : tick % cycle;
}

async function partOne() {
  const input = await readInput('./input.txt', { relativeTo: __dirname, splitLines: true });
  const layers = input.map((str) => {
    const [_, layerStr, rangeStr] = str.match(/(\d+): (\d+)/);

    return { layer: parseInt(layerStr, 10), range: parseInt(rangeStr, 10) };
  });

  // Evaluate which of the layers we get caught in
  const caughtLayers = layers.filter(({ layer, range }) => indexAtTick(range, layer) === 0);
  return caughtLayers.reduce((sum, layer) => {
    return sum + (layer.layer * layer.range);
  }, 0);
}

async function partTwo() {
  const input = await readInput('./input.txt', { relativeTo: __dirname, splitLines: true });
  const layers = input.map((str) => {
    const [_, layerStr, rangeStr] = str.match(/(\d+): (\d+)/);
    return { layer: parseInt(layerStr, 10), range: parseInt(rangeStr, 10) };
  });

  // Evaluate which of the layers we get caught in
  let delay = 0;
  while (true) {
    const caughtLayers = layers.filter(({ layer, range }) => indexAtTick(range, layer + delay) === 0);
    if (caughtLayers.length === 0) {
      return delay;
    }

    delay++;
  }
}

async function solve() {
  console.log('Result of part one', await partOne());
  console.log('Result of part two', await partTwo());
}

solve().catch(console.error);
