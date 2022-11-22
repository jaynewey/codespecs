import { LayoutList } from "charm-icons";
import {
  MosaicNode,
  MosaicPath,
  MosaicWindow,
  getNodeAtPath,
} from "react-mosaic-component";

import "../../index.css";
import CharmIcon from "../CharmIcon";
import { MosaicKey, Window } from "./types";

export default function Variables<T extends MosaicKey>({
  tree,
  windowKey,
  path,
}: {
  tree: MosaicNode<T>;
  windowKey: T;
  path: MosaicPath;
}) {
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
      <div className="w-full h-full bg-zinc-100 dark:bg-zinc-900" />,
    </MosaicWindow>
  );
}
