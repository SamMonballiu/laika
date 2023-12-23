import { FC } from "react";

interface Props {
  options: number[];
  value: number;
  onSelect: (zoom: number) => void;
}

export const ZoomPicker: FC<Props> = ({ options, value, onSelect }) => {
  return (
    <select
      style={{ width: "200px" }}
      defaultValue={value}
      onChange={(e) => onSelect(parseFloat(e.target.value))}
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {(opt * 100).toFixed(0)} %
        </option>
      ))}
    </select>
  );
};
