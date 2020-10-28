import { readInput } from '../../../lib/input';

function fuelMassForMass(mass: number) {
  return Math.max(Math.floor(mass / 3) - 2, 0);
}

function fullAdditionalMassForMass(mass: number) {
  let fuelMass = fuelMassForMass(mass);
  let additionalFuel = fuelMassForMass(fuelMass);

  while (additionalFuel > 0) {
    fuelMass += additionalFuel;
    additionalFuel = fuelMassForMass(additionalFuel);
  }

  return fuelMass;
}

async function getModules() {
  const lines = await readInput('./input.txt', { relativeTo: __dirname, splitLines: true });
  return lines.map((line) => parseInt(line, 10));
}

async function partOne() {
  const modules = await getModules();

  return modules.reduce((sum, mod) => {
    return sum + fuelMassForMass(mod);
  }, 0);
}

async function partTwo() {
  const modules = await getModules();

  return modules.reduce((sum, mod) => {
    return sum + fullAdditionalMassForMass(mod);
  }, 0);
}

async function solve() {
  console.log('Result of part one', await partOne());
  console.log('Result of part two', await partTwo());
}

solve().catch(console.error);
