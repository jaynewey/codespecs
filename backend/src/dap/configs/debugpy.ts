import { Config } from "./types";

const DISALLOWED_NAMES = ["function variables", "special variables"];

const config: Config = {
  adapterCommand: "python3 $PKG_DIR/debugpy/src/debugpy/adapter/ --port=5678",
  codePath: `${process.env.PWD}/main.py`,
  language: "Python (3.10.0)",
  includer: (variable) => {
    return !DISALLOWED_NAMES.includes(variable?.name);
  },
};

export default config;
