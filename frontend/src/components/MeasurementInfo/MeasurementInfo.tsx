import { FC } from "react";
import { Measurement } from "../../models/measurement";
import { Scale } from "../../models/models";
import { Rect, Text } from "react-konva";

interface Props {
  displayScale: number;
  rotation?: number;
  measurement?: Measurement;
  scale: Scale;
  fontSize: number;
}

export const MeasurementInfo: FC<Props> = ({
  displayScale,
  rotation,
  measurement,
  scale,
  fontSize,
}) => {
  const drawScale = { x: displayScale, y: displayScale };
  const description = measurement?.getDescription(scale) ?? scale.description;
  const center = measurement?.center ?? scale.center;
  const character = {
    width: (fontSize * 20) / 30,
    height: (fontSize * 38) / 30,
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
      <Rect
        fill="rgba(255, 255, 255, 0.85"
        stroke="rgba(0, 0, 0, .25)"
        strokeWidth={2 * displayScale}
        {...rectangle}
        rotation={rotation}
        listening={false}
      />

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
        listening={false}
      />
    </>
  );
};
