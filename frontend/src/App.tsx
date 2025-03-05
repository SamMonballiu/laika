import React, { FC, useState, useEffect, useMemo } from "react";
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
//import styles from "./Main.module.scss";
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
// import { Mode, Modes, useMode } from "./hooks/useMode";
import { useMeasure } from "./hooks/useMeasure";
import cx from "classnames";
import { KonvaPoints } from "./components/KonvaPoints";
import { useZoom } from "./hooks/useZoom";
import { AlignmentGuide } from "./components/AlignmentGuide";
import { MeasurementInfo } from "./components/MeasurementInfo/MeasurementInfo";
import { PdfPagePicker } from "./PdfPagePicker";
import Workspace from "./Workspace";
import { GetPdfPage } from "../wailsjs/go/main/App";
import { useOpenedPdfContext } from "./context/OpenedPdfContext";
import styles from "./App.module.scss";
import { Loading } from "./components/common/Loading/Loading";

type Mode = "load" | "work" | "open";

export const App: FC = () => {
  const [mode, setMode] = useState<Mode>("open");
  const { path, pages, setPage, selectedPage, isPageCached } =
    useOpenedPdfContext();
  const [content, setContent] = useState<string | null>(null);

  useEffect(() => {
    if (mode === "load") {
      if (isPageCached(selectedPage)) {
        setContent(pages[selectedPage].content);
        setMode("work");
      } else {
        GetPdfPage(path, selectedPage).then((content) => {
          setPage(selectedPage, content);
          setContent(content);
          setMode("work");
        });
      }
    }
  }, [mode]);

  if (mode === "load") {
    return <Loading animated className={styles.loading} />;
  } else if (mode === "open") {
    return <PdfPagePicker onSelectPage={() => setMode("load")} />;
  } else if (mode === "work" && content) {
    return <Workspace pageContent={content} onPicker={() => setMode("open")} />;
  }

  return null;
};
