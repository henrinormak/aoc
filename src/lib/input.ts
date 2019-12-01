import * as path from 'path';
import * as fs from 'fs';

export interface InputOptions {
  relativeTo?: string;
  splitLines?: boolean;
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

      const string = data.toString('ascii');

      if (options.splitLines) {
        return resolve(string.split('\n'));
      }

      return resolve([string]);
    });
  });
}
