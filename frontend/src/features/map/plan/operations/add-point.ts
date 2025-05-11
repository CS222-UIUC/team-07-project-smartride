import { nanoid } from "nanoid";
import { toast } from "sonner";
import { calcRoute } from "@/api/services/ors/calc_route";
import type {
  Coordinates,
  Point,
  RouteData,
  RouteSegment,
} from "@/types/MapRoute";

/**
 * Adds a new point and a connecting segment (if applicable) to the given RouteData.
 * Returns updated RouteData.
 */
export const addPoint = async (
  routeData: RouteData,
  coordinates: Coordinates,
): Promise<RouteData> => {
  const newPoint: Point = {
    id: nanoid(6),
    label: `Point ${String(routeData.points.length + 1)}`,
    coordinates,
    type: "main",
  };

  const updatedPoints = [...routeData.points, newPoint];
  const updatedSegments = [...routeData.segments];

  if (updatedPoints.length >= 2) {
    const from = updatedPoints[updatedPoints.length - 2];
    const to = newPoint;

    try {
      const res = await calcRoute(from.coordinates, to.coordinates);
      const newSegment: RouteSegment = {
        from: from.id,
        to: to.id,
        path: res.route,
      };
      updatedSegments.push(newSegment);
    } catch (err) {
      toast.error(
        `Failed to calculate route from ${from.label} to ${to.label}`,
      );
      console.error("addPoint: calcRoute failed", err);
    }
  }

  return {
    points: updatedPoints,
    segments: updatedSegments,
  };
};
