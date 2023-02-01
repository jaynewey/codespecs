import { Language } from "../languages";
import { arrayOrNone, objectOrNone } from "../utils";
import DapClient from "./generated/dapClient";
import { Variable as DapVariable } from "./generated/debugAdapterProtocol";

export type Variable = {
  name: string;
  value: string;
  nativeType: string;
  likeType: string;
  attributes?: Variable[];
  indexes?: Variable[];
};

export type Line = {
  lineNumber: number;
  variables: Variable[];
  stdout: string;
};

export type ProgramTrace = {
  language: Language;
  lines: Line[];
};

function guessType(
  variable: DapVariable,
  attributes: Variable[],
  indexes: Variable[]
): string {
  // if it has any indexed children, it's an array - forget named children
  if (indexes.length) {
    return "array";
  }
  // if it has no indexed children but named, it is an object/mapping
  if (attributes.length) {
    return "object";
  }
  // check value matches general string representations (enclosed in quotes)
  if (variable.value.match(/^['|"](.*)['|"]$/)) {
    return "string";
  }
  // default to numbers
  return "numeric";
}

/**
 * Given a variable find its indexed and named children.
 */
function getAttributesAndIndexes(
  client: DapClient,
  variable: DapVariable
): Promise<{ attributes: Variable[]; indexes: Variable[] }> {
  // guess it's an index by the name being an integer only made of digits
  // TODO: prefer using indexed/named filter over this method however fallback to this
  //       when the adapter doesn't return a different set of children e.g debugpy
  const isIndex = (name: string): boolean => name.match(/^[0-9]+$/);

  return getVariables(client, variable?.variablesReference).then((children) => {
    return {
      attributes: children.filter((child) => !isIndex(child.name)),
      indexes: children.filter((child) => isIndex(child.name)),
    };
  });
}

/**
 * Gets variables and all child variables from a variable reference
 */
function getVariables(
  client: DapClient,
  variablesReference: number
): Promise<Variable[]> {
  return new Promise((resolve, reject) => {
    if (typeof variablesReference !== "number" || variablesReference === 0) {
      resolve([]);
    } else {
      client
        .variables({ variablesReference: variablesReference })
        .then((variables) => {
          return Promise.all(
            (variables?.body?.variables ?? [])
              .filter(
                (variable) =>
                  // TODO: Make exclusions part of language specific config
                  variable?.name !== "special variables" &&
                  variable?.name !== "function variables" &&
                  variable?.name !== "__proto__" &&
                  variable?.name !== "constructor" &&
                  variable?.name !== "prototype" &&
                  !/.*\[\[.*\]\].*/.test(variable?.name) &&
                  // hide 'internal' properties
                  variable?.presentationHint?.visibility !== "internal"
              )
              .map((variable) => {
                return getAttributesAndIndexes(client, variable).then(
                  ({ attributes, indexes }) => {
                    return {
                      name: variable?.name ?? "",
                      value: variable?.value ?? "",
                      nativeType: variable?.type ?? "",
                      likeType: guessType(variable, attributes, indexes),
                      ...(attributes.length && { attributes }),
                      ...(indexes.length && { indexes }),
                    };
                  }
                );
              })
          ).then(resolve);
        });
    }
  });
}

function addHandlers(
  client: DapClient,
  codePath: string,
  language: Language
): Promise<ProgramTrace> {
  return new Promise((resolve, reject) => {
    const programTrace: ProgramTrace = {
      language: language,
      lines: [],
    };

    client.onInitializedEvent((event) => {
      // once initialised, set breakpoints
      client
        .setBreakpoints({
          // want to stop at first line and step through each line
          breakpoints: [{ line: 1 }],
          source: { path: codePath },
        })
        .then((response) => {
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
            getVariables(client, variablesReference).then((variables) => {
              programTrace.lines.push({
                lineNumber: lineNumber,
                variables: variables.flat(1),
                stdout: "", // TODO: support program output
              });

              if (typeof threadId === "number") {
                client.next({ threadId: threadId });
              }
            });
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

/**
 * Generates a program trace of all variables at each line
 * Assumes this is safe code
 */
export default function traceProgram(
  codePath: string,
  language: Language
): Promise<ProgramTrace> {
  const client = new DapClient();

  // first, add all of our required event handlers
  const programTrace = addHandlers(client, codePath, language);

  // finally, initialise the debug adapter
  client
    .initialize({
      adapterID: "pydevd", //pydevd?
      pathFormat: "path",
    })
    .then((response) => {
      client.launch({
        __restart: true,
        program: codePath,
      });
    });

  return programTrace;
}
