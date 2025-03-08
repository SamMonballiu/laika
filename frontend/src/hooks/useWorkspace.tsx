import { useState } from "react";
import { LineMeasurement, PolygonalMeasurement } from "../models/measurement";
import { Point, Scale } from "../models/models";
import {
  MeasurementViewmodel,
  LineMeasurementViewmodel,
  PolygonalMeasurementViewmodel,
} from "../models/viewmodels";

export const useWorkspace = () => {
  const [scale, setScale] = useState<Scale>(
    new Scale(new Point(417, 380), new Point(2291, 380), 12.192, "Meters")
  );
  const [selected, setSelected] = useState<MeasurementViewmodel | null>(null);
  const [showScaleDialog, setShowScaleDialog] = useState(false);
  const [showList, setShowList] = useState(true);
  const [measurements, setMeasurements] =
    useState<MeasurementViewmodel[]>(temp);

  const [dragPointIndex, setDragPointIndex] = useState<number | null>(null);

  return {
    measurements,
    setMeasurements,
    scale,
    setScale,
    selected,
    setSelected,
    showScaleDialog,
    setShowScaleDialog,
    showList,
    setShowList,
    dragPointIndex,
    setDragPointIndex,
  };
};

const temp: MeasurementViewmodel[] = [
  new LineMeasurementViewmodel(
    new LineMeasurement(new Point(200, 200), new Point(700, 500)),
    "#1",
    "#db3e00",
    "dash"
  ),

  new LineMeasurementViewmodel(
    new LineMeasurement(new Point(1300, 1400), new Point(1600, 1200)),
    "#2",
    "cyan",
    "solid"
  ),

  new PolygonalMeasurementViewmodel(
    new PolygonalMeasurement([
      new Point(600, 600),
      new Point(800, 600),
      new Point(800, 800),
      new Point(600, 800),
    ]),
    "#3",
    "pink",
    "solid"
  ),
];
