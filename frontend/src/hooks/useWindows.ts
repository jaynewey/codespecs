import { useState } from "react";

import { Variable } from "../components/animation/types";
import { State } from "../components/windows/types";
import { Runtime } from "../components/windows/types";

export type Output = {
  stdout: string;
  stderr: string;
};

export type WindowStates = {
  animation: {};
  code: {
    sourceCode: State<string>;
    runtime: State<Runtime | null>;
    highlighted: State<number[]>;
    isRunning: State<boolean>;
  };
  terminal: {
    input: State<string>;
    output: State<Output[]>;
    error: State<string>;
    tab: State<"output" | "input">;
  };
  variables: {
    selectedVariables: State<string[]>;
    variablesList: State<Variable[]>;
  };
};

export default function useWindows(): WindowStates {
  return {
    animation: {},
    code: {
      sourceCode: useState<string>(""),
      runtime: useState(null),
      highlighted: useState([]),
      isRunning: useState(false),
    },
    terminal: {
      input: useState<string>(""),
      output: useState<Output[]>([]),
      error: useState<string>(""),
      tab: useState("input"),
    },
    variables: {
      selectedVariables: useState([]),
      variablesList: useState([]),
    },
  };
}
