import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { LatLngBoundsExpression, LatLngExpression } from "leaflet";

interface Props {
  points: LatLngExpression[];
  zoom?: number;
}

const AutoFocusView = ({ points, zoom = 13 }: Props) => {
  const map = useMap();

  useEffect(() => {
    if (!map || points.length === 0) return;

    if (points.length === 1) {
      map.setView(points[0], zoom);
    } else {
      const bounds = points.map((point) =>
        Array.isArray(point) ? point : [point.lat, point.lng],
      );
      map.fitBounds(bounds as LatLngBoundsExpression);
    }
  }, [map, points, zoom]);

  return null;
};

export default AutoFocusView;
