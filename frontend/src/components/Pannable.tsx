import { ReactNode, useState } from "react";

import { State, Vector2d } from "./types";

const ZOOM_SENSITIVITY = 15;
const DEFAULT_MIN_ZOOM = 0.1;
const DEFAULT_MAX_ZOOM = Number.MAX_VALUE;

/**
 * Wrap any component to make it pannable and zoomable using the scroll wheel and mouse.
 */
export default function Pannable({
  zoomState,
  translateState,
  zoomSensitivity = ZOOM_SENSITIVITY,
  minZoom = DEFAULT_MIN_ZOOM,
  maxZoom = DEFAULT_MAX_ZOOM,
  className,
  children,
}: {
  zoomState?: State<number>;
  translateState?: State<Vector2d>;
  zoomSensitivity?: number;
  minZoom?: number;
  maxZoom?: number;
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
        setZoom(
          Math.min(
            Math.max(
              zoom - (Math.sign(event.deltaY) / zoomSensitivity) * zoom,
              minZoom
            ),
            maxZoom
          )
        );
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
