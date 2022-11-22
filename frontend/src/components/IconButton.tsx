import {Icon} from "charm-icons"
import CharmIcon from "./CharmIcon"

export default function IconButton({icon, onClick = ()=>{}}: {icon: Icon, onClick: () => void}) {
  return (
      <button
	className="border border-zinc-500 rounded p-1 hover:bg-gray-500/20 duration-300"
        onClick={onClick}
      >
        <CharmIcon icon={icon} />
      </button>
  )
}
