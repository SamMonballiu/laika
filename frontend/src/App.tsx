import { FC, useState } from "react";
import { PdfPagePicker } from "./PdfPagePicker";
import Workspace from "./Workspace";
import { useOpenedPdfContext } from "./context/OpenedPdfContext";
import "./App.module.scss";

type Mode = "work" | "open";

export const App: FC = () => {
  const [mode, setMode] = useState<Mode>("open");
  const { pages, selectedPage } = useOpenedPdfContext();

  if (mode === "open") {
    return <PdfPagePicker onSelectPage={() => setMode("work")} />;
  } else if (mode === "work") {
    return (
      <Workspace
        pageContent={pages[selectedPage].content}
        onPicker={() => setMode("open")}
      />
    );
  }

  return null;
};
