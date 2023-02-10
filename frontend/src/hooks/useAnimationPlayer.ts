import { useEffect, useState } from "react";
import { Dispatch, SetStateAction } from "react";

import { Variable } from "../components/animation/types";
import { State } from "../components/windows/types";
import { WindowStates } from "./useWindows";

export type Line = {
  lineNumber: number;
  variables: Variable[];
  stdout: string;
};

export type ProgramTrace = {
  language: string;
  lines: Line[];
};

export const DEFAULT_INTERVAL = 1500;
export const PAUSED_INTERVAL = 0;

export type AnimationPlayer = {
  programTrace: ProgramTrace | null;
  setProgramTrace: Dispatch<SetStateAction<ProgramTrace | null>>;
  setAnimInterval: (animInterval: number) => void;
  currentIndex: number;
  setCurrentIndex: (currentIndex: number) => void;
  isPaused: boolean;
  inProgress: boolean;
  setInProgress: Dispatch<SetStateAction<boolean>>;
};

export default function useAnimationPlayer(
  windowStates: WindowStates
): AnimationPlayer {
  const [inProgress, setInProgress] = useState<boolean>(false);
  const [programTrace, setProgramTrace] = useState<ProgramTrace | null>(null);
  const [animInterval, setAnimInterval] = useState<number>(DEFAULT_INTERVAL);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  useEffect(() => {
    if (inProgress) {
      const step = () => {
        setCurrentIndex((i) => i + 1);
      };

      if (animInterval > PAUSED_INTERVAL) {
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
  }, [inProgress, animInterval]);

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

      // if we are at last animation frame, pause
      if (currentIndex === programTrace.lines.length - 1) {
        setAnimInterval(PAUSED_INTERVAL);
      }
    }
  }, [currentIndex]);

  return {
    programTrace,
    setProgramTrace,
    setAnimInterval,
    currentIndex,
    setCurrentIndex,
    isPaused: animInterval === PAUSED_INTERVAL,
    inProgress,
    setInProgress,
  };
}
