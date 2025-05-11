import { useEffect, useMemo } from "react";
import { useMap } from "react-leaflet";
import { LatLngBoundsExpression, LatLngExpression } from "leaflet";
import type { RouteSegment } from "@/types/MapRoute";

interface Props {
  points: LatLngExpression[] | RouteSegment[];
  zoom?: number;
}

const AutoFocusView = ({ points, zoom = 13 }: Props) => {
  const map = useMap();

  const allPoints = useMemo(() => {
    if (points.length === 0) return [];
    if (Array.isArray(points)) {
      if (typeof points[0] === "object" && "path" in (points[0] as RouteSegment)) {
        return (points as RouteSegment[]).flatMap((seg) =>
          seg.path.map((p) => [p.lat, p.lng] as LatLngExpression)
        );
      }
      return points as LatLngExpression[];
    }
    return [];
  }, [points]);

  useEffect(() => {
    if (allPoints.length === 0) return;

    if (allPoints.length === 1) {
      map.setView(allPoints[0], zoom);
    } else {
      map.fitBounds(allPoints as LatLngBoundsExpression);
    }
  }, [map, allPoints, zoom]);

  return null;
};

export default AutoFocusView;
