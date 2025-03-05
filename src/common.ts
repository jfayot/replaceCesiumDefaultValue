import { globSync } from "glob";

export function getFiles(pattern: string): string[] {
  return globSync(pattern, {
    nodir: true,
    ignore: {
      ignored: (p) =>
        p.name.endsWith("defaultValue.js") ||
        p.name.endsWith("defaultValueSpec.js"),
      childrenIgnored: (p) =>
        p.isNamed("Build") ||
        p.isNamed("node_modules") ||
        p.isNamed("Assets") ||
        p.isNamed("GltfPipeline") ||
        p.isNamed("ThirdParty"),
    },
  });
}

export function replaceFromIndex(
  content: string,
  index: number,
  pattern: string,
  replacement: string
) {
  const before = content.slice(0, index);
  const after = content.slice(index).replace(pattern, replacement);
  return before + after;
}

export function findClosingParenthesis(startIndex: number, content: string) {
  let found = false;
  let foundIndex = startIndex;
  let balance = 0;
  while (!found) {
    if (content[foundIndex] === ")" && balance === 0) break;
    if (content[foundIndex] === "(") ++balance;
    if (content[foundIndex] === ")") --balance;
    ++foundIndex;
  }
  return foundIndex;
}

export function findBalancedComma(content: string) {
  const length = content.length;
  let balance1 = 0;
  let balance2 = 0;
  let balance3 = 0;
  for (let i = 0; i < length; ++i) {
    if (
      content[i] === "," &&
      balance1 === 0 &&
      balance2 === 0 &&
      balance3 === 0
    )
      return i;
    if (content[i] === "(") ++balance1;
    if (content[i] === ")") --balance1;
    if (content[i] === "[") ++balance2;
    if (content[i] === "]") --balance2;
    if (content[i] === "{") ++balance3;
    if (content[i] === "}") --balance3;
  }
  return -1;
}
