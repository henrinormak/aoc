function flattenCups(cups: Map<number, number>, current: number) {
  const result: number[] = [];
  let i = current;

  while (!result.includes(i)) {
    result.push(i);
    i = cups.get(i);
  }

  return result;
}

async function partOne() {
  const input = '792845136'.split('').map((val) => parseInt(val, 10));
  const min = Math.min(...input);
  const max = Math.max(...input);

  let current = input[0];
  const cups = new Map<number, number>();
  input.forEach((val, idx) => cups.set(val, input[(idx + 1) % input.length]));

  for (let move = 1; move <= 100; move++) {
    const one = cups.get(current);
    const two = cups.get(one);
    const three = cups.get(two);

    let destination = current === min ? max : current - 1;
    while ([one, two, three].includes(destination)) {
      destination--;
      if (destination < min) {
        destination = max;
      }
    }

    // Remove the three cups by joining current to whatever comes after three
    cups.set(current, cups.get(three));

    // Re-insert the 3 cups by joining destination to one, and three to whatever destination was pointing to before
    cups.set(three, cups.get(destination));
    cups.set(destination, one);

    // Move the current cup
    current = cups.get(current);
  }

  return flattenCups(cups, 1).filter((val) => val !== 1).join('');
}

async function partTwo() {
  const input = '792845136'.split('').map((val) => parseInt(val, 10));
  const min = Math.min(...input);
  const inputMax = Math.max(...input);
  const max = 1_000_000;

  let current = input[0];
  const cups = new Map<number, number>();
  input.forEach((val, idx) => cups.set(val, input[(idx + 1) % input.length]));
  cups.set(input[input.length - 1], inputMax + 1);
  for (let i = inputMax + 1; i <= max; i++) {
    cups.set(i, i + 1);
  }
  cups.set(max, input[0]);

  for (let move = 1; move <= 10_000_000; move++) {
    const one = cups.get(current);
    const two = cups.get(one);
    const three = cups.get(two);

    let destination = current === min ? max : current - 1;
    while ([one, two, three].includes(destination)) {
      destination--;
      if (destination < min) {
        destination = max;
      }
    }

    // Remove the three cups by joining current to whatever comes after three
    cups.set(current, cups.get(three));

    // Re-insert the 3 cups by joining destination to one, and three to whatever destination was pointing to before
    cups.set(three, cups.get(destination));
    cups.set(destination, one);

    // Move the current cup
    current = cups.get(current);
  }

  return cups.get(1) * cups.get(cups.get(1));
}

async function solve() {
  console.log('Result of part one', await partOne());
  console.log('Result of part two', await partTwo());
}

solve().catch(console.error);
