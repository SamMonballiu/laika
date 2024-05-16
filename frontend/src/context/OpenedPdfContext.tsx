import React, { createContext, useContext, useState } from "react";

interface Page {
  index: number;
  content: string;
}

interface OpenedPdfContextProps {
  path: string;
  setPath: (value: string) => void;
  thumbnails: string[];
  setThumbnails: (value: string[]) => void;
  pages: Page[];
  setPage: (page: number, content: string) => void;
  clearPages: () => void;
  selectedPage: number;
  setSelectedPage: (value: number) => void;
  isPageCached: (page: number) => boolean;
  getPage: (page: number) => Page | undefined;
}

export const OpenedPdfContext = createContext<OpenedPdfContextProps>(
  //@ts-expect-error
  null
);
export const useOpenedPdfContext = () => useContext(OpenedPdfContext);

//@ts-expect-error
export const OpenedFileProvider = ({ children }) => {
  const [path, setPath] = useState<string>("");
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [selectedPage, setSelectedPage] = useState<number>(0);

  const handleSetPage = (page: number, content: string) => {
    const newPages = [...pages].filter((x) => x.index !== page);
    setPages([...newPages, { index: page, content }]);
  };

  const getPage = (page: number) => pages.find((x) => x.index === page);

  const hasPage = (page: number) => {
    return getPage(page) !== undefined;
  };

  const clearPages = () => setPages([]);

  const context: OpenedPdfContextProps = {
    path,
    setPath,
    thumbnails,
    setThumbnails,
    pages,
    setPage: handleSetPage,
    selectedPage,
    setSelectedPage,
    isPageCached: hasPage,
    getPage,
    clearPages,
  };

  return (
    <OpenedPdfContext.Provider value={context}>
      {children}
    </OpenedPdfContext.Provider>
  );
};
