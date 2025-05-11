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
  // from and to are point IDs
  from: string;
  to: string;
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

export interface RouteInfo {
  name: string;
  // RESERVE FOR FUTURE USE
  // description: string;
  // weekly: boolean;
  // weekday: string;
}

export interface Route {
  id: number;
  info: RouteInfo;
  data: RouteData;
}

export interface RouteMeta extends RouteInfo {
  id: number;
}

export const NEW_ROUTE_NAME = "New Route";
export const NEW_ROUTE_ID = -1;

export const NEW_ROUTE_INFO: RouteInfo = {
  name: NEW_ROUTE_NAME,
};

export const NEW_ROUTE: Route = {
  id: NEW_ROUTE_ID,
  info: NEW_ROUTE_INFO,
  data: EMPTY_ROUTE_DATA,
}

export const updateRouteId = (setRoute: (updater: (prev: Route) => Route) => void, newId: number): void => {
  setRoute(prev => ({
    ...prev,
    id: newId,
  }));
};

export const updateRouteInfo = (setRoute: (updater: (prev: Route) => Route) => void, newRouteInfo: RouteInfo): void => {
  setRoute(prev => ({
    ...prev,
    info: newRouteInfo,
  }));
};

export const updateRouteData = (setRoute: (updater: (prev: Route) => Route) => void, newRouteData?: RouteData): void => {
  setRoute(prev =>({
    ...prev,
    route_data: newRouteData,
  }));
};