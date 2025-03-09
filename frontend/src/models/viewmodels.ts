import {
  LineMeasurement,
  Measurement,
  PolygonalMeasurement,
} from "./measurement";

export const Styles = ["solid", "dash", "dashdot", "dot"] as const;
export type Style = (typeof Styles)[number];
export type LineWidth = 1 | 2 | 3;

export abstract class MeasurementViewmodel {
  public measurement: Measurement;
  public name: string;
  public color: string;
  public style: Style;
  public stroke: LineWidth;

  constructor(
    measurement: Measurement,
    name: string,
    color: string,
    style: Style,
    width: LineWidth
  ) {
    this.measurement = measurement;
    this.name = name;
    this.color = color;
    this.style = style;
    this.stroke = width;
  }
}

export class LineMeasurementViewmodel extends MeasurementViewmodel {
  constructor(
    measurement: LineMeasurement,
    name: string,
    color: string,
    style: Style
  ) {
    super(measurement, name, color, style, 1);
  }
}

export class PolygonalMeasurementViewmodel extends MeasurementViewmodel {
  constructor(
    measurement: PolygonalMeasurement,
    name: string,
    color: string,
    style: Style
  ) {
    super(measurement, name, color, style, 1);
  }
}
