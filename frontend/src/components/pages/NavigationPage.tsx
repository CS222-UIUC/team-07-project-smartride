import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MapView from "@/components/maps/MapView";
import { useNavController } from "@/features/map/nav/controller";

const NavigationPage = () => {
  const navigate = useNavigate();
  const { getMapBindings, flatCoords } = useNavController();

  const [hasInjected, setHasInjected] = useState(false);

  useEffect(() => {
    if (flatCoords.length > 0) {
      setHasInjected(true);
    }
  }, [flatCoords]);

  if (!hasInjected) {
    return <div>Loading route...</div>;
  }

  return (
    <div className="absolute inset-0">
      <MapView {...getMapBindings()} />
      <Button
        onClick={() => {
          void navigate("/map/plan");
        }}
        className="bg-red-600 hover:bg-red-700 text-black px-6 py-2 rounded-md shadow-md absolute bottom-5 left-1/2 transform -translate-x-1/2 z-50"
      >
        Exit Navigation
      </Button>
    </div>
  );
};

export default NavigationPage;
