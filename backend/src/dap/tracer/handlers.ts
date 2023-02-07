import { Language } from "../../languages";
import { arrayOrNone, objectOrNone } from "../../utils";
import DapClient from "../generated/dapClient";
import { ProgramTrace, VariableIncluder } from "./types";
import { getVariables } from "./variables";

export function addHandlers(
  client: DapClient,
  codePath: string,
  language: Language,
  includer?: VariableIncluder
): Promise<ProgramTrace> {
  return new Promise((resolve, reject) => {
    const programTrace: ProgramTrace = {
      language: language,
      lines: [],
    };

    client.onInitializedEvent(() => {
      // once initialised, set breakpoints
      client
        .setBreakpoints({
          // want to stop at first line and step through each line
          breakpoints: [{ line: 1 }],
          source: { path: codePath },
        })
        .then(() => {
          // once breakpoints are set, tell the server we are done configuring
          client.configurationDone();
        });
    });

    client.onStoppedEvent((event) => {
      const body = objectOrNone(event?.body) ?? {};

      const threadId = body?.threadId;

      if (typeof threadId !== "number") {
        client.close();
        reject();
      }

      client.threads().then(() => {
        client.stackTrace({ threadId: threadId }).then((response) => {
          const body = objectOrNone(response?.body) ?? {};

          const stackFrame = (arrayOrNone(body?.stackFrames) ?? []).filter(
            (stackFrame) => stackFrame?.source?.path === codePath
          )?.[0];
          // need stack frame id
          const frameId = stackFrame?.id;
          // get line number
          const lineNumber = stackFrame?.line ?? 0;

          if (typeof frameId !== "number") {
            client.close();
            resolve(programTrace);
          }

          client.scopes({ frameId: frameId }).then((response) => {
            const body = objectOrNone(response?.body) ?? {};
            // need variables reference
            const variablesReference = body?.scopes?.[0]?.variablesReference;
            getVariables(client, variablesReference, includer).then(
              (variables) => {
                programTrace.lines.push({
                  lineNumber: lineNumber,
                  variables: variables.flat(1),
                  stdout: "", // TODO: support program output
                });

                if (typeof threadId === "number") {
                  client.next({ threadId: threadId });
                }
              }
            );
          });
        });
      });
    });

    client.onTerminatedEvent(() => {
      // close the connection when the adapter terminates
      client.close();
      // the trace is finished, resolve the promise
      resolve(programTrace);
    });
  });
}
