import { FC } from "react";
import { Scale } from "../models/models";
import { KonvaLine } from "./KonvaLine";

interface Props {
  scale: Scale;
  displayScale: number;
  rotation?: number;
}

export const KonvaScale: FC<Props> = (props) => {
  return <KonvaLine color="orange" {...props} />;
};
