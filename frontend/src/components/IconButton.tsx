import { Icon } from "charm-icons";
import { ButtonHTMLAttributes } from "react";

import CharmIcon from "./CharmIcon";

export default function IconButton(
  props: {
    icon: Icon;
  } & ButtonHTMLAttributes<HTMLElement>
) {
  return (
    <button
      {...props}
      className={`border border-zinc-500 rounded p-1.5 hover:bg-zinc-500/20 focus:ring-2 ring-zinc-500 duration-300 ${props.className}`}
    >
      <CharmIcon icon={props.icon} />
    </button>
  );
}
