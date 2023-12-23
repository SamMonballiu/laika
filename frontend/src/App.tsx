import React, { useState, useEffect, useMemo } from "react";
import Test from "./assets/test.jpg";
// import "./App.css";
import { Layer, Stage, Image, Line, Circle, Text, Rect } from "react-konva";
import useImage from "use-image";
import styles from "./Main.module.scss";
import {
  LineMeasurement,
  Measurement,
  PolygonalMeasurement,
} from "./models/measurement";
import { Point, Scale } from "./models/models";
import { Dialog } from "./components/Dialog";
import { ScalePicker } from "./components/ScalePicker/ScalePicker";
import { KonvaScale } from "./components/KonvaScale";
import { Sidebar } from "./components/Sidebar";
import { StatusBar } from "./components/StatusBar";
import { LuRuler } from "react-icons/lu";
import { IconButton } from "./components/IconButton";
import { ZoomPicker } from "./components/ZoomPicker/ZoomPicker";

type Mode = "setscale";

function App() {
  const [mode, setMode] = useState<Mode>("setscale");
  const [temporaryPoints, setTemporaryPoints] = useState<Point[]>([]);
  const [stuff] = useImage(Test);
  const [displayScale, setDisplayScale] = useState(1);
  const [scale, setScale] = useState<Scale>(
    new Scale(new Point(200, 200), new Point(500, 500), 12.921, "Meters")
  );
  const [clicked, setClicked] = useState<Point[]>([]);
  const [showScaleDialog, setShowScaleDialog] = useState(false);

  const asPoints = React.useMemo(() => {
    return clicked.reduce((acc, val) => {
      return [...acc, val.x, val.y];
    }, [] as number[]);
  }, [clicked]);

  const scaled = (factor?: number) => displayScale * (factor ?? 0);
  const drawScale: { x: number; y: number } = {
    x: displayScale,
    y: displayScale,
  };

  const measurements: Measurement[] = [
    // new LineMeasurement(new Point(200, 200), new Point(350, 500)),
    // new PolygonalMeasurement([
    //   new Point(50, 50),
    //   new Point(160, 160),
    //   new Point(50, 200),
    //   new Point(0, 200),
    //   // new Point(600, 500),
    // ]),
  ];

  const handleClicked = (point: Point) => {
    if (mode === "setscale") {
      point.x = point.x * (1 / displayScale);
      point.y = point.y * (1 / displayScale);
      setTemporaryPoints([...temporaryPoints, point]);
      //setClicked([...clicked, point]);
    }
  };

  useEffect(() => {
    if (mode === "setscale" && temporaryPoints.length === 2) {
      setShowScaleDialog(true);
    }
  }, [temporaryPoints]);

  const scaleDialog = (
    <Dialog isOpen={showScaleDialog} onClose={() => setShowScaleDialog(false)}>
      <ScalePicker
        onConfirm={(distance, unit) => {
          setScale(
            new Scale(temporaryPoints[0], temporaryPoints[1], distance, unit)
          );
          setShowScaleDialog(false);
          setTemporaryPoints([]);
        }}
      />
    </Dialog>
  );

  const zoomPicker = useMemo(
    () => (
      <ZoomPicker
        value={displayScale}
        options={[0.5, 1, 1.25, 1.5, 2]}
        onSelect={(zoom) => setDisplayScale(zoom)}
      />
    ),
    [displayScale]
  );

  return (
    <>
      {scaleDialog}
      <div className={styles.container}>
        <Sidebar>
          <IconButton
            className={styles.activeButton}
            icon={<LuRuler />}
            action={() => alert("todo")}
          />
        </Sidebar>
        <section className={styles.main}>
          <div className={styles.stage}>
            <Stage width={scaled(stuff?.width)} height={scaled(stuff?.height)}>
              <Layer>
                <Image
                  onClick={(evt) =>
                    handleClicked(
                      evt.target.getStage()?.getPointerPosition() as Point
                    )
                  }
                  image={stuff}
                  scale={drawScale}
                />
              </Layer>
              <Layer>
                {!scale.isDefault && (
                  <KonvaScale displayScale={displayScale} scale={scale} />
                )}

                {measurements.map((mst, idx) => {
                  return (
                    <Line
                      key={idx}
                      scale={drawScale}
                      x={0}
                      y={0}
                      // closed
                      points={mst.asPointsArray}
                      tension={0}
                      stroke="black"
                      strokeWidth={10}
                    />
                  );
                })}

                <Line
                  scale={drawScale}
                  x={0}
                  y={0}
                  points={Point.toArray(temporaryPoints)}
                  stroke="magenta"
                  strokeWidth={10}
                  dash={[24, 12]}
                />

                {/* SCALE */}
                <Line
                  scale={drawScale}
                  x={0}
                  y={0}
                  points={asPoints}
                  tension={0}
                  closed
                  stroke="magenta"
                  strokeWidth={2 / displayScale}
                  onClick={() => alert("that tickles")}
                />

                {temporaryPoints.map((pt, idx) => {
                  return (
                    <Circle
                      key={idx}
                      scale={drawScale}
                      x={pt.x * displayScale}
                      y={pt.y * displayScale}
                      radius={6}
                      stroke="magenta"
                      fill="magenta"
                    />
                  );
                })}
              </Layer>
            </Stage>
          </div>
          <StatusBar>{zoomPicker}</StatusBar>
        </section>
      </div>
    </>
  );
}

export default App;
