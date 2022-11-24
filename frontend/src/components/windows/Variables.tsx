import { ChevronDown, ChevronRight, LayoutList, Tag } from "charm-icons";
import { useState } from "react";
import {
  MosaicNode,
  MosaicPath,
  MosaicWindow,
  getNodeAtPath,
} from "react-mosaic-component";

import "../../index.css";
import CharmIcon from "../CharmIcon";
import { MosaicKey, State } from "./types";

export type Variable = {
  name: string;
  value: string;
  children?: Variable[];
};

function VariableRow({
  variable,
  depth = 0,
}: {
  variable: Variable;
  depth: number;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <li
        onClick={() => {
          setIsOpen(!isOpen && variable?.children?.length !== undefined);
        }}
        className={`p-1 pl-${
          4 * depth
        } border-b border-zinc-500 hover:bg-zinc-500/10 duration-300 cursor-pointer`}
      >
        <div className="flex items-center pl-1">
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
            <VariableRow variable={variable} depth={depth + 1} key={i} />
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
}: {
  path: MosaicPath;
  variablesListState: State<Variable[]>;
}) {
  const [variablesList, _] = variablesListState;

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
      <ul className="w-full h-full bg-zinc-100 dark:bg-zinc-900">
        {variablesList.map((variable, i) => (
          <VariableRow variable={variable} key={i} />
        ))}
      </ul>
    </MosaicWindow>
  );
}
