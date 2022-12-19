import { Code as CodeCharm } from "charm-icons";
import Highlight, { Language, defaultProps } from "prism-react-renderer";
import { useContext, useState } from "react";
import {
  MosaicNode,
  MosaicPath,
  MosaicWindow,
  getNodeAtPath,
} from "react-mosaic-component";
import Editor from "react-simple-code-editor";

import ThemeContext from "../../contexts/ThemeContext";
import "../../index.css";
import CharmIcon from "../CharmIcon";
import { MosaicKey, State, Window } from "./types";

export const fileMap: { [key: string]: string } = {
  "Python (3.8.1)": "main.py",
  "Python (2.7.17)": "main.py",
  "JavaScript (Node.js 12.14.0)": "script.js",
  "Java (OpenJDK 13.0.1)": "Main.java",
};

export const languageMap: { [key: string]: Language } = {
  "Python (3.8.1)": "python",
  "Python (2.7.17)": "python",
  "JavaScript (Node.js 12.14.0)": "javascript",
  "Java (OpenJDK 13.0.1)": "javascript", // closest thing we have :)
};

export default function Code<T extends MosaicKey>({
  path,
  sourceCodeState,
  languageState,
  highlightedState,
}: {
  path: MosaicPath;
  sourceCodeState: State<string>;
  languageState: State<string | null>;
  highlightedState: State<number[]>;
}) {
  const [sourceCode, setSourceCode] = sourceCodeState;
  const [language, setLanguage] = languageState;
  const [highlighted, setHighlighted] = highlightedState;

  const { theme } = useContext(ThemeContext);

  return (
    <MosaicWindow<T>
      title="Code"
      className=""
      renderToolbar={() => (
        <div className="flex items-center p-2 gap-x-2 w-full h-full text-sm bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-300 dark:border-zinc-800">
          <CharmIcon icon={CodeCharm} />
          {language !== null ? (
            <>
              <span className="font-mono">{fileMap[language] ?? ""}</span>
              <span className="text-xs text-zinc-500">{language}</span>
            </>
          ) : (
            <span className="h-3 w-36 bg-zinc-500/20 animate-pulse rounded-full" />
          )}
        </div>
      )}
      path={path}
      draggable={true}
    >
      <div className="w-full h-full bg-zinc-100 dark:bg-zinc-900 py-2 overflow-auto">
        <Editor
          value={`l = [5, 2, 4, 1, 3]

for i in range(len(l) - 1):
    swapped = False
    for j in range(len(l) - i - 1):
        if l[j] > l[j + 1]:
            l[j], l[j + 1] = l[j + 1], l[j]
            swapped = True

    if not swapped:
        break`}
          onValueChange={(code) => setSourceCode(code)}
          highlight={(code) => {
            return (
              <Highlight
                {...defaultProps}
                code={code}
                language={languageMap[language ?? ""] ?? "clike"}
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
