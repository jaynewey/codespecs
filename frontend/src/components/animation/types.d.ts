import { ReactElement } from "react";

export type Variable = {
  name: string;
  value: string;
  children?: Variable[];
};

export type AnimationFactory = (variable: Variable) => ReactElement;
