import { FC, useState, useEffect } from "react";
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
