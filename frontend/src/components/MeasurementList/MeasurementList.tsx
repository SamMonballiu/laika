import { Popover } from "@headlessui/react";
import { FC } from "react";
import { CompactPicker } from "react-color";
import {
  LineMeasurement,
  PolygonalMeasurement,
} from "../../models/measurement";
import { Scale } from "../../models/models";
import { MeasurementViewmodel, Style, Styles } from "../../models/viewmodels";
import styles from "./MeasurementList.module.scss";

interface Props {
  list: MeasurementViewmodel[];
  scale: Scale;
  onChange: (idx: number, color: string, style: Style) => void;
}

export const MeasurementList: FC<Props> = ({ list, scale, onChange }) => {
  return (
    <div className={styles.container}>
      {list.map((item, idx) => (
        <Measurement
          model={item}
          key={idx}
          scale={scale}
          onChange={(color, style) => onChange(idx, color, style)}
        />
      ))}
    </div>
  );
};

interface MeasurementProps {
  model: MeasurementViewmodel;
  scale: Scale;
  onChange: (color: string, style: Style) => void;
}
const Measurement: FC<MeasurementProps> = ({ model, scale, onChange }) => {
  const data =
    model.measurement instanceof LineMeasurement
      ? model.measurement.getDescription(scale)
      : model.measurement instanceof PolygonalMeasurement
      ? model.measurement.getDescription(scale)
      : "";
  return (
    <div className={styles.measurement}>
      <p className={styles.name}>{model.name}</p>
      <div className={styles.data}>
        <p>{data}</p>
        <select
          value={model.style}
          onChange={(s) => onChange(model.color, s.target.value as Style)}
        >
          {Styles.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <Popover>
          <Popover.Button className={styles.colorPickerBtn}>
            <div
              className={styles.color}
              style={{ background: model.color }}
            ></div>
          </Popover.Button>

          <Popover.Panel className={styles.colorPicker}>
            <CompactPicker
              color={model.color}
              onChange={(result) => {
                onChange(result.hex, model.style);
              }}
            />
          </Popover.Panel>
        </Popover>
      </div>
    </div>
  );
};
