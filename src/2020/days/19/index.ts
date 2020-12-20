import { readMappedInput } from '../../../lib/input';
import { match } from 'xregexp/types';

function resolveRule(rule: string, rules: Map<string, string>, maxDepth = Infinity, depth = 0): string {
  let match: RegExpMatchArray;

  if (match = rule.match(/"([a-z])"/)) {
    return rule[1];
  }

  if (depth > maxDepth) {
    // To avoid recursing too deep
    return '';
  }

  if (!rule.includes('|')) {
    let result = rule;

    while (match = result.match(/\d+/)) {
      result = result.replace(match[0], resolveRule(rules.get(match[0]), rules, maxDepth, depth + 1));
    }

    return result.replace(/\s+/g, '');
  }

  const result = '((' + rule.split(' | ').map((nested) => resolveRule(nested, rules, maxDepth, depth + 1)).join(')|(') + '))';
  return result;
}

async function partOne() {
  const [rulesStrs, messages] = await readMappedInput('./input.txt', (block) => block.split('\n'), { relativeTo: __dirname, splitBy: '\n\n' });

  const rules = new Map<string, string>();
  rulesStrs.map((ruleStr) => {
    const [idx, rule] = ruleStr.split(': ');
    rules.set(idx, rule);
  });


  const regex = new RegExp(`^${resolveRule(rules.get('0'), rules)}$`);
  return messages.filter((message) => regex.test(message)).length;
}

async function partTwo() {
  const [rulesStrs, messages] = await readMappedInput('./input.txt', (block) => block.split('\n'), { relativeTo: __dirname, splitBy: '\n\n' });

  const rules = new Map<string, string>();
  rulesStrs.map((ruleStr) => {
    const [idx, rule] = ruleStr.split(': ');
    rules.set(idx, rule);
  });

  // The rules have been changed
  rules.set('8', '42 | 42 8');
  rules.set('11', '42 31 | 42 11 31');

  let regex = new RegExp(`^${resolveRule(rules.get('0'), rules, 30)}$`);
  return messages.filter((message) => regex.test(message)).length;
}

async function solve() {
  console.log('Result of part one', await partOne());
  console.log('Result of part two', await partTwo());
}

solve().catch(console.error);
