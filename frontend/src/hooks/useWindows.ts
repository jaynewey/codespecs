import { useState } from "react";

import { Variable } from "../components/animation/types";
import { State } from "../components/windows/types";

export type WindowStates = {
  animation: {
    selectedVariable: State<Variable | null>;
  };
  code: {
    sourceCode: State<string>;
    language: State<string | null>;
  };
  terminal: {
    input: State<string>;
    output: State<string>;
    tab: State<"output" | "input">;
  };
  variables: {
    selectedVariable: State<Variable | null>;
    variablesList: State<Variable[]>;
  };
};

export default function useWindows(): WindowStates {
  return {
    animation: {
      selectedVariable: useState(null),
    },
    code: {
      sourceCode: useState<string>(""),
      language: useState(null),
    },
    terminal: {
      input: useState<string>(""),
      output: useState<string>(""),
      tab: useState("input"),
    },
    variables: {
      selectedVariable: useState(null),
      variablesList: useState([]),
    },
  };
}
