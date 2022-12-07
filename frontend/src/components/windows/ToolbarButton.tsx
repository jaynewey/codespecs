import { MouseEventHandler, ReactNode } from "react";

export default function ToolbarButton({
  className = "",
  onClick = () => {},
  children,
}: {
  className?: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
}) {
  return (
    <button
      className={`flex hover:bg-zinc-500/20 hover:text-inherit rounded-full p-0.5 duration-300 ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
