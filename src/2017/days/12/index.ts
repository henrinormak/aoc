import { readInput } from '../../../lib/input';

function findGroup(start: string, connections: Map<string, Set<string>>): Set<string> {
  const programsToVisit = [start];
  const visitedPrograms = new Set<string>();

  while (programsToVisit.length > 0) {
    const program = programsToVisit.pop();
    visitedPrograms.add(program);

    const candidates = Array.from(connections.get(program).values()).filter((val) => !visitedPrograms.has(val));
    programsToVisit.push(...candidates);
  }

  return visitedPrograms;
}

async function partOne() {
  const input = await readInput('./input.txt', { relativeTo: __dirname, splitLines: true });

  const connections = new Map<string, Set<string>>();
  input.forEach((line) => {
    const [name, targetsStr] = line.split(' <-> ');
    const targets = targetsStr.split(', ');

    if (!connections.has(name)) {
      connections.set(name, new Set());
    }

    connections.set(name, new Set([...connections.get(name), ...targets]));
  });

  return findGroup('0', connections).size;
}

async function partTwo() {
  const input = await readInput('./input.txt', { relativeTo: __dirname, splitLines: true });

  const connections = new Map<string, Set<string>>();
  input.forEach((line) => {
    const [name, targetsStr] = line.split(' <-> ');
    const targets = targetsStr.split(', ');

    if (!connections.has(name)) {
      connections.set(name, new Set());
    }

    connections.set(name, new Set([...connections.get(name), ...targets]));
  });

  // Find all groups starting with a random program until we have no more programs that don't belong to any group
  const remainingPrograms = new Set(connections.keys());
  const groups: Set<string>[] = [];

  while (remainingPrograms.size > 0) {
    const next = Array.from(remainingPrograms.values()).pop();
    const group = findGroup(next, connections);
    group.forEach((val) => remainingPrograms.delete(val));

    groups.push(group);
  }

  return groups.length;
}

async function solve() {
  console.log('Result of part one', await partOne());
  console.log('Result of part two', await partTwo());
}

solve().catch(console.error);
