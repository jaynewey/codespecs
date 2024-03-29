import { ReactElement, useState } from "react";
import {
  Mosaic,
  MosaicNode,
  MosaicParent,
  MosaicPath,
  getNodeAtPath,
} from "react-mosaic-component";

import "../index.css";
import { MosaicKey, WindowFactory } from "./windows/types";

export default function Windows<T extends MosaicKey>({
  windows,
  setWindows,
  windowFactory,
  resize,
}: {
  windows: MosaicNode<T>;
  setWindows: (windows: MosaicNode<T>) => void;
  windowFactory: WindowFactory;
  resize: boolean;
}) {
  return (
    <div className="h-full">
      <Mosaic<T>
        className=""
        renderTile={windowFactory}
        value={windows}
        onChange={(currentNode) => {
          if (currentNode) setWindows(currentNode);
        }}
        resize={
          resize
            ? {
                minimumPaneSizePercentage: 10,
              }
            : "DISABLED"
        }
      />
    </div>
  );
}
