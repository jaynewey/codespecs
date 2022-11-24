import { useState } from "react";

import { Variable } from "../components/windows/Variables";
import { State } from "../components/windows/types";

export type WindowStates = {
  animation: {};
  code: {
    sourceCode: State<string>;
  };
  terminal: {
    input: State<string>;
    output: State<string>;
    tab: State<"output" | "input">;
  };
  variables: {
    variablesList: State<Variable[]>;
  };
};

export default function useWindows(): WindowStates {
  return {
    animation: {},
    code: {
      sourceCode: useState<string>(""),
    },
    terminal: {
      input: useState<string>(""),
      output: useState<string>(""),
      tab: useState("input"),
    },
    variables: {
      variablesList: useState([]),
    },
  };
}
