import { FC, useEffect, useRef, useState } from "react";
import { Scale, ScaleUnit, ScaleUnits } from "../../models/models";
import styles from "./ScalePicker.module.scss";
import cx from "classnames";

interface Props {
  scale?: Scale;
  onConfirm: (distance: number, unit: ScaleUnit) => void;
}

export const ScalePicker: FC<Props> = ({ scale, onConfirm }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [distance, setDistance] = useState<string>(
    scale?.enteredDistance.toString() ?? ""
  );
  const [unit, setUnit] = useState<ScaleUnit>(scale?.unit ?? "None");

  const handleConfirm = () => {
    onConfirm(parseFloat(distance), unit);
  };

  useEffect(() => {
    if (!inputRef.current) {
      return;
    }

    inputRef.current.type = "text";
    inputRef.current.setSelectionRange(0, distance.toString().length);
    inputRef.current.type = "number";
  }, []);

  return (
    <div className={styles.container}>
      <h2>Scale</h2>
      <section className={styles.line}>
        <p>Distance</p>
        <input
          ref={inputRef}
          type="text"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
          autoFocus
        />
      </section>
      <section className={styles.line}>
        <p>Unit</p>
        <ScaleUnitPicker selected={unit} onSelect={setUnit} />
      </section>
      <section className={styles.buttonRow}>
        <button onClick={handleConfirm} disabled={isNaN(parseFloat(distance))}>
          OK
        </button>
      </section>
    </div>
  );
};

const ScaleUnitPicker: FC<{
  selected: ScaleUnit;
  onSelect: (unit: ScaleUnit) => void;
}> = ({ selected, onSelect }) => {
  return (
    <div className={styles.unitPicker}>
      {ScaleUnits.map((x) => (
        <span
          key={x}
          onClick={() => onSelect(x)}
          className={cx(styles.unit, { [styles.selected]: x === selected })}
        >
          {x}
        </span>
      ))}
    </div>
  );
};
