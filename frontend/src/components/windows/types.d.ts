import { ReactElement } from "react";
import { MosaicNode, MosaicPath, MosaicWindow } from "react-mosaic-component";

export type MosaicKey = number | string;

export type Window = <T extends MosaicKey>(props: {
  tree: MosaicNode<T>;
  path: MosaicPath;
}) => ReactElement;

export type WindowFactory = <T extends MosaicKey>(
  key: T,
  path: MosaicPath
) => ReactElement;

export type State<S> = [S, (S) => void];

export type Runtime = {
  language: string;
  version: string;
  aliases: string[];
};
