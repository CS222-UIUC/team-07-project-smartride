import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import WaypointMarkers from "./WaypointMarkers";
import RoutePolyline from "./RoutePolyline";
import UserLocationMarker from "./UserLocationMarker";
import AutoFocusView from "./AutoFocusView";
import { LatLngExpression } from "leaflet";
import { useMemo, useState } from "react";
import waypoints from "./../../assets/waypoints_test.json";

const MapView = () => {
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const routearr: LatLngExpression[] = useMemo(() => {
    return waypoints.map((pt) => pt.coords as [number, number]);
  }, []);
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <MapContainer
        center={[0, 0]}
        zoom={1}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        {/* The background Tile layer renderer */}
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Component to mark way points */}
        <WaypointMarkers />

        {/* Component to mark routes */}
        <RoutePolyline />

        {/* Show User Location */}
        <UserLocationMarker onPosition={setUserPos} />
        {userPos && <AutoFocusView points={[userPos]} zoom={15} />}

        {/* Show Route Location */}
        {/* <AutoFocusView points={routearr} /> */}
      </MapContainer>
    </div>
  );
};

export default MapView;
