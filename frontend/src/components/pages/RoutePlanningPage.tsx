import MapView from "@/components/maps/MapView";

import { CSSProperties } from "react";
import { useIsPhone } from "@/components/context/PhoneContext";

const MapWrapper = () => {
  const IsPhone = useIsPhone();
  const style: CSSProperties = IsPhone
    ? {
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }
    : {
        width: "60%",
        height: "90%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      };

  return (
    <div style={style}>
      <MapView />
    </div>
  );
};

const RoutePlanningPage = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        alignItems: "center",
      }}
    >
      <MapWrapper />
    </div>
  );
};

export default RoutePlanningPage;
