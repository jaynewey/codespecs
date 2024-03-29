import { ChevronDown, ChevronRight, LayoutList, Tag } from "charm-icons";
import Highlight, { Language, defaultProps } from "prism-react-renderer";
import darkTheme from "prism-react-renderer/themes/nightOwl";
import lightTheme from "prism-react-renderer/themes/nightOwlLight";
import { MouseEvent, useContext, useState } from "react";
import {
  MosaicNode,
  MosaicPath,
  MosaicWindow,
  getNodeAtPath,
} from "react-mosaic-component";

import ThemeContext from "../../contexts/ThemeContext";
import "../../index.css";
import CharmIcon from "../CharmIcon";
import { Id, Variable } from "../animation/types";
import { languageMap } from "./Code";
import ToolbarButton from "./ToolbarButton";
import { MosaicKey, Runtime, State } from "./types";

export function children(variable: Variable): Variable[] {
  return [...(variable?.attributes ?? []), ...(variable?.indexes ?? [])];
}

export function getVariableById(
  id: Id,
  variables: Variable[]
): Variable | null {
  for (const variable of variables) {
    if (variable.id === id) {
      return variable;
    }
    const nested = getVariableById(id, children(variable));
    if (nested) {
      return nested;
    }
  }
  return null;
}

function VariableRow({
  variable,
  selectedVariablesState,
  runtimeState,
  depth = 0,
}: {
  variable: Variable;
  selectedVariablesState: State<Id[]>;
  runtimeState: State<Runtime | null>;
  depth?: number;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedVariables, setSelectedVariables] = selectedVariablesState;

  const { theme } = useContext(ThemeContext);
  const [runtime] = runtimeState;

  return (
    <li className={`${depth > 0 ? "ml-4 border-l border-zinc-500" : ""}`}>
      <div
        className={`flex items-center pl-1 hover:bg-zinc-500/10 duration-300 cursor-pointer
        ${selectedVariables.includes(variable.id) ? "bg-zinc-500/20" : ""}
	`}
        onClick={() =>
          setSelectedVariables(
            selectedVariables.includes(variable.id)
              ? [
                  ...selectedVariables.slice(
                    0,
                    selectedVariables.indexOf(variable.id)
                  ),
                  ...selectedVariables.slice(
                    selectedVariables.indexOf(variable.id) + 1
                  ),
                ]
              : [...selectedVariables, variable.id]
          )
        }
      >
        {children(variable).length ? (
          <ToolbarButton
            onClick={(event) => {
              setIsOpen(!isOpen && children(variable).length > 0);
              event.stopPropagation();
            }}
          >
            <CharmIcon icon={isOpen ? ChevronDown : ChevronRight} />
          </ToolbarButton>
        ) : (
          <></>
        )}
        <span className="w-full text-sm font-mono pl-2 py-1 truncate">
          {variable.name}:{" "}
          <span className="text-zinc-700 dark:text-zinc-300">
            <Highlight
              {...defaultProps}
              theme={theme === "dark" ? darkTheme : lightTheme}
              code={variable.value}
              language={languageMap[runtime?.language ?? ""] ?? "clike"}
            >
              {({ className, tokens, getTokenProps }) => (
                <pre className={`${className} inline`}>
                  {tokens.map((line, i) => (
                    <span key={i}>
                      {line.map((token, key) => (
                        <span {...getTokenProps({ token, key })} style={{}} />
                      ))}
                    </span>
                  ))}
                </pre>
              )}
            </Highlight>
          </span>
        </span>
      </div>
      {children(variable).length && isOpen ? (
        <ul>
          {children(variable).map((variable, i) => (
            <VariableRow
              variable={variable}
              depth={depth + 1}
              key={i}
              selectedVariablesState={selectedVariablesState}
              runtimeState={runtimeState}
            />
          ))}
        </ul>
      ) : (
        <></>
      )}
    </li>
  );
}

export default function Variables<T extends MosaicKey>({
  path,
  variablesListState,
  selectedVariablesState,
  runtimeState,
}: {
  path: MosaicPath;
  variablesListState: State<Variable[]>;
  selectedVariablesState: State<Id[]>;
  runtimeState: State<Runtime | null>;
}) {
  const [variablesList, _] = variablesListState;
  const [selectedVariables, setSelectedVariables] = selectedVariablesState;

  return (
    <MosaicWindow<T>
      title="Variables"
      className=""
      renderToolbar={() => (
        <div className="flex items-center p-2 w-full h-full text-sm bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-300 dark:border-zinc-800">
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
            selectedVariablesState={selectedVariablesState}
            runtimeState={runtimeState}
          />
        ))}
      </ul>
    </MosaicWindow>
  );
}
