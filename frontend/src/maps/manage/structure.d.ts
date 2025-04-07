export type PointType = "main" | "waypoint";
export interface Point {
    id: string;
    label: string;
    lat: number;
    lng: number;
    type: PointType;
}
export interface RouteSegment {
    from: Point;
    to: Point;
    path: {
        lat: number;
        lng: number;
    }[];
}
