import { execSync } from "child_process";

import { Variable } from "../generated/debugAdapterProtocol";
import { Config } from "./types";

const DISALLOWED_NAMES = [
  "General Purpose Registers",
  "Floating Point Registers",
  "Advanced Vector Extensions",
  "[raw]",
];

const CODE_PATH = `${process.env.PWD}/main.rs`;
const PROGRAM_PATH = `${process.env.PWD}/main`;

// find line of main func using `nm`
const parts =
  String(
    execSync(`nm -Cl ${PROGRAM_PATH} | grep 't main::main' | head -n 1`)
  ).split(":") ?? [];
const entrypoint = Number(parts?.[parts.length - 1]);

const config: Config = {
  adapterCommand:
    '$PKG_DIR/codelldb/extension/adapter/codelldb --port=5678 --params "{\\"sourceLanguages\\": [\\"rust\\"]}"',
  codePath: CODE_PATH,
  programPath: PROGRAM_PATH,
  language: "Rust (rustc 1.65.0)",
  includer: (variable: Variable) => {
    return !DISALLOWED_NAMES.includes(variable?.name);
  },
  entrypoint: !isNaN(entrypoint) ? entrypoint : 1,
};

export default config;
