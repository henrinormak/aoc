import { readInput } from '../../../lib/input';

async function partOne() {
  const input = await readInput('./input.txt', { relativeTo: __dirname, splitLines: true });

  const rules = new Map<string, Set<string>>();

  input.forEach((line) => {
    const [color, contents] = line.split(' bags contain ');

    contents.split(',').forEach((part) => {
      if (/no other bags/.test(part)) {
        return undefined;
      }

      const [_, innerColor] = part.match(/\d+ (.+) bags?/);
      if (!rules.has(innerColor)) {
        rules.set(innerColor, new Set());
      }

      rules.get(innerColor).add(color);
    });
  });

  // Determine all the colours that can eventually contain shiny gold
  const allowed = new Set<string>();
  const explore = Array.from(rules.get('shiny gold'));

  while (explore.length > 0) {
    const next = explore.pop();
    if (allowed.has(next)) {
      continue;
    }

    allowed.add(next);
    explore.push(...(rules.get(next) ?? new Set()));
  }

  return allowed.size;
}

function countBagsInside(color: string, rules: Map<string, Map<string, number>>) {
  const counts = rules.get(color);
  if (counts.size === 0) {
    return 0;
  }

  let sum = 0;
  counts.forEach((value, nextColor) => {
    sum += value;
    sum += countBagsInside(nextColor, rules) * value;
  });

  return sum;
}

async function partTwo() {
  const input = await readInput('./input.txt', { relativeTo: __dirname, splitLines: true });

  const rules = new Map<string, Map<string, number>>();

  input.forEach((line) => {
    const [color, contents] = line.split(' bags contain ');
    const counts = contents.split(',').reduce((memo, part) => {
      if (/no other bags/.test(part)) {
        return memo;
      }

      const [_, count, innerColor] = part.match(/(\d+) (.+) bags?/);
      return memo.set(innerColor, parseInt(count, 10));
    }, new Map<string, number>());

    rules.set(color, counts);
  });

  return countBagsInside('shiny gold', rules);
}

async function solve() {
  console.log('Result of part one', await partOne());
  console.log('Result of part two', await partTwo());
}

solve().catch(console.error);
