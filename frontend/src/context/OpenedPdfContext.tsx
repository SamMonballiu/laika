import React, { createContext, useContext, useState } from "react";

interface Page {
  index: number;
  content: string;
}

interface OpenedPdfContextProps {
  path: string;
  setPath: (value: string) => void;
  pages: Page[];
  setPage: (page: number, content: string) => void;
  selectedPage: number;
  setSelectedPage: (value: number) => void;
}

export const OpenedPdfContext = createContext<OpenedPdfContextProps>(
  //@ts-expect-error
  null
);
export const useOpenedPdfContext = () => useContext(OpenedPdfContext);

//@ts-expect-error
export const OpenedFileProvider = ({ children }) => {
  const [path, setPath] = useState<string>("");
  const [pages, setPages] = useState<Page[]>([]);
  const [selectedPage, setSelectedPage] = useState<number>(0);

  const handleSetPage = (page: number, content: string) => {
    const newPages = [...pages].filter((x) => x.index !== page);
    setPages([...newPages, { index: page, content }]);
  };

  const context: OpenedPdfContextProps = {
    path,
    setPath,
    pages,
    setPage: handleSetPage,
    selectedPage,
    setSelectedPage,
  };

  return (
    <OpenedPdfContext.Provider value={context}>
      {children}
    </OpenedPdfContext.Provider>
  );
};
