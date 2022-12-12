import { useState } from "react";

import { Variable } from "../components/animation/types";
import { State } from "../components/windows/types";

export type WindowStates = {
  animation: {};
  code: {
    sourceCode: State<string>;
    language: State<string | null>;
    highlighted: State<number[]>;
  };
  terminal: {
    input: State<string>;
    output: State<string>;
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
      language: useState(null),
      highlighted: useState([]),
    },
    terminal: {
      input: useState<string>(""),
      output: useState<string>(""),
      tab: useState("input"),
    },
    variables: {
      selectedVariables: useState([]),
      variablesList: useState([]),
    },
  };
}
