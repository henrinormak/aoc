import readline from 'readline-sync';
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
  'inv',
  'east',
];

async function partOne() {
  const buffer: number[] = [];
  const computer = new IntcodeComputer(() => {
    if (buffer.length === 0) {
      const command = readline.prompt();

      // Our own special commands
      if (command === 'reset') {
        computer.reset();
        return 0;
      } else if (command === 'win') {
        computer.reset();
        buffer.push(...toInputs(`${commands.join('\n')}\n`));
        return 0;
      } else if (command === 'help') {
        console.log("Move with 'north', 'south', 'west', east'. Take items with 'take <item>', drop items with 'drop <item>', list items with 'inv'");
        return 10;
      }

      buffer.push(...toInputs(command), ...toInputs('\n'));
    }

    return buffer.shift();
  });
  await computer.initialiseFromFile('./input.txt', __dirname);

  while (!computer.isHalted()) {
    const [output] = computer.runUntilOutput();
    const string = String.fromCharCode(output);

    process.stdout.write(string);
  }
}

async function solve() {
  await partOne();
}

solve().catch(console.error);
