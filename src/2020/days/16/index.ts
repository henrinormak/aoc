import { readInput } from '../../../lib/input';

function parseRule(value: string): { field: string; validate: (value: number) => boolean } {
  const [_, field, lowFirstStr, highFirstStr, lowSecondStr, highSecondStr] = /(.*): (\d+)-(\d+) or (\d+)-(\d+)/.exec(value);
  const lowFirst = parseInt(lowFirstStr, 10);
  const highFirst = parseInt(highFirstStr, 10);
  const lowSecond = parseInt(lowSecondStr, 10);
  const highSecond = parseInt(highSecondStr, 10);

  return { field, validate: (number) => (number >= lowFirst && number <= highFirst) || (number >= lowSecond && number <= highSecond)}
}

async function partOne() {
  const [rulesStr, _, nearbyStr] = await readInput('./input.txt', { relativeTo: __dirname, splitBy: '\n\n' });
  const rules = rulesStr.split('\n').map(parseRule);
  const nearbyTickets = nearbyStr.split('\n').slice(1).map((val) => val.split(',').map((number) => parseInt(number, 10)));

  return nearbyTickets.map((fields) => {
    return fields.filter((field) => {
      const valid = rules.some(({ validate }) => validate(field));
      return valid ? 0 : field;
    }).reduce((sum, next) => sum + next, 0);
  }).reduce((sum, next) => sum + next, 0);
}

async function partTwo() {
  const [rulesStr, ticketStr, nearbyStr] = await readInput('./input.txt', { relativeTo: __dirname, splitBy: '\n\n' });
  const rules = rulesStr.split('\n').map(parseRule);
  const nearbyValidTickets = nearbyStr.split('\n').slice(1).map((val) => val.split(',').map((number) => parseInt(number, 10))).filter((fields) => {
    return !fields.some((field) => !rules.some(({ validate }) => validate(field)));
  });
  const ticket = ticketStr.split(',').map((val) => parseInt(val, 10));

  const validIndicesForRules: { [field: string]: number[] } = {};
  const initialValidFields: number[] = [];
  for (let i = 0; i < rules.length; i++) {
    initialValidFields[i] = i;
  }

  for (const rule of rules) {
    validIndicesForRules[rule.field] = [...initialValidFields];
  }

  for (const ticket of nearbyValidTickets) {
    rules.forEach((rule) => {
      validIndicesForRules[rule.field] = validIndicesForRules[rule.field].filter((idx) => rule.validate(ticket[idx]));
    });
  }

  const actualIndicesForRules: { [field: string]: number } = {};
  while (Object.keys(actualIndicesForRules).length < rules.length) {
    const uniqueField = Object.keys(validIndicesForRules).find((field) => validIndicesForRules[field].length === 1);
    const finalIndex = validIndicesForRules[uniqueField][0];
    actualIndicesForRules[uniqueField] = finalIndex;

    Object.keys(validIndicesForRules).forEach((field) => {
      validIndicesForRules[field] = validIndicesForRules[field].filter((idx) => idx !== finalIndex);
    });
  }

  const departureFields = rules.filter((rule) => rule.field.startsWith('departure'));
  return departureFields.reduce((sum, { field }) => sum * ticket[actualIndicesForRules[field]], 1);
}

async function solve() {
  console.log('Result of part one', await partOne());
  console.log('Result of part two', await partTwo());
}

solve().catch(console.error);
