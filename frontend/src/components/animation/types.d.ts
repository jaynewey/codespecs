import { ReactElement } from "react";

export type Variable = {
  name: string;
  value: string;
  nativeType: string;
  likeType: string;
  children?: Variable[];
};

export type AnimationFactory = (variable: Variable) => ReactElement;
