import { Marker } from "react-leaflet";
import L, { LatLngExpression } from "leaflet";

const arrowIcon = new L.Icon({
  iconUrl: "/navigation-arrow.png",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

const NavigationArrow = ({ position }: { position: LatLngExpression }) => {
  return <Marker position={position} icon={arrowIcon} />;
};

export default NavigationArrow;
