import { FC, useEffect, useState } from "react";
import { Circle, Line, Rect, Text } from "react-konva";
import { Scale } from "../models/models";

interface Props {
  scale: Scale;
  displayScale: number;
  rotation?: number;
}

export const KonvaScale: FC<Props> = ({ scale, displayScale, rotation }) => {
  const drawScale = { x: displayScale, y: displayScale };
  const fontSize = 40;
  const character = {
    width: (fontSize * 20) / 30,
    height: (fontSize * 38) / 30,
  };

  const rectangle = {
    width: scale.description.length * character.width * displayScale,
    height: character.height * displayScale,
    x: scale.center.x * displayScale,
    y: scale.center.y * displayScale,
    offset: {
      x: (scale.description.length * character.width * displayScale) / 2,
      y: (character.height * displayScale) / 2,
    },
  };

  const text = {
    width: scale.description.length * character.width,
    height: character.height * displayScale,
    x: scale.center.x * displayScale,
    y: scale.center.y * displayScale,
    offset: {
      x: (scale.description.length * character.width) / 2,
      y: (character.height * displayScale) / 2,
    },
  };

  return (
    <>
      <Line
        scale={drawScale}
        points={scale.points}
        tension={0}
        stroke="orange"
        strokeWidth={10 * displayScale}
        lineCap="round"
        x={scale.center.x * displayScale}
        y={scale.center.y * displayScale}
        offset={{
          x: scale.center.x,
          y: scale.center.y,
        }}
        rotation={rotation}
      />

      <Rect
        fill="rgba(255, 255, 255, 0.85"
        stroke="rgba(0, 0, 0, .25)"
        strokeWidth={2 * displayScale}
        {...rectangle}
        rotation={rotation}
      />

      {/* <Circle
        fill="cyan"
        radius={4}
        x={scale.first.x * displayScale}
        y={scale.first.y * displayScale}
      /> */}

      <Text
        scale={drawScale}
        text={scale.description}
        fill="black"
        fontFamily="DM Mono"
        fontSize={fontSize}
        {...text}
        rotation={rotation}
        align="center"
        verticalAlign="middle"
      />
    </>
  );
};
