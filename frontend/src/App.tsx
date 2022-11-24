import { ReactElement, useEffect, useState } from "react";
import { MosaicNode, MosaicPath } from "react-mosaic-component";

import Topbar from "./components/Topbar";
import Windows from "./components/Windows";
import Animation from "./components/windows/Animation";
import Code from "./components/windows/Code";
import Terminal from "./components/windows/Terminal";
import Variables from "./components/windows/Variables";
import { MosaicKey, WindowFactory } from "./components/windows/types";
import { ThemeProvider } from "./contexts/ThemeContext";
import useWindows, { WindowStates } from "./hooks/useWindows";
import "./index.css";

function windowFactoryFactory(windowStates: WindowStates): WindowFactory {
  return (key, path) => {
    switch (key) {
      case "animation":
        return <Animation path={path} />;
      case "code":
        return (
          <Code path={path} sourceCodeState={windowStates.code.sourceCode} />
        );
      case "terminal":
        return (
          <Terminal
            path={path}
            inputState={windowStates.terminal.input}
            outputState={windowStates.terminal.output}
          />
        );
      case "variables":
        return <Variables path={path} />;
      default:
        return <></>;
    }
  };
}

function App() {
  const [windows, setWindows] = useState<MosaicNode<string>>({
    direction: "row",
    first: {
      direction: "column",
      first: "animation",
      second: "terminal",
      splitPercentage: 60,
    },
    second: {
      direction: "column",
      first: "code",
      second: "variables",
      splitPercentage: 50,
    },
    splitPercentage: 60,
  });

  const windowStates = useWindows();

  return (
    <ThemeProvider>
      <div className="flex flex-col h-screen bg-zinc-100 dark:bg-zinc-900 dark:text-white">
        <Topbar
          windows={windows}
          setWindows={setWindows}
          windowStates={windowStates}
        />
        <Windows
          windows={windows}
          setWindows={setWindows}
          windowFactory={windowFactoryFactory(windowStates)}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;
