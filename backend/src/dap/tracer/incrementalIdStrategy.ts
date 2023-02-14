import { Id, IdStrategy } from "./types";

export function generateIncrementalIdStrategy(): IdStrategy {
  const seenIds = new Map<string, Id>();
  let increment = 0;

  return (variable) => {
    if (!variable.evaluateName) return -1;
    seenIds.set(
      variable.evaluateName,
      seenIds.get(variable.evaluateName) ?? increment++
    );
    return seenIds.get(variable.evaluateName) ?? -1;
  };
}
