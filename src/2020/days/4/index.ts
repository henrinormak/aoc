import { readInput } from '../../../lib/input';

const REQUIRED_FIELDS = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'] as const;
const OPTIONAL_FIELDS = ['cid'] as const;

const FIELD_VALIDATORS: { [key in typeof REQUIRED_FIELDS[number]]: (value: string) => boolean } = {
  byr: (value) => {
    const numeric = parseInt(value, 10);
    return numeric >= 1920 && numeric <= 2002;
  },
  iyr: (value) => {
    const numeric = parseInt(value, 10);
    return numeric >= 2010 && numeric <= 2020;
  },
  eyr: (value) => {
    const numeric = parseInt(value, 10);
    return numeric >= 2020 && numeric <= 2030;
  },
  hgt: (value) => {
    const regex = /^(\d+)(cm|in)$/;
    if (!regex.test(value)) {
      return false;
    }

    const [_, number, unit] = regex.exec(value);
    const numeric = parseInt(number, 10);

    if (unit === 'cm') {
      return numeric >= 150 && numeric <= 193;
    }

    if (unit === 'in') {
      return numeric >= 59 && numeric <= 76;
    }

    return false;
  },
  hcl: (value) => {
    return /^#[0-9a-f]{6}$/.test(value);
  },
  ecl: (value) => {
    return ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(value);
  },
  pid: (value) => {
    return /^[0-9]{9}$/.test(value);
  },
};

async function partOne() {
  const input = await readInput('./input.txt', { relativeTo: __dirname, splitBy: '\n\n' });

  const validPassports = input.filter((passport) => {
    const fields = passport.split('\n').map((val) => val.split(' ')).reduce((memo, val) => memo.concat(val), []).map((field) => {
      const [key, value] = field.split(':')
      return { key, value };
    }).reduce((memo, field) => memo.set(field.key, field.value), new Map<string, string>());

    return REQUIRED_FIELDS.every((key) => fields.has(key));
  });

  return validPassports.length;
}

async function partTwo() {
  const input = await readInput('./input.txt', { relativeTo: __dirname, splitBy: '\n\n' });

  const validPassports = input.filter((passport) => {
    const fields = passport.split('\n').map((val) => val.split(' ')).reduce((memo, val) => memo.concat(val), []).map((field) => {
      const [key, value] = field.split(':')
      return { key, value };
    }).reduce((memo, field) => memo.set(field.key, field.value), new Map<string, string>());

    return REQUIRED_FIELDS.every((key) => fields.has(key) && FIELD_VALIDATORS[key](fields.get(key)));
  });

  return validPassports.length;
}

async function solve() {
  console.log('Result of part one', await partOne());
  console.log('Result of part two', await partTwo());
}

solve().catch(console.error);
