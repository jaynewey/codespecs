import { ReactNode } from "react";

import "../index.css";

// TODO: support more positions(?)
type Position = "bottom" | "bottom-right";

/*
 * Gets class(es) for tooltip to place in correct position
 */
function getPositionClass(position: Position): string {
  switch (position) {
    case "bottom":
      return "top-full left-1/2 -translate-x-1/2 mt-2";
    case "bottom-right":
      return "top-full right-0 mt-2 rounded-tr-none";
    default:
      return "";
  }
}

/**
 * Elements wrapped with this component will show a tooltip below it containing the given text.
 */
export default function Tooltip({
  text,
  position = "bottom",
  children,
}: {
  text: string;
  position?: Position;
  children: ReactNode;
}) {
  return (
    <div className="group relative">
      {children}
      <div
        className={`absolute flex whitespace-nowrap items-center content-center px-2 z-50
	    ${getPositionClass(position)}
	    invisible group-hover:visible
	    opacity-0 group-hover:opacity-100 transition-opacity duration-150 delay-700 ease-in-out
	    bg-zinc-200 dark:bg-zinc-800 border border-zinc-500 rounded-full text-xs select-none
	    `}
      >
        {text}
      </div>
    </div>
  );
}
