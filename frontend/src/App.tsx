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
import useAnimationPlayer from "./hooks/useAnimationPlayer";
import useWindows, { WindowStates } from "./hooks/useWindows";
import "./index.css";

function windowFactoryFactory(windowStates: WindowStates): WindowFactory {
  return (key, path) => {
    switch (key) {
      case "animation":
        return (
          <Animation
            path={path}
            runStateState={windowStates.animation.runState}
            selectedVariablesState={windowStates.variables.selectedVariables}
            variablesListState={windowStates.variables.variablesList}
          />
        );
      case "code":
        return (
          <Code
            path={path}
            sourceCodeState={windowStates.code.sourceCode}
            runtimeState={windowStates.code.runtime}
            highlightedState={windowStates.code.highlighted}
            isRunningState={windowStates.code.isRunning}
          />
        );
      case "terminal":
        return (
          <Terminal
            path={path}
            outputState={windowStates.terminal.output}
            errorState={windowStates.terminal.error}
          />
        );
      case "variables":
        return (
          <Variables
            path={path}
            selectedVariablesState={windowStates.variables.selectedVariables}
            variablesListState={windowStates.variables.variablesList}
            runtimeState={windowStates.code.runtime}
          />
        );
      default:
        return <></>;
    }
  };
}

export const defaultWindows: MosaicNode<string> = {
  direction: "row",
  first: {
    direction: "column",
    first: "code",
    second: "animation",
    splitPercentage: 100,
  },
  second: {
    direction: "column",
    first: "terminal",
    second: "variables",
    splitPercentage: 100,
  },
  splitPercentage: 100,
};

function App() {
  const [windows, setWindows] = useState<MosaicNode<string>>(defaultWindows);

  const windowStates = useWindows();
  const animationPlayer = useAnimationPlayer(windowStates);

  return (
    <ThemeProvider>
      <div className="flex flex-col h-screen bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200">
        <Topbar
          windows={windows}
          selectedRuntime={windowStates.code.runtime[0]}
          setSelectedRuntime={windowStates.code.runtime[1]}
          setWindows={setWindows}
          windowStates={windowStates}
          animationPlayer={animationPlayer}
        />
        <Windows
          windows={windows}
          setWindows={setWindows}
          windowFactory={windowFactoryFactory(windowStates)}
          resize={windowStates.code.isRunning[0]}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;
