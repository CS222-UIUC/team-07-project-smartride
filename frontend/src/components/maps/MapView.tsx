import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import WaypointMarkers from "./WaypointMarkers";
import RoutePolyline from "./RoutePolyline";
// import UserLocationMarker from "./UserLocationMarker";
import AutoFocusView from "./AutoFocusView";
import MapClickHandler from "./MapClickHandler";
import { useState } from "react";
import { LatLngExpression } from "leaflet";

const MapView = () => {
  // const [userPos, setUserPos] = useState<[number, number] | null>(null);
  // State to hold the clicked position
  const [clickedPos, setClickedPos] = useState<LatLngExpression | null>(null);

  // Update the clicked position when the map is clicked
  const handleMapClick = (latlng: { lat: number; lng: number }) => {
    console.log("Map clicked at:", latlng);
    setClickedPos([latlng.lat, latlng.lng]);
  };

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

        {/* Listen for map clicks */}
        <MapClickHandler onMapClick={handleMapClick} />

        {/* Mark way points */}
        <WaypointMarkers />

        {/* Draw routes */}
        <RoutePolyline />

        {/* Show User Location */}
        {/* <UserLocationMarker onPosition={setUserPos} /> */}

        {/* Auto-focus on user location */}
        {clickedPos && <AutoFocusView points={[clickedPos]} zoom={15} />}

        {/* Set view to the clicked location */}
        {/* {clickedPos && <SetViewToLocation position={clickedPos} zoom={13} />} */}

        {/* Add marker at the clicked location */}
        {clickedPos && <Marker position={clickedPos} />}
      </MapContainer>
    </div>
  );
};

export default MapView;
