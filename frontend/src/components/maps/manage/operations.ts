import { useState, useCallback } from "react";
import { nanoid } from "nanoid";
import { calcRoute } from "@/api/services/ors/calc_route.js";
import { EMPTY_ROUTE_DATA, Point, PointType, RouteData, RouteSegment } from "@/types/MapRoute.ts";
import { toast } from "sonner";

export const useRouteOperations = (
  initialRoute: RouteData = EMPTY_ROUTE_DATA,
) => {
  const [route, setRoute] = useState<RouteData>(initialRoute);

  const setSegments = useCallback((newSegments: RouteSegment[]) => {
    setRoute((prevRoute) => ({
      ...prevRoute,
      segments: newSegments,
    }));
  }, []);

  const setPoints = useCallback((newPoints: Point[]) => {
    setRoute((prevRoute) => ({
      ...prevRoute,
      points: newPoints,
    }));
  }
  , []);

  const planFullRoute = useCallback(async () => {
    if (route.points.length < 2) {
      setSegments([]);
      return;
    }

    const newSegments: RouteSegment[] = [];

    const pts = route.points;
    for (let i = 0; i < pts.length - 1; i++) {
      const from = pts[i];
      const to = pts[i + 1];
      try {
        const res = await calcRoute(from.coordinates, to.coordinates);
        newSegments.push({ from, to, path: res.route });
      } catch (e) {
        toast.error(`Failed to calculate route from ${from.label} to ${to.label}`);
        console.error(`getRoute failed: ${from.label} → ${to.label}`, e);
      }
    }
    setSegments(newSegments);
  }, [route.points, setSegments]);

  // TODO: Add a new helper function to plan the route only for updated parts to prevent recalculating

  const addPoint = useCallback(
    async (lat: number, lng: number) => {
      const points: Point[] = route.points;
      const newPoint: Point = {
        id: nanoid(6),
        label: `Point ${String(points.length + 1)}`,
        coordinates: {lat, lng, ele: -22207},
        type: "main",
      };
      const updatedPoints = [...points, newPoint];
      setPoints(updatedPoints);
      if (updatedPoints.length < 2)
        return;
      const from = updatedPoints[updatedPoints.length - 2];
      const to = updatedPoints[updatedPoints.length - 1];
      try {
        const res = await calcRoute(from.coordinates, to.coordinates);
        const newSegment: RouteSegment = {
          from,
          to,
          path: res.route,
        };
        setSegments([...route.segments, newSegment]);
      } catch (e) {
        toast.error(`Failed to calculate route from ${from.label} to ${to.label}`);
        console.error("getRoute failed:", e);
      }
    },
    [route.segments, route.points, setPoints, setSegments],
  );

  const removePoint = useCallback(
    async (id: string) => {
      const points: Point[] = route.points;
      const updated = points.filter((pt) => pt.id !== id);
      setPoints(updated);
      await planFullRoute();
    },
    [planFullRoute, route.points, setPoints],
  );

  const reorderPoints = useCallback(
    async (fromIndex: number, toIndex: number) => {
      const points: Point[] = route.points;
      const newPoints = [...points];
      const [moved] = newPoints.splice(fromIndex, 1);
      newPoints.splice(toIndex, 0, moved);
      setPoints(newPoints);
      await planFullRoute();
    },
    [planFullRoute, route.points, setPoints],
  );

  const togglePointType = useCallback((id: string) => {
    const points: Point[] = route.points;
    const updated = points.map((pt) =>
      pt.id === id
        ? { ...pt, type: (pt.type === "main" ? "waypoint" : "main") as PointType }
        : pt,
    );
    setPoints(updated);
  }, [route.points, setPoints]);

  const clearPoints = useCallback(() => {
    setPoints([]);
    setSegments([]);
  }, [setPoints, setSegments]);

  return {
    route,
    addPoint,
    removePoint,
    reorderPoints,
    togglePointType,
    clearPoints,
  };
};
