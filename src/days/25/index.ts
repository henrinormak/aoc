import { readInput } from '../../lib/input';
import { IntcodeComputer } from '../../lib/intcode';

function toInputs(string: string) {
  return string.split('').map((val) => val.charCodeAt(0));
}

// After testing, the items we need at the end are loom, sand, mutex and wreath
// There are likely other combinations as well, but as this one worked
// for my input, optimising the route with that in mind
const commands = [
  'north',
  'north',
  'north',
  'take mutex',
  'south',
  'south',
  'east',
  'north',
  'take loom',
  'south',
  'west',
  'south',
  'west',
  'west',
  'take sand',
  'south',
  'east',
  'north',
  'take wreath',
  'south',
  'west',
  'north',
  'north',
  'east',
  'east',
];

async function partOne() {
  const input: number[] = commands.reduce((memo, command) => [...memo, ...toInputs(command + '\n')], []);
  const computer = new IntcodeComputer(() => input.shift());
  await computer.initialiseFromFile('./input.txt', __dirname);

  let dialog = '';

  while (!computer.isHalted()) {
    const [output] = computer.runUntilOutput();
    const string = String.fromCharCode(output);

    process.stdout.write(string);
    dialog += string;
  }
}

async function solve() {
  await partOne();
}

solve().catch(console.error);
