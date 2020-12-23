import { readMappedInput } from '../../../lib/input';

interface Food {
  ingredients: string[];
  allergens: string[];
}

function parseFood(line: string): Food {
  const [_, ingredients, allergens] = line.match(/^([a-z ]+) \(contains ([a-z, ]+)\)$/);
  return { ingredients: ingredients.split(' '), allergens: allergens.split(', ') };
}

async function partOne() {
  const foods = await readMappedInput('./input.txt', parseFood, { relativeTo: __dirname, splitLines: true });
  const possibleIngredientsForAllergens = new Map<string, string[]>();
  const allIngredients: string[] = [];

  foods.forEach((food) => {
    food.allergens.forEach((allergen) => {
      if (possibleIngredientsForAllergens.has(allergen)) {
        possibleIngredientsForAllergens.set(allergen, possibleIngredientsForAllergens.get(allergen).filter((ingredient) => food.ingredients.includes(ingredient)));
      } else {
        possibleIngredientsForAllergens.set(allergen, [...food.ingredients]);
      }
    });

    allIngredients.push(...food.ingredients);
  });

  const ingredientsTiedToAllergens = Array.from(possibleIngredientsForAllergens.values()).reduce((memo, ingredients) => {
    ingredients.forEach((i) => memo.add(i));
    return memo;
  }, new Set<string>());

  const inertIngredients = allIngredients.filter((ingredient) => !ingredientsTiedToAllergens.has(ingredient));
  return inertIngredients.length;
}

async function partTwo() {
  const foods = await readMappedInput('./input.txt', parseFood, { relativeTo: __dirname, splitLines: true });
  const possibleIngredientsForAllergens = new Map<string, string[]>();
  const allIngredients: string[] = [];

  foods.forEach((food) => {
    food.allergens.forEach((allergen) => {
      if (possibleIngredientsForAllergens.has(allergen)) {
        possibleIngredientsForAllergens.set(allergen, possibleIngredientsForAllergens.get(allergen).filter((ingredient) => food.ingredients.includes(ingredient)));
      } else {
        possibleIngredientsForAllergens.set(allergen, [...food.ingredients]);
      }
    });

    allIngredients.push(...food.ingredients);
  });

  const knownAllergens = new Map<string, string>();
  while (knownAllergens.size !== possibleIngredientsForAllergens.size) {
    const allergens = Array.from(possibleIngredientsForAllergens.keys());
    const uniquelyIdentifiedAllergen = allergens.find((allergen) => possibleIngredientsForAllergens.get(allergen).length === 1);
    if (uniquelyIdentifiedAllergen === undefined) {
      throw new Error('Could not pick another allergen off the list');
    }

    const ingredient = possibleIngredientsForAllergens.get(uniquelyIdentifiedAllergen)[0];
    knownAllergens.set(uniquelyIdentifiedAllergen, ingredient);
    allergens.forEach((allergen) => {
      possibleIngredientsForAllergens.set(allergen, possibleIngredientsForAllergens.get(allergen).filter((i) => i !== ingredient));
    });
  }

  return Array.from(knownAllergens.entries()).sort((a, b) => a[0].localeCompare(b[0])).map(([_, ingredient]) => ingredient).join(',');
}

async function solve() {
  console.log('Result of part one', await partOne());
  console.log('Result of part two', await partTwo());
}

solve().catch(console.error);
