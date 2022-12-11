import { Cross, Crosshair, Glasses, Info, LayoutList } from "charm-icons";
import { ReactElement, useState } from "react";
import {
  MosaicNode,
  MosaicPath,
  MosaicWindow,
  getNodeAtPath,
} from "react-mosaic-component";

import "../../index.css";
import CharmIcon from "../CharmIcon";
import Pannable from "../Pannable";
import ArrayLike from "../animation/ArrayLike";
import ObjectLike from "../animation/ObjectLike";
import { Variable } from "../animation/types";
import ToolbarButton from "./ToolbarButton";
import { getVariableByName } from "./Variables";
import { MosaicKey, State, Window } from "./types";

function animationFactory(variable: Variable): ReactElement {
  switch (variable.likeType) {
    case "string":
      return (
        <span className="text-green-700 dark:text-green-300">
          {variable.value}
        </span>
      );
    case "numeric":
      return (
        <span className="m-auto text-purple-700 dark:text-purple-300">
          {variable.value}
        </span>
      );
    case "array":
      return <ArrayLike animationFactory={animationFactory} value={variable} />;
    case "object":
      return (
        <ObjectLike animationFactory={animationFactory} value={variable} />
      );
    default:
      return <></>;
  }
}

export default function Animation<T extends MosaicKey>({
  path,
  selectedVariableState,
  variablesListState,
}: {
  path: MosaicPath;
  selectedVariableState: State<string | null>;
  variablesListState: State<Variable[]>;
}) {
  const [zoom, setZoom] = useState<number>(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [selectedVariable, _] = selectedVariableState;
  const [variablesList, __] = variablesListState;

  const variableObj =
    typeof selectedVariable === "string"
      ? getVariableByName(selectedVariable, variablesList)
      : null;

  return (
    <MosaicWindow<T>
      title="Animation"
      className=""
      renderToolbar={() => (
        <div className="flex items-center p-2 w-full h-full text-sm bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-500">
          <CharmIcon icon={Glasses} />
          <span className="pl-2">Animation</span>
          <ToolbarButton
            className="ml-auto"
            onClick={() => {
              setZoom(1);
              setTranslate({ x: 0, y: 0 });
            }}
          >
            <CharmIcon icon={Crosshair} />
          </ToolbarButton>
        </div>
      )}
      path={path}
      draggable={true}
    >
      {variableObj ? (
        <Pannable
          zoomState={[zoom, setZoom]}
          translateState={[translate, setTranslate]}
          className="w-full h-full bg-zinc-100 dark:bg-zinc-900 cursor-grab active:cursor-grabbing duration-100 transition-transform select-none"
        >
          <div className="absolute">{animationFactory(variableObj)}</div>
        </Pannable>
      ) : (
        <div className="w-full h-full flex bg-zinc-100 dark:bg-zinc-900">
          <div className="relative m-auto items-center text-center bg-blue-500/10 border border-blue-500 text-blue-500 rounded-lg p-2">
            <div className="absolute -top-1 -left-1">
              <span className="absolute animate-ping inline-flex h-3 w-3 rounded-full bg-blue-500/80"></span>
              <span className="absolute inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </div>
            <div className="pl-2 justify-center">
              <p>Select a variable to view from the</p>
              <div className="flex flex-row justify-center items-center text-sm">
                <CharmIcon icon={LayoutList} />
                <span className="pl-2">Variables</span>
              </div>
              <p>window.</p>
            </div>
          </div>
        </div>
      )}
    </MosaicWindow>
  );
}
