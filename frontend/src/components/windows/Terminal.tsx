import { Terminal as TerminalCharm } from "charm-icons";
import { useState } from "react";
import {
  MosaicNode,
  MosaicPath,
  MosaicWindow,
  getNodeAtPath,
} from "react-mosaic-component";

import "../../index.css";
import CharmIcon from "../CharmIcon";
import { MosaicKey, Window } from "./types";

export default function Terminal<T extends MosaicKey>({
  tree,
  windowKey,
  path,
}: {
  tree: MosaicNode<T>;
  windowKey: T;
  path: MosaicPath;
}) {
  const [tab, setTab] = useState<"output" | "input">("output");
  const [output, setOutput] =useState<string>("");
  const [input, setInput] =useState<string>("");

  return (
    <MosaicWindow<T>
      title="Terminal"
      className=""
      renderToolbar={() => (
        <div className="flex items-center p-2 w-full h-full text-sm bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-500">
          <CharmIcon icon={TerminalCharm} />
          <span className="pl-2">Terminal</span>
          <button
	    className={`rounded text-xs ml-2 px-1 hover:bg-gray-500/20 duration-300 ${
              tab === "output" ? "bg-gray-500/30" : ""
            }`}
            onClick={() => setTab("output")}
          >
            output
          </button>
          <button
            className={`rounded text-xs ml-2 px-1 hover:bg-gray-500/20 duration-300 ${
              tab === "input" ? "bg-gray-500/30" : ""
            }`}
            onClick={() => setTab("input")}
          >
            input
          </button>
        </div>
      )}
      path={path}
      draggable={true}
    >
      {tab === "input" ?
	<textarea
	    value={input}
	    onChange={(event) => setInput(event.target.value)}
	    className="w-full h-full p-4 bg-zinc-100 dark:bg-zinc-900 font-mono resize-none text-sm"
	  />
	: <textarea
	    value={output}
	    readOnly={true}
	    className="w-full h-full p-4 bg-zinc-100 dark:bg-zinc-900 font-mono resize-none text-sm"
	  />
      }
    </MosaicWindow>
  );
}
