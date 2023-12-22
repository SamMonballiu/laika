import { FC } from "react";
import { Line, Rect, Text } from "react-konva";
import { Scale } from "../models/models";

interface Props {
  scale: Scale;
  displayScale: number;
}
export const KonvaScale: FC<Props> = ({ scale, displayScale }) => {
  const drawScale = { x: displayScale, y: displayScale };

  const character = {
    width: 20,
    height: 38,
  };

  const rectangle = {
    width: scale.description.length * character.width * displayScale,
    height: character.height * displayScale,
    x: (scale.center.x - (scale.description.length * 20) / 2) * displayScale,
    y: (scale.center.y - character.height / 2) * displayScale,
  };

  const text = {
    x: (scale.center.x - (scale.description.length * 18) / 2) * displayScale,
    y: (scale.center.y + 8 - character.height / 2) * displayScale,
  };

  return (
    <>
      <Line
        scale={drawScale}
        x={0}
        y={0}
        points={scale.points}
        tension={0}
        stroke="orange"
        strokeWidth={10 * displayScale}
        lineCap="round"
      />
      <Rect
        fill="rgba(255, 255, 255, 0.85"
        stroke="rgba(0, 0, 0, .25)"
        strokeWidth={2 * displayScale}
        {...rectangle}
      />

      <Text
        scale={drawScale}
        text={scale.description}
        fill="black"
        fontFamily="DM Mono"
        fontSize={30}
        {...text}
      />
    </>
  );
};
