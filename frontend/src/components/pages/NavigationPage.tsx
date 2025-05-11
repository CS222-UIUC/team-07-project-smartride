import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MapWrapper from "@/components/maps/MapWrapper";
import { useNavController } from "@/features/map/nav/controller";

const NavigationPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const routeId = parseInt(searchParams.get("id") ?? "-1");

  const { getMapBindings, flatCoords } = useNavController();
  const [hasInjected, setHasInjected] = useState(false);

  useEffect(() => {
    if (flatCoords.length > 0) {
      setHasInjected(true);
    }
  }, [flatCoords]);

  if (!hasInjected) {
    return (
      <div className="flex items-center justify-center h-screen text-lg text-gray-500">
        Loading route...
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Fullscreen map */}
      <MapWrapper bindings={getMapBindings()} />

      {/* Exit Button - Top Left */}
      <div className="absolute top-4 left-4 z-[1000]">
        <Button
          variant="outline"
          className="border-red-500 text-red-600 hover:bg-red-100"
          onClick={() => {
            void navigate(
              routeId !== -1
                ? `/map/plan?id=${routeId.toString()}`
                : "/map/plan",
            );
          }}
        >
          ← Exit
        </Button>
      </div>

      {/* Complete Button - Bottom Center */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000]">
        <Button
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-md shadow-lg"
          onClick={() => {
            void navigate(`/ride-log?routeId=${routeId.toString()}`);
          }}
        >
          Complete Ride and Log
        </Button>
      </div>
    </div>
  );
};

export default NavigationPage;
