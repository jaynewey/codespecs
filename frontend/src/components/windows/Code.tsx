import { Code as CodeCharm } from "charm-icons";
import {
  MosaicNode,
  MosaicPath,
  MosaicWindow,
  getNodeAtPath,
} from "react-mosaic-component";

import "../../index.css";
import CharmIcon from "../CharmIcon";
import { MosaicKey, State, Window } from "./types";

export default function Code<T extends MosaicKey>({
  path,
  sourceCodeState,
}: {
  path: MosaicPath;
  sourceCodeState: State<string>;
}) {
  const [_, setSourceCode] = sourceCodeState;
  return (
    <MosaicWindow<T>
      title="Code"
      className=""
      renderToolbar={() => (
        <div className="flex items-center p-2 w-full h-full text-sm bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-500">
          <CharmIcon icon={CodeCharm} />
          <span className="pl-2">Code</span>
        </div>
      )}
      path={path}
      draggable={true}
    >
      <textarea
        onBlur={(event) => {
          setSourceCode(event.target.value);
        }}
        className="w-full h-full bg-zinc-200 dark:bg-zinc-800 p-4 font-mono resize-none text-sm"
        placeholder={
          // TODO: Remove this
          `array = [1, 2, 3]

number = 7

string = "Hello, world!"

mapping = {
    "a": "b",
    "b": "c"
}

print(string)`
        }
      />
    </MosaicWindow>
  );
}
