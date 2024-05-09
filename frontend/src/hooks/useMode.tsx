import { useState } from "react";

export const Modes = [
    "setscale",
    "measureLine",
    "measureRect",
    "measurePoly",
  ] as const;
export type Mode = (typeof Modes)[number];

export const useMode = () => {
    const [mode, setMode] = useState<Mode>("measureRect");

    const isOneOf = (...modes: Mode[]) => modes.includes(mode);

    return {
        mode,
        setMode,
        isOneOf
    }
}