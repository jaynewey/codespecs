import { Code as CodeCharm } from "charm-icons";
import Highlight, { Language, defaultProps } from "prism-react-renderer";
import { useContext, useEffect } from "react";
import {
  MosaicNode,
  MosaicPath,
  MosaicWindow,
  getNodeAtPath,
} from "react-mosaic-component";
import Editor from "react-simple-code-editor";

import ThemeContext from "../../contexts/ThemeContext";
import { codeMap } from "../../defaultPrograms";
import "../../index.css";
import CharmIcon from "../CharmIcon";
import { MosaicKey, Runtime, State, Window } from "./types";
import { runtimeName } from "./utils";

export const fileMap: { [key: string]: string } = {
  "python (via debugpy)": "main.py",
  "javascript (via node-debug2)": "main.js",
  "typescript (via node-debug2)": "main.ts",
  "c++ (via codelldb)": "main.cpp",
  "c (via codelldb)": "main.c",
  "rust (via codelldb)": "main.rs",
  "c# (via netcoredbg)": "Program.cs",
};

// TODO: figure out prism-react-renderer voodoo to get
//       additional languages e.g rust to work properly
export const languageMap: { [key: string]: Language } = {
  "python (via debugpy)": "python",
  "javascript (via node-debug2)": "javascript",
  "typescript (via node-debug2)": "typescript",
  "c++ (via codelldb)": "cpp",
  "c (via codelldb)": "c",
};

export default function Code<T extends MosaicKey>({
  path,
  sourceCodeState,
  runtimeState,
  highlightedState,
  isRunningState,
}: {
  path: MosaicPath;
  sourceCodeState: State<string>;
  runtimeState: State<Runtime | null>;
  highlightedState: State<number[]>;
  isRunningState: State<boolean>;
}) {
  const [sourceCode, setSourceCode] = sourceCodeState;
  const [runtime] = runtimeState;
  const [highlighted, setHighlighted] = highlightedState;
  const [isRunning] = isRunningState;

  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    setSourceCode(codeMap?.[runtime?.language ?? ""] ?? "");
  }, [runtime]);

  return (
    <MosaicWindow<T>
      title="Code"
      className=""
      renderToolbar={() => (
        <div className="flex items-center p-2 gap-x-2 w-full h-full text-sm bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-300 dark:border-zinc-800">
          <CharmIcon icon={CodeCharm} />
          {runtime !== null ? (
            <>
              <span className="font-mono">
                {fileMap[runtime.language] ?? ""}
              </span>
              <span className="text-xs text-zinc-500">
                {runtimeName(runtime)}
              </span>
            </>
          ) : (
            <span className="h-3 w-36 bg-zinc-500/20 animate-pulse rounded-full" />
          )}
        </div>
      )}
      path={path}
      draggable={isRunning}
    >
      <div className="w-full h-full bg-zinc-100 dark:bg-zinc-900 py-2 overflow-auto">
        <Editor
          value={sourceCode}
          onValueChange={(code) => {
            if (!isRunning) setSourceCode(code);
          }}
          highlight={(code) => {
            return (
              <Highlight
                {...defaultProps}
                code={code}
                language={languageMap[runtime?.language ?? ""] ?? "clike"}
              >
                {({ tokens, getLineProps, getTokenProps }) => (
                  <pre className="text-left">
                    {tokens.map((line, i) => (
                      <div
                        {...getLineProps({ line, key: i })}
                        style={{}}
                        className={`table table-fixed w-full duration-100 whitespace-pre-wrap ${
                          highlighted.includes(i + 1) ? "bg-blue-500/10" : ""
                        }`}
                      >
                        <div
                          className={`table-cell text-right w-8 select-none ${
                            highlighted.includes(i + 1)
                              ? "text-blue-700 dark:text-blue-300"
                              : "text-zinc-500"
                          }`}
                        >
                          {i + 1}
                        </div>
                        <div className="table-cell pl-4">
                          {line.map((token, key) => (
                            <span
                              {...getTokenProps({ token, key })}
                              style={{}}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </pre>
                )}
              </Highlight>
            );
          }}
          className="bg-zinc-100 dark:bg-zinc-900 font-mono text-sm"
          textareaClassName="!pl-12 outline-none"
          tabSize={4}
        />
      </div>
    </MosaicWindow>
  );
}
