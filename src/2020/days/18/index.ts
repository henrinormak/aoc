import XRegExp from 'xregexp';

import { readInput } from '../../../lib/input';

function evaluate(expression: string): number {
  let result = expression;

  let parensMatches = XRegExp.matchRecursive(result, '\\(', '\\)');
  while (parensMatches.length > 0) {
    parensMatches.forEach((match) => {
      const value = evaluate(match);
      result = result.replace(`(${match})`, value.toString());
    });

    parensMatches = XRegExp.matchRecursive(result, '\\(', '\\)');
  }

  let match: RegExpMatchArray;
  while (match = result.match(/(\d+) (\*|\+) (\d+)/)) {
    const [replace, a, op, b] = match;
    result = result.replace(replace, (op === '*' ? parseInt(a) * parseInt(b) : parseInt(a) + parseInt(b)).toString());
  }

  return parseInt(result, 10);
}

function evaluateAdvanced(expression: string): number {
  let result = expression;

  let parensMatches = XRegExp.matchRecursive(result, '\\(', '\\)');
  while (parensMatches.length > 0) {
    parensMatches.forEach((match) => {
      const value = evaluateAdvanced(match);
      result = result.replace(`(${match})`, value.toString());
    });

    parensMatches = XRegExp.matchRecursive(result, '\\(', '\\)');
  }

  let match: RegExpMatchArray;
  while (match = result.match(/(\d+) \+ (\d+)/)) {
    const [replace, a, b] = match;
    result = result.replace(replace, (parseInt(a) + parseInt(b)).toString());
  }

  while (match = result.match(/(\d+) \* (\d+)/)) {
    const [replace, a, b] = match;
    result = result.replace(replace, (parseInt(a) * parseInt(b)).toString());
  }

  return parseInt(result, 10);
}

async function partOne() {
  const input = await readInput('./input.txt', { relativeTo: __dirname, splitLines: true });
  const values = input.map((line) => evaluate(line));
  return values.reduce((sum, next) => sum + next, 0);
}

async function partTwo() {
  const input = await readInput('./input.txt', { relativeTo: __dirname, splitLines: true });
  const values = input.map((line) => evaluateAdvanced(line));
  return values.reduce((sum, next) => sum + next, 0);
}

async function solve() {
  console.log('Result of part one', await partOne());
  console.log('Result of part two', await partTwo());
}

solve().catch(console.error);
