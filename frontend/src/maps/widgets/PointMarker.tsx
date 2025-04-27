import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useMemo } from "react";
import type { Point } from "../manage/structure.ts";

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
          <Marker key={pt.id} position={[pt.lat, pt.lng]} icon={icon}>
            <Popup>{pt.label}</Popup>
          </Marker>
        );
      })}
    </>
  );
};

export default PointMarker;
