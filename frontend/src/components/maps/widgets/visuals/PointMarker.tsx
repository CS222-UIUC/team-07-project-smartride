import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useMemo } from "react";
import type { Point } from "@/types/MapRoute";

interface PointMarkerProps {
  points: Point[];
}

const createIcon = (color: string) =>
  new L.Icon({
    iconUrl: `/markers/marker-icon-${color}.png`,
    shadowUrl: `/markers/marker-shadow.png`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

const PointMarker: React.FC<PointMarkerProps> = ({ points }) => {
  const icons = useMemo(
    () => ({
      grey: createIcon("grey"),
      green: createIcon("green"),
      blue: createIcon("blue"),
    }),
    [],
  );

  if (points.length === 0) return null;

  return (
    <>
      {points.map((pt, idx) => {
        let icon = icons.grey;
        if (idx === 0) icon = icons.green;
        else if (idx === points.length - 1) icon = icons.blue;
        return (
          <div key={pt.id}>
            {
              <Marker
                position={[pt.coordinates.lat, pt.coordinates.lng]}
                icon={icon}
              >
                <Popup>{pt.label}</Popup>
              </Marker>
            }
          </div>
        );
      })}
    </>
  );
};

export default PointMarker;
