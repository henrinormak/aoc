import Graph from 'node-dijkstra';

import { IntcodeComputer } from '../../lib/intcode';

enum Movement {
  North = 1,
  South = 2,
  West = 3,
  East = 4,
}

enum Status {
  Wall = 0,
  Ack = 1,
  Target = 2,
}

enum Element {
  Wall = 0,
  Open = 1,
  OxygenSystem = 2,
  Oxygen = 3,
  Unknown = 4,
}

interface Droid {
  position: { x: number; y: number };
}

function keyForPosition({ x, y }: { x: number; y: number }) {
  return `${x}:${y}`;
}

function positionForKey(key: string) {
  const [x, y] = key.split(':').map((val) => parseInt(val, 10));
  return { x, y };
}

function renderWorld(world: Map<string, Element>, droid: Droid) {
  const positions = Array.from(world.keys()).map((key) => {
    const [x, y] = key.split(':').map((val) => parseInt(val, 10));
    return { x, y };
  });

  const ys = positions.map(({ y }) => y);
  const xs = positions.map(({ x }) => x);
  const minY = Math.min(...ys, droid.position.y);
  const maxY = Math.max(...ys, droid.position.y);
  const minX = Math.min(...xs, droid.position.x);
  const maxX = Math.max(...xs, droid.position.x);

  let result = '';
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      if (droid.position.x === x && droid.position.y === y) {
        result += 'D';
        continue;
      }

      const element = world.get(keyForPosition({ x, y })) ?? Element.Unknown;
      switch (element) {
        case Element.Wall:
          result += '#';
          break;
        case Element.OxygenSystem:
          result += 'O';
          break;
        case Element.Open:
          result += x === 0 && y === 0 ? 'H' : '.';
          break;
        default:
          result += ' ';
          break;
      }
    }

    result += '\n';
  }

  return result;
}

function move({ x, y }: { x: number; y: number }, direction: Movement) {
  switch (direction) {
    case Movement.North:
      return { x, y: y - 1 };
    case Movement.South:
      return { x, y: y + 1 };
    case Movement.East:
      return { x: x + 1, y };
    case Movement.West:
      return { x: x - 1, y };
  }
}

function turnRight(direction: Movement) {
  switch (direction) {
    case Movement.West:
      return Movement.North;
    case Movement.North:
      return Movement.East;
    case Movement.East:
      return Movement.South;
    case Movement.South:
      return Movement.West;
  }
}

function turnLeft(direction: Movement) {
  switch (direction) {
    case Movement.West:
      return Movement.South;
    case Movement.South:
      return Movement.East;
    case Movement.East:
      return Movement.North;
    case Movement.North:
      return Movement.West;
  }
}

function getNeighbours(position: { x: number; y: number }) {
  const north = move(position, Movement.North);
  const south = move(position, Movement.South);
  const west = move(position, Movement.West);
  const east = move(position, Movement.East);

  return [north, south, west, east];
}

function shortestPathTo(position: { x: number; y: number }, world: Map<string, Element>): string[] {
  const graph = new Graph();

  for (const [key, value] of world.entries()) {
    if (value === Element.Wall || value === Element.Unknown) {
      continue;
    }

    const [x, y] = key.split(':').map((val) => parseInt(val, 10));
    const neighbours = getNeighbours({ x, y }).filter(({ x, y }) => {
      const element = world.get(keyForPosition({ x, y }))
      return element === Element.Open || element === Element.OxygenSystem;
    });
    graph.addNode(key, neighbours.reduce((memo, pos) => ({ ...memo, [keyForPosition(pos)]: 1 }), {} as any));
  }

  return graph.path(keyForPosition({ x: 0, y: 0 }), keyForPosition(position));
}

async function discoverWorld(): Promise<Map<string, Element>> {
  const input: number[] = [];
  const computer = new IntcodeComputer(() => input.shift());
  await computer.initialiseFromFile('./input.txt', __dirname);

  const droid: Droid = { position: { x: 0, y: 0 } };
  const world: Map<string, Element> = new Map([
    [keyForPosition({ x: 0, y: 0 }), Element.Open],
    [keyForPosition({ x: -1, y: 0 }), Element.Unknown],
    [keyForPosition({ x: 1, y: 0 }), Element.Unknown],
    [keyForPosition({ x: 0, y: 1 }), Element.Unknown],
    [keyForPosition({ x: 0, y: -1 }), Element.Unknown],
  ]);
  let movement = Movement.West;

  while (!computer.isHalted()) {
    input.push(movement);
    const targetPosition = move(droid.position, movement);

    const [status] = computer.runUntilOutput();

    if (status === Status.Target) {
      world.set(keyForPosition(targetPosition), Element.OxygenSystem);
      droid.position = targetPosition;
    } else if (status === Status.Ack) {
      world.set(keyForPosition(targetPosition), Element.Open);

      getNeighbours(targetPosition).filter((pos) => !world.has(keyForPosition(pos))).forEach((pos) => {
        world.set(keyForPosition(pos), Element.Unknown);
      });

      droid.position = targetPosition;
      movement = turnLeft(movement);
    } else if (status === Status.Wall) {
      world.set(keyForPosition(targetPosition), Element.Wall);
      movement = turnRight(movement);
    }

    // Stop when there are no more unknown places in the world
    if (!Array.from(world.values()).some((element) => element === Element.Unknown)) {
      console.log('Discovered full world');
      console.log(renderWorld(world, droid));
      return world;
    }
  }

  return world;
}

async function partOne(world: Map<string, Element>) {
  const pos = positionForKey(Array.from(world.keys()).find((key) => world.get(key) === Element.OxygenSystem));
  return shortestPathTo(pos, world).length - 1;
}

async function partTwo(world: Map<string, Element>) {
  let minutes = 0;
  let open = Array.from(world.entries()).filter(([_, element]) => element === Element.Open);

  while (open.length > 0) {
    // Oxygenate all open spaces that have a neighbouring oxygen source
    const oxygenated = open.filter(([key]) => {
      const position = positionForKey(key);
      return getNeighbours(position).some((neighbour) => {
        const element = world.get(keyForPosition(neighbour));
        return element === Element.Oxygen || element === Element.OxygenSystem;
      });
    });

    oxygenated.forEach(([key]) => world.set(key, Element.Oxygen));
    open = Array.from(world.entries()).filter(([_, element]) => element === Element.Open);
    minutes++;
  }

  return minutes;
}

async function solve() {
  const world = await discoverWorld();
  console.log('Result of part one', await partOne(world));
  console.log('Result of part two', await partTwo(world));
}

solve().catch(console.error);
