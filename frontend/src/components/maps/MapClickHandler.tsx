import { useMapEvents } from "react-leaflet";
import { LeafletMouseEvent } from "leaflet";
import { useRef } from "react";
import { getRoute } from "@/api/map/route_service";

interface MapClickHandlerProps {
  onRouteFetched: (route: { lat: number; lng: number }[]) => void;
  onPointsUpdate?: (points: { lat: number; lng: number }[]) => void;
}

const MapClickHandler: React.FC<MapClickHandlerProps> = ({
  onRouteFetched,
  onPointsUpdate,
}) => {
  const pointsRef = useRef<{ lat: number; lng: number }[]>([]);

  useMapEvents({
    click(e: LeafletMouseEvent) {
      const latlng = { lat: e.latlng.lat, lng: e.latlng.lng };

      const newPoints = [...pointsRef.current, latlng];
      if (newPoints.length === 2) {
        getRoute(newPoints[0], newPoints[1])
          .then((res) => {
            onRouteFetched(res.route);
          })
          .catch((err: unknown) => {
            console.error("Route fetch failed", err);
          });
        pointsRef.current = [newPoints[1]];
        onPointsUpdate?.([newPoints[0], newPoints[1]]);
      } else {
        pointsRef.current = newPoints;
        onPointsUpdate?.(newPoints);
      }
    },
  });

  return null;
};

export default MapClickHandler;
