import MapView from "@/maps/MapView.tsx";

import { CSSProperties, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useIsPhone } from "@/components/context/PhoneContext.tsx";
import { createOrUpdateRoute } from "@/api/map/route_store.ts";
import { Button } from "@/components/ui/button.tsx";
import type { Point, RouteSegment } from "@/maps/manage/structure.ts";
import { useEffect } from "react";
import { RouteRecord, GetRoutesResponse } from "@/api/map/route_service.ts";

const MapWrapper = ({
  onRouteDataChange,
  initialData,
}: {
  onRouteDataChange: (data: {
    points: Point[];
    segments: RouteSegment[];
  }) => void;
  initialData: { points: Point[]; segments: RouteSegment[] };
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

// interface RouteRecord {
//   id: number;
//   route_name: string;
//   route_data?: string | { points: Point[]; segments: RouteSegment[] };
// }

// interface GetRoutesResponse {
//   success: boolean;
//   data?: RouteRecord[];
// }

const RoutePlanningPage = () => {
  const [searchParams] = useSearchParams();
  const initialRouteId = parseInt(searchParams.get("id") || "-1");
  const [routeId, setRouteId] = useState<number>(initialRouteId);
  const initialRouteName = searchParams.get("route_name") || "New Route";
  const [routeName, setRouteName] = useState<string>(initialRouteName);

  const [routeData, setRouteData] = useState<{
    points: Point[];
    segments: RouteSegment[];
  }>({ points: [], segments: [] });

  const [hasLoadedData, setHasLoadedData] = useState(false);

  const handleSave = async () => {
    const result = await createOrUpdateRoute(routeId, routeName, routeData);
    if (result && routeId === -1) {
      setRouteId(result.id);
      alert(`Route created with ID: ${String(result.id)}`);
    } else if (result) {
      alert(`Route updated with ID: ${String(result.id)}`);
    } else {
      alert("Failed to save route");
    }
  };
  useEffect(() => {
    if (routeId === -1 || hasLoadedData) return;

    async function fetchRouteData() {
      try {
        const res = await fetch("/api/map/manage/get_routes", {
          credentials: "include",
        });

        const result = (await res.json()) as GetRoutesResponse;

        if (result.success && result.data) {
          const found: RouteRecord | undefined = result.data.find(
            (r: RouteRecord) => r.id === routeId,
          );

          if (found?.route_data) {
            try {
              const parsed =
                typeof found.route_data === "string"
                  ? (JSON.parse(found.route_data) as {
                      points: Point[];
                      segments: RouteSegment[];
                    })
                  : found.route_data;

              setRouteData(parsed);
            } catch (e) {
              console.error("Failed to parse route_data:", e);
            }
          }
        }
      } catch (e) {
        console.error("Failed to fetch or parse route_data:", e);
      } finally {
        setHasLoadedData(true);
      }
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
    </div>
  );
};

export default RoutePlanningPage;