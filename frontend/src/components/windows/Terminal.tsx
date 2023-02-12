import { Info, Terminal as TerminalCharm } from "charm-icons";
import { useState } from "react";
import {
  MosaicNode,
  MosaicPath,
  MosaicWindow,
  getNodeAtPath,
} from "react-mosaic-component";
import Editor from "react-simple-code-editor";

import { Output } from "../../hooks/useWindows";
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
  outputState: State<Output[]>;
  tabState: State<"output" | "input">;
}) {
  const [tab, setTab] = tabState;
  const [input, setInput] = inputState;
  const [output, setOutput] = outputState;

  return (
    <MosaicWindow<T>
      title="Terminal"
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
      <div className="w-full h-full bg-zinc-100 dark:bg-zinc-900">
        {tab === "input" ? (
          <Editor
            value={input}
            highlight={(code) => {
              return (
                <pre className="text-left">
                  {code.split("\n").map((line, i) => (
                    <div
                      className="table table-fixed w-full duration-100 whitespace-pre-wrap"
                      key={i}
                    >
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
            className="font-mono text-sm bg-inherit w-full h-full"
            textareaClassName="!pl-10 outline-none"
            tabSize={4}
            placeholder={`Standard input can be specified before running e.g.
First Input
Second Input`}
          />
        ) : (
          <ul className="font-mono resize-none text-sm bg-inherit w-full h-full whitespace-pre-wrap overflow-auto">
            {output.map((line, i) => {
              return (
                <li key={i}>
                  {line.stdout ? (
                    <li className="px-2">{line.stdout}</li>
                  ) : (
                    <></>
                  )}
                  {line.stderr ? (
                    <li className="px-2 text-red-500 bg-red-500/10">
                      {line.stderr}
                    </li>
                  ) : (
                    <></>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </MosaicWindow>
  );
}
