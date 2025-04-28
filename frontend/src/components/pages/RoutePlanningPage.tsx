import MapView from "@/components/maps/MapView.tsx";

import { CSSProperties, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useIsPhone } from "@/components/context/PhoneContext.tsx";
import { createOrUpdateRoute, getRouteById } from "@/api/services/map/manage_routes";
import { Button } from "@/components/ui/button.tsx";
import type { Point, RouteData, RouteSegment } from "@/types/MapRoute.ts";
import { useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// TODO: Do not store the route data here, call operations.ts
const MapWrapper = ({
  onRouteDataChange,
  initialData,
}: {
  onRouteDataChange: (route: RouteData) => void;
  initialData: RouteData;
}) => {
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
      <MapView
        onRouteDataChange={onRouteDataChange}
        initialData={initialData}
      />
    </div>
  );
};

const RoutePlanningPage = () => {
  const [searchParams] = useSearchParams();
  const initialRouteId = parseInt(searchParams.get("id") || "-1");
  const [routeId, setRouteId] = useState<number>(initialRouteId);
  const [routeName, setRouteName] = useState<string>("New Route");

  const [routeData, setRouteData] = useState<{
    points: Point[];
    segments: RouteSegment[];
  }>({ points: [], segments: [] });

  const [hasLoadedData, setHasLoadedData] = useState(false);
  const navigate = useNavigate();

  const handleSave = async () => {
    const result = await createOrUpdateRoute(routeId, routeName, routeData);
    try {
      if (routeId === -1) {
      setRouteId(result.id);
      toast.success(`Route is successfully created.`);
      } else {
      toast.success(`Route is successfully updated.`);
      }
    } catch (error) {
      console.error("Failed to save/update route:", error);
      toast.error("An error occurred while saving/updating the route.");
    }
  };
  useEffect(() => {
    if (routeId === -1 || hasLoadedData) return;

    async function fetchRouteData() {
      const res = await getRouteById(routeId);
      if (res.route_name) {
        setRouteName(res.route_name);
      }
      if (res.route_data) {
        try {
          const parsed =
            typeof res.route_data === "string"
              ? (JSON.parse(res.route_data) as {
                  points: Point[];
                  segments: RouteSegment[];
                })
              : res.route_data;

          setRouteData(parsed);
        } catch (e) {
          console.error("Failed to parse route_data:", e);
        }
      }
      setHasLoadedData(true);
    }
    void fetchRouteData();
  }, [routeId, hasLoadedData]);

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
      {routeId === -1 || routeData.points.length > 0 ? (
        <MapWrapper
          initialData={routeData}
          onRouteDataChange={(data) => {
            setRouteData(data);
          }}
        />
      ) : (
        <div>Loading route data...</div> // or a spinner
      )}
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

      <div style={{ marginTop: "10px" }}>
        <Button
          onClick={() => {
            void navigate("/map/navigation", { state: { routeData, routeId } });
          }}
          className="bg-green-600 hover:bg-green-700 text-black px-6 py-2 rounded-md shadow-md"
        >
          Start Navigation
        </Button>
      </div>
    </div>
  );
};

export default RoutePlanningPage;
