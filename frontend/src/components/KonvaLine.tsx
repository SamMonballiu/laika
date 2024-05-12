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
  onClick?: () => void;
}

export const KonvaLine: FC<Props> = ({
  displayScale,
  scale,
  measurement,
  rotation,
  showDistance = true,
  color = "black",
  style = "solid",
  onClick,
}) => {
  const center = measurement?.center ?? scale.center;
  const points = measurement?.asPointsArray ?? scale.points;
  const drawScale = { x: displayScale, y: displayScale };

  const styles: Record<Style, number[]> = {
    solid: [],
    dash: [20, 24],
    dashdot: [20, 12 * displayScale, 2, 12 * displayScale],
    dot: [1, 10 * displayScale],
  };

  const closed = (measurement?.points?.length ?? 0) > 2;

  return (
    <>
      <Line
        scale={drawScale}
        points={points}
        closed={closed}
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
        listening={measurement !== undefined}
        onClick={onClick}
      />

      {showDistance ? (
        <MeasurementInfo
          measurement={measurement}
          scale={scale}
          rotation={rotation}
          fontSize={40}
          displayScale={displayScale}
          onClick={onClick}
        />
      ) : null}
    </>
  );
};
