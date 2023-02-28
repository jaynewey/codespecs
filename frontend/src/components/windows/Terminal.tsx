import { Info, Terminal as TerminalCharm } from "charm-icons";
import { MosaicPath, MosaicWindow } from "react-mosaic-component";

import { Output } from "../../hooks/useWindows";
import "../../index.css";
import CharmIcon from "../CharmIcon";
import { MosaicKey, State } from "./types";

export default function Terminal<T extends MosaicKey>({
  path,
  outputState,
  errorState,
}: {
  path: MosaicPath;
  outputState: State<Output[]>;
  errorState: State<string>;
}) {
  const [output] = outputState;
  const [error] = errorState;

  return (
    <MosaicWindow<T>
      title="Output"
      renderToolbar={() => (
        <div className="flex items-center p-2 w-full h-full text-sm bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-300 dark:border-zinc-800">
          <CharmIcon icon={TerminalCharm} />
          <span className="pl-2">Output</span>
        </div>
      )}
      path={path}
      draggable={true}
    >
      <div className="w-full h-full bg-zinc-100 dark:bg-zinc-900">
        <div className="font-mono resize-none text-sm bg-inherit w-full h-full whitespace-pre-wrap overflow-y-auto break-all">
          <div className="px-2 text-red-500 bg-red-500/10">{error}</div>
          {output.map((line, i) => {
            return (
              <ul key={i}>
                {line.stdout ? <li className="px-2">{line.stdout}</li> : <></>}
                {line.stderr ? (
                  <li className="px-2 text-red-500 bg-red-500/10">
                    {line.stderr}
                  </li>
                ) : (
                  <></>
                )}
              </ul>
            );
          })}
        </div>
      </div>
    </MosaicWindow>
  );
}
