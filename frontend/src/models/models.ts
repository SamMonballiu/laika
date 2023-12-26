export class Point {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  static get Empty(): Point {
    return new Point(-500, -500);
  }

  public get isEmpty() {
    return this.x === 0 && this.y === 0;
  }

  public asString() {
    return `[${this.x.toFixed(0)}, ${this.y.toFixed(0)}]`;
  }

  public align(other: Point, tolerance: number): Point {
    const difference = {
      horizontal: Math.abs(this.x - other.x),
      vertical: Math.abs(this.y - other.y),
    };

    if (difference.horizontal <= tolerance) {
      return new Point(other.x, this.y);
    }

    if (difference.vertical <= tolerance) {
      return new Point(this.x, other.y);
    }

    return this;
  }

  public sharesAxisWith(other: Point): boolean {
    const tolerance = 20;
    const result =
      Math.abs(this.x - other.x) < tolerance ||
      Math.abs(this.y - other.y) < tolerance;
    return result;
  }

  public isCloseTo(other: Point) {
    if (!other) {
      return false;
    }

    const tolerance = 20;

    return (
      Math.abs(this.x - other.x) < tolerance &&
      Math.abs(this.y - other.y) < tolerance
    );
  }
}

export const Points = {
  toNumberArray: (points: Point[]): number[] => {
    return points.reduce((acc, val) => {
      return acc.concat([val.x, val.y]);
    }, [] as number[]);
  },

  mirror: (first: Point, second: Point) => {
    const points = [first, second];
    points.splice(1, 0, new Point(second.x, first.y));
    points.splice(3, 0, new Point(first.x, second.y));
    return points;
  },
};

export const ScaleUnits = ["None", "Centimeters", "Meters"] as const;
export type ScaleUnit = (typeof ScaleUnits)[number];

export class Scale {
  public first: Point;
  public second: Point;
  public unit: ScaleUnit;
  public enteredDistance: number;
  public get actualDistance(): number {
    return Math.sqrt(
      Math.pow(this.first.x - this.second.x, 2) +
        Math.pow(this.first.y - this.second.y, 2)
    );
  }

  public get factor(): number {
    return this.enteredDistance / this.actualDistance;
  }

  public get isDefault(): boolean {
    return (
      this.first.isEmpty && this.second.isEmpty && this.enteredDistance === 0
    );
  }

  public get points() {
    return Points.toNumberArray([this.first, this.second]);
  }

  public get center(): Point {
    return new Point(
      Math.abs(this.second.x + this.first.x) / 2,
      Math.abs(this.second.y + this.first.y) / 2
    );
  }

  public get description(): string {
    const unitMap: Record<ScaleUnit, string> = {
      None: "",
      Meters: "m",
      Centimeters: "cm",
    };
    if (this.unit === "None") {
      return this.enteredDistance.toString();
    }

    return `${this.enteredDistance} ${unitMap[this.unit]}`;
  }

  constructor(first: Point, second: Point, distance: number, unit: ScaleUnit) {
    this.first = first;
    this.second = second;
    this.enteredDistance = distance;
    this.unit = unit;
  }

  public static Default(): Scale {
    return new Scale(Point.Empty, Point.Empty, 0, "None");
  }
}
