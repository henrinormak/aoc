import Graph from 'node-dijkstra';

import { readInput } from '../../../lib/input';

function getOrbitsForNode(map: Map<string, string[]>, source: string): number {
  const directOrbits = map.get(source) || [];
  return directOrbits.reduce((count, otherSource) => {
    return count + getOrbitsForNode(map, otherSource);
  }, directOrbits.length);
}

function findOrbitingNode(forNode: string, orbits: Map<string, string[]>) {
  return Array.from(orbits.keys()).find((key) => {
    return orbits.get(key).includes(forNode);
  });
}

async function getOrbits(): Promise<Map<string, string[]>> {
  const input = (await readInput('./input.txt', { relativeTo: __dirname, splitLines: true })).map((line) => line.split(')'));
  const orbits = new Map<string, string[]>();

  for (const line of input) {
    const node = line[0];
    const otherNode = line[1];

    if (orbits.has(node)) {
      orbits.set(node, [...orbits.get(node), otherNode])
    } else {
      orbits.set(node, [otherNode]);
    }
  }

  return orbits;
}

async function partOne() {
  const orbits = await getOrbits();
  return Array.from(orbits.keys()).reduce((count, key) => {
    return count + getOrbitsForNode(orbits, key);
  }, 0);
}

async function partTwo() {
  const orbits = await getOrbits();

  const graph = new Graph();
  Array.from(orbits.keys()).map((key) => {
    const descendants = orbits.get(key) || [];
    const parent = findOrbitingNode(key, orbits);
    const neighbours = [...descendants, parent].reduce((memo, neighbour) => ({ ...memo, [neighbour]: 1 }), {});

    graph.addNode(key, neighbours);
  });

  const source = findOrbitingNode('YOU', orbits);
  const target = findOrbitingNode('SAN', orbits);

  const path = graph.path(source, target);
  // The number of transfers we have to make is the length of the path minus one (the first node does not need a transfer)
  return path.length - 1;
}

async function solve() {
  console.log('Result of part one', await partOne());
  console.log('Result of part two', await partTwo());
}

solve().catch(console.error);
