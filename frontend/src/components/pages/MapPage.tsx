// TODO
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const MapPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <h1 className="text-xl font-bold mb-6 text-black">
        SmartRide Map Module
      </h1>
      <Button
        className="w-full max-w-xs text-black"
        onClick={() => {
          void navigate("/map/plan");
        }}
      >
        Go to Route Planning
      </Button>
    </div>
  );
};

export default MapPage;
