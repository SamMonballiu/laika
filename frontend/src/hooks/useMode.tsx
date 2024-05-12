import { useState } from "react";

export const Modes = [
  "select",
  "setscale",
  "measureLine",
  "measureRect",
  "measurePoly",
] as const;
export type Mode = (typeof Modes)[number];

export const useMode = (initial: Mode = "select") => {
  const [mode, setMode] = useState<Mode>(initial);
  const isOneOf = (...modes: Mode[]) => modes.includes(mode);
  const is = (value: Mode) => mode === value;

  return {
    value: mode,
    set: setMode,
    isOneOf,
    is,
  };
};
