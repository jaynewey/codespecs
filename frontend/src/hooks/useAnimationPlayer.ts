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

export const DEFAULT_INTERVAL = 1000;

export type AnimationPlayer = {
  setProgramTrace: (programTrace: ProgramTrace | null) => void;
  setAnimInterval: (animInterval: number) => void;
  setCurrentIndex: (currentIndex: number) => void;
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

      if (animInterval > 0) {
        const interval = setInterval(step, animInterval);

        return () => clearInterval(interval);
      }
    } else {
      const [, setHighlighted] = windowStates.code.highlighted;
      setHighlighted([]);
      const [, setSelectedVariable] = windowStates.variables.selectedVariable;
      setSelectedVariable(null);
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
    }
  }, [currentIndex]);

  return { setProgramTrace, setAnimInterval, setCurrentIndex };
}
