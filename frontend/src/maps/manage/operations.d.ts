import type { Point, RouteSegment } from "./structure.ts";
export declare const useRouteOperations: () => {
    points: Point[];
    segments: RouteSegment[];
    addPoint: (lat: number, lng: number) => Promise<void>;
    removePoint: (id: string) => Promise<void>;
    reorderPoints: (fromIndex: number, toIndex: number) => Promise<void>;
    togglePointType: (id: string) => void;
    clearPoints: () => void;
};
