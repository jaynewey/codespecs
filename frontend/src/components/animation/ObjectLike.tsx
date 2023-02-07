import { AnimationFactory, Variable } from "./types";

export default function ObjectLike({
  value,
  animationFactory,
}: {
  value: Variable;
  animationFactory: AnimationFactory;
}) {
  return <span className="text-sm font-mono">{value.value}</span>;
}
