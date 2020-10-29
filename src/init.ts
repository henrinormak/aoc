import * as yargs from 'yargs';
import * as path from 'path';
import * as mkdirp from 'mkdirp';
import * as fs from 'fs';

const argv = yargs.argv;

const day = argv.day;
if (typeof day !== 'number') {
  console.error('Must provide option \'day\' with a valid value');
  process.exit(1);
}

const year = argv.year || 2020;

const resolvedPath = path.resolve(__dirname, `./${year}/days/${day}`);
mkdirp.sync(resolvedPath);
fs.copyFileSync(path.resolve(__dirname, './lib/template.ts'), path.resolve(resolvedPath, 'index.ts'));
fs.closeSync(fs.openSync(path.resolve(resolvedPath, 'input.txt'), 'w'));
