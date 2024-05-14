import React, { createContext, useContext, useState } from "react";

interface OpenedPdfContextProps {
  path: string;
  setPath: (value: string) => void;
  pages: string[];
  setPages: (value: string[]) => void;
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
  const [pages, setPages] = useState<string[]>([]);
  const [selectedPage, setSelectedPage] = useState<number>(0);

  const context: OpenedPdfContextProps = {
    path,
    setPath,
    pages,
    setPages,
    selectedPage,
    setSelectedPage,
  };

  return (
    <OpenedPdfContext.Provider value={context}>
      {children}
    </OpenedPdfContext.Provider>
  );
};
