import * as yargs from 'yargs';
import * as path from 'path';
import * as shelljs from 'shelljs';

const argv = yargs.argv;

const day = argv.day;
if (typeof day !== 'number') {
  console.error('Must provide option \'day\' with a valid value');
  process.exit(1);
}

const resolvedPath = path.resolve(__dirname, `./days/${day}`);
shelljs.exec(`ts-node ${resolvedPath}`);
