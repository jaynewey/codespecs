import { ReactElement } from "react";

export type Id = string | number;

export type Variable = {
  id: Id;
  name: string;
  value: string;
  nativeType: string;
  likeType: string;
  attributes?: Variable[];
  indexes?: Variable[];
};

export type AnimationFactory = (variable: Variable) => ReactElement;
