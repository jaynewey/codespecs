import { useAutoAnimate } from "@formkit/auto-animate/react";

import { AnimationFactory, Variable } from "./types";

export default function ArrayLike({
  value,
  animationFactory,
}: {
  value: Variable;
  animationFactory: AnimationFactory;
}) {
  const [parent, enableAnimations] = useAutoAnimate<HTMLDivElement>();

  return (
    <div
      className="flex flex-row w-auto border border-zinc-500 divide-x divide-zinc-500 rounded"
      ref={parent}
    >
      {(value.indexes ?? []).map((v, i) => (
        <div
          key={v.value}
          className="p-3 px-4 flex shrink content-center bg-zinc-500/10"
        >
          {animationFactory(v)}
        </div>
      ))}
    </div>
  );
}
