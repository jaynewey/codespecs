import { Variable } from "../generated/debugAdapterProtocol";
import { Config } from "./types";

const DISALLOWED_NAMES = [
  "__proto__",
  "constructor",
  "prototype",
  "this",
  "__dirname",
  "__filename",
  "exports",
  "module",
  "require",
];

const config: Config = {
  adapterCommand:
    "node $PKG_DIR/vscode-node-debug2/out/src/nodeDebug.js --server=5678",
  codePath: `${process.env.PWD}/main.js`,
  language: "JavaScript (Node.js 16.3.0)",
  includer: (variable: Variable) => {
    return (
      !DISALLOWED_NAMES.includes(variable?.name) &&
      !/.*\[\[.*\]\].*/.test(variable?.name)
    );
  },
};

export default config;
