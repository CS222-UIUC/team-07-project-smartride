interface Coordinates {
    lat: number;
    lng: number;
}
interface RouteResponse {
    distance: number;
    duration: number;
    route: Coordinates[];
}
export declare function getRoute(start: Coordinates, dest: Coordinates): Promise<RouteResponse>;
export {};
