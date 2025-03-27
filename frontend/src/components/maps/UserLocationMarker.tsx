import { useEffect, useState } from "react";
import { Marker } from "react-leaflet";
import L from "leaflet";

const userIcon = new L.Icon({
  iconUrl: "/markers/marker-icon-red.png",
  shadowUrl: "/markers/marker-shadow.png",
  iconSize: [35, 55],
  iconAnchor: [17, 55],
  popupAnchor: [1, -45],
  shadowSize: [50, 50],
});

const UserLocationMarker = ({
  onPosition,
}: {
  onPosition: (pos: [number, number]) => void;
}) => {
  const [position, setPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [
          pos.coords.latitude,
          pos.coords.longitude,
        ];
        setPosition(coords);
        onPosition(coords);
      },
      (err) => console.error("Geolocation error:", err),
      { enableHighAccuracy: true },
    );
  }, []);

  return position ? <Marker position={position} icon={userIcon} /> : null;
};

export default UserLocationMarker;
