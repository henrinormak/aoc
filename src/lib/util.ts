export function buildArray<T>(length: number, initialiser: (idx: number) => T): T[] {
  const result: T[] = new Array<T>(length);
  for (let i = 0; i < length; i++) {
    result[i] = initialiser(i);
  }

  return result;
}

export function chunkArray<T>(array: readonly T[], size: number): T[][] {
  const results: T[][] = [];

  for (let i = 0; i < array.length; i += size) {
    results.push(array.slice(i, i + size));
  }

  return results;
}

export function flatten<T>(array: readonly T[][]): T[] {
  const result: T[] = [];

  array.forEach((val) => {
    result.push(...val);
  });

  return result;
}