import { useMapEvents } from "react-leaflet";
import { LeafletMouseEvent } from "leaflet";

interface MapClickHandlerProps {
  onMapClick: (latlng: { lat: number; lng: number }) => void;
}

const MapClickHandler: React.FC<MapClickHandlerProps> = ({ onMapClick }) => {
  useMapEvents({
    click(e: LeafletMouseEvent) {
      onMapClick(e.latlng);
    },
  });
  return null;
};

export default MapClickHandler;
