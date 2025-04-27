import { Marker } from "react-leaflet";
import L from "leaflet";

const arrowIcon = new L.Icon({
  iconUrl: "/public/navigation-arrow.png",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

const NavigationArrow = ({ position }: { position: [number, number] }) => {
  return <Marker position={position} icon={arrowIcon} />;
};

export default NavigationArrow;
