// src/components/maps/SetViewToUserOnce.tsx
import { useEffect } from "react";
import { useMap } from "react-leaflet";

const SetViewToUserOnce: React.FC = () => {
  const map = useMap();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        map.setView([latitude, longitude], 15);
      },
      (err) => {
        console.error("Geolocation error:", err);
      },
      { enableHighAccuracy: true },
    );
  }, [map]);

  return null;
};

export default SetViewToUserOnce;
