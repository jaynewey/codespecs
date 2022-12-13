import { Icon } from "charm-icons";

import CharmIcon from "./CharmIcon";

export default function IconButton({
  icon,
  onClick = () => {},
  className = "",
}: {
  icon: Icon;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      className={`border border-zinc-500 rounded p-1.5 hover:bg-gray-500/20 focus:ring-2 ring-zinc-500 duration-300 ${className}`}
      onClick={onClick}
    >
      <CharmIcon icon={icon} />
    </button>
  );
}
