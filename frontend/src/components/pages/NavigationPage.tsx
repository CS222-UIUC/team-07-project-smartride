import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import MapView from "@/maps/MapView";
import { Button } from "@/components/ui/button.tsx";
import type { Point, RouteSegment } from "@/maps/manage/structure";
// import NavigationArrow from "@/maps/widgets/NavigationArrow"; 
import { splitRouteByPosition } from "@/utils/splitRoute"; 

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

  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);

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

  // track user position
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserPosition([latitude, longitude]);
      },
      (error) => {
        console.error("Error getting position:", error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  const routePoints = useMemo(() => {
    return routeData.segments.flatMap((segment) =>
      segment.path.map((p) => [p.lat, p.lng] as [number, number])
    );
  }, [routeData]);

  // Split the route into traveled and remaining points based on user position
  const { traveledPoints, remainingPoints } = useMemo(() => {
    if (!userPosition || routePoints.length === 0) {
      return { traveledPoints: [], remainingPoints: routePoints };
    }
    return splitRouteByPosition(routePoints, userPosition);
  }, [userPosition, routePoints]);

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
          <div style={{ width: "100%", height: "90%", position: "relative" }}>
            <MapView
              initialData={routeData}
              onRouteDataChange={() => {}}
              readonly={true}
              userPosition={userPosition ?? undefined}
              traveledPoints={traveledPoints}
              remainingPoints={remainingPoints}
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
