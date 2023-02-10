import {
  MosaicNode,
  MosaicParent,
  MosaicPath,
  getNodeAtPath,
} from "react-mosaic-component";

import { MosaicKey } from "./types";

export function isVisible<T extends MosaicKey>(
  tree: MosaicNode<T>,
  path: MosaicPath
) {
  const nodeAtPath = getNodeAtPath(
    tree,
    path.slice(0, path.length - 1)
  ) as MosaicParent<T>;
  const splitPercentage = nodeAtPath?.splitPercentage ?? 50;
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
    if (tree && typeof tree === "object") {
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
  const path: MosaicPath = [];
  search(tree, key, path);
  return path;
}
