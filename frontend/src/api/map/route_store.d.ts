export interface Route {
    id: number;
    route_name: string;
}
export declare function getSavedRoutes(): Promise<Route[]>;
export declare function createOrUpdateRoute(routeId: number, routeName: string): Promise<Route | null>;
