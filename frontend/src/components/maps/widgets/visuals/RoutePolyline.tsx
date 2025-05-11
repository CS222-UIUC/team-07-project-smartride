// components/maps/widgets/visuals/RoutePolyline.tsx

import { LatLngExpression, PolylineOptions } from "leaflet";
import { Polyline } from "react-leaflet";
import type { RouteSegment } from "@/types/MapRoute";

interface Props {
  processedRoute: LatLngExpression[] | RouteSegment[];
  color?: string;
  weight?: number;
}

const RoutePolyline: React.FC<Props> = ({
  processedRoute,
  color = "red",
  weight = 6,
}) => {
  if (processedRoute.length === 0) return null;

  const options: PolylineOptions = { color, weight };

  // Draw a single polyline
  if (Array.isArray(processedRoute[0])) {
    return (
      <Polyline
        positions={processedRoute as LatLngExpression[]}
        pathOptions={options}
      />
    );
  }

  // Treat as RouteSegment[]
  return (
    <>
      {(processedRoute as RouteSegment[]).map((seg) => (
        <Polyline
          key={`${seg.from}-${seg.to}`}
          positions={seg.path.map((p) => [p.lat, p.lng] as LatLngExpression)}
          pathOptions={options}
        />
      ))}
    </>
  );
};

export default RoutePolyline;
