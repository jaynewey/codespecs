import { JSONObject } from "../types";

/**
 * Takes a DAP JSONSchema and generates a TypeScript client to consume it.
 */
export default (schema: JSONObject): string => {
  return `import Connection from "../connection";
import { Response, Event, ${Object.keys(schema?.definitions ?? {})
    .filter((definition) => definition.endsWith("Arguments"))
    .join(",\n")} } from "./debugAdapterProtocol";

export default class DapClient {
  private connection: Connection;

  constructor() {
    this.connection = new Connection();
  }

  public close() {
    this.connection.close();
  }

  ${Object.entries(schema?.definitions ?? {})
    .filter(([definition, _]) => definition.endsWith("Request"))
    .map(([key, value]) => {
      const obj =
        (Array.isArray(value?.allOf) ? value?.allOf : []).filter(
          (obj: JSONObject) => obj?.type === "object"
        )?.[0] ?? {};

      // some requests e.g threads have no arguments
      const hasArguments = obj?.properties?.arguments !== undefined;

      // don't generate a method signature for undefined commands
      return obj?.properties?.command?.enum?.[0] === undefined
        ? ""
        : `
  public ${obj?.properties?.command?.enum?.[0]} (
    ${
      hasArguments
        ? `arguments_${
            (obj?.required ?? []).includes("arguments") ? "" : "?"
          }: ${obj?.properties?.arguments?.$ref?.split("/")?.pop()}`
        : ""
    }
  ): Promise<Response> {
    return this.connection.request(
      {
	"command": "${obj?.properties?.command?.enum?.[0]}",
	${hasArguments ? '"arguments": arguments_,' : ""}
      }
    );
  }
  `;
    })
    .join("")}

  ${Object.entries(schema?.definitions ?? {})
    .filter(([definition, _]) => definition.endsWith("Event"))
    .map(([key, value]) => {
      const obj =
        (Array.isArray(value?.allOf) ? value?.allOf : []).filter(
          (obj: JSONObject) => obj?.type === "object"
        )?.[0] ?? {};

      const event = obj?.properties?.event?.enum?.[0];

      return event === undefined
        ? ""
        : `
  public on${key} (handler: (event: Event) => void) {
    this.connection.onEvent("${event}", handler);
  }
    `;
    })
    .join("")}
}
`;
};
