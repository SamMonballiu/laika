import { FC } from "react";
import { Point } from "../models/models";
import { Circle } from "react-konva";

interface Props {
  points: Point[];
  drawScale: { x: number; y: number };
  displayScale: number;
  color?: string;
}

export const KonvaPoints: FC<Props> = ({
  points,
  drawScale,
  displayScale,
  color = "magenta",
}) => {
  return points.map((pt, idx) => (
    <Circle
      listening={false}
      key={idx}
      scale={drawScale}
      x={pt.x * displayScale}
      y={pt.y * displayScale}
      radius={4 * displayScale}
      stroke={color}
      fill={color}
    />
  ));
};
