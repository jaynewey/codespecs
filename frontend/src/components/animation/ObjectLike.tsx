import { AnimationFactory, Variable } from "./types";

export default function ObjectLike({
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
      <div className="flex flex-col w-fit border border-zinc-500 divide-y divide-zinc-500 rounded bg-zinc-500/10">
        {(value.attributes ?? []).map((v, i) => (
          <div key={i}>
            <div className="flex p-3 w-fit px-4 content-center divide-x divide-zinc-500">
              <span className="m-auto content-center">{v.name}</span>
              <div className="p-1 ml-3 pl-3 content-center">
                {animationFactory(v)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
