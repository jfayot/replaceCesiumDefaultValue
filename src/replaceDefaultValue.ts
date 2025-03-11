import fs from "fs";

import {
  findClosingParenthesis,
  findBalancedComma,
  getFiles,
  replaceFromIndex,
} from "./common.js";

function replaceInFile(filePath: string, searched: string) {
  const length = searched.length;
  let count = 0;
  let content = fs.readFileSync(filePath, "utf8");
  let initialContent = content + "";
  let index = 0;
  let foundIndex = content.indexOf(searched, index);
  while (foundIndex !== -1) {
    let startIndex = foundIndex + length;
    const closingIndex = findClosingParenthesis(startIndex, content);
    const toReplace = content.substring(foundIndex, closingIndex + 1);
    const defaultValueContent = content.substring(startIndex, closingIndex);
    const commaIndex = findBalancedComma(defaultValueContent);
    if (commaIndex === -1) {
      throw `comma not found: ${filePath} => ${defaultValueContent}`;
    }
    const firstArg = defaultValueContent.substring(0, commaIndex).trim();
    let secondArg = defaultValueContent.substring(commaIndex + 1).trim();
    let comment = "";
    const commentIndex = secondArg.indexOf("// ");
    if (commentIndex !== -1) {
      const newLineIndex = secondArg.indexOf("\n", commentIndex);
      if (newLineIndex === -1) {
        comment = secondArg.substring(commentIndex);
        secondArg = secondArg.substring(0, commentIndex).trim();
      }
    }
    if (secondArg.endsWith(","))
      secondArg = secondArg.slice(0, secondArg.length - 1);
    if (secondArg === "[]" && firstArg.includes("options."))
      secondArg = "Frozen.EMPTY_ARRAY";
    const replacement = `((${firstArg}) ?? (${secondArg})) ${comment}`;

    content = replaceFromIndex(content, foundIndex, toReplace, replacement);

    ++count;

    foundIndex = content.indexOf(searched, foundIndex + replacement.length);
  }

  if (content !== initialContent) fs.writeFileSync(filePath, content, "utf8");

  return count;
}

function replaceInFiles(pattern: string, searched: string) {
  let count = 0;
  const files = getFiles(pattern);
  files.forEach((filePath) => {
    count += replaceInFile(filePath, searched);
  });
  return count;
}

export default function replaceDefaultValue(projectDir: string) {
  let count = 0;

  let searched = "defaultValue(";
  count += replaceInFiles(`${projectDir}/**/*.js`, searched);
  count += replaceInFiles(`${projectDir}/**/*.js`, searched);

  searched = "Cesium.defaultValue(";
  count += replaceInFiles(`${projectDir}/**/*.html`, searched);
  count += replaceInFiles(`${projectDir}/**/*.html`, searched);

  console.log(`defaultValue replacement complete! Found ${count} occurrences`);
}