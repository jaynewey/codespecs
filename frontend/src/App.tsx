import { useEffect, useState } from "react";
import { ThemeProvider } from "./contexts/ThemeContext";

import "./index.css";
import Topbar from "./components/Topbar"
import Windows from "./components/Windows"

function App() {

  return (
    <ThemeProvider>
      <div className="flex flex-col h-screen bg-zinc-100 dark:bg-zinc-900 dark:text-white">
	<Topbar/>
	<Windows />
      </div>
    </ThemeProvider>
  );
}

export default App;
