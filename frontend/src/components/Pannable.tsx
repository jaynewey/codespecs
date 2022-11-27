import { ReactNode, useState } from "react";

type State<S> = [S, (S) => void];

type Vector2d = {
  x: number;
  y: number;
};

/**
 * Wrap any component to make it pannable and zoomable using the scroll wheel and mouse.
 */
export default function Pannable({
  zoomState,
  translateState,
  className,
  children,
}: {
  zoomState?: State<number>;
  translateState?: State<Vector2d>;
  className?: string;
  children: ReactNode;
}) {
  const [zoom, setZoom] = zoomState ?? useState<number>(1);
  const [translate, setTranslate] =
    translateState ?? useState<Vector2d>({ x: 0, y: 0 });
  const [lastDragPos, setLastDragPos] = useState<Vector2d | null>(null);

  return (
    <div
      className={className ?? ""}
      onWheel={(event) => {
        setZoom(Math.max(zoom - event.deltaY / 30, 0.1));
      }}
      onMouseDown={(event) =>
        setLastDragPos({ x: event.clientX, y: event.clientY })
      }
      onMouseUp={() => setLastDragPos(null)}
      onMouseLeave={() => setLastDragPos(null)}
      onMouseMove={(event) => {
        if (lastDragPos !== null) {
          setTranslate({
            x: translate.x - (lastDragPos.x - event.clientX),
            y: translate.y - (lastDragPos.y - event.clientY),
          });
          setLastDragPos({ x: event.clientX, y: event.clientY });
        }
      }}
    >
      <div
        style={{
          transformOrigin: "0 0",
          transform: `scale(${zoom}) translate(${translate.x / zoom}px, ${
            translate.y / zoom
          }px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
