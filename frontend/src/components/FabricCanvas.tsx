import { Canvas, Rect, Line, Polygon, controlsUtils } from "fabric";
import { FC, useRef, useState, useEffect, useMemo } from "react";
import { Point, Scale } from "../models/models";
import { MeasurementViewmodel, Style } from "../models/viewmodels";

interface Props {
  measurements: MeasurementViewmodel[];
  zoom: number;
  onPointsChanged?: (idx: number, points: Point[]) => void;
}

const styles: Record<Style, number[]> = {
  solid: [],
  dash: [20, 14],
  dashdot: [20, 12, 2, 12],
  dot: [1, 10],
};

export const FabricCanvas: FC<Props> = ({
  measurements,
  zoom,
  onPointsChanged,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = useState(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const initCanvas = new Canvas(canvasRef.current, {
        width: 2000 * zoom,
        height: 3000 * zoom,
        selection: false,
        angle: 20,
      });

      initCanvas.backgroundColor = "#ffffff";
      initCanvas.set("angle", 20);
      initCanvas.renderAll();

      initCanvas.on("object:modified", (e) => {
        const index = initCanvas.getObjects().indexOf(e.target);
        // Lines don't have this
        // if (!e.target.points) {
        //   return;
        // }

        onPointsChanged(
          index,
          e.target.points ?? [
            { x: e.target.x1, y: e.target.y1 },
            { x: e.target.x2, y: e.target.y2 },
          ]
        );
        //initCanvas.renderAll();
      });

      initCanvas.on("mouse:down", (e) => {
        const index = initCanvas.getObjects().indexOf(e.target);
        console.log(index);
        // if (index != -1) {
        //   setEditingIndex(index);
        // } else {
        //   setEditingIndex(null);
        // }
      });

      //initCanvas.add(rect);
      setCanvas(initCanvas);

      return () => initCanvas.dispose();
    }
  }, []);

  const shapes = useMemo(() => {
    let shapes = [];

    const commonProperties = {
      selectable: false,
      lockMovementX: true,
      lockMovementY: true,
      cornerStyle: null, // "rect",
      cornerColor: null, // model.color,
      hasBorders: false,
      objectCaching: false,
      lockScalingX: true,
      lockScalingY: true,
      hoverCursor: "default",
    };

    for (const model of measurements) {
      if (model.measurement.type === "polygon") {
        const polygon = new Polygon(model.measurement.points, {
          fill: "transparent",
          stroke: model.color,
          strokeDashArray: styles[model.style],
          strokeWidth: 3 * model.stroke * zoom,
          ...commonProperties,
        });

        shapes.push(polygon);

        //if (isEditing) {
        // polygon.controls = controlsUtils.createPolyControls(polygon);
        // polygon.setCoords();
        //}
        //canvas.add(polygon);
      } else if (model.measurement.type === "line") {
        const line = new Line(
          [
            model.measurement.points[0].x,
            model.measurement.points[0].y,
            model.measurement.points[1].x,
            model.measurement.points[1].y,
          ],
          {
            stroke: model.color,
            strokeDashArray: styles[model.style],
            strokeWidth: 3 * model.stroke * zoom,
            ...commonProperties,
          }
        );
        shapes.push(line);
        //canvas.add(line);
      }

      //   polygon.controls = controlsUtils.createPolyControls(polygon);
      //   polygon.setCoords();
      //   canvas.add(polygon);
      //canvas.renderAll();
      //canvas.setZoom(4);

      //return () => canvas.dispose();
    }

    return shapes;
  }, [measurements, zoom, onPointsChanged]);

  useEffect(() => {
    if (canvas === null) {
      return;
    }

    canvas.setWidth(2000 * zoom);
    canvas.setHeight(3000 * zoom);
    canvas.clear();
    canvas.backgroundColor = "#ffffff";
    canvas.setZoom(zoom);
    canvas.renderAll();

    for (const shape of shapes) {
      canvas.add(shape);
    }

    canvas.renderAll();
  }, [canvas, zoom, editingIndex, shapes]);

  return <canvas id="canvas" ref={canvasRef} />;
};
