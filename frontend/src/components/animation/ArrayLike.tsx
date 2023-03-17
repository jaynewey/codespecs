import { AutoAnimationPlugin, getTransitionSizes } from "@formkit/auto-animate";
import { useAutoAnimate } from "@formkit/auto-animate/react";

import { AnimationFactory, Variable } from "./types";

const SCALE_FACTOR = 1.15;
const TRANSLATE_FACTOR = -0.15;

/**
 * Exemplary AutoAnimate plugin which accentuates the changes
 * in element positions by setting border and scaling moved objects.
 */
const autoAnimatePlugin: AutoAnimationPlugin = (
  el,
  action,
  oldCoords,
  newCoords
) => {
  let keyframes: Keyframe[] = [];
  if (action === "add") {
    keyframes = [
      { transform: "scale(0)", opacity: 0 },
      { transform: "scale(1.15)", opacity: 1, offset: 0.75 },
      { transform: "scale(1)", opacity: 1 },
    ];
  }
  if (action === "remove") {
    keyframes = [
      { transform: "scale(1)", opacity: 1 },
      { transform: "scale(1.15)", opacity: 1, offset: 0.33 },
      { transform: "scale(0.75)", opacity: 0.1, offset: 0.5 },
      { transform: "scale(0.5)", opacity: 0 },
    ];
  }
  if (action === "remain") {
    const deltaX = (oldCoords?.left ?? 0) - (newCoords?.left ?? 0);
    const deltaY = (oldCoords?.top ?? 0) - (newCoords?.top ?? 0);
    keyframes =
      deltaX === 0 && deltaY === 0
        ? []
        : [
            { transform: `translate(${deltaX}px, ${deltaY}px)` },
            {
              transform: `translate(${deltaX * TRANSLATE_FACTOR}px, ${
                deltaY * TRANSLATE_FACTOR
              }px) scale(${SCALE_FACTOR})`,

              // NOTE: Below applies tailwind classes "ring-2 ring-zinc-500" but
              //       this will not be dynamic if the tailwind config is changed
              boxShadow: "0 0 0 calc(2px) rgb(113 113 122)",

              borderColor: "transparent", // hide the dangling array left border
              borderRadius: "0.5rem",
            },
            { transform: "translate(0, 0)" },
          ];
  }

  return new KeyframeEffect(el, keyframes, {
    duration: 900,
    easing: "ease-out",
  });
};

export default function ArrayLike({
  value,
  animationFactory,
}: {
  value: Variable;
  animationFactory: AnimationFactory;
}) {
  const [parent, enableAnimations] =
    useAutoAnimate<HTMLDivElement>(autoAnimatePlugin);

  return (
    <div
      className="flex flex-row w-auto border border-zinc-500 divide-x divide-zinc-500 rounded"
      ref={parent}
    >
      {(value.indexes ?? []).map((v, i, indexes) => (
        <div
          key={`${v.value}-${
            indexes.slice(0, i).filter((v_) => v_.value == v.value).length
          }`}
          className="p-2 px-3 flex shrink content-center bg-zinc-500/10"
        >
          {animationFactory(v)}
        </div>
      ))}
    </div>
  );
}
