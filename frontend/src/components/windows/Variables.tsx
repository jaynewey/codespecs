import { ChevronDown, ChevronRight, LayoutList, Tag } from "charm-icons";
import { MouseEvent, useState } from "react";
import {
  MosaicNode,
  MosaicPath,
  MosaicWindow,
  getNodeAtPath,
} from "react-mosaic-component";

import "../../index.css";
import CharmIcon from "../CharmIcon";
import { Variable } from "../animation/types";
import { MosaicKey, State } from "./types";

function children(variable: Variable): Variable[] {
  return [...(variable?.attributes ?? []), ...(variable?.indexes ?? [])];
}

export function getVariableByName(
  name: string,
  variables: Variable[]
): Variable | null {
  for (const variable of variables) {
    if (variable.name === name) {
      return variable;
    }
    const nested = getVariableByName(name, children(variable));
    if (nested) {
      return nested;
    }
  }
  return null;
}

function VariableRow({
  variable,
  selectedVariableState,
  depth = 0,
}: {
  variable: Variable;
  selectedVariableState: State<string | null>;
  depth?: number;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedVariable, setSelectedVariable] = selectedVariableState;

  return (
    <>
      <li
        onClick={() => {
          setIsOpen(!isOpen && children(variable).length > 0);
          setSelectedVariable(variable.name);
        }}
        className={`p-1 border-b border-zinc-500/30 ${
          selectedVariable === variable.name ? "bg-zinc-500/20" : ""
        } hover:bg-zinc-500/10 duration-300 cursor-pointer`}
      >
        <div
          className="flex items-center pl-1"
          style={{ marginLeft: `${depth}rem` }}
        >
          {children(variable).length ? (
            <CharmIcon icon={isOpen ? ChevronDown : ChevronRight} />
          ) : (
            <></>
          )}
          <span className="text-sm font-mono pl-2 truncate">
            {variable.name}:{" "}
            <span className="text-zinc-700 dark:text-zinc-300">
              {variable.value}
            </span>
          </span>
        </div>
      </li>
      {children(variable).length && isOpen ? (
        <ul>
          {children(variable).map((variable, i) => (
            <VariableRow
              variable={variable}
              depth={depth + 1}
              key={i}
              selectedVariableState={selectedVariableState}
            />
          ))}
        </ul>
      ) : (
        <></>
      )}
    </>
  );
}

export default function Variables<T extends MosaicKey>({
  path,
  variablesListState,
  selectedVariableState,
}: {
  path: MosaicPath;
  variablesListState: State<Variable[]>;
  selectedVariableState: State<string | null>;
}) {
  const [variablesList, _] = variablesListState;
  const [selectedVariable, setSelectedVariable] = selectedVariableState;

  return (
    <MosaicWindow<T>
      title="Variables"
      className=""
      renderToolbar={() => (
        <div className="flex items-center p-2 w-full h-full text-sm bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-500">
          <CharmIcon icon={LayoutList} />
          <span className="pl-2">Variables</span>
        </div>
      )}
      path={path}
      draggable={true}
    >
      <ul className="w-full h-full bg-zinc-100 dark:bg-zinc-900 overflow-auto">
        {variablesList.map((variable, i) => (
          <VariableRow
            variable={variable}
            key={i}
            selectedVariableState={selectedVariableState}
          />
        ))}
      </ul>
    </MosaicWindow>
  );
}
