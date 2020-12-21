import chalk from 'chalk';

import { readMappedInput } from '../../../lib/input';

enum Direction {
  Top = 'top',
  Bottom = 'bottom',
  Left = 'left',
  Right = 'right',
}

interface Tile {
  id: string;
  pixels: string[][];
  borders: {
    direction: Direction;
    border: string;
    flipHorizontal?: boolean;
    flipVertical?: boolean;
    neighbour?: string;
  }[];
  neighbours?: string[];
}

interface TileToPlace {
  tileIds: string[];
  position: { x: number; y: number };
  matchBorder: {
    direction: Direction.Left | Direction.Top;
    border: string;
  };
}

const SEA_MONSTER_REGEX: RegExp[] = [
  /^..................#./,
  /^#....##....##....###/,
  /^.#..#..#..#..#..#.../,
];

const SEA_MONSTER_WIDTH = 20;
const SEA_MONSTER_HEIGHT = 3;
const SEA_MONSTER_AREA = 15;

function getBorder(tile: string[][], direction: Direction): string {
  switch (direction) {
    case Direction.Top:
      return tile[0].join('');
    case Direction.Bottom:
      return tile[tile.length - 1].join('');
    case Direction.Left:
      return Array.from({ length: tile.length }, (_, idx) => tile[idx][0]).join('');
    case Direction.Right:
      return Array.from({ length: tile.length }, (_, idx) => tile[idx][tile[idx].length - 1]).join('');
  }
}

function getTranslation(from: Direction, to: Direction.Left | Direction.Top, flipVertical: boolean, flipHorizontal: boolean): { rotate: number, flipVertical: boolean; flipHorizontal: boolean } {
  if (from === to) {
    return { rotate: 0, flipVertical, flipHorizontal };
  }

  switch (from) {
    case Direction.Top:
      switch (to) {
        case Direction.Left:
          return { rotate: 3, flipVertical, flipHorizontal: !flipHorizontal };
      }
      break;
    case Direction.Right:
      switch (to) {
        case Direction.Left:
          return { rotate: 0, flipVertical, flipHorizontal: !flipHorizontal };
        case Direction.Top:
          return { rotate: 3, flipVertical, flipHorizontal };
      }
    case Direction.Bottom:
      switch (to) {
        case Direction.Left:
          return { rotate: 1, flipVertical, flipHorizontal };
        case Direction.Top:
          return { rotate: 0, flipVertical: !flipVertical, flipHorizontal };
      }
    case Direction.Left:
      switch (to) {
        case Direction.Top:
          return { rotate: 1, flipVertical: !flipVertical, flipHorizontal };
      }
      break;
  }

  return { rotate: 0, flipVertical, flipHorizontal };
}

function rotate(tile: string[][]) {
  const side = tile.length;
  const result: string[][] = Array.from({ length: side }, (_) => []);

  for (let y = 0; y < side; y++) {
    for (let x = 0; x < side; x++) {
      const char = tile[y][x];
      result[x][side - 1 - y] = char;
    }
  }

  return result;
}

function flipHorizontal(tile: string[][]) {
  return tile.map((line) => [...line].reverse());
}

function flipVertical(tile: string[][]) {
  return [...tile].reverse().map((line) => [...line]);
}

function translate(tile: string[][], options: { rotate?: number; flipHorizontal?: boolean; flipVertical?: boolean }) {
  let result = tile;

  if (options.flipHorizontal) {
    result = flipHorizontal(result);
  }

  if (options.flipVertical) {
    result = flipVertical(result);
  }

  if (options.rotate) {
    for (let i = 0; i < options.rotate; i++) {
      result = rotate(result);
    }
  }

  return result;
}

function placeTile(pixels: string[][], tile: string[][], offsetX: number = 0, offsetY: number = 0, border: number = 1) {
  const width = tile[0].length - border * 2;
  const height = tile.length - border * 2;

  const startX = offsetX * width;
  const startY = offsetY * height;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      pixels[startY + y][startX + x] = tile[y + border][x + border];
    }
  }
}

function findMonsters(pixels: string[][]): { x: number; y: number }[] {
  const width = pixels[0].length;
  const height = pixels.length;

  const result: { x: number, y: number }[] = [];
  const lines = pixels.map((line) => line.join(''));

  for (let y = 0; y < height - SEA_MONSTER_HEIGHT; y++) {
    for (let x = 0; x < width - SEA_MONSTER_WIDTH; x++) {
      if (SEA_MONSTER_REGEX.every((regex, idx) => regex.test(lines[y + idx].substr(x, SEA_MONSTER_WIDTH)))) {
        result.push({ x, y });
      }
    }
  }

  return result;
}

// function print(pixels: string[][], tileSize: number, highlightBorder: number) {
//   let result = '';

//   for (const [y, row] of pixels.entries()) {
//     for (const [x, char] of row.entries()) {
//       const xWithinTile = x % tileSize;
//       const yWithinTile = y % tileSize;
//       const isBorder = (xWithinTile < highlightBorder || xWithinTile >= tileSize - highlightBorder) || (yWithinTile < highlightBorder || yWithinTile >= tileSize - highlightBorder);

//       result += isBorder ? chalk.gray(char) : char;
//     }

//     result += '\n';
//   }

//   return result;
// }

async function partOne() {
  const tiles = await readMappedInput('./input.txt', (block) => {
    const [header, ...tile] = block.split('\n');
    const [_, id] = header.match(/Tile (\d+):$/);

    const pixels = tile.map((line) => line.split(''));
    const borders = Object.values(Direction).map((direction) => ({ direction, flipHorizontal: false, flipVertical: false, border: getBorder(pixels, direction)}));
    const reversed = Object.values(Direction).map((direction) => {
      const flipHorizontal = direction === Direction.Top || direction === Direction.Bottom;
      const flipVertical = direction === Direction.Left || direction === Direction.Right;

      const border = getBorder(pixels, direction).split('').reverse().join('');

      return {
        direction,
        flipHorizontal,
        flipVertical,
        border
      };
    });

    return { id, borders: [...borders, ...reversed] };
  }, { relativeTo: __dirname, splitBy: '\n\n' });

  // Corner tiles are ones that only have 2 neighbours
  const corners = tiles.filter(({ id, borders }) => {
    const neighbours = tiles.filter((candidate) => candidate.id !== id && candidate.borders.some((border) => borders.some((n) => n.border === border.border)));
    return neighbours.length === 2;
  });

  return corners.map(({ id }) => id).reduce((total, next) => total * parseInt(next), 1);
}

async function partTwo() {
  const tiles = await readMappedInput('./input.txt', (block) => {
    const [header, ...tile] = block.split('\n');
    const [_, id] = header.match(/Tile (\d+):$/);

    const pixels = tile.map((line) => line.split(''));
    const borders = Object.values(Direction).map((direction) => ({ direction, flipHorizontal: false, flipVertical: false, border: getBorder(pixels, direction)}));
    const reversed = Object.values(Direction).map((direction) => {
      const flipHorizontal = direction === Direction.Top || direction === Direction.Bottom;
      const flipVertical = direction === Direction.Left || direction === Direction.Right;

      const border = getBorder(pixels, direction).split('').reverse().join('');

      return {
        direction,
        flipHorizontal,
        flipVertical,
        border
      };
    });

    return { id, pixels, borders: [...borders, ...reversed] };
  }, { relativeTo: __dirname, splitBy: '\n\n' });

  // We assume that all borders are unique (i.e only two pieces have exactly that border)
  const tilesWithNeighbours: Tile[] = tiles.map((tile) => {
    const bordersWithNeighbours = tile.borders.map((border) => {
      const neighbour = tiles.find((neighbour) => {
        if (neighbour.id === tile.id) {
          return false;
        }

        return neighbour.borders.some((n) => n.border === border.border);
      });

      return { ...border, neighbour: neighbour === undefined ? undefined : neighbour.id };
    });

    const neighbours = Array.from(new Set(bordersWithNeighbours.filter(({ neighbour }) => neighbour !== undefined).map(({ neighbour }) => neighbour)));

    return {
      ...tile,
      neighbours,
      borders: bordersWithNeighbours,
    };
  });

  const border = 1;
  const tileSize = tiles[0].pixels[0].length - border * 2;
  const side = Math.sqrt(tiles.length);
  const dimension = side * tileSize;
  const pixels = Array.from({ length: dimension }, (): string[] => Array.from({ length: dimension }, (): string => chalk.blue('+')));
  const placedTiles = new Map<string, { rotate: number, flipHorizontal: boolean, flipVertical: boolean, x: number; y: number }>();
  const tilesById = tilesWithNeighbours.reduce((memo, tile) => memo.set(tile.id, tile), new Map<string, Tile>());

  // Pick a corner to use as start
  const start = tilesWithNeighbours.find((tile) => tile.neighbours.length === 2);

  const [top, right, bottom, left] = [
    start.borders.find((border) => border.neighbour !== undefined && border.direction === Direction.Top && !border.flipHorizontal && !border.flipVertical),
    start.borders.find((border) => border.neighbour !== undefined && border.direction === Direction.Right && !border.flipHorizontal && !border.flipVertical),
    start.borders.find((border) => border.neighbour !== undefined && border.direction === Direction.Bottom && !border.flipHorizontal && !border.flipVertical),
    start.borders.find((border) => border.neighbour !== undefined && border.direction === Direction.Left && !border.flipHorizontal && !border.flipVertical),
  ];

  const translation = { flipVertical: top !== undefined && bottom === undefined, flipHorizontal: right === undefined && left !== undefined };
  const translatedPixels = translate(start.pixels, translation)
  placeTile(pixels, translatedPixels, 0, 0, border);
  placedTiles.set(start.id, { rotate: 0, ...translation, x: 0, y: 0 });

  // The rest we can place by looking at one of the borders (as it is unique, we only need to make one border match)
  const tilesToPlace: TileToPlace[] = [
    { tileIds: [...start.neighbours], position: { x: 1, y: 0 }, matchBorder: { border: getBorder(translatedPixels, Direction.Right), direction: Direction.Left } },
    { tileIds: [...start.neighbours], position: { x: 0, y: 1 }, matchBorder: { border: getBorder(translatedPixels, Direction.Bottom), direction: Direction.Top } },
  ];

  while (tilesToPlace.length > 0) {
    const tileToPlace = tilesToPlace.shift();

    const tileId = tileToPlace.tileIds.filter((id) => !placedTiles.has(id)).find((id) => tilesById.get(id).borders.some((border) => border.border === tileToPlace.matchBorder.border));
    if (tileId === undefined) {
      continue;
    }

    const tile = tilesById.get(tileId);
    const matchingBorder = tile.borders.find((border) => border.border === tileToPlace.matchBorder.border);
    const translation = getTranslation(matchingBorder.direction, tileToPlace.matchBorder.direction, matchingBorder.flipVertical, matchingBorder.flipHorizontal);
    const translatedTilePixels = translate(tile.pixels, translation);
    placeTile(pixels, translatedTilePixels, tileToPlace.position.x, tileToPlace.position.y, border);
    placedTiles.set(tileId, { ...translation, x: tileToPlace.position.x, y: tileToPlace.position.y });

    tilesToPlace.push(
      { tileIds: [...tile.neighbours], position: { x: tileToPlace.position.x + 1, y: tileToPlace.position.y }, matchBorder: { border: getBorder(translatedTilePixels, Direction.Right), direction: Direction.Left } },
      { tileIds: [...tile.neighbours], position: { x: tileToPlace.position.x, y: tileToPlace.position.y + 1 }, matchBorder: { border: getBorder(translatedTilePixels, Direction.Bottom), direction: Direction.Top } },
    );
  }

  const monsters: { x: number; y: number }[][] = [
    findMonsters(pixels),
    findMonsters(translate(pixels, { rotate: 1 })),
    findMonsters(translate(pixels, { rotate: 2 })),
    findMonsters(translate(pixels, { rotate: 3 })),
    findMonsters(translate(pixels, { rotate: 1, flipVertical: true })),
    findMonsters(translate(pixels, { rotate: 2, flipVertical: true })),
    findMonsters(translate(pixels, { rotate: 3, flipVertical: true })),
    findMonsters(translate(pixels, { rotate: 1, flipHorizontal: true})),
    findMonsters(translate(pixels, { rotate: 2, flipHorizontal: true })),
    findMonsters(translate(pixels, { rotate: 3, flipHorizontal: true })),
    findMonsters(translate(pixels, { rotate: 1, flipVertical: true, flipHorizontal: true})),
    findMonsters(translate(pixels, { rotate: 2, flipVertical: true, flipHorizontal: true })),
    findMonsters(translate(pixels, { rotate: 3, flipVertical: true, flipHorizontal: true })),
  ];


  const mostMonsters = Math.max(...monsters.map((val) => val.length));
  const roughness = Array.from(pixels.map((line) => line.join('')).join('').matchAll(/#/g)).length;
  return roughness - (mostMonsters * SEA_MONSTER_AREA);
}

async function solve() {
  console.log('Result of part one', await partOne());
  console.log('Result of part two', await partTwo());
}

solve().catch(console.error);
