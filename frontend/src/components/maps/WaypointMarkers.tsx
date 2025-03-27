import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import waypoints from "./../../assets/waypoints_test.json";

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

const WaypointMarkers = () => {
  return (
    <>
      {waypoints.map((pt, idx) => {
        let iconColor = "grey";
        if (idx === 0) iconColor = "green";
        else if (idx === waypoints.length - 1) iconColor = "blue";
        else iconColor = idx % 2 === 0 ? "orange" : "violet";

        return (
          <Marker
            key={pt.id}
            position={pt.coords as [number, number]}
            icon={createIcon(iconColor)}
          >
            <Popup>{pt.label}</Popup>
          </Marker>
        );
      })}
    </>
  );
};

export default WaypointMarkers;
