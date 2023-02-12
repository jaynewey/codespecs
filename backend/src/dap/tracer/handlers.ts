import { EventEmitter } from "node:events";

import { Language } from "../../languages";
import { arrayOrNone, objectOrNone } from "../../utils";
import DapClient from "../generated/dapClient";
import { Scope } from "../generated/debugAdapterProtocol";
import { Line, ProgramTrace, VariableIncluder } from "./types";
import { getVariables } from "./variables";

function flushLines(
  lineBuffer: Line[],
  programTrace: ProgramTrace,
  eventEmitter?: EventEmitter
) {
  lineBuffer.forEach((line) => {
    programTrace.lines.push(line);
    eventEmitter?.emit("pushLine", line);
  });
  lineBuffer.length = 0;
}

export function addHandlers(
  client: DapClient,
  codePath: string,
  language: Language,
  includer?: VariableIncluder,
  eventEmitter?: EventEmitter
): Promise<ProgramTrace> {
  return new Promise((resolve, reject) => {
    const programTrace: ProgramTrace = {
      language: language,
      lines: [],
    };
    const lineBuffer: Line[] = [];
    let configurationDone = false;

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
          configurationDone = true;
        });
    });

    client.onOutputEvent((event) => {
      const body = objectOrNone(event?.body) ?? {};

      // if we have no lines to attach output to, give up
      if (!lineBuffer.length) {
        return;
      }
      // assume this output is from the latest line in the buffer
      const line = lineBuffer[lineBuffer.length - 1];
      // we only care about standard output
      if (body?.category === "stdout") {
        // append to it just to ensure we're not throwing away data
        line.stdout = (line.stdout ?? "") + body.output;
      } else if (body?.category === "stderr") {
        if (configurationDone) {
          line.stderr = (line.stderr ?? "") + body.output;
        }
      }
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
          // NOTE: assumes that if the main file is not first in stackframe list
          // then we're in an internal function and should step out
          const stackFrame = (arrayOrNone(body?.stackFrames) ?? [])?.[0];
          // need stack frame id
          const frameId = stackFrame?.id;
          // get line number
          const lineNumber = stackFrame?.line ?? 0;

          if (
            typeof frameId !== "number" ||
            stackFrame?.source?.path !== codePath
          ) {
            client.stepOut({ threadId });
            return;
          }

          client.scopes({ frameId: frameId }).then((response) => {
            const body = objectOrNone(response?.body) ?? {};
            Promise.all(
              body?.scopes
                ?.filter((scope: Scope) => !scope.expensive)
                ?.map(async (scope: Scope) => {
                  // need variables reference
                  const variablesReference = scope?.variablesReference;
                  return getVariables(client, variablesReference, includer);
                })
            ).then((variables) => {
              const line = {
                lineNumber: lineNumber,
                variables: variables.flat(1),
              };
              // buffer our lines before pushing them to give a chance for events
              // to "catch up" - for example stdout events are often late
              flushLines(lineBuffer, programTrace, eventEmitter);
              lineBuffer.push(line);

              if (typeof threadId === "number") {
                client.stepIn({ threadId: threadId, granularity: "line" });
              }
            });
          });
        });
      });
    });

    client.onTerminatedEvent(() => {
      // be sure to flush the buffer
      flushLines(lineBuffer, programTrace, eventEmitter);
      // close the connection when the adapter terminates
      client.close();
      // the trace is finished, resolve the promise
      resolve(programTrace);
    });
  });
}
