import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import MapView from "@/maps/MapView";
import { Button } from "@/components/ui/button.tsx";
import type { Point, RouteSegment } from "@/maps/manage/structure";
import { splitRouteByPosition } from "@/utils/splitRoute";
import { getWeather, WeatherData } from "@/api/omt/get_weather";

interface RouteData {
  points: Point[];
  segments: RouteSegment[];
}

const NavigationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [routeData, setRouteData] = useState<RouteData>({
    points: [],
    segments: [],
  });
  const [routeId, setRouteId] = useState<number>(-1);
  const [hasLoadedRoute, setHasLoadedRoute] = useState(false);
  const [userPosition, setUserPosition] = useState<[number, number] | null>(
    null,
  );

  useEffect(() => {
    const state = location.state as
      | { routeData: RouteData; routeId: number }
      | undefined;
    if (state?.routeData) {
      setRouteData(state.routeData);
      setRouteId(state.routeId);
      setHasLoadedRoute(true);
    } else {
      console.error("No routeData found in navigation state.");
    }
  }, [location.state]);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setUserPosition([latitude, longitude]);
        const weather : WeatherData = await getWeather(latitude, longitude);
        console.log(weather);
      },
      (error) => {
        console.error("Error getting position:", error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      },
    );
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  const routePoints = useMemo(() => {
    return routeData.segments.flatMap((segment) =>
      segment.path.map((p) => [p.lat, p.lng] as [number, number]),
    );
  }, [routeData]);

  const { traveledPoints, remainingPoints } = useMemo(() => {
    if (!userPosition || routePoints.length === 0) {
      return { traveledPoints: [], remainingPoints: routePoints };
    }
    return splitRouteByPosition(routePoints, userPosition);
  }, [userPosition, routePoints]);

  if (!hasLoadedRoute) {
    return <div>Loading route...</div>;
  }

  return (
    <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}>
      <MapView
        initialData={routeData}
        onRouteDataChange={() => {}}
        readonly={true}
        userPosition={userPosition ?? [0, 0]}
        traveledPoints={traveledPoints}
        remainingPoints={remainingPoints}
      />
      <Button
        onClick={() => {
          if (routeId !== -1) {
            void navigate(`/map/plan?id=${routeId.toString()}`);
          } else {
            void navigate("/map/plan");
          }
        }}
        className="bg-red-600 hover:bg-red-700 text-black px-6 py-2 rounded-md shadow-md"
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
        }}
      >
        Exit Navigation
      </Button>
    </div>
  );
};

export default NavigationPage;
