import { useState, useCallback } from "react";
import { nanoid } from "nanoid";
import { getRoute } from "@/api/map/route_service";
import type { Point, RouteSegment } from "./structure";

export const useRouteOperations = () => {
  const [points, setPoints] = useState<Point[]>([]);
  const [segments, setSegments] = useState<RouteSegment[]>([]);

  const planFullRoute = useCallback(async (pts: Point[]) => {
    if (pts.length < 2) {
      setSegments([]);
      return;
    }

    const newSegments: RouteSegment[] = [];

    for (let i = 0; i < pts.length - 1; i++) {
      const from = pts[i];
      const to = pts[i + 1];
      try {
        const res = await getRoute(from, to);
        newSegments.push({ from, to, path: res.route });
      } catch (e) {
        console.error(`getRoute failed: ${from.label} → ${to.label}`, e);
      }
    }

    setSegments(newSegments);
  }, []);

  const addPoint = useCallback(
    async (lat: number, lng: number) => {
      const newPoint: Point = {
        id: nanoid(6),
        label: `Point ${String(points.length + 1)}`,
        lat,
        lng,
        type: "main",
      };

      const updatedPoints = [...points, newPoint];
      setPoints(updatedPoints);

      if (updatedPoints.length >= 2) {
        const from = updatedPoints[updatedPoints.length - 2];
        const to = updatedPoints[updatedPoints.length - 1];
        try {
          const res = await getRoute(from, to);
          setSegments((prev) => [...prev, { from, to, path: res.route }]);
        } catch (e) {
          console.error("getRoute failed:", e);
        }
      }
    },
    [points],
  );

  const removePoint = useCallback(
    async (id: string) => {
      const updated = points.filter((pt) => pt.id !== id);
      setPoints(updated);
      await planFullRoute(updated);
    },
    [planFullRoute, points],
  );

  const reorderPoints = useCallback(
    async (fromIndex: number, toIndex: number) => {
      const newPoints = [...points];
      const [moved] = newPoints.splice(fromIndex, 1);
      newPoints.splice(toIndex, 0, moved);
      setPoints(newPoints);
      await planFullRoute(newPoints);
    },
    [planFullRoute, points],
  );

  const togglePointType = useCallback((id: string) => {
    setPoints((prev) =>
      prev.map((pt) =>
        pt.id === id
          ? { ...pt, type: pt.type === "main" ? "waypoint" : "main" }
          : pt,
      ),
    );
  }, []);

  const clearPoints = useCallback(() => {
    setPoints([]);
    setSegments([]);
  }, []);

  return {
    points,
    segments,
    addPoint,
    removePoint,
    reorderPoints,
    togglePointType,
    clearPoints,
  };
};
