import { Code as CodeCharm } from "charm-icons";
import Highlight, { Language, defaultProps } from "prism-react-renderer";
import theme from "prism-react-renderer/themes/nightOwl";
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
}: {
  path: MosaicPath;
  sourceCodeState: State<string>;
  languageState: State<string | null>;
}) {
  const [sourceCode, setSourceCode] = sourceCodeState;
  const [language, setLanguage] = languageState;
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
          value={sourceCode}
          onValueChange={(code) => setSourceCode(code)}
          highlight={(code) => {
            return (
              <Highlight
                {...defaultProps}
                theme={theme}
                code={code}
                language={languageMap[language ?? ""] ?? "clike"}
              >
                {({ tokens, getLineProps, getTokenProps }) => (
                  <pre className="text-left overflow-auto">
                    {tokens.map((line, i) => (
                      <div
                        {...getLineProps({ line, key: i })}
                        className="table"
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
          textareaClassName="!ml-12"
          tabSize={4}
        />
      </div>
    </MosaicWindow>
  );
}
