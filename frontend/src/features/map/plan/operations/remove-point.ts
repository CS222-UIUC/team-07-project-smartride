import { calcRoute } from "@/api/services/ors/calc_route";
import type { RouteData, RouteSegment } from "@/types/MapRoute";

/**
 * Removes a point and performs minimal re-planning of affected segments.
 */
export const removePoint = async (
  routeData: RouteData,
  pointId: string
): Promise<RouteData> => {
  const points = routeData.points;
  const segments = routeData.segments;

  const index = points.findIndex((pt) => pt.id === pointId);
  if (index === -1) return routeData; // Point not found

  const newPoints = points.filter((pt) => pt.id !== pointId);

  // Case 1: Only one point
  if (points.length <= 1) {
    return {
      points: [],
      segments: [],
    };
  }

  // Case 2: Removing first point
  if (index === 0) {
    const newSegments = segments.filter((seg) => seg.from !== pointId);
    return {
      points: newPoints,
      segments: newSegments,
    };
  }

  // Case 3: Removing last point
  if (index === points.length - 1) {
    const newSegments = segments.filter((seg) => seg.to !== pointId);
    return {
      points: newPoints,
      segments: newSegments,
    };
  }

  // Case 4: Removing middle point, replan
  const prev = points[index - 1];
  const next = points[index + 1];

  const filteredSegments = segments.filter(
    (seg) => seg.from !== pointId && seg.to !== pointId
  );

  try {
    const res = await calcRoute(prev.coordinates, next.coordinates);
    const newSegment: RouteSegment = {
      from: prev.id,
      to: next.id,
      path: res.route,
    };
    return {
      points: newPoints,
      segments: [...filteredSegments, newSegment],
    };
  } catch (e) {
    console.error("Failed to replan after removal:", e);
    return {
      points: newPoints,
      segments: filteredSegments,
    };
  }
};
