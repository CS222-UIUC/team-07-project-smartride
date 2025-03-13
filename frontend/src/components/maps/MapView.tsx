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
    navigator.geolocation.getCurrentPosition(
      (pos) => setPosition([pos.coords.latitude, pos.coords.longitude] as LatLngExpression),
      (err) => console.error("Geolocation error:", err),
      { enableHighAccuracy: true }
    );
  }, []);

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <MapContainer style={{ height: "100%", width: "100%" }}>
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
