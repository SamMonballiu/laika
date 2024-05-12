import { FC, useState } from "react";
import { Point } from "../models/models";
import { Circle, Text } from "react-konva";

interface Props {
  points: Point[];
  drawScale: { x: number; y: number };
  displayScale: number;
  color?: string;
  onDragMove?: (pointIndex: number, position: { x: number; y: number }) => void;
}

export const KonvaPoints: FC<Props> = ({
  points,
  drawScale,
  displayScale,
  color = "magenta",
  onDragMove,
}) => {
  const [dragging, setDragging] = useState<number | null>(null);
  const isDraggable = onDragMove !== undefined;
  return (
    <>
      {points.map((pt, idx) => (
        <Circle
          listening={isDraggable}
          draggable={isDraggable}
          onDragStart={() => setDragging(idx)}
          onDragMove={(evt) => {
            const x = evt.target.x() / displayScale;
            const y = evt.target.y() / displayScale;
            onDragMove?.(idx, { x, y });
          }}
          onDragEnd={(evt) => {
            evt.target.to({
              x: pt.x * displayScale,
              y: pt.y * displayScale,
              duration: 0.01,
            });
            setDragging(null);
          }}
          key={idx}
          scale={drawScale}
          x={pt.x * displayScale}
          y={pt.y * displayScale}
          radius={2 * displayScale}
          stroke={color}
          fill={dragging === idx ? "transparent" : color}
          strokeWidth={1}
        />
      ))}

      {/* {points.map((pt, idx) => (
        <Text
          scale={drawScale}
          fill="black"
          key={idx}
          x={pt.x * displayScale + 10}
          y={pt.y * displayScale + 10}
          text={`[${(pt.x * displayScale).toFixed(2)}, ${(
            pt.y * displayScale
          ).toFixed(2)}]`}
        />
      ))} */}
    </>
  );
};
