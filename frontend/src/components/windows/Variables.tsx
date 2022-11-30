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

function VariableRow({
  variable,
  selectedVariableState,
  depth = 0,
}: {
  variable: Variable;
  selectedVariableState: State<Variable | null>;
  depth?: number;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedVariable, setSelectedVariable] = selectedVariableState;

  return (
    <>
      <li
        onClick={() => {
          setIsOpen(!isOpen && variable?.children?.length !== undefined);
          setSelectedVariable(variable);
        }}
        className={`p-1 border-b border-zinc-500/30 ${
          selectedVariable === variable ? "bg-zinc-500/20" : ""
        } hover:bg-zinc-500/10 duration-300 cursor-pointer`}
      >
        <div
          className="flex items-center pl-1"
          style={{ marginLeft: `${depth}rem` }}
        >
          {variable?.children?.length ? (
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
      {variable?.children?.length && isOpen ? (
        <ul>
          {(variable?.children ?? []).map((variable, i) => (
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
  selectedVariableState: State<Variable | null>;
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
