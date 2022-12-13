import {
  ChevronDown,
  Code,
  Glasses,
  Icon,
  LayoutList,
  LightningBolt,
  MediaPause,
  MediaPlay,
  Moon,
  Rocket,
  RotateClockwise,
  Square,
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

import { defaultWindows } from "../App";
import ThemeContext from "../contexts/ThemeContext";
import {
  AnimationPlayer,
  DEFAULT_INTERVAL,
  ProgramTrace,
} from "../hooks/useAnimationPlayer";
import { WindowStates } from "../hooks/useWindows";
import "../index.css";
import CharmIcon from "./CharmIcon";
import Dropdown from "./Dropdown";
import IconButton from "./IconButton";
import Slider from "./Slider";
import { MosaicKey } from "./windows/types";
import { getPathToNode, isVisible } from "./windows/utils";

const API_ENDPOINT = import.meta.env.PROD
  ? "https://codespecs.tech/api"
  : "http://localhost:8081/api";

const MIN_PLAY_SPEED = 0.25;
const MAX_PLAY_SPEED = 2;
const PLAY_SPEED_STEP = 0.25;

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
  selectedLanguage,
  setSelectedLanguage,
  windowStates,
  animationPlayer,
}: {
  windows: MosaicNode<string>;
  setWindows: (windows: MosaicNode<string>) => void;
  selectedLanguage: string | null;
  setSelectedLanguage: (language: string | null) => void;
  windowStates: WindowStates;
  animationPlayer: AnimationPlayer;
}) {
  const { theme, setTheme } = useContext(ThemeContext);
  const { setProgramTrace, setAnimInterval, setCurrentIndex, isPaused } =
    animationPlayer;
  const [playSpeed, setPlaySpeed] = useState<number>(1);
  const [languages, setLanguages] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const togglePause = () =>
    setAnimInterval(isPaused ? DEFAULT_INTERVAL / playSpeed : 0);

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
    <div className="sticky shrink flex top-0 w-full border-b border-zinc-300 dark:border-zinc-800 p-2 gap-x-2 z-50">
      <button
        onClick={() => {
          const [input, _] = windowStates.terminal.input;
          const [sourceCode, __] = windowStates.code.sourceCode;
          const [___, setTab] = windowStates.terminal.tab;
          const [____, setOutput] = windowStates.terminal.output;

          if (!isRunning) {
            fetch(`${API_ENDPOINT}/run/`, {
              method: "POST",
              body: JSON.stringify({
                language: selectedLanguage ?? "",
                stdin: input,
                source_code: sourceCode,
              }),
            })
              .then((response) => response.json())
              .then((json) => {
                setTab("output");
                setOutput(json?.stdout ?? "");
                setProgramTrace(json as ProgramTrace);
              });

            // set up windows
            setWindows({
              direction: "row",
              first: {
                direction: "row",
                first: "code",
                second: "animation",
                splitPercentage: 50,
              },
              second: {
                direction: "column",
                first: "terminal",
                second: "variables",
                splitPercentage: 30,
              },
              splitPercentage: 70,
            });
          } else {
            // reset windows to default
            setWindows(defaultWindows);
            setProgramTrace(null);
          }

          setIsRunning(!isRunning);
        }}
        disabled={!selectedLanguage}
        className={`flex content-center px-2 text-sm duration-300 border rounded hover:shadow-md focus:ring-2 ${
          selectedLanguage
            ? isRunning
              ? "bg-red-500/10 hover:bg-red-500/20 border-red-700 dark:border-red-300 text-red-700 dark:text-red-300 hover:shadow-red-500 ring-red-500"
              : "bg-green-500/10 hover:bg-green-500/20 border-green-700 dark:border-green-300 text-green-700 dark:text-green-300 hover:shadow-green-500 ring-green-500"
            : "bg-zinc-500/20 border-zinc-500 animate-pulse cursor-not-allowed"
        }`}
      >
        <div className="pr-1 py-1.5">
          {isRunning ? (
            <CharmIcon icon={Square} />
          ) : (
            <CharmIcon icon={Rocket} />
          )}
        </div>
        <span className="pt-1">{isRunning ? "Stop" : "Run"}</span>
      </button>
      {isRunning ? (
        <>
          <button
            className={`flex content-center text-sm duration-300 border rounded hover:shadow-md focus:ring-2 ${
              isPaused
                ? "bg-green-500/10 hover:bg-green-500/20 border-green-700 dark:border-green-300 text-green-700 dark:text-green-300 hover:shadow-green-500 ring-green-500"
                : "bg-amber-500/10 hover:bg-amber-500/20 border-amber-700 dark:border-amber-300 text-amber-700 dark:text-amber-300 hover:shadow-amber-500 ring-amber-500"
            }`}
            onClick={() => togglePause()}
          >
            <div className="p-1.5">
              <CharmIcon icon={isPaused ? MediaPlay : MediaPause} />
            </div>
          </button>

          <button
            className="flex content-center text-sm duration-300 border rounded bg-blue-500/10 hover:bg-blue-500/20 border-blue-700 dark:border-blue-300 text-blue-700 dark:text-blue-300 hover:shadow-md hover:shadow-blue-500 focus:ring-2 ring-blue-500"
            onClick={() => {
              setCurrentIndex(0);
            }}
          >
            <div className="p-1.5">
              <CharmIcon icon={RotateClockwise} />
            </div>
          </button>

          <div className="flex gap-1 px-2 align-middle">
            <div className="flex py-1 m-auto">
              <CharmIcon icon={LightningBolt} />
              <span className="text-xs">-</span>
            </div>
            <div className="w-24">
              <Slider
                value={playSpeed}
                onChange={(event) => {
                  setPlaySpeed(event.target.valueAsNumber);
                  setAnimInterval(
                    DEFAULT_INTERVAL / event.target.valueAsNumber
                  );
                }}
                min={MIN_PLAY_SPEED}
                max={MAX_PLAY_SPEED}
                step={PLAY_SPEED_STEP}
              />
            </div>
            <div className="flex py-1 m-auto">
              <CharmIcon icon={LightningBolt} />
              <span className="text-xs">+</span>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
      <div className="flex ml-auto">
        <IconButton
          icon={theme === "light" ? Sun : Moon}
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        />
      </div>
      <Dropdown
        options={languages}
        selectedOption={selectedLanguage ?? ""}
        setSelectedOption={setSelectedLanguage}
      >
        <button
          type="button"
          className={`flex px-2 py-0.5 content-center border border-zinc-500 rounded hover:bg-zinc-500/20 focus:ring-zinc-500 focus:ring-2 duration-300 ${
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
