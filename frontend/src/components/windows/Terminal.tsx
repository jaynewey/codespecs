import { Info, Terminal as TerminalCharm } from "charm-icons";
import { useState } from "react";
import {
  MosaicNode,
  MosaicPath,
  MosaicWindow,
  getNodeAtPath,
} from "react-mosaic-component";
import Editor from "react-simple-code-editor";

import "../../index.css";
import CharmIcon from "../CharmIcon";
import { MosaicKey, State, Window } from "./types";

export default function Terminal<T extends MosaicKey>({
  path,
  inputState,
  outputState,
  tabState,
}: {
  path: MosaicPath;
  inputState: State<string>;
  outputState: State<string>;
  tabState: State<"output" | "input">;
}) {
  const [tab, setTab] = tabState;
  const [input, setInput] = inputState;
  const [output, setOutput] = outputState;

  return (
    <MosaicWindow<T>
      title="Terminal"
      className=""
      renderToolbar={() => (
        <div className="flex items-center p-2 w-full h-full text-sm bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-300 dark:border-zinc-800">
          <CharmIcon icon={TerminalCharm} />
          <button
            className={`rounded-full text-xs ml-2 px-2 hover:bg-zinc-500/20 duration-300 border ${
              tab === "input"
                ? "bg-zinc-500/30 border-zinc-500"
                : "border-hidden"
            }`}
            onClick={() => setTab("input")}
          >
            input
          </button>
          <button
            className={`rounded-full text-xs ml-1 px-2 hover:bg-zinc-500/20 duration-300 border ${
              tab === "output"
                ? "bg-zinc-500/30 border-zinc-500"
                : "border-hidden"
            }`}
            onClick={() => setTab("output")}
          >
            output
          </button>
        </div>
      )}
      path={path}
      draggable={true}
    >
      {tab === "input" ? (
        <Editor
          value={input}
          placeholder="Standard input for the program can be placed here..."
          highlight={(code) => {
            return (
              <pre className="text-left">
                {code.split("\n").map((line, i) => (
                  <div className="table table-fixed w-full duration-100 whitespace-pre-wrap">
                    <div className="table-cell text-right w-6 select-none text-zinc-500">
                      {input === "" ? (
                        <span className="flex justify-end">
                          <CharmIcon icon={Info} />
                        </span>
                      ) : (
                        i + 1
                      )}
                    </div>
                    <div className="table-cell pl-4">{line}</div>
                  </div>
                ))}
              </pre>
            );
          }}
          onValueChange={(code) => setInput(code)}
          className="w-full h-full bg-zinc-100 dark:bg-zinc-900 font-mono text-sm"
          textareaClassName="!pl-10 outline-none"
          tabSize={4}
        />
      ) : (
        <textarea
          value={output}
          readOnly={true}
          className="w-full h-full p-4 bg-zinc-100 dark:bg-zinc-900 font-mono resize-none text-sm"
        />
      )}
    </MosaicWindow>
  );
}
