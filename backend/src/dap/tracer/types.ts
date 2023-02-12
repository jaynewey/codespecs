import { Language } from "../../languages";
import { Variable as DapVariable } from "../generated/debugAdapterProtocol";

export type Variable = {
  name: string;
  value: string;
  nativeType: string;
  likeType: string;
  attributes?: Variable[];
  indexes?: Variable[];
};

export type Line = {
  lineNumber: number;
  variables: Variable[];
  stdout?: string;
  stderr?: string;
};

export type ProgramTrace = {
  language: Language;
  lines: Line[];
};

export type VariableIncluder = (variable: DapVariable) => boolean;
