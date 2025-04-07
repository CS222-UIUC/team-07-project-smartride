import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button.tsx";

import { useState, useEffect } from "react";
import { getSavedRoutes, Route } from "@/api/map/route_store.ts";

const MapPage = () => {
  const navigate = useNavigate();
  const [routes, setRoutes] = useState<Route[]>([]);

  useEffect(() => {
    async function fetchRoutes() {
      const savedRoutes = await getSavedRoutes();
      setRoutes(savedRoutes);
    }
    void fetchRoutes();
  }, []);

  const handleRouteClick = (routeId: number, routeName: string) => {
    // Navigate to route planning with the route id and route_name as parameters
    void navigate(
      `/map/plan?id=${String(routeId)}&route_name=${encodeURIComponent(routeName)}`
    );
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <h1 className="text-xl font-bold mb-6 text-black">
        SmartRide Map Module
      </h1>
      {/* For all saved routes, show them in a list of buttons, upon clicking it navigates to "/map/plan", but with the route id and route name as parameters */}
      {routes.length > 0 && (
        <div className="mb-4">
          {routes.map((route) => (
            <Button
              key={route.id}
              className="w-full max-w-xs text-black mb-2"
              onClick={() => {
                handleRouteClick(route.id, route.route_name);
              }}
            >
              {route.route_name}
            </Button>
          ))}
        </div>
      )}

      <Button
        className="w-full max-w-xs text-black"
        onClick={() => {
          void navigate("/map/plan");
        }}
      >
        Create A New Route
      </Button>
    </div>
  );
};

export default MapPage;
