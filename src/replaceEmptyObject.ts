import fs from "fs";
import { getFiles, replaceFromIndex } from "./common.js"

function replaceInFile(
  filePath: string,
  searched: string,
  replacement: string
) {
  let count = 0;
  let content = fs.readFileSync(filePath, "utf8");
  let initialContent = content + "";
  let index = 0;
  let foundIndex = content.indexOf(searched, index);
  while (foundIndex !== -1) {
    content = replaceFromIndex(content, foundIndex, searched, replacement);

    ++count;

    foundIndex = content.indexOf(searched, foundIndex + replacement.length);
  }

  if (content !== initialContent) fs.writeFileSync(filePath, content, "utf8");

  return count;
}

function replaceInFiles(pattern: string, searched: string, replacement: string) {
  let count = 0;
  const files = getFiles(pattern);
  files.forEach((filePath) => {
    count += replaceInFile(filePath, searched, replacement);
  });
  return count;
}

export default function replaceEmptyObject(projectDir: string) {
  let count = 0;
  let searched = "defaultValue.EMPTY_OBJECT";
  count += replaceInFiles(
    `${projectDir}/**/*.js`,
    searched,
    "Frozen.EMPTY_OBJECT"
  );

  searched = "Cesium.defaultValue.EMPTY_OBJECT(";
  count += replaceInFiles(
    `${projectDir}/**/*.html`,
    searched,
    "Cesium.Frozen.EMPTY_OBJECT"
  );

  console.log(
    `defaultValue.EMPTY_OBJECT replacement complete! Found ${count} occurrences`
  );
}
