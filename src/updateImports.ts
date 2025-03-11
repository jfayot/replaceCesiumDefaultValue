import fs from "fs";
import { getFiles } from "./common.js"

function replaceInFile(
  filePath: string,
  searched: string | RegExp,
  replacement: string,
  isReplacementPattern: boolean,
) {
  let count = 0;
  let content = fs.readFileSync(filePath, "utf8");
  if (content.indexOf("Frozen.") === -1)
    if (isReplacementPattern) replacement = "$1";
    else replacement = "";
  let initialContent = content + "";

  content = content.replace(searched, replacement);

  if (content !== initialContent) {
    ++count;
    fs.writeFileSync(filePath, content, "utf8");
  }

  return count;
}

function replaceInFiles(
  pattern: string,
  searched: string | RegExp,
  replacement: string,
  isReplacementPattern: boolean = false,
) {
  let count = 0;
  const files = getFiles(pattern);
  files.forEach((filePath) => {
    count += replaceInFile(
      filePath,
      searched,
      replacement,
      isReplacementPattern,
    );
  });
  return count;
}

export default function updateImports(projectDir: string) {
  let count = 0;
  let searched: string | RegExp = `import defaultValue from "./defaultValue.js";
`;
  count += replaceInFiles(
    `${projectDir}/**/*.js`,
    searched,
    `import Frozen from "./Frozen.js";
`);

  searched = `import defaultValue from "../Core/defaultValue.js";
`;
  count += replaceInFiles(
    `${projectDir}/**/*.js`,
    searched,
    `import Frozen from "../Core/Frozen.js";
`);

  searched = `import defaultValue from "../../Core/defaultValue.js";
`;
  count += replaceInFiles(
    `${projectDir}/**/*.js`,
    searched,
    `import Frozen from "../../Core/Frozen.js";
`);

  searched = `import defaultValue from "../../../Core/defaultValue.js";
`;
  count += replaceInFiles(
    `${projectDir}/**/*.js`,
    searched,
    `import Frozen from "../../../Core/Frozen.js";
`);

  searched = `import defaultValue from "../../../../Core/defaultValue.js";
`;
  count += replaceInFiles(
    `${projectDir}/**/*.js`,
    searched,
    `import Frozen from "../../../../Core/Frozen.js";
`);

  searched = `  defaultValue,
`;
  count += replaceInFiles(
    `${projectDir}/**/*.js`,
    searched,
    `  Frozen,
`);

  searched = `import { defaultValue } from "@cesium/engine";
`;
  count += replaceInFiles(
    `${projectDir}/**/*.js`,
    searched,
    `import { Frozen } from "@cesium/engine";
`);

  searched = /(import .*)(defaultValue, )/;
  count += replaceInFiles(
    `${projectDir}/**/*.js`,
    searched,
    `\$1DefaultValues, `,
    true,
  );

  searched = /(import .*)(, defaultValue)/;
  count += replaceInFiles(
    `${projectDir}/**/*.js`,
    searched,
    `\$1, Frozen`,
    true
  );

  console.log(
    `imports replacement complete! Found ${count} occurrences`
  );
}