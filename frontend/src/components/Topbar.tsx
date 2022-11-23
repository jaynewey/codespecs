import {
  ChevronDown,
  Code,
  Eye,
  LayoutList,
  Moon,
  Sun,
  Terminal,
} from "charm-icons";
import { useContext, useEffect, useState } from "react";
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

const API_ENDPOINT =
  process.env.NODE_ENV === "production"
    ? "https://codespecs.tech/api"
    : "http://localhost:8081/api";

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
  const [languages, setLanguages] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>();

  useEffect(() => {
    fetch(`${API_ENDPOINT}/languages/`)
      .then((response) => response.json())
      .then((json) => {
        setLanguages(json);
        setSelectedLanguage(languages[0]);
      });
  }, []);

  return (
    <div className="sticky shrink flex top-0 w-full border-b border-zinc-500 p-1 gap-x-1 z-50">
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
      <div className="ml-auto">
        <IconButton
          icon={theme === "light" ? Sun : Moon}
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        />
      </div>
      <div className="relative group text-sm">
        <button
          type="button"
          className={`flex px-2 content-center border border-zinc-500 rounded hover:bg-zinc-500/20 focus:ring-zinc-500 focus:ring-2 duration-300 ${
            selectedLanguage ? "" : "animate-pulse bg-zinc-500/20"
          }`}
          disabled={!selectedLanguage}
        >
          <span className="pt-0.5">{selectedLanguage ?? "Loading..."}</span>
          <div className="pl-1 py-1">
            <CharmIcon icon={ChevronDown} />
          </div>
        </button>
        <ul className="absolute flex flex-col top-full right-0 mt-2 p-2 gap-y-1 invisible border border-zinc-500 group-focus-within:visible opacity-0 group-focus-within:opacity-100 -translate-y-1 group-focus-within:translate-y-0 duration-100 overflow-hidden rounded bg-zinc-100 dark:bg-zinc-900">
          {languages.map((language, i) => (
            <li
              key={i}
              className={`p-1 flex hover:bg-zinc-500/20 ${
                selectedLanguage === language ? "bg-zinc-500/30" : ""
              } duration-300 rounded whitespace-nowrap cursor-pointer`}
            >
              <a
                className="w-full text-left"
                onClick={() => setSelectedLanguage(language)}
              >
                {language}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
