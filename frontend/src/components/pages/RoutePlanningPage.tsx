import MapView from "@/maps/MapView";

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
      {/* TODO (Daniel): Without prop, it should be a new route, with id as prop, it should be a loaded route.
      For this week, do not load the route, but show the name in the name field */}
      {/* TODO: Allow user to change the name of the route, add a input field */}
      <MapWrapper />{" "}
      {/* TODO: MapWrapper change height to not 100% but fill the screen, while seeing the input field and the save button */}
      {/* TODO: Add a button to save the route and link it to backend, use the functions in @/api/route_store.ts for now do NOT really save the route, but:
      if it is a new route, you should call the backend to create a new route and give name as parameter,
      if it is an existing route, you should call the backend to update the route with the new name. by passing the id and new name as parameter */}
      {/* Be careful of ESLint rules */}
    </div>
  );
};

export default RoutePlanningPage;
