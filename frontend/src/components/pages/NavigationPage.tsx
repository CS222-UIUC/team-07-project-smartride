import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import MapView from "@/maps/MapView";
import { Button } from "@/components/ui/button.tsx";
import type { Point, RouteSegment } from "@/maps/manage/structure";

interface RouteData {
  points: Point[];
  segments: RouteSegment[];
}

const NavigationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [routeData, setRouteData] = useState<RouteData>({ points: [], segments: [] });
  const [routeId, setRouteId] = useState<number>(-1);
  const [hasLoadedRoute, setHasLoadedRoute] = useState(false);

  useEffect(() => {
    const state = location.state as { routeData: RouteData; routeId: number } | undefined;
    if (state?.routeData) {
      setRouteData(state.routeData);
      setRouteId(state.routeId ?? -1);
      setHasLoadedRoute(true);
    } else {
      console.error("No routeData found in navigation state.");
    }
  }, [location.state]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {hasLoadedRoute ? (
        <>
          <div style={{ width: "100%", height: "90%" }}>
            <MapView
              initialData={routeData}
              onRouteDataChange={() => {}}
              readonly={true}
            />
          </div>
          <div style={{ marginTop: "10px" }}>
            <Button
              onClick={() => {
                if (routeId !== -1) {
                  navigate(`/map/plan?id=${routeId}`);
                } else {
                  navigate("/map/plan");
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-black px-6 py-2 rounded-md shadow-md"
            >
              Exit Navigation
            </Button>
          </div>
        </>
      ) : (
        <div>Loading route...</div>
      )}
    </div>
  );
};

export default NavigationPage;
