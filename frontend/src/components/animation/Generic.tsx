import { useEffect, useState } from "react";

import { AnimationFactory, Variable } from "./types";

const DEFAULT_STYLE = {
  transform: "scale(1)",
  transition: "all .3s",
  background: "rgba(113, 113, 122, 0)",
};
const DURATION = 500;

export default function Generic({
  value,
  animationFactory,
  className,
}: {
  value: Variable;
  animationFactory: AnimationFactory;
  className?: string;
}) {
  const [style, setStyle] = useState(DEFAULT_STYLE);

  useEffect(() => {
    setStyle({
      ...DEFAULT_STYLE,
      ...{
        transform: "scale(1.25)",
        background: "rgba(113, 113, 122, 0.3)",
      },
    });
    const timer = setTimeout(() => {
      setStyle(DEFAULT_STYLE);
    }, DURATION);
    return () => clearTimeout(timer);
  }, [value.value]);

  return (
    <span
      style={style}
      className={`p-1 m-auto text-sm font-mono rounded ${className ?? ""}`}
    >
      {value.value}
    </span>
  );
}
