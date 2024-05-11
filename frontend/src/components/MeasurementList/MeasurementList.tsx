import { Popover } from "@headlessui/react";
import { FC, useState } from "react";
import { CompactPicker } from "react-color";
import {
  LineMeasurement,
  PolygonalMeasurement,
} from "../../models/measurement";
import { Scale } from "../../models/models";
import { MeasurementViewmodel, Style, Styles } from "../../models/viewmodels";
import styles from "./MeasurementList.module.scss";
import { MdClose } from "react-icons/md";
import { useConfirmDialog } from "../../hooks/useConfirmDialog";

interface Props {
  list: MeasurementViewmodel[];
  scale: Scale;
  onChange: (idx: number, color: string, style: Style) => void;
  onDelete: (idx: number) => void;
}

export const MeasurementList: FC<Props> = ({
  list,
  scale,
  onChange,
  onDelete,
}) => {
  const [removeCandidate, setRemoveCandidate] = useState<number | null>(null);
  const confirmDelete = useConfirmDialog({
    isOpen: removeCandidate !== null,
    message: `Remove ${list[removeCandidate ?? - 1]?.name}?`,
    onConfirm: () => { 
      onDelete(removeCandidate!);
      setRemoveCandidate(null);
    },
    onCancel: () => setRemoveCandidate(null)
  })

  return (
    <div className={styles.container}>
      {confirmDelete.dialog}
      {list.map((item, idx) => (
        <Measurement
          model={item}
          key={idx}
          scale={scale}
          onChange={(color, style) => onChange(idx, color, style)}
          onDelete={() => setRemoveCandidate(idx)}
        />
      ))}
    </div>
  );
};

interface MeasurementProps {
  model: MeasurementViewmodel;
  scale: Scale;
  onChange: (color: string, style: Style) => void;
  onDelete: () => void;
}
const Measurement: FC<MeasurementProps> = ({
  model,
  scale,
  onChange,
  onDelete,
}) => {
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

        <MdClose className={styles.removeIcon} onClick={onDelete} />
      </div>
    </div>
  );
};
