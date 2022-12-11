import { InputHTMLAttributes, useState } from "react";

import "../index.css";

export default function Slider(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="h-full w-full flex">
      <input
        {...props}
        type="range"
        className="appearance-none w-full m-auto py-1 px-0.5 h-5 cursor-pointer bg-zinc-500/10 hover:bg-zinc-500/20 border border-zinc-500 duration-300 rounded-full focus:ring-zinc-500 focus:ring-2 thumb-zinc"
      />
    </div>
  );
}
