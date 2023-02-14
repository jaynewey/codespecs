import { execSync } from "child_process";

import { Variable } from "../generated/debugAdapterProtocol";
import { Config } from "./types";

const DISALLOWED_NAMES = [
  "General Purpose Registers",
  "Floating Point Registers",
  "Advanced Vector Extensions",
];

const CODE_PATH = `${process.env.PWD}/main.cpp`;
const PROGRAM_PATH = `${process.env.PWD}/main`;

// find line of main func using `nm`
const parts =
  String(execSync(`nm -l ${PROGRAM_PATH} | grep 'T main' | head -n 1`)).split(
    ":"
  ) ?? [];
const entrypoint = Number(parts?.[parts.length - 1]);

const config: Config = {
  adapterCommand: "$PKG_DIR/codelldb/extension/adapter/codelldb --port=5678",
  codePath: CODE_PATH,
  programPath: PROGRAM_PATH,
  language: "C++ (GCC 8.3.0)",
  includer: (variable: Variable) => {
    return (
      !DISALLOWED_NAMES.includes(variable?.name) &&
      !variable?.evaluateName?.startsWith("/nat") &&
      !variable?.evaluateName?.startsWith("std::") &&
      !variable?.evaluateName?.startsWith("__gnu")
    );
  },
  entrypoint: !isNaN(entrypoint) ? entrypoint : 1,
};

export default config;
