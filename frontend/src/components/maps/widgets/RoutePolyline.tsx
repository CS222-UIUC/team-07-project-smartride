import { LatLngExpression } from "leaflet";
import { Polyline } from "react-leaflet";
import { RouteData } from "@/types/MapRoute";

const RoutePolyline: React.FC<{ route: RouteData }> = ({
  route,
}) => {
  if (route.points.length === 0) return null;

  const routearr: LatLngExpression[] = route.points.map((pt) => [pt.coordinates.lat, pt.coordinates.lng]);
  return (
    <Polyline positions={routearr} pathOptions={{ color: "red", weight: 6 }} />
  );
};

export default RoutePolyline;
