import { useEffect, useState } from "react";
import { Dispatch, SetStateAction } from "react";

import { Variable } from "../components/animation/types";
import { WindowStates } from "./useWindows";

export type Line = {
  lineNumber: number;
  variables: Variable[];
  stdout?: string;
  stderr?: string;
};

export type ProgramTrace = {
  language: string;
  lines: Line[];
};

export const DEFAULT_INTERVAL = 1500;
export const PAUSED_INTERVAL = 0;

export type AnimationPlayer = {
  setAnimInterval: (animInterval: number) => void;
  isPaused: boolean;
  inProgress: boolean;
  setInProgress: Dispatch<SetStateAction<boolean>>;
};

export default function useAnimationPlayer(
  windowStates: WindowStates
): AnimationPlayer {
  const [inProgress, setInProgress] = useState<boolean>(false);
  const [animInterval, setAnimInterval] = useState<number>(DEFAULT_INTERVAL);

  const [runState, setRunState] = windowStates.animation.runState;
  const [programTrace] = windowStates.animation.programTrace;
  const [currentIndex, setCurrentIndex] = windowStates.animation.currentIndex;

  useEffect(() => {
    if (inProgress) {
      const step = () => {
        setCurrentIndex((i: number) => i + 1);
      };

      if (
        animInterval > PAUSED_INTERVAL &&
        !["coding", "compiling", "tracing"].includes(runState)
      ) {
        const interval = setInterval(step, animInterval);

        return () => clearInterval(interval);
      }
    } else {
      const [, setHighlighted] = windowStates.code.highlighted;
      setHighlighted([]);
      const [, setSelectedVariables] = windowStates.variables.selectedVariables;
      setSelectedVariables([]);
      const [, setVariablesList] = windowStates.variables.variablesList;
      setVariablesList([]);
    }
  }, [inProgress, animInterval, runState]);

  useEffect(() => {
    if (programTrace && (programTrace?.lines ?? []).length) {
      if (currentIndex >= programTrace.lines.length) {
        setCurrentIndex(0);
        return;
      }

      const [, setHighlighted] = windowStates.code.highlighted;
      setHighlighted([programTrace.lines[currentIndex].lineNumber]);

      const [, setVariablesList] = windowStates.variables.variablesList;
      setVariablesList(programTrace.lines[currentIndex].variables);

      const [, setOutput] = windowStates.terminal.output;
      setOutput(
        programTrace.lines
          .map((line) => {
            return { stdout: line.stdout, stderr: line.stderr };
          })
          .slice(0, currentIndex + 1)
      );

      // if we are at last animation frame, pause
      if (currentIndex >= programTrace.lines.length - 1) {
        if (runState !== "traced") {
          if (runState === "playing") {
            setRunState("tracing");
          }
        } else {
          setAnimInterval(PAUSED_INTERVAL);
        }
      } else {
        if (runState === "tracing") {
          setRunState("playing");
        }
      }
    }
  }, [currentIndex, programTrace]);

  return {
    setAnimInterval,
    isPaused: animInterval === PAUSED_INTERVAL,
    inProgress,
    setInProgress,
  };
}
