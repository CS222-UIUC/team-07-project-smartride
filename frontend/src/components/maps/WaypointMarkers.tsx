// src/components/maps/WaypointMarkers.tsx
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";

interface Waypoint {
  lat: number;
  lng: number;
}

interface WaypointMarkersProps {
  points: Waypoint[];
}

// Marker Icon
const createIcon = (color: string) =>
  new L.Icon({
    iconUrl: `/markers/marker-icon-${color}.png`,
    shadowUrl: `/markers/marker-shadow.png`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

const WaypointMarkers: React.FC<WaypointMarkersProps> = ({ points }) => {
  if (points.length === 0) return null;

  return (
    <>
      {points.map((pt, idx) => {
        const icon = idx === 0 ? createIcon("green") : createIcon("blue");

        return (
          <Marker
            key={`${pt.lat.toString()},${pt.lng.toString()}`}
            position={[pt.lat, pt.lng]}
            icon={icon}
          >
            <Popup>{idx === 0 ? "Start Point" : "Destination"}</Popup>
          </Marker>
        );
      })}
    </>
  );
};

export default WaypointMarkers;
