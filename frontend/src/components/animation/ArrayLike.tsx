import { AnimationFactory, Variable } from "./types";

export default function ArrayLike({
  value,
  animationFactory,
}: {
  value: Variable;
  animationFactory: AnimationFactory;
}) {
  return (
    <div className="m-4">
      <p className="font-mono text-xs pb-1">
        {value.name}
        <span className="text-zinc-500">: {value.nativeType}</span>
      </p>
      <div className="flex flex-row w-auto border border-zinc-500 divide-x divide-zinc-500 rounded">
        {(value.indexes ?? []).map((v, i) => (
          <div
            key={i}
            className="p-3 px-4 flex shrink content-center bg-zinc-500/10"
          >
            {animationFactory(v)}
          </div>
        ))}
      </div>
    </div>
  );
}
