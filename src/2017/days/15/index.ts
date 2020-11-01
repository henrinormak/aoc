const seedA = 883;
const seedB = 879;

const factorA = 16807;
const factorB = 48271;

const divisorA = 4;
const divisorB = 8;

function createGenerator(seed: number, factor: number, divisor: number = 1) {
  let previous = seed;

  const generate = (): number => {
    const next = (previous * factor) % 2147483647;
    previous = next;
    return next;
  }

  return () => {
    let next = generate();
    while (next % divisor !== 0) {
      next = generate();
    }

    return next;
  };
}

async function partOne() {
  const generatorA = createGenerator(seedA, factorA);
  const generatorB = createGenerator(seedB, factorB);

  let matches = 0;
  for (let i = 0; i < 40_000_000; i++) {
    const a = generatorA() & 0xFFFF;
    const b = generatorB() & 0xFFFF;

    if (a === b) {
      matches++;
    }
  }

  return matches;
}

async function partTwo() {
  const generatorA = createGenerator(seedA, factorA, divisorA);
  const generatorB = createGenerator(seedB, factorB, divisorB);

  let matches = 0;
  for (let i = 0; i < 5_000_000; i++) {
    const a = generatorA() & 0xFFFF;
    const b = generatorB() & 0xFFFF;

    if (a === b) {
      matches++;
    }
  }

  return matches;
}

async function solve() {
  console.log('Result of part one', await partOne());
  console.log('Result of part two', await partTwo());
}

solve().catch(console.error);
