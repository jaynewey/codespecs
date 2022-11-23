import { useEffect, useState } from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import {MosaicNode} from "react-mosaic-component"

import "./index.css";
import Topbar from "./components/Topbar"
import Windows from "./components/Windows"

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

  return (
    <ThemeProvider>
      <div className="flex flex-col h-screen bg-zinc-100 dark:bg-zinc-900 dark:text-white">
	<Topbar windows={windows} setWindows={setWindows}/>
	<Windows windows={windows} setWindows={setWindows} />
      </div>
    </ThemeProvider>
  );
}

export default App;
