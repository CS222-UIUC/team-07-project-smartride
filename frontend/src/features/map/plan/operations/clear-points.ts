import type { RouteData } from "@/types/MapRoute";

/**
 * Clears all points and segments from RouteData.
 */
export const clearPoints = (routeData: RouteData): RouteData => {
  return {
    ...routeData,
    points: [],
    segments: [],
  };
};
