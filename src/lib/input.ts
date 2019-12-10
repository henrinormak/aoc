import * as path from 'path';
import * as fs from 'fs';

export interface InputOptions {
  relativeTo?: string;
  splitBy?: string;
  splitLines?: boolean; // alias for "splitBy: '\n'"
}

export async function readInput(filePath: string, options: InputOptions = {}) {
  const fullPath = path.resolve(options.relativeTo === undefined ? process.cwd() : options.relativeTo, filePath);
  return readFileContents(fullPath, options);
}

function readFileContents(filePath: string, options: InputOptions = {}): Promise<string[]> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        return reject(err);
      }

      const string = data.toString('utf8');

      if (options.splitBy !== undefined) {
        return resolve(string.split(options.splitBy));
      }

      if (options.splitLines) {
        return resolve(string.split('\n'));
      }

      return resolve([string]);
    });
  });
}
