import { FC } from "react";
import { Line } from "react-konva";

interface Props {
  points: number[];
  scale: { x: number; y: number };
}

export const AlignmentGuide: FC<Props> = ({ points, scale }) => (
  <Line
    scale={scale}
    x={0}
    y={0}
    points={points}
    stroke="#19ACD6"
    strokeWidth={3}
    dash={[12, 8]}
    closed={false}
    listening={false}
  />
);
