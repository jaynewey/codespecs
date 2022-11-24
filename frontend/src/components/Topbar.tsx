import {
  ChevronDown,
  Code,
  Eye,
  Icon,
  LayoutList,
  MediaPlay,
  Moon,
  Sun,
  Terminal,
} from "charm-icons";
import { useContext, useEffect, useState } from "react";
import {
  MosaicNode,
  MosaicParent,
  createHideUpdate,
  getNodeAtPath,
  updateTree,
} from "react-mosaic-component";

import ThemeContext from "../contexts/ThemeContext";
import { WindowStates } from "../hooks/useWindows";
import "../index.css";
import CharmIcon from "./CharmIcon";
import Dropdown from "./Dropdown";
import IconButton from "./IconButton";
import { MosaicKey } from "./windows/types";
import { getPathToNode, isVisible } from "./windows/utils";

const API_ENDPOINT = import.meta.env.PROD
  ? "https://codespecs.tech/api"
  : "http://localhost:8081/api";

function ToggleWindowButton<T extends MosaicKey>({
  icon,
  windowKey,
  windows,
  setWindows,
}: {
  icon: Icon;
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
          const nodeAtPath = getNodeAtPath(
            windows,
            path.slice(0, path.length - 1)
          );
          if (nodeAtPath) {
            setSplitPercentage(
              (nodeAtPath as MosaicParent<MosaicKey>)?.splitPercentage ?? 50
            );
            setWindows(updateTree(windows, [createHideUpdate(path)]));
          }
        } else {
          setWindows(
            updateTree(windows, [
              {
                path: path.slice(0, path.length - 1),
                spec: {
                  splitPercentage: {
                    $set:
                      splitPercentage <= 0 || splitPercentage >= 100
                        ? 50
                        : splitPercentage,
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
  windowStates,
}: {
  windows: MosaicNode<string>;
  setWindows: (windows: MosaicNode<string>) => void;
  windowStates: WindowStates;
}) {
  const { theme, setTheme } = useContext(ThemeContext);
  const [languages, setLanguages] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>();

  useEffect(() => {
    fetch(`${API_ENDPOINT}/languages/`)
      .then((response) => response.json())
      .then((json) => {
        if (Array.isArray(json)) {
          setLanguages(json);
          setSelectedLanguage(json[0]);
        }
      });
  }, []);

  return (
    <div className="sticky shrink flex top-0 w-full border-b border-zinc-500 p-1 gap-x-1 z-50">
      <button
        onClick={() => {
          const [input, _] = windowStates.terminal.input;
          const [sourceCode, __] = windowStates.code.sourceCode;
          const [___, setTab] = windowStates.terminal.tab;
          const [____, setOutput] = windowStates.terminal.output;
          const [_____, setVariablesList] =
            windowStates.variables.variablesList;
          fetch(`${API_ENDPOINT}/run/`, {
            method: "POST",
            body: JSON.stringify({
              language: selectedLanguage,
              stdin: input,
              source_code: sourceCode,
            }),
          })
            .then((response) => response.json())
            .then((json) => {
              setTab("output");
              setOutput(json?.stdout ?? "");
              setVariablesList(json?.variables ?? []);
            });
          // set up windows
          setWindows({
            direction: "row",
            first: {
              direction: "column",
              first: "code",
              second: "animation",
              splitPercentage: 0,
            },
            second: {
              direction: "column",
              first: "terminal",
              second: "variables",
              splitPercentage: 30,
            },
            splitPercentage: 70,
          });
        }}
        disabled={!selectedLanguage}
        className={`flex content-center px-2 text-sm duration-300 border rounded ${
          selectedLanguage
            ? "bg-green-500/10 hover:bg-green-500/20 border-green-700 dark:border-green-300 text-green-700 dark:text-green-300"
            : "bg-zinc-500/20 border-zinc-500 animate-pulse cursor-not-allowed"
        }`}
      >
        <div className="pr-1 py-1">
          <CharmIcon icon={MediaPlay} />
        </div>
        <span className="pt-0.5">Run</span>
      </button>
      <div className="border-l border-zinc-500 mx-1" />
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
      <div className="flex ml-auto">
        <IconButton
          icon={theme === "light" ? Sun : Moon}
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        />
      </div>
      <Dropdown
        options={languages}
        selectedOption={selectedLanguage}
        setSelectedOption={setSelectedLanguage}
      >
        <button
          type="button"
          className={`flex px-2 content-center border border-zinc-500 rounded hover:bg-zinc-500/20 focus:ring-zinc-500 focus:ring-2 duration-300 ${
            selectedLanguage
              ? ""
              : "animate-pulse bg-zinc-500/20 cursor-not-allowed"
          }`}
          disabled={!selectedLanguage}
        >
          <span className="pt-0.5">{selectedLanguage ?? "Loading..."}</span>
          <div className="pl-1 py-1">
            <CharmIcon icon={ChevronDown} />
          </div>
        </button>
      </Dropdown>
    </div>
  );
}
