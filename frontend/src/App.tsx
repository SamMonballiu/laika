import React, { useState, useEffect, useMemo } from "react";
import Test from "./assets/test.jpg";
// import "./App.css";
import {
  Layer,
  Stage,
  Image,
  Line,
  Circle,
  Text,
  Rect,
  Shape,
} from "react-konva";
import useImage from "use-image";
import styles from "./Main.module.scss";
import { LineMeasurement, PolygonalMeasurement } from "./models/measurement";
import { Point, Points, Scale } from "./models/models";
import { Dialog } from "./components/Dialog";
import { ScalePicker } from "./components/ScalePicker/ScalePicker";
import { KonvaScale } from "./components/KonvaScale";
import { Sidebar } from "./components/Sidebar";
import { StatusBar } from "./components/StatusBar";
import {
  LuRuler,
  LuPenLine,
  LuList,
  LuRectangleHorizontal,
  LuMousePointer2,
} from "react-icons/lu";
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
import { Mode, Modes, useMode } from "./hooks/useMode";
import { useMeasure } from "./hooks/useMeasure";
import cx from "classnames";
import { KonvaPoints } from "./components/KonvaPoints";
import { useZoom } from "./hooks/useZoom";

const icons: Record<Mode, React.ReactNode> = {
  select: <LuMousePointer2 />,
  setscale: <LuRuler />,
  measureLine: <LuPenLine />,
  measurePoly: <LiaDrawPolygonSolid />,
  measureRect: <LuRectangleHorizontal />,
};

function App() {
  const mode = useMode("select");
  useEffect(() => {
    if (mode.value !== "select") {
      setSelected(null);
    }
  }, [mode.value]);
  const {
    temporaryPoints,
    cursorPoint,
    endMeasurement,
    cancelLastPoint,
    addPoint,
    setCursorPoint,
    getLastPoint,
  } = useMeasure();
  const [stuff] = useImage(Test);
  const zoom = useZoom();
  //const [displayScale, setDisplayScale] = useState(zoom.value);
  const [scale, setScale] = useState<Scale>(
    new Scale(new Point(417, 380), new Point(2291, 380), 12.192, "Meters")
  );
  const [selected, setSelected] = useState<MeasurementViewmodel | null>(null);
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
  const [measurements, setMeasurements] =
    useState<MeasurementViewmodel[]>(temp);

  const scaled = (factor?: number) => zoom.value * (factor ?? 0);
  const drawScale: { x: number; y: number } = {
    x: zoom.value,
    y: zoom.value,
  };

  useEffect(() => {
    const contextClickHandler = (event: Event) => {
      event.preventDefault();
    };

    document.addEventListener("contextmenu", contextClickHandler);

    return () =>
      document.removeEventListener("contextmenu", contextClickHandler);
  }, []);

  const handleRightClick = () => {
    if (
      mode.isOneOf("measurePoly", "measureLine", "measureRect", "setscale") &&
      temporaryPoints.length === 1
    ) {
      endMeasurement();
      return;
    }

    switch (mode.value) {
      case "measurePoly":
        cancelLastPoint();
        break;
    }
  };

  const handleClicked = (point: Point) => {
    if (!point || mode.is("select")) {
      setSelected(null);
      return;
    }

    point.x = point.x * (1 / zoom.value);
    point.y = point.y * (1 / zoom.value);

    if (!cursorPoint) {
      setCursorPoint(point);
      addPoint(new Point(point.x, point.y));
      return;
    }

    if (mode.is("measureRect") && temporaryPoints.length === 1) {
      // Mirror first point and cursor point to make a rectangle
      const first = temporaryPoints[0];
      const second = point;
      const points = Points.mirror(first, second);

      const model = new PolygonalMeasurementViewmodel(
        new PolygonalMeasurement(points),
        `#${measurements.length + 1}`,
        "black",
        "solid"
      );

      setMeasurements([...measurements, model]);
      endMeasurement();
    } else if (mode.isOneOf("setscale", "measureLine", "measurePoly")) {
      const pt = new Point(point.x, point.y);

      if (pt.isCloseTo(getLastPoint())) {
        return;
      } else if (
        mode.value !== "setscale" &&
        pt.isCloseTo(temporaryPoints[0])
      ) {
        const model = new PolygonalMeasurementViewmodel(
          new PolygonalMeasurement(temporaryPoints),
          `#${measurements.length + 1}`,
          "black",
          "solid"
        );
        setMeasurements([...measurements, model]);
        endMeasurement();
      } else {
        addPoint(new Point(cursorPoint.x, cursorPoint.y));
      }
    }
  };

  useEffect(() => {
    if (temporaryPoints.length === 0) {
      return;
    }
    if (mode.is("setscale") && temporaryPoints.length === 2) {
      setShowScaleDialog(true);
    } else if (mode.is("measureLine") && temporaryPoints.length === 2) {
      setMeasurements([
        ...measurements,
        new LineMeasurementViewmodel(
          new LineMeasurement(temporaryPoints[0], temporaryPoints[1]),
          `#${measurements.length + 1}`,
          "black",
          "solid"
        ),
      ]);
      endMeasurement();
    }
  }, [temporaryPoints]);

  const handleViewmodelChanged = (idx: number, color: string, style: Style) => {
    const updated = [...measurements];
    updated[idx].color = color;
    updated[idx].style = style;

    setMeasurements(updated);
  };

  const handleDeleteMeasurement = (idx: number) => {
    setMeasurements(
      measurements.filter((x) => measurements.indexOf(x) !== idx)
    );
  };

  const scaleDialog = (
    <Dialog isOpen={showScaleDialog} onClose={() => setShowScaleDialog(false)}>
      <ScalePicker
        onConfirm={(distance, unit) => {
          setScale(
            new Scale(temporaryPoints[0], temporaryPoints[1], distance, unit)
          );
          setShowScaleDialog(false);
          endMeasurement();
        }}
      />
    </Dialog>
  );

  const zoomPicker = useMemo(
    () => (
      <ZoomPicker
        value={zoom.value}
        options={zoom.options}
        onSelect={(val) => zoom.set(val)}
        onIncrement={zoom.can.increment ? zoom.increment : undefined}
        onDecrement={zoom.can.decrement ? zoom.decrement : undefined}
      />
    ),
    [zoom]
  );

  const tempPoints = React.useMemo(() => {
    let points = [...temporaryPoints];

    if (cursorPoint) {
      points = points.concat(cursorPoint);
    }
    if (
      mode.is("measureRect") &&
      points.length === 2 &&
      points.every((x) => x !== undefined)
    ) {
      points = Points.mirror(points[0], points[1]);
    }
    return Points.toNumberArray(points);
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

          {Modes.map((md) => (
            <IconButton
              className={mode.is(md) ? styles.activeButton : undefined}
              icon={icons[md]}
              action={() => mode.set(md)}
            />
          ))}
        </Sidebar>
        {showList ? (
          <section className={styles.list}>
            <MeasurementList
              list={measurements}
              scale={scale}
              onChange={handleViewmodelChanged}
              onDelete={handleDeleteMeasurement}
              selected={selected?.measurement.id}
              onSelect={(id) =>
                setSelected(measurements.find((x) => x.measurement.id === id)!)
              }
            />
          </section>
        ) : null}
        <section className={styles.main}>
          <div
            className={cx(styles.stage, {
              [styles.crosshair]: mode.isOneOf(
                "measureLine",
                "measurePoly",
                "measureRect",
                "setscale"
              ),
            })}
          >
            <Stage
              onMouseMove={(evt) => {
                if (temporaryPoints.length === 0) {
                  return;
                }
                const pos = evt.target.getStage()?.getPointerPosition();
                if (pos) {
                  let cursorPoint = new Point(
                    parseInt((pos.x * (1 / zoom.value)).toString()),
                    parseInt((pos.y * (1 / zoom.value)).toString())
                  ).align(
                    temporaryPoints[temporaryPoints.length - 1],
                    20 * (1 / zoom.value)
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
                  onClick={(evt) => {
                    if (evt.evt.button === 2) {
                      handleRightClick();
                    } else {
                      handleClicked(
                        evt.target.getStage()?.getPointerPosition() as Point
                      );
                    }
                  }}
                  image={stuff}
                  scale={drawScale}
                />
                {/* </Layer> */}
                {/* <Layer> */}
                {!scale.isDefault && (
                  <KonvaScale displayScale={zoom.value} scale={scale} />
                )}

                {measurements.map((mst, idx) => (
                  <KonvaLine
                    displayScale={zoom.value}
                    measurement={mst.measurement}
                    color={mst.color}
                    style={mst.style}
                    scale={scale}
                    key={idx}
                    rotation={0}
                    onClick={() => {
                      if (mode.is("select")) {
                        setSelected(mst);
                      }
                    }}
                  />
                ))}

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

                {/* Points of selected measurement */}
                {selected ? (
                  <KonvaPoints
                    points={selected.measurement.points}
                    drawScale={drawScale}
                    displayScale={zoom.value}
                    onDragMove={(idx, pos) => {
                      let point = new Point(pos.x, pos.y);
                      const currentMeasurement = { ...selected };
                      for (
                        let i = 0;
                        i < selected.measurement.points.length;
                        i++
                      ) {
                        if (idx === i) continue;
                        const other = currentMeasurement.measurement.points[i];

                        if (point.sharesAxisWith(other)) {
                          point = point.align(other, 8 / zoom.value);
                        }
                      }

                      currentMeasurement.measurement.points[idx] = point;
                      setSelected(currentMeasurement);
                    }}
                  />
                ) : null}

                <Shape
                  points={tempPoints}
                  stroke="red"
                  strokeWidth={3}
                  fill="magenta"
                  x={100}
                  y={100}
                />

                <KonvaPoints
                  points={temporaryPoints.concat(cursorPoint ?? Point.Empty)}
                  displayScale={zoom.value}
                  drawScale={drawScale}
                />

                {/* 
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
                  })} */}
              </Layer>
            </Stage>
          </div>
          <StatusBar>
            {temporaryPoints
              .map((pt) => `[${pt.x.toFixed(0)}, ${pt.y.toFixed(0)}]`)
              .join(" ")}
            {selected?.measurement.points
              .map(
                (pt, idx) => `${idx} - [${pt.x.toFixed(0)}, ${pt.y.toFixed(0)}]`
              )
              .join(" ")}
            {zoomPicker}
          </StatusBar>
        </section>
      </div>
    </>
  );
}

export default App;
