import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

const SetViewToLocation = ({ position }: { position: LatLngExpression }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(position, 13);
  }, [position, map]);
  return null;
};

const MapView = () => {
  const [position, setPosition] = useState<LatLngExpression | null>(null);

  useEffect(() => {
    /* Get the current location of the user */
    navigator.geolocation.getCurrentPosition(
      (pos) => setPosition([pos.coords.latitude, pos.coords.longitude] as LatLngExpression),
      (err) => console.error("Geolocation error:", err),
      { enableHighAccuracy: true }
    );
  }, []);

  return (
    // First add a wrapper div with full height and width
    <div style={{ height: "100%", width: "100%" }}>
      <MapContainer style={{ height: "100%", width: "100%", margin: "0", padding: "0" }} center={[0, 0]} zoom={1} scrollWheelZoom={true}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {position && (
          <>
            <SetViewToLocation position={position} />
            <Marker position={position} />
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default MapView;
