import { LatLngExpression } from "leaflet";
import { Polyline } from "react-leaflet";
import waypoints from "./../../assets/waypoints_test.json";
import { useMemo } from "react";

// test purpose only
const RoutePolyline = () => {
  const routearr: LatLngExpression[] = useMemo(() => {
    return waypoints.map((pt) => pt.coords as [number, number]);
  }, []);
  return (
    <>
      <Polyline
        positions={routearr}
        pathOptions={{ color: "red", weight: 6 }}
      />
    </>
  );
};

export default RoutePolyline;
