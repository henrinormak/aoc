import { readInput } from '../../../lib/input';

const SIZE = { width: 25, height: 6 };

async function getLayers(size: { width: number; height: number } = SIZE) {
  const input = (await readInput('./input.txt', { relativeTo: __dirname, splitLines: false }))[0];
  const pixels = input.split('').map((val) => parseInt(val, 10));

  const layers: number[][] = [];

  for (let [idx, pixel] of pixels.entries()) {
    const layer = Math.floor(idx / (size.width * size.height));
    if (layers[layer] === undefined) {
      layers[layer] = [pixel];
    } else {
      layers[layer].push(pixel);
    }
  }

  return layers;
}

async function partOne() {
  const layers = await getLayers();
  let minZeroes = Infinity;
  let minLayer = 0;

  for (const [idx, layer] of layers.entries()) {
    const zeroes = layer.filter((val) => val === 0).length;

    if (zeroes < minZeroes) {
      minZeroes = zeroes;
      minLayer = idx;
    }
  }

  const layer = layers[minLayer];
  return layer.filter((val) => val === 1).length * layer.filter((val) => val === 2).length;
}

async function partTwo() {
  const layers = await getLayers();

  const flattenedLayer = layers.reduce((master, layer) => {
    for (const [idx, pixel] of layer.entries()) {
      if (master[idx] === 2) {
        master[idx] = pixel;
      }
    }

    return master;
  }, [...layers[0]]);

  let result = '';

  for (let [idx, pixel] of flattenedLayer.entries()) {
    if (idx % SIZE.width === 0) {
      result = result + '\n'
    }

    result = result + `${pixel === 0 ? ' ' : '*'}`;
  }

  return result;
}

async function solve() {
  console.log('Result of part one', await partOne());
  console.log('Result of part two', await partTwo());
}

solve().catch(console.error);
