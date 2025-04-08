import MapView from "@/maps/MapView";

import { CSSProperties, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useIsPhone } from "@/components/context/PhoneContext";
import { createOrUpdateRoute } from "@/api/map/route_store";
import { Button } from "@/components/ui/button";

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
  /* id and route_name may be undefined, if the user is creating a new route */
  const [searchParams] = useSearchParams();
  const initialRouteId = parseInt(searchParams.get("id") || "-1");
  const [routeId, setRouteId] = useState<number>(initialRouteId);
  const initialRouteName = searchParams.get("route_name") || "New Route";
  const [routeName, setRouteName] = useState<string>(initialRouteName);

  const handleSave = async () => {
    const result = await createOrUpdateRoute(routeId, routeName);
    if (result && routeId === -1) {
      // If the routeId is -1, it means we are creating a new route
      setRouteId(result.id);
      alert(`Route created with ID: ${String(result.id)}`);
    } else if (result) {
      // If the routeId is not -1, it means we are updating an existing route
      alert(`Route updated with ID: ${String(result.id)}`);
    } else {
      alert("Failed to save route");
    }
  };

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
      {/* For this week, we do not load the route, but show the name in the name field */}
      {/* Allow user to change the name of the route */}
      <input
        type="text"
        value={routeName}
        onChange={(e) => {
          setRouteName(e.target.value);
        }}
        placeholder="Route Name"
        style={{
          width: "80%",
          padding: "10px",
          marginBottom: "20px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />
      <MapWrapper />
      <div>
        <Button
          onClick={() => {
            void handleSave();
          }}
          className="bg-blue-600 hover:bg-blue-700 text-black px-6 py-2 rounded-md shadow-md"
        >
          Save/Update Route
        </Button>
      </div>
    </div>
  );
};

export default RoutePlanningPage;
