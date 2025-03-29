import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import {
  LatLngExpression,
  LeafletMouseEvent,
} from "leaflet";
import "leaflet/dist/leaflet.css";

/** Props for our click-handler component */
interface MapClickHandlerProps {
  onMapClick: (latlng: { lat: number; lng: number }) => void;
}

/**
 * Component to handle map clicks using the useMapEvents hook
 * We type the event with LeafletMouseEvent to avoid "implicit any."
 */
const MapClickHandler: React.FC<MapClickHandlerProps> = ({ onMapClick }) => {
  useMapEvents({
    click(e: LeafletMouseEvent) {
      onMapClick(e.latlng);
    },
  });
  return null; // No UI; just handles events
};

const SetViewToLocation = ({
  position,
}: {
  position: LatLngExpression;
}) => {
  const map = useMap();
  useEffect(() => {
    map.setView(position, 13);
  }, [position, map]);
  return null;
};

const MapView: React.FC = () => {
  const [position, setPosition] =
    useState<LatLngExpression | null>(null);

  // Get the user's location when the component mounts
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition([
          pos.coords.latitude,
          pos.coords.longitude,
        ] as LatLngExpression);
      },
      (err) => console.error("Geolocation error:", err),
      { enableHighAccuracy: true }
    );
  }, []);

  // Called whenever the user clicks the map
  const handleMapClick = (latlng: { lat: number; lng: number }) => {
    console.log("Map clicked at:", latlng);
    // Example: update position or do something else
    setPosition([latlng.lat, latlng.lng]);
  };

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <MapContainer
        center={[0, 0]}
        zoom={1}
        scrollWheelZoom={true}
        style={{
          height: "100%",
          width: "100%",
          margin: "0",
          padding: "0",
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* Use MapClickHandler so it isn't "unused" */}
        <MapClickHandler onMapClick={handleMapClick} />

        {/* If we have a position, recenter and show a marker */}
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
