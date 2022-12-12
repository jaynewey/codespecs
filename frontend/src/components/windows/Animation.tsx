import {
  Cross,
  Crosshair,
  Glasses,
  Info,
  LayoutList,
  ZoomIn,
  ZoomOut,
} from "charm-icons";
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
import Slider from "../Slider";
import ArrayLike from "../animation/ArrayLike";
import ObjectLike from "../animation/ObjectLike";
import { Variable } from "../animation/types";
import ToolbarButton from "./ToolbarButton";
import { getVariableByName } from "./Variables";
import { MosaicKey, State, Window } from "./types";

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 8;
const ZOOM_STEP = 0.1;
const ZOOM_BUTTON_STEP = 0.5;

function animationFactory(variable: Variable): ReactElement {
  switch (variable.likeType) {
    case "string":
      return <span className="m-auto token string">{variable.value}</span>;
    case "numeric":
      return <span className="m-auto token number">{variable.value}</span>;
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
          <div className="flex ml-auto gap-1 px-2 align-middle">
            <ToolbarButton
              onClick={() =>
                setZoom(
                  Math.min(
                    Math.max(zoom - ZOOM_BUTTON_STEP, MIN_ZOOM),
                    MAX_ZOOM
                  )
                )
              }
            >
              <CharmIcon icon={ZoomOut} />
            </ToolbarButton>
            <div className="w-24 h-4">
              <Slider
                value={zoom}
                onChange={(event) => {
                  setZoom(event.target.valueAsNumber);
                }}
                min={MIN_ZOOM}
                max={MAX_ZOOM}
                step={ZOOM_STEP}
                // Stop the toolbar from being dragged when we are interacting with the slider
                onDragStart={(event) => event.preventDefault()}
                draggable={true}
              />
            </div>
            <ToolbarButton
              onClick={() =>
                setZoom(
                  Math.min(
                    Math.max(zoom + ZOOM_BUTTON_STEP, MIN_ZOOM),
                    MAX_ZOOM
                  )
                )
              }
            >
              <CharmIcon icon={ZoomIn} />
            </ToolbarButton>
          </div>
          <ToolbarButton
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
          minZoom={MIN_ZOOM}
          maxZoom={MAX_ZOOM}
          className="w-full h-full bg-zinc-100 dark:bg-zinc-900 cursor-grab active:cursor-grabbing duration-100 transition-transform select-none"
        >
          <div className="absolute">
            <div className="m-4 bg-zinc-500/10 rounded-lg p-3">
              <p className="font-mono text-xs pb-2">
                {variableObj.name}
                <span className="text-zinc-500">
                  : {variableObj.nativeType}
                </span>
              </p>
              <div className="flex m-auto">{animationFactory(variableObj)}</div>
            </div>
          </div>
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
