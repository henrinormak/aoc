import { readInput } from '../../../lib/input';

const ELEMENT = /([0-9]+) ([A-Z]+)/;

interface Element {
  count: number;
  element: string;
}

interface Reaction {
  element: Element;
  input: Element[];
}

async function getReactions() {
    const lines = await readInput('./input.txt', { relativeTo: __dirname, splitBy: '\n' });
  const reactions = lines.map((line) => {
    const [lhs, rhs] = line.split('=>').map((part) => part.trim());
    const input = lhs.split(',').map((val) => val.trim()).map((val) => {
      const matches = val.match(ELEMENT);
      return {
        count: parseInt(matches[1], 10),
        element: matches[2],
      };
    });

    const outputMatches = rhs.match(ELEMENT);

    return {
      input,
      output: {
        count: parseInt(outputMatches[1], 10),
        element: outputMatches[2],
      },
    };
  });

  return reactions.reduce((memo, reaction) => {
    return memo.set(reaction.output.element, { input: reaction.input, element: reaction.output });
  }, new Map<string, Reaction>());
}

function getWithDefault<K, V>(map: Map<K, V>, key: K, defaultValue: V): V {
  return map.get(key) ?? defaultValue;
}

function oreNeededForFuel(amount: number, reactions: Map<string, Reaction>) {
  const inventory = new Map<string, number>();

  function produce(element: string, amount: number) {
    let ore = 0;
    const reaction = reactions.get(element);
    const multiplier = Math.ceil(amount / reaction.element.count);

    for (const input of reaction.input) {
      if (input.element === 'ORE') {
        ore += multiplier * input.count;
        continue;
      }

      if (getWithDefault(inventory, input.element, 0) < multiplier * input.count) {
        ore += produce(input.element, multiplier * input.count - inventory.get(input.element));
      }

      inventory.set(input.element, getWithDefault(inventory, input.element, 0) - multiplier * input.count);
    }

    inventory.set(reaction.element.element, getWithDefault(inventory, reaction.element.element, 0) + multiplier * reaction.element.count);
    return ore;
  }

  return produce('FUEL', amount);
}

async function partOne() {
  const reactions = await getReactions();
  return oreNeededForFuel(1, reactions);
}

async function partTwo() {
  const reactions = await getReactions();

  // Binary search to figure out how much fuel we can produce for 1e12 ore
  let limit = 1e12;
  let upperBound = limit; // 1-1 producing
  let lowerBound = 0; // somehow can't produce any

  while (upperBound !== lowerBound) {
    const fuel = lowerBound + Math.floor((upperBound - lowerBound) / 2);

    if (oreNeededForFuel(fuel, reactions) <= limit) {
      // We can produce more, as it took less ore than the limit
      lowerBound = fuel;
    } else {
      // We can't produce as much, so at least one fuel less
      upperBound = fuel - 1;
    }
  }

  return lowerBound;
}

async function solve() {
  console.log('Result of part one', await partOne());
  console.log('Result of part two', await partTwo());
}

solve().catch(console.error);
