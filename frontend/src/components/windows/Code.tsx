import { Code as CodeCharm } from "charm-icons";
import Highlight, { Language, defaultProps } from "prism-react-renderer";
import darkTheme from "prism-react-renderer/themes/nightOwl";
import lightTheme from "prism-react-renderer/themes/nightOwlLight";
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

const languageMap: { [key: string]: Language } = {
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
        <div className="flex items-center p-2 w-full h-full text-sm bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-500">
          <CharmIcon icon={CodeCharm} />
          <span className="pl-2">Code</span>
        </div>
      )}
      path={path}
      draggable={true}
    >
      <div className="w-full h-full bg-zinc-200 dark:bg-zinc-800 py-2 overflow-auto">
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
                theme={theme === "dark" ? darkTheme : lightTheme}
                code={code}
                language={languageMap[language ?? ""] ?? "clike"}
              >
                {({ tokens, getLineProps, getTokenProps }) => (
                  <pre className="text-left overflow-auto">
                    {tokens.map((line, i) => (
                      <div
                        {...getLineProps({ line, key: i })}
                        className={`table w-full duration-100 ${
                          highlighted.includes(i + 1) ? "bg-green-500/20" : ""
                        }`}
                      >
                        <div className="table-cell text-right w-8 select-none text-zinc-500">
                          {i + 1}
                        </div>
                        <div className="table-cell pl-4">
                          {line.map((token, key) => (
                            <span {...getTokenProps({ token, key })} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </pre>
                )}
              </Highlight>
            );
          }}
          className="bg-zinc-200 dark:bg-zinc-800 font-mono text-sm"
          textareaClassName="!ml-12 outline-none"
          tabSize={4}
        />
      </div>
    </MosaicWindow>
  );
}
