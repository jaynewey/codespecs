import { ReactElement } from "react";
import { MosaicNode, MosaicPath, MosaicWindow } from "react-mosaic-component";

export type MosaicKey = number | string;

export type Window = <T extends MosaicKey>(props: {
  tree: MosaicNode<T>;
  windowKey: T;
  path: MosaicPath;
}) => ReactElement;
