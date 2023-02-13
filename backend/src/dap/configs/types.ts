import { Language } from "../../languages";
import { VariableIncluder } from "../tracer/types";

export type Config = {
  adapterCommand: string;
  codePath: string;
  programPath?: string;
  language: Language;
  includer: VariableIncluder;
  entrypoint?: number;
};
