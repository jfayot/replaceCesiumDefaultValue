import path from "path";

import replaceDefaultValue from "./replaceDefaultValue.js";
import replaceEmptyObject from "./replaceEmptyObject.js";
import updateImports from "./updateImports.js";

const arg = process.argv.slice(2)[0];
if (arg === undefined) process.exit(0);

const projectDir = path.resolve(arg);

replaceDefaultValue(projectDir);
replaceEmptyObject(projectDir);
updateImports(projectDir);
