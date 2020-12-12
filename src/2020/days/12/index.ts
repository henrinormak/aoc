import { readMappedInput } from '../../../lib/input';

interface Ship {
  direction: number;
  position: { x: number; y: number };
}

interface Waypoint {
  position: { x: number; y: number };
}

interface Instruction {
  action: 'N' | 'S' | 'E' | 'W' | 'L' | 'R' | 'F';
  value: number;
}

function extractInstruction(input: string): Instruction {
  const [_, action, valueStr] = input.match(/([a-zA-Z])(\d+)/);

  return {
    action: action as Instruction['action'],
    value: parseInt(valueStr, 10),
  };
}

function applyInstruction(state: Ship, instruction: Instruction): Ship {
  switch (instruction.action) {
    case 'N':
      return { direction: state.direction, position: { x: state.position.x, y: state.position.y - instruction.value } };
    case 'S':
      return { direction: state.direction, position: { x: state.position.x, y: state.position.y + instruction.value } };
    case 'E':
      return { direction: state.direction, position: { x: state.position.x + instruction.value, y: state.position.y } };
    case 'W':
      return { direction: state.direction, position: { x: state.position.x - instruction.value, y: state.position.y } };
    case 'L':
      return { direction: (state.direction + (360 - instruction.value)) % 360, position: state.position };
    case 'R':
      return { direction: (state.direction + instruction.value) % 360, position: state.position };
    case 'F':
      return {
        direction: state.direction, position: {
          x: state.direction === 90 ? state.position.x + instruction.value : state.direction === 270 ? state.position.x - instruction.value : state.position.x,
          y: state.direction === 0 ? state.position.y - instruction.value : state.direction === 180 ? state.position.y + instruction.value : state.position.y,
      } };
  }
}

function applyInstructionToWaypoint(waypoint: Waypoint, ship: Ship, instruction: Instruction): { waypoint: Waypoint, ship: Ship } {
  switch (instruction.action) {
    case 'N':
      return { ship, waypoint: { position: { x: waypoint.position.x, y: waypoint.position.y - instruction.value } } };
    case 'S':
      return { ship, waypoint: { position: { x: waypoint.position.x, y: waypoint.position.y + instruction.value } } };
    case 'E':
      return { ship, waypoint: { position: { x: waypoint.position.x + instruction.value, y: waypoint.position.y } } };
    case 'W':
      return { ship, waypoint: { position: { x: waypoint.position.x - instruction.value, y: waypoint.position.y } } };
    case 'L':
    case 'R':
      // See all turns as right turns
      const adjustedWaypoint = { position: { ...waypoint.position } };
      const degrees = (instruction.action === 'R' ? instruction.value : (360 - instruction.value)) % 360;
      switch (degrees) {
        case 90:
          adjustedWaypoint.position.x = waypoint.position.y * -1;
          adjustedWaypoint.position.y = waypoint.position.x;
          break;
        case 180:
          adjustedWaypoint.position.x *= -1;
          adjustedWaypoint.position.y *= -1;
          break;
        case 270:
          adjustedWaypoint.position.x = waypoint.position.y;
          adjustedWaypoint.position.y = waypoint.position.x * -1;
          break;
        default:
          throw new Error('Not sure how to turn');
      }

      return { ship, waypoint: adjustedWaypoint };
    case 'F':
      return { waypoint, ship: { direction: ship.direction, position: { x: ship.position.x + waypoint.position.x * instruction.value, y: ship.position.y + waypoint.position.y * instruction.value } } };
  }
}

async function partOne() {
  const instructions = await readMappedInput('./input.txt', extractInstruction, { relativeTo: __dirname, splitLines: true });
  let state: Ship = {
    direction: 90,
    position: { x: 0, y: 0 },
  };

  instructions.forEach((instruction) => {
    state = applyInstruction(state, instruction);
  });

  return Math.abs(state.position.x) + Math.abs(state.position.y);
}

async function partTwo() {
  const instructions = await readMappedInput('./input.txt', extractInstruction, { relativeTo: __dirname, splitLines: true });
  let ship: Ship = {
    direction: 0,
    position: { x: 0, y: 0 },
  };

  let waypoint: Waypoint = {
    position: { x: 10, y: -1 },
  }

  instructions.forEach((instruction) => {
    const next = applyInstructionToWaypoint(waypoint, ship, instruction);
    ship = next.ship;
    waypoint = next.waypoint;
  });

  return Math.abs(ship.position.x) + Math.abs(ship.position.y);
}

async function solve() {
  console.log('Result of part one', await partOne());
  console.log('Result of part two', await partTwo());
}

solve().catch(console.error);
