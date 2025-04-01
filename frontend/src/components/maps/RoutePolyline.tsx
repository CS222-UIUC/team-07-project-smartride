import { LatLngExpression } from "leaflet";
import { Polyline } from "react-leaflet";

interface RoutePolylineProps {
  points?: Array<{ lat: number; lng: number }>;
}

const defaultPoints: Array<{ lat: number; lng: number }> = [];

const RoutePolyline: React.FC<RoutePolylineProps> = ({
  points = defaultPoints,
}) => {
  console.log("[RoutePolyline receive points]: ", points);
  if (points.length === 0) return null;
  const routearr: LatLngExpression[] = points.map((pt) => [pt.lat, pt.lng]);
  return (
    <Polyline positions={routearr} pathOptions={{ color: "red", weight: 6 }} />
  );
};

export default RoutePolyline;
