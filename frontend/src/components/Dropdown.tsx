import { ReactNode } from "react";

import "../index.css";

export default function Dropdown<T>({
  options,
  selectedOption,
  setSelectedOption,
  optionToString,
  children,
}: {
  options: T[];
  selectedOption?: T;
  setSelectedOption: (option: T) => void;
  optionToString: (option: T) => string;
  children: ReactNode;
}) {
  return (
    <div className="relative group text-sm">
      {children}
      <ul className="absolute flex flex-col top-full right-0 mt-2 p-2 gap-y-1 invisible border border-zinc-500 group-focus-within:visible opacity-0 group-focus-within:opacity-100 -translate-y-1 group-focus-within:translate-y-0 duration-100 overflow-hidden rounded bg-zinc-100 dark:bg-zinc-900">
        {options.map((option, i) => (
          <li
            key={i}
            className={`p-1 flex hover:bg-zinc-500/20 ${
              selectedOption === option ? "bg-zinc-500/30" : ""
            } duration-300 rounded whitespace-nowrap cursor-pointer`}
            onClick={() => setSelectedOption(option)}
          >
            {optionToString(option)}
          </li>
        ))}
      </ul>
    </div>
  );
}
