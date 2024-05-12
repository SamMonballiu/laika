import { FC } from "react";
import styles from "./ZoomPicker.module.scss";

interface Props {
  options: number[];
  value: number;
  onSelect: (zoom: number) => void;
  onDecrement?: () => void;
  onIncrement?: () => void;
}

export const ZoomPicker: FC<Props> = ({
  options,
  value,
  onSelect,
  onDecrement,
  onIncrement,
}) => {
  return (
    <div className={styles.container}>
      <button disabled={!onDecrement} onClick={onDecrement}>
        -
      </button>
      <select
        style={{ width: "200px" }}
        value={value}
        onChange={(e) => onSelect(parseFloat(e.target.value))}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {(opt * 100).toFixed(0)}%
          </option>
        ))}
      </select>
      <button disabled={!onIncrement} onClick={onIncrement}>
        +
      </button>
    </div>
  );
};
