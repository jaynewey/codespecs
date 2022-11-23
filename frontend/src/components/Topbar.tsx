import { Code, Eye, LayoutList, Moon, Sun, Terminal } from "charm-icons";
import { useContext, useState } from "react";
import {
  MosaicKey,
  createExpandUpdate,
  createHideUpdate,
  getNodeAtPath,
  updateTree,
} from "react-mosaic-component";

import ThemeContext from "../contexts/ThemeContext";
import "../index.css";
import CharmIcon from "./CharmIcon";
import IconButton from "./IconButton";
import { getPathToNode, isVisible } from "./Windows";

function ToggleWindowButton<T extends MosaicKey>({
  icon,
  windowKey,
  windows,
  setWindows,
}: {
  icon: CharmIcon;
  windowKey: T;
  windows: MosaicNode<T>;
  setWindows: (windows: MosaicNode<T>) => void;
}) {
  const [splitPercentage, setSplitPercentage] = useState<number>(0);

  return (
    <IconButton
      icon={icon}
      className={
        isVisible(windows, getPathToNode(windows, windowKey))
          ? "bg-gray-500/30"
          : ""
      }
      onClick={() => {
        const path = getPathToNode(windows, windowKey);
        if (isVisible(windows, path)) {
          setSplitPercentage(
            getNodeAtPath(windows, path.slice(0, path.length - 1))
              ?.splitPercentage ?? 50
          );
          setWindows(updateTree(windows, [createHideUpdate(path)]));
        } else {
          setWindows(
            updateTree(windows, [
              {
                path: path.slice(0, path.length - 1),
                spec: {
                  splitPercentage: {
                    $set: splitPercentage <= 0 ? 50 : splitPercentage,
                  },
                },
              },
            ])
          );
        }
      }}
    />
  );
}

export default function Topbar({
  windows,
  setWindows,
}: {
  windows: MosaicNode<string>;
  setWindows: (windows: MosaicNode<string>) => void;
}) {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <div className="sticky shrink flex top-0 w-full border-b border-zinc-500 p-1 space-x-1">
      <ToggleWindowButton
        icon={Eye}
        windowKey="animation"
        windows={windows}
        setWindows={setWindows}
      />
      <ToggleWindowButton
        icon={Code}
        windowKey="code"
        windows={windows}
        setWindows={setWindows}
      />
      <ToggleWindowButton
        icon={Terminal}
        windowKey="terminal"
        windows={windows}
        setWindows={setWindows}
      />
      <ToggleWindowButton
        icon={LayoutList}
        windowKey="variables"
        windows={windows}
        setWindows={setWindows}
      />
      <div className="border-l border-zinc-500" />
      <IconButton
        icon={theme === "light" ? Sun : Moon}
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      />
    </div>
  );
}
