import { ReactElement } from "react";

export type Variable = {
  name: string;
  value: string;
  nativeType: string;
  likeType: string;
  attributes?: Variable[];
  indexes?: Variable[];
};

export type AnimationFactory = (variable: Variable) => ReactElement;
