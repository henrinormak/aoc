import { readInput } from '../../../lib/input';

async function partOne() {
  const groups = await readInput('./input.txt', { relativeTo: __dirname, splitBy: '\n\n' });
  const counts = groups.map((group) => {
    const people = group.split('\n');
    const answers = new Set();

    people.forEach((person) => {
      person.split('').forEach((answer) => answers.add(answer));
    });

    return answers.size;
  });

  return counts.reduce((sum, count) => sum + count, 0);
}

async function partTwo() {
  const groups = await readInput('./input.txt', { relativeTo: __dirname, splitBy: '\n\n' });
  const counts = groups.map((group) => {
    const people = group.split('\n');
    const answers = new Set(people[0].split(''));

    people.forEach((person) => {
      const suitableAnswers = person.split('');
      answers.forEach((answer) => {
        if (!suitableAnswers.includes(answer)) {
          answers.delete(answer);
        }
      });
    });

    return answers.size;
  });

  return counts.reduce((sum, count) => sum + count, 0);
}

async function solve() {
  console.log('Result of part one', await partOne());
  console.log('Result of part two', await partTwo());
}

solve().catch(console.error);
