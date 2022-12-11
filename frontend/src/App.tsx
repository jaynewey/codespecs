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
            selectedVariableState={windowStates.variables.selectedVariable}
            variablesListState={windowStates.variables.variablesList}
          />
        );
      case "code":
        return (
          <Code
            path={path}
            sourceCodeState={windowStates.code.sourceCode}
            languageState={windowStates.code.language}
            highlightedState={windowStates.code.highlighted}
          />
        );
      case "terminal":
        return (
          <Terminal
            path={path}
            inputState={windowStates.terminal.input}
            outputState={windowStates.terminal.output}
            tabState={windowStates.terminal.tab}
          />
        );
      case "variables":
        return (
          <Variables
            path={path}
            selectedVariableState={windowStates.variables.selectedVariable}
            variablesListState={windowStates.variables.variablesList}
            languageState={windowStates.code.language}
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
  splitPercentage: 70,
};

function App() {
  const [windows, setWindows] = useState<MosaicNode<string>>(defaultWindows);

  const windowStates = useWindows();
  const animationPlayer = useAnimationPlayer(windowStates);

  return (
    <ThemeProvider>
      <div className="flex flex-col h-screen bg-zinc-100 dark:bg-zinc-900 dark:text-white">
        <Topbar
          windows={windows}
          selectedLanguage={windowStates.code.language[0]}
          setSelectedLanguage={windowStates.code.language[1]}
          setWindows={setWindows}
          windowStates={windowStates}
          animationPlayer={animationPlayer}
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
