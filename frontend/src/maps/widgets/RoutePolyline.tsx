import { LatLngExpression } from "leaflet";
import { Polyline } from "react-leaflet";

const RoutePolyline: React.FC<{ route: { lat: number; lng: number }[] }> = ({
  route,
}) => {
  if (route.length === 0) return null;

  const routearr: LatLngExpression[] = route.map((pt) => [pt.lat, pt.lng]);
  return (
    <Polyline positions={routearr} pathOptions={{ color: "red", weight: 6 }} />
  );
};

export default RoutePolyline;
