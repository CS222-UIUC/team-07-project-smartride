export type PointType = "main" | "waypoint";

export interface Point {
  id: string;
  label: string;
  lat: number;
  lng: number;
  ele: number;
  type: PointType;
}

export interface RouteSegment {
  from: Point;
  to: Point;
  path: { lat: number; lng: number; ele: number }[];
}
