import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { LatLngExpression } from "leaflet";

interface Props {
  position: LatLngExpression;
  zoom?: number;
}

const SetViewToLocation = ({ position, zoom = 13 }: Props) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, zoom);
    }
  }, [position, zoom, map]);

  return null;
};

export default SetViewToLocation;
