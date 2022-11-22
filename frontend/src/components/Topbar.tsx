import { Moon, Sun } from "charm-icons";
import { useContext } from "react";

import ThemeContext from "../contexts/ThemeContext";
import "../index.css";
import CharmIcon from "./CharmIcon";
import IconButton from "./IconButton";

export default function Topbar() {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <div className="sticky shrink top-0 w-full border-b border-zinc-500 p-1">
      <IconButton icon={theme === "light" ? Sun : Moon} onClick={() => setTheme(theme === "light" ? "dark" : "light")} />
    </div>
  );
}
