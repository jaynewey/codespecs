import { EventEmitter } from "node:events";

import { Language } from "../../languages";
import DapClient from "../generated/dapClient";
import { addHandlers } from "./handlers";
import { ProgramTrace, VariableIncluder } from "./types";

export default class Tracer extends EventEmitter {
  /**
   * Generates a program trace of all variables at each line
   * Assumes this is safe code
   */
  public traceProgram(
    codePath: string,
    programPath: string,
    language: Language,
    includer?: VariableIncluder,
    entrypoint?: number
  ): Promise<ProgramTrace> {
    const client = new DapClient();

    // first, add all of our required event handlers
    const programTrace = addHandlers(
      client,
      codePath,
      language,
      includer,
      entrypoint,
      this
    );

    // finally, initialise the debug adapter
    client.connect().then(() => {
      client
        .initialize({
          adapterID: "codespecs",
          pathFormat: "path",
          supportsVariableType: true,
        })
        .then(() => {
          client.launch({
            __restart: true,
            program: programPath,
          });
        });
    });

    return programTrace;
  }
}
