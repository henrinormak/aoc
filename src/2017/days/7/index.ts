import { readInput } from '../../../lib/input';

interface Node {
  name: string;
  weight: number;
  children: string[];
}

async function partOne() {
  const input = await readInput('./input.txt', { relativeTo: __dirname, splitLines: true });
  const nodes: Node[] = input.map((val) => {
    const [_, name, weight, children] = val.match(/([a-z]+) \((\d+)\)(?: -> ([a-z]+(?:, [a-z]+)*))?/);

    return {
      name,
      weight: parseInt(weight, 10),
      children: children?.split(', ') ?? [],
    };
  });

  return nodes.find((node, idx) => {
    // Find the first node that is not the child of any other node (meaning it is the root node)
    return !nodes.some((other) => other.children.includes(node.name));
  })?.name;
}

function calculateTotalWeightOfNode(node: Node, nodesByName: Map<string, Node>): number {
  return node.weight + node.children.reduce((sum, child) => {
    const childNode = nodesByName.get(child);
    return sum + calculateTotalWeightOfNode(childNode, nodesByName);
  }, 0);
}

async function partTwo(rootNode: string) {
  const input = await readInput('./input.txt', { relativeTo: __dirname, splitLines: true });
  const nodes: Node[] = input.map((val) => {
    const [_, name, weight, children] = val.match(/([a-z]+) \((\d+)\)(?: -> ([a-z]+(?:, [a-z]+)*))?/);

    return {
      name,
      weight: parseInt(weight, 10),
      children: children?.split(', ') ?? [],
    };
  });

  const nodesByName = nodes.reduce((memo, node) => memo.set(node.name, node), new Map<string, Node>());

  // Start from root node, and go down the unbalanced child to figure out which node has wrong weight
  const root = nodesByName.get(rootNode);
  let previousParent: Node | undefined = undefined;
  let parent: Node = root;

  while (parent !== undefined) {
    // Determine weight for all children
    const childNodes = parent.children.map((child) => nodesByName.get(child));
    const weights = childNodes.map((child) => calculateTotalWeightOfNode(child, nodesByName));
    const uniqueWeights = new Set(weights);

    if (uniqueWeights.size === 1) {
      // The tree is balanced below us, meaning the node we are at is the one with the incorrect weight
      const randomSibling = nodesByName.get(previousParent?.children.find((child) => child !== parent.name) ?? '');
      const expectedWeight = calculateTotalWeightOfNode(randomSibling, nodesByName);
      const actualWeight = calculateTotalWeightOfNode(parent, nodesByName);
      const diff = actualWeight - expectedWeight;

      return `Tree is balanced below ${parent.name}, it should weigh ${parent.weight - diff} not ${parent.weight}`;
    }

    // Go down the subtree that has the fault in it
    const subtreeName = parent.children.find((_, idx) => !weights.some((weight, otherIdx) => idx !== otherIdx && weight === weights[idx]));
    previousParent = parent;
    parent = nodesByName.get(subtreeName);
  }
}

async function solve() {
  const rootNode = await partOne();
  console.log('Result of part one', rootNode);
  console.log('Result of part two', await partTwo(rootNode));
}

solve().catch(console.error);
