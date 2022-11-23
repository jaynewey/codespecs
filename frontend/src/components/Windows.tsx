import { ReactElement, useState } from "react";
import {
  Mosaic,
  MosaicNode,
  MosaicPath,
  getNodeAtPath,
} from "react-mosaic-component";

import "../index.css";
import Animation from "./windows/Animation";
import Code from "./windows/Code";
import Terminal from "./windows/Terminal";
import Variables from "./windows/Variables";
import { MosaicKey } from "./windows/types";

const windowKeys = new Map<
  string,
  <T extends MosaicKey>(
    tree: MosaicNode<T>,
    key: T,
    path: MosaicPath
  ) => ReactElement
>([
  [
    "animation",
    (tree, key, path) => <Animation tree={tree} windowKey={key} path={path} />,
  ],
  [
    "variables",
    (tree, key, path) => <Variables tree={tree} windowKey={key} path={path} />,
  ],
  [
    "code",
    (tree, key, path) => <Code tree={tree} windowKey={key} path={path} />,
  ],
  [
    "terminal",
    (tree, key, path) => <Terminal tree={tree} windowKey={key} path={path} />,
  ],
]);

export function isVisible<T extends MosaicKey>(
  tree: MosaicNode<T>,
  path: MosaicPath
) {
  const splitPercentage =
    getNodeAtPath(tree, path.slice(0, path.length - 1))?.splitPercentage ?? 50;
  return (
    (path?.[path.length - 1] === "first" && splitPercentage > 0) ||
    (path?.[path.length - 1] === "second" && splitPercentage < 100)
  );
}

export function getPathToNode<T extends MosaicKey>(
  tree: MosaicNode<T>,
  key: T
): MosaicPath {
  function search<T extends MosaicKey>(
    tree: MosaicNode<T>,
    key: T,
    path: MosaicPath
  ): boolean {
    if (tree) {
      if (tree?.first === key) {
        path.push("first");
        return true;
      }
      if (tree?.second === key) {
        path.push("second");
        return true;
      }
      if (search(tree?.first, key, path)) {
        path.unshift("first");
        return true;
      }
      if (search(tree?.second, key, path)) {
        path.unshift("second");
        return true;
      }
    }
    return false;
  }
  const path = [];
  search(tree, key, path);
  return path;
}

export default function Windows({
  windows,
  setWindows,
}: {
  windows: MosaicNode<string>;
  setWindows: (windows: MosaicNode<string>) => void;
}) {
  return (
    <div className="h-full">
      <Mosaic<string>
        className=""
        renderTile={(key, path) =>
          (windowKeys.get(key) ?? (() => <></>))(windows, key, path)
        }
        value={windows}
        onChange={(currentNode: MosaicNode<string> | null) => {
          if (currentNode) setWindows(currentNode);
        }}
        resize={{
          minimumPaneSizePercentage: 0,
        }}
      />
    </div>
  );
}
