import { useState } from "react";

export const useZoom = () => {
  const options = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3];

  const [optionIndex, setOptionIndex] = useState(
    options.findIndex((x) => x === 1)
  );

  const setZoom = (value: number) =>
    setOptionIndex(options.findIndex((x) => x === value));

  const increment = () => {
    if (optionIndex === options.length - 1) {
      return;
    }
    setOptionIndex(optionIndex + 1);
  };

  const decrement = () => {
    if (optionIndex === 0) {
      return;
    }

    setOptionIndex(optionIndex - 1);
  };

  return {
    options,
    value: options[optionIndex],
    set: setZoom,
    increment,
    decrement,
    can: {
      increment: optionIndex < options.length - 1,
      decrement: optionIndex > 0,
    },
  };
};
