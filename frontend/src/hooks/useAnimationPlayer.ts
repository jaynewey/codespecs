import { useEffect, useState } from "react";

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
const PAUSED_INTERVAL = 0;

export type AnimationPlayer = {
  programTrace: ProgramTrace | null;
  setProgramTrace: (programTrace: ProgramTrace | null) => void;
  setAnimInterval: (animInterval: number) => void;
  currentIndex: number;
  setCurrentIndex: (currentIndex: number) => void;
  isPaused: boolean;
};

export default function useAnimationPlayer(
  windowStates: WindowStates
): AnimationPlayer {
  const [programTrace, setProgramTrace] = useState<ProgramTrace | null>(null);
  const [animInterval, setAnimInterval] = useState<number>(DEFAULT_INTERVAL);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  useEffect(() => {
    if (programTrace) {
      const step = () => {
        if (!programTrace.lines.length) {
          return;
        }

        setCurrentIndex((i) => (i + 1) % programTrace.lines.length);
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
  }, [programTrace, animInterval]);

  useEffect(() => {
    if (programTrace) {
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
  };
}
