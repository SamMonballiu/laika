import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { OpenedFileProvider } from "./context/OpenedPdfContext";
import { App } from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <OpenedFileProvider>
      <App />
    </OpenedFileProvider>
  </React.StrictMode>
);
