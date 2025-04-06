import { useState, useCallback } from "react";
import { nanoid } from "nanoid";
import { getRoute } from "@/api/map/route_service";

export type PointType = "main" | "waypoint";

export interface Point {
  id: string;
  label: string;
  lat: number;
  lng: number;
  type: PointType;
}

export const useManagePoints = () => {
  const [points, setPoints] = useState<Point[]>([]);
  const [route, setRoute] = useState<{ lat: number; lng: number }[]>([]);

  const addPoint = useCallback(
    (lat: number, lng: number) => {
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
        getRoute(from, to)
          .then((res) => {
            setRoute((prevRoute) => {
              const newRoute = [...prevRoute, ...res.route];
              console.log("old route", prevRoute);
              console.log("fetched route", res.route);
              console.log("new route", newRoute);
              return newRoute;
            });
          })
          .catch((err: unknown) => {
            console.error("Route fetch failed", err);
          });
      }
    },
    [points]
  );

  const removePoint = useCallback((id: string) => {
    setPoints((prev) => prev.filter((pt) => pt.id !== id));
  }, []);

  const togglePointType = useCallback((id: string) => {
    setPoints((prev) =>
      prev.map((pt) =>
        pt.id === id
          ? { ...pt, type: pt.type === "main" ? "waypoint" : "main" }
          : pt
      )
    );
  }, []);

  const reorderPoints = useCallback((from: number, to: number) => {
    setPoints((prev) => {
      const newPoints = [...prev];
      const [moved] = newPoints.splice(from, 1);
      newPoints.splice(to, 0, moved);
      return newPoints;
    });
  }, []);

  const clearPoints = useCallback(() => {
    setPoints([]);
    setRoute([]);
  }, []);

  return {
    points,
    route,
    setRoute,
    addPoint,
    removePoint,
    togglePointType,
    reorderPoints,
    clearPoints,
  };
};
