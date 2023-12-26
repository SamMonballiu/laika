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
import { LuRuler, LuPenLine, LuList } from "react-icons/lu";
import { IconButton } from "./components/IconButton";
import { ZoomPicker } from "./components/ZoomPicker/ZoomPicker";
import { KonvaLine } from "./components/KonvaLine";
import {
  LineMeasurementViewmodel,
  MeasurementViewmodel,
  PolygonalMeasurementViewmodel,
  Style,
} from "./models/viewmodels";
import { MeasurementList } from "./components/MeasurementList/MeasurementList";
import { LiaDrawPolygonSolid } from "react-icons/lia";

type Mode = "setscale" | "measureLine" | "measurePoly";

function App() {
  const [mode, setMode] = useState<Mode>("measurePoly");
  const [temporaryPoints, setTemporaryPoints] = useState<Point[]>([
    new Point(100, 100),
    new Point(300, 100),
    new Point(300, 300),
  ]);
  const [cursorPoint, setCursorPoint] = useState<Point | undefined>(undefined);
  const [stuff] = useImage(Test);
  const [displayScale, setDisplayScale] = useState(0.75);
  const [scale, setScale] = useState<Scale>(
    new Scale(new Point(417, 380), new Point(2291, 380), 12.192, "Meters")
  );
  const [clicked, setClicked] = useState<Point[]>([]);
  const [showScaleDialog, setShowScaleDialog] = useState(false);
  const [showList, setShowList] = useState(true);
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
  ];
  const [measurements, setMeasurements] =
    useState<MeasurementViewmodel[]>(temp);

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

  //const measurements: Measurement[] = [
  //new LineMeasurement(new Point(200, 200), new Point(350, 500)),
  // new PolygonalMeasurement([
  //   new Point(50, 50),
  //   new Point(160, 160),
  //   new Point(50, 200),
  //   new Point(0, 200),
  //   // new Point(600, 500),
  // ]),
  //];

  const handleClicked = (point: Point) => {
    if (!point) {
      return;
    }
    if (
      mode === "setscale" ||
      mode === "measureLine" ||
      mode === "measurePoly"
    ) {
      point.x = point.x * (1 / displayScale);
      point.y = point.y * (1 / displayScale);
      if (!cursorPoint) {
        setCursorPoint(point);
        setTemporaryPoints([new Point(point.x, point.y)]);
        return;
      }

      const pt = new Point(point.x, point.y);
      if (pt.isCloseTo(temporaryPoints[0])) {
        const model = new PolygonalMeasurementViewmodel(
          new PolygonalMeasurement(temporaryPoints),
          `#${measurements.length + 1}`,
          "black",
          "solid"
        );
        setTemporaryPoints([]);
        setCursorPoint(undefined);
        setMeasurements([...measurements, model]);
      } else {
        setTemporaryPoints([
          ...temporaryPoints,
          new Point(cursorPoint.x, cursorPoint.y),
        ]);
      }
      //setClicked([...clicked, point]);
    }
  };

  // const handleClicked = (point: Point) => {
  //   if (
  //     mode === "setscale" ||
  //     mode === "measureLine" ||
  //     mode === "measurePoly"
  //   ) {
  //     point.x = point.x * (1 / displayScale);
  //     point.y = point.y * (1 / displayScale);
  //     setTemporaryPoints([...temporaryPoints, point]);
  //     //setClicked([...clicked, point]);
  //   }
  // };

  useEffect(() => {
    if (temporaryPoints.length === 0) {
      return;
    }
    if (mode === "setscale" && temporaryPoints.length === 2) {
      setShowScaleDialog(true);
    } else if (mode === "measureLine" && temporaryPoints.length === 2) {
      setMeasurements([
        ...measurements,
        new LineMeasurementViewmodel(
          new LineMeasurement(temporaryPoints[0], temporaryPoints[1]),
          `#${measurements.length + 1}`,
          "black",
          "solid"
        ),
      ]);
      setTemporaryPoints([]);
      setCursorPoint(undefined);
    }
  }, [temporaryPoints]);

  const handleViewmodelChanged = (idx: number, color: string, style: Style) => {
    const updated = [...measurements];
    updated[idx].color = color;
    updated[idx].style = style;

    setMeasurements(updated);
  };

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
        options={[0.25, 0.5, 0.75, 1, 1.25, 1.5, 2]}
        onSelect={(zoom) => setDisplayScale(zoom)}
      />
    ),
    [displayScale]
  );

  const tempPoints = React.useMemo(() => {
    let points = Point.toArray(temporaryPoints);
    if (cursorPoint) {
      points = points.concat(cursorPoint.x, cursorPoint.y);
    }
    return points;
  }, [temporaryPoints, cursorPoint]);

  return (
    <>
      {scaleDialog}
      <div className={styles.container}>
        <Sidebar>
          <IconButton
            className={showList ? styles.activeButton : undefined}
            icon={<LuList />}
            action={() => setShowList(!showList)}
          />

          <IconButton
            className={mode === "setscale" ? styles.activeButton : undefined}
            icon={<LuRuler />}
            action={() => setMode("setscale")}
          />
          <IconButton
            icon={<LuPenLine />}
            className={mode === "measureLine" ? styles.activeButton : undefined}
            action={() => setMode("measureLine")}
          />
          <IconButton
            icon={<LiaDrawPolygonSolid />}
            className={mode === "measurePoly" ? styles.activeButton : undefined}
            action={() => setMode("measurePoly")}
          />
        </Sidebar>
        {showList ? (
          <section className={styles.list}>
            <MeasurementList
              list={measurements}
              scale={scale}
              onChange={handleViewmodelChanged}
            />
          </section>
        ) : null}
        <section className={styles.main}>
          <div className={styles.stage}>
            <Stage
              onMouseMove={(evt) => {
                if (temporaryPoints.length === 0) {
                  return;
                }
                const pos = evt.target.getStage()?.getPointerPosition();
                if (pos) {
                  let cursorPoint = new Point(
                    parseInt((pos.x * (1 / displayScale)).toString()),
                    parseInt((pos.y * (1 / displayScale)).toString())
                  ).align(
                    temporaryPoints[temporaryPoints.length - 1],
                    20 * (1 / displayScale)
                  );

                  if (cursorPoint.sharesAxisWith(temporaryPoints[0])) {
                    cursorPoint = cursorPoint.align(temporaryPoints[0], 20);
                  }
                  setCursorPoint(cursorPoint);
                }
              }}
              width={scaled(stuff?.width)}
              height={scaled(stuff?.height)}
            >
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
                    <KonvaLine
                      displayScale={displayScale}
                      measurement={mst.measurement}
                      color={mst.color}
                      style={mst.style}
                      scale={scale}
                      key={idx}
                      rotation={0}
                    />
                  );
                })}

                {/* <Rect
                  scale={drawScale}
                  rotation={0}
                  offset={{ x: 100, y: 100 }}
                  x={400}
                  y={400}
                  width={200}
                  height={200}
                  fill="red"
                /> */}

                <Line
                  scale={drawScale}
                  x={0}
                  y={0}
                  points={tempPoints}
                  stroke="magenta"
                  strokeWidth={2}
                  // dash={[24, 120]}
                  closed
                  listening={false}
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

                {temporaryPoints
                  .concat(cursorPoint ?? Point.Empty)
                  .map((pt, idx) => {
                    return (
                      <Circle
                        listening={false}
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
