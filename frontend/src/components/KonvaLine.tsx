import { FC } from "react";
import { Scale } from "../models/models";
import { Measurement } from "../models/measurement";
import { Line, Rect, Text } from "react-konva";
import { Style } from "../models/viewmodels";
import { MeasurementInfo } from "./MeasurementInfo/MeasurementInfo";

interface Props {
  scale: Scale;
  measurement?: Measurement;
  displayScale: number;
  rotation?: number;
  showDistance?: boolean;
  color?: string;
  style?: Style;
}

export const KonvaLine: FC<Props> = ({
  displayScale,
  scale,
  measurement,
  rotation,
  showDistance = true,
  color = "black",
  style = "solid",
}) => {
  const center = measurement?.center ?? scale.center;
  const points = measurement?.asPointsArray ?? scale.points;
  const drawScale = { x: displayScale, y: displayScale };
  const styles: Record<Style, number[] | undefined> = {
    solid: undefined,
    dash: [20, 48],
    dashdot: [20, 40, 2, 40],
    dot: [0.5, 23],
  };

  return (
    <>
      <Line
        scale={drawScale}
        points={points}
        closed
        stroke={color}
        strokeWidth={5 * displayScale}
        lineCap="round"
        x={center.x * displayScale}
        y={center.y * displayScale}
        offset={{
          x: center.x,
          y: center.y,
        }}
        rotation={rotation}
        dash={styles[style]}
        listening={false}
      />

      {showDistance ? (
        <MeasurementInfo
          measurement={measurement}
          scale={scale}
          rotation={rotation}
          fontSize={40}
          displayScale={displayScale}
        />
      ) : null}
    </>
  );
};
