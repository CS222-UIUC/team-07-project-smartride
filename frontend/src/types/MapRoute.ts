export type PointType = "main" | "waypoint";

export interface Coordinates {
  lat: number;
  lng: number;
  ele: number;
}

export interface Point {
  id: string;
  label: string;
  coordinates: Coordinates;
  type: PointType;
}

export interface RouteSegment {
  from: Point;
  to: Point;
  path: Coordinates[];
}

export interface RouteData {
  points: Point[];
  segments: RouteSegment[];
}

export const EMPTY_ROUTE_DATA: RouteData = {
  points: [],
  segments: [],
};

export interface ORSRouteData {
  distance: number;
  duration: number;
  route: Coordinates[];
}

export interface Route {
  id: number;
  route_name: string;
  route_data?: RouteData;
}

export const EMPTY_ROUTE: Route = {
  id: -1,
  route_name: "New Route",
}