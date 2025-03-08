import { Point } from "../models/models";
import { useState, useMemo, useEffect } from "react";

export const useMeasure = () => {
  const [temporaryPoints, setTemporaryPoints] = useState<Point[]>([
    //new Point(100, 100),
    // new Point(300, 100),
    // new Point(300, 300),
  ]);

  const [cursorPoint, setCursorPoint] = useState<Point | undefined>(undefined);

  useEffect(() => {
    if (temporaryPoints.length === 0) {
      setCursorPoint(undefined);
    }
  }, [temporaryPoints]);

  const endMeasurement = () => {
    setTemporaryPoints([]);
    setCursorPoint(undefined);
  };

  const cancelLastPoint = () => {
    temporaryPoints.pop();
    setTemporaryPoints([...temporaryPoints]);
  };

  const getLastPoint = () => [...temporaryPoints].pop();

  const addPoint = (point: Point) => {
    setTemporaryPoints([...temporaryPoints, point]);
  };

  return {
    cursorPoint,
    temporaryPoints,
    endMeasurement,
    cancelLastPoint,
    getLastPoint,
    addPoint,
    setCursorPoint,
  };
};
