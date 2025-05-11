import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button.tsx";

import { useState, useEffect } from "react";
import { getRoutesMeta } from "@/api/services/map/manage_routes";
import { RouteMeta } from "@/types/MapRoute.ts";

const MapPage = () => {
  const navigate = useNavigate();
  const [routeMetas, setRouteMetas] = useState<RouteMeta[]>([]);

  useEffect(() => {
    async function fetchRoutes() {
      const savedRouteMetas = await getRoutesMeta();
      setRouteMetas(savedRouteMetas);
    }
    void fetchRoutes();
  }, []);

  const handleRouteClick = (routeId: number) => {
    // Navigate to route planning with the route id and route_name as parameters
    void navigate(`/map/plan?id=${String(routeId)}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <h1 className="text-xl font-bold mb-6 text-black">
        SmartRide Map Module
      </h1>
      {/* For all saved routes, show them in a list of buttons, upon clicking it navigates to "/map/plan", but with the route id and route name as parameters */}
      {routeMetas.length > 0 && (
        <div className="mb-4">
          {routeMetas.map((routeMeta) => (
            <Button
              key={routeMeta.id}
              className="w-full max-w-xs text-black mb-2"
              onClick={() => {
                handleRouteClick(routeMeta.id);
              }}
            >
              {routeMeta.name}
            </Button>
          ))}
        </div>
      )}

      <Button
        className="w-full max-w-xs text-black"
        onClick={() => {
          void navigate(`/map/plan?id=-1`);
        }}
      >
        Create A New Route
      </Button>
    </div>
  );
};

export default MapPage;
