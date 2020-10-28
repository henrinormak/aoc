async function partOne(low: number, high: number) {
  let matches: number[] = [];

  outer:
  for (let candidate = low; candidate <= high; candidate = candidate + 1) {
    const string = candidate.toString();
    const repeats = /(1+)|(2+)|(3+)|(4+)|(5+)|(6+)|(7+)|(8+)|(9+)/g

    const regexMatches = string.match(repeats);
    if (regexMatches.length === 0) {
      continue;
    }

    const chars = string.split('');
    let prev = chars[0];
    for (const char of chars) {
      if (parseInt(char, 10) < parseInt(prev, 10)) {
        continue outer;
      }
      prev = char;
    }

    matches.push(candidate);
  }

  return matches;
}

async function partTwo(candidates: number[]) {
  let matches: number[] = [];

  for (let candidate of candidates) {
    const string = candidate.toString();
    const repeats = /(1+)|(2+)|(3+)|(4+)|(5+)|(6+)|(7+)|(8+)|(9+)/g

    const regexMatches = string.match(repeats);
    if (!regexMatches.some((match) => match.length == 2)) {
      continue;
    }

    matches.push(candidate);
  }

  return matches;
}

async function solve() {
  const low = 145852;
  const high = 616942;

  const candidates = await partOne(low, high);
  console.log('Result of part one', candidates.length);

  const finalSolutions = await partTwo(candidates);
  console.log('Result of part two', finalSolutions.length);
}

solve().catch(console.error);
