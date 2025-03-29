// MapView.tsx (example)
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { LatLngExpression, LeafletMouseEvent } from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapViewProps {
  onMapClick: (point: { lat: number; lng: number }) => void;
  selectedPoints: Array<{ lat: number; lng: number }>;
}

const MapView: React.FC<MapViewProps> = ({ onMapClick, selectedPoints }) => {
  const [position, setPosition] = useState<LatLngExpression | null>(null);

  // Example: get the user’s current location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
      },
      (err) => console.error("Error:", err),
      { enableHighAccuracy: true }
    );
  }, []);

  // This inner component handles clicks via useMapEvents
  function MapClickHandler() {
    useMapEvents({
      click(e: LeafletMouseEvent) {
        onMapClick(e.latlng);
      },
    });
    return null; // no visual rendering
  }

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <MapContainer
        center={position || [0, 0]}
        zoom={position ? 13 : 2}
        scrollWheelZoom
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Add the click handler so the parent can receive clicks */}
        <MapClickHandler />

        {/* Show markers for each selected point */}
        {selectedPoints.map((point, index) => (
          <Marker
            key={index}
            position={[point.lat, point.lng]}
          />
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
