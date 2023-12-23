import { FC } from "react";
import { Point, Scale } from "../models/models";
import { LineMeasurement } from "../models/measurement";
import { Line, Rect, Text } from "react-konva";
import { Style } from "../models/viewmodels";

interface Props {
  scale: Scale;
  line?: LineMeasurement;
  displayScale: number;
  rotation?: number;
  showDistance?: boolean;
  color?: string;
  style: Style;
}

export const KonvaLine: FC<Props> = ({
  displayScale,
  scale,
  line,
  rotation,
  showDistance = true,
  color = "black",
  style = "solid",
}) => {
  const description = line?.getDescription(scale) ?? scale.description;
  const center = line?.center ?? scale.center;
  const points = line?.asPointsArray ?? scale.points;
  const drawScale = { x: displayScale, y: displayScale };
  const fontSize = 40;
  const character = {
    width: (fontSize * 20) / 30,
    height: (fontSize * 38) / 30,
  };
  const styles: Record<Style, number[] | undefined> = {
    solid: undefined,
    dash: [20, 48],
    dashdot: [20, 40, 2, 40],
    dot: [0.5, 23],
  };

  const rectangle = {
    width: description.length * character.width * displayScale,
    height: character.height * displayScale,
    x: center.x * displayScale,
    y: center.y * displayScale,
    offset: {
      x: (description.length * character.width * displayScale) / 2,
      y: (character.height * displayScale) / 2,
    },
  };

  const text = {
    width: description.length * character.width,
    height: character.height * displayScale,
    x: center.x * displayScale,
    y: center.y * displayScale,
    offset: {
      x: (description.length * character.width) / 2,
      y: (character.height * displayScale) / 2,
    },
  };
  return (
    <>
      <Line
        scale={drawScale}
        points={points}
        closed
        stroke={color}
        strokeWidth={10 * displayScale}
        lineCap="round"
        x={center.x * displayScale}
        y={center.y * displayScale}
        offset={{
          x: center.x,
          y: center.y,
        }}
        rotation={rotation}
        dash={styles[style]}
      />

      {showDistance ? (
        <>
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
            text={description}
            fill="black"
            fontFamily="DM Mono"
            fontSize={fontSize}
            {...text}
            rotation={rotation}
            align="center"
            verticalAlign="middle"
          />
        </>
      ) : null}
    </>
  );
};
