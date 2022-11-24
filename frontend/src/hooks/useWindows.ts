import { useState } from "react";

import { State } from "../components/windows/types";

export type WindowStates = {
  animation: {};
  code: {
    sourceCode: State<string>;
  };
  terminal: {
    input: State<string>;
    output: State<string>;
  };
  variables: {};
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
    },
    variables: {},
  };
}
