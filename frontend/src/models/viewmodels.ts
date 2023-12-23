import { LineMeasurement, Measurement } from "./measurement";

const Styles = ["solid", "dash", "dot", "dashdot"] as const;
export type Style = (typeof Styles)[number];

export abstract class MeasurementViewmodel {
  public measurement: Measurement;
  public name: string;
  public color: string;
  public style: Style;

  constructor(
    measurement: Measurement,
    name: string,
    color: string,
    style: Style
  ) {
    this.measurement = measurement;
    this.name = name;
    this.color = color;
    this.style = style;
  }
}

export class LineMeasurementViewmodel extends MeasurementViewmodel {
  constructor(
    measurement: LineMeasurement,
    name: string,
    color: string,
    style: Style
  ) {
    super(measurement, name, color, style);
  }
}
