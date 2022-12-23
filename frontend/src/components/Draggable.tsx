import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { State, Vector2d } from "./types";

export const DragContext = createContext<{
  cursorPosition: Vector2d | null; // is null when the cursor is not in the DragArea
  zoom: number;
}>({
  cursorPosition: null,
  zoom: 1,
});

/*
 * Area which `Draggables` can be dragged around in.
 * Exposes a Drag Context which can be consumed by draggables.
 */
export function DragArea({
  zoom,
  className,
  children,
}: {
  zoom?: number;
  className?: string;
  children: ReactNode;
}) {
  const [cursorPosition, setCursorPosition] = useState<Vector2d | null>(null);

  return (
    <div
      className={className ?? ""}
      onMouseMove={(event) =>
        setCursorPosition({ x: event.clientX, y: event.clientY })
      }
      onMouseLeave={() => setCursorPosition(null)}
    >
      <DragContext.Provider value={{ cursorPosition, zoom: zoom ?? 1 }}>
        {children}
      </DragContext.Provider>
    </div>
  );
}

/*
 * Basic draggable component. Must be placed in a `DragArea`.
 * When placed inside a `DragArea`, can be dragged freely
 * anywhere within the bounds of the drag area.
 */
export default function Draggable({
  onDrag,
  className,
  children,
}: {
  onDrag: () => void;
  className: string;
  children: ReactNode;
}) {
  const [translate, setTranslate] = useState<Vector2d>({ x: 0, y: 0 });
  const [lastDragPos, setLastDragPos] = useState<Vector2d | null>(null);

  const { cursorPosition, zoom } = useContext(DragContext);

  const doTranslate = (position: Vector2d) => {
    if (lastDragPos !== null) {
      onDrag();
      setTranslate({
        x: translate.x - (lastDragPos.x - position.x) / zoom,
        y: translate.y - (lastDragPos.y - position.y) / zoom,
      });
      setLastDragPos({ x: position.x, y: position.y });
    }
  };

  useEffect(() => {
    if (cursorPosition !== null) {
      doTranslate(cursorPosition);
    } else {
      setLastDragPos(null);
    }
  }, [cursorPosition]);

  return (
    <div
      style={{
        transform: `translate(${translate.x}px, ${translate.y}px)`,
      }}
      className={className ?? ""}
      onMouseDown={(event) => {
        setLastDragPos({ x: event.clientX, y: event.clientY });
        event.stopPropagation();
      }}
      onMouseUp={() => setLastDragPos(null)}
    >
      {children}
    </div>
  );
}
