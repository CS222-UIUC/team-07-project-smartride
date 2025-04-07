import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const MapPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <h1 className="text-xl font-bold mb-6 text-black">
        SmartRide Map Module
      </h1>
      {/* Be careful of ESLint rules */}
      {/* In RoutePlanningPage we will be able to change name and save the route to backend*/}
      {/* TODO (Daniel): For all saved routes (use one of the functions in @/api/route_store.ts), show them in a list of buttons, upon clicking it should still navigate to "/map/plan", but with the route id as a parameter */}
      <Button
        className="w-full max-w-xs text-black"
        onClick={() => {
          void navigate("/map/plan");
        }}
      >
        Go to Route Planning
      </Button>
      {/* TODO: Change accordingly */}
    </div>
  );
};

export default MapPage;
