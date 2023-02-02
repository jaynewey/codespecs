import { objectOrNone } from "../../utils";
import DapClient from "../generated/dapClient";
import { Variable as DapVariable } from "../generated/debugAdapterProtocol";
import { Variable, VariableIncluder } from "./types";

export function guessType(
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
export async function getAttributesAndIndexes(
  client: DapClient,
  variable: DapVariable
): Promise<{ attributes: Variable[]; indexes: Variable[] }> {
  // guess it's an index by the name being an integer only made of digits
  // TODO: prefer using indexed/named filter over this method however fallback to this
  //       when the adapter doesn't return a different set of children e.g debugpy
  const isIndex = (name: string): boolean => name.match(/^[0-9]+$/) !== null;

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
export function getVariables(
  client: DapClient,
  variablesReference: number,
  includer?: VariableIncluder
): Promise<Variable[]> {
  return new Promise((resolve) => {
    if (typeof variablesReference !== "number" || variablesReference === 0) {
      resolve([]);
    } else {
      client
        .variables({ variablesReference: variablesReference })
        .then((variables) => {
          return Promise.all(
            (objectOrNone(variables?.body)?.variables ?? [])
              .filter(
                (variable: DapVariable) =>
                  (includer ?? (() => true))(variable) &&
                  // hide 'internal' properties
                  variable?.presentationHint?.visibility !== "internal"
              )
              .map(async (variable: DapVariable) => {
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
