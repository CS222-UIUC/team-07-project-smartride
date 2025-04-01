import { useMapEvents } from "react-leaflet";
import { LeafletMouseEvent } from "leaflet";
import { useState } from "react";
import { getRoute } from "@/api/map/route_service";

interface MapClickHandlerProps {
  onMapClick?: (latlng: { lat: number; lng: number }) => void;
}

const MapClickHandler: React.FC<MapClickHandlerProps> = ({ onMapClick }) => {
  const [lastTwoPoints, setLastTwoPoints] = useState<
    { lat: number; lng: number }[]
  >([]);

  useMapEvents({
    click(e: LeafletMouseEvent) {
      const clicked = e.latlng;

      onMapClick?.(clicked);

      const updated = [...lastTwoPoints, clicked];
      if (updated.length === 2) {
        const [start, dest] = updated;

        getRoute(start, dest)
          .then((res) => {
            console.log("Route result:", res);
          })
          .catch((err: unknown) => {
            console.error("Route fetch failed:", err);
          });

        setLastTwoPoints([dest]);
      } else {
        setLastTwoPoints(updated);
      }
    },
  });

  return null;
};

export default MapClickHandler;
