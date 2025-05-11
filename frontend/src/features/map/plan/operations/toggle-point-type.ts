import type { PointType, RouteData } from "@/types/MapRoute";

/**
 * Toggles a point's type between "main" and "waypoint".
 * Does not trigger replanning.
 */
export const togglePointType = (
  routeData: RouteData,
  pointId: string,
): RouteData => {
  const updatedPoints = routeData.points.map((pt) =>
    pt.id === pointId
      ? {
          ...pt,
          type:
            pt.type === "main"
              ? ("waypoint" as PointType)
              : ("main" as PointType),
        }
      : pt,
  );

  return {
    ...routeData,
    points: updatedPoints,
  };
};
