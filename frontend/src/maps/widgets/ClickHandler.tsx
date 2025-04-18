import { useMapEvents } from "react-leaflet";
import { LeafletMouseEvent } from "leaflet";

const ClickHandler = ({
  onClick,
}: {
  onClick: (lat: number, lng: number) => void;
}) => {
  useMapEvents({
    click: (e: LeafletMouseEvent) => {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

export default ClickHandler;
