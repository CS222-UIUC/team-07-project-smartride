import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import WaypointMarkers from "./WaypointMarkers";
import RoutePolyline from "./RoutePolyline";
import AutoFocusView from "./AutoFocusView";
import MapClickHandler from "./MapClickHandler";
import { useState } from "react";
import SetViewToUserOnce from "./SetViewToUserOnce";

const MapView = () => {
  const [route, setRoute] = useState<{ lat: number; lng: number }[]>([]);
  const [waypoints, setWaypoints] = useState<{ lat: number; lng: number }[]>(
    []
  );

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <MapContainer
        center={[0, 0]}
        zoom={1}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <MapClickHandler
          onRouteFetched={setRoute}
          onPointsUpdate={setWaypoints}
        />

        <RoutePolyline points={route} />
        <WaypointMarkers points={waypoints} />
        {route.length > 0 && <AutoFocusView points={route} />}

        <SetViewToUserOnce />
      </MapContainer>
    </div>
  );
};

export default MapView;
