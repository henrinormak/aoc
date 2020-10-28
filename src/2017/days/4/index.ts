import { readInput } from '../../../lib/input';

async function partOne() {
  const phrases = await readInput('./input.txt', { relativeTo: __dirname, splitLines: true });

  const valid = phrases.filter((phrase) => {
    const words = phrase.split(' ');
    const uniqueWords = new Set(words);
    return uniqueWords.size === words.length;
  });

  return valid.length;
}

async function partTwo() {
  const phrases = await readInput('./input.txt', { relativeTo: __dirname, splitLines: true });

  const valid = phrases.filter((phrase) => {
    const words = phrase.split(' ');

    const wordLetters = words.map((word) => {
      const chars = word.split('');
      return chars.reduce((memo, char) => {
        return memo.set(char, (memo.get(char) || 0) + 1);
      }, new Map<string, number>());
    });

    return wordLetters.every((word, idx) => {
      return !wordLetters.slice(idx + 1).some((otherWord) => {
        if (word.size > otherWord.size) {
          return Array.from(word.keys()).every((letter) => word.get(letter) === otherWord.get(letter));
        }

        return Array.from(otherWord.keys()).every((letter) => word.get(letter) === otherWord.get(letter));
      });
    });
  });

  return valid.length;
}

async function solve() {
  console.log('Result of part one', await partOne());
  console.log('Result of part two', await partTwo());
}

solve().catch(console.error);
