import { Point, Scale, ScaleUnit } from "./models";

const calculatePolygonArea = (points: Point[]) => {
  let area = 0;
  let j = points.length - 1;

  for (let i = 0; i < points.length; i++) {
    area += (points[j].x + points[i].x) * (points[j].y - points[i].y);
    j = i;
  }

  return Math.abs(area / 2);
};

export abstract class Measurement {
  public points: Point[];
  public get asPointsArray() {
    return this.points.reduce((acc, pt) => {
      return acc.concat([pt.x, pt.y]);
    }, [] as number[]);
  }

  constructor(points: Point[]) {
    this.points = points;
  }

  abstract getDescription(scale?: Scale): string;
  abstract get center(): Point;
}

export class PolygonalMeasurement extends Measurement {
  constructor(points: Point[]) {
    super(points);
  }

  public GetArea(scale?: Scale) {
    if (!scale) {
      return undefined;
    }

    const area = calculatePolygonArea(this.points);
    return area * scale.factor * scale.factor;
  }

  public getDescription(scale: Scale) {
    const unitMap: Record<ScaleUnit, string> = {
      None: "",
      Meters: "m²",
      Centimeters: "cm²",
    };

    const area = this.GetArea(scale)!.toFixed(2);

    if (scale.unit === "None") {
      return area!.toString();
    }

    return `${area} ${unitMap[scale.unit]}`;
  }

  public get center(): Point {
    const byX = [...this.points].sort((a, b) => a.x - b.x);
    const byY = [...this.points].sort((a, b) => a.y - b.y);

    const leftMost = byX[0];
    const rightMost = byX[this.points.length - 1];
    const highest = byY[0];
    const lowest = byY[this.points.length - 1];

    return new Point(
      leftMost.x + (rightMost.x - leftMost.x) / 2,
      highest.y + (lowest.y - highest.y) / 2
    );
  }
}

export class LineMeasurement extends Measurement {
  public get start() {
    return this.points[0];
  }

  public get end() {
    return this.points[1];
  }

  public get distance() {
    return this.calcDistance(this.start, this.end);
  }

  private calcDistance(first: Point, second: Point) {
    return Math.sqrt(
      Math.pow(first.x - second.x, 2) + Math.pow(first.y - second.y, 2)
    );
  }

  constructor(first: Point, second: Point) {
    super([first, second]);
  }

  public GetDistance(scale: Scale) {
    if (!scale) {
      return null;
    }

    const dist = this.calcDistance(this.start, this.end);
    const scaledDistance = dist * scale.factor;
    return scaledDistance;
  }

  public get center(): Point {
    return new Point(
      Math.abs(this.end.x + this.start.x) / 2,
      Math.abs(this.end.y + this.start.y) / 2
    );
  }

  public getDescription(scale: Scale): string {
    const unitMap: Record<ScaleUnit, string> = {
      None: "",
      Meters: "m",
      Centimeters: "cm",
    };
    const distance = this.GetDistance(scale)!.toFixed(2);
    if (scale.unit === "None") {
      return distance!.toString();
    }

    return `${distance} ${unitMap[scale.unit]}`;
  }
}
