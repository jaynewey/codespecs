import { Language } from "../../languages";
import DapClient from "../generated/dapClient";
import { addHandlers } from "./handlers";
import { ProgramTrace, VariableIncluder } from "./types";

/**
 * Generates a program trace of all variables at each line
 * Assumes this is safe code
 */
export default function traceProgram(
  codePath: string,
  programPath: string,
  language: Language,
  includer?: VariableIncluder
): Promise<ProgramTrace> {
  const client = new DapClient();

  // first, add all of our required event handlers
  const programTrace = addHandlers(client, codePath, language, includer);

  // finally, initialise the debug adapter
  client
    .initialize({
      adapterID: "pydevd", //pydevd?
      pathFormat: "path",
    })
    .then(() => {
      client.launch({
        __restart: true,
        program: programPath,
      });
    });

  return programTrace;
}

const code = "/home/jay/Documents/uni/dap/debugpy/foo.py";
const includer: VariableIncluder = (variable) => {
  return (
    variable?.name !== "special variables" &&
    variable?.name !== "function variables"
  );
};
traceProgram(code, code, "Python (3.8.1)", includer).then((result) => {
  console.log(JSON.stringify(result, null, 2));
});
