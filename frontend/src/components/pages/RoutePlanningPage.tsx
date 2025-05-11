import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import MapWrapper from "@/components/maps/MapWrapper";
import { usePlanController, useNavController } from "@/features/map/controller";

const RoutePlanningPage = () => {
  const [searchParams] = useSearchParams();
  const routeId = parseInt(searchParams.get("id") || "-1");

  const isNewRoute = routeId === -1;
  const navigate = useNavigate();

  const {
    isDirty,
    route,
    updateRouteToBackend,
    loadRouteFromBackend,
    setRouteInfo,
    getMapBindings,
  } = usePlanController();
  const { injectRouteData } = useNavController();

  const [routeName, setRouteName] = useState("");
  const [hasLoaded, setHasLoaded] = useState(false);

  // one-time load of route data from backend
  useEffect(() => {
    if (hasLoaded) {
      return;
    }
    const load = async () => {
      await loadRouteFromBackend(routeId);
      setRouteName(route.info.name);
      setHasLoaded(true);
    };
    void load();
  }, [hasLoaded, loadRouteFromBackend, route.info.name, routeId]);

  const handleInputChange = (newName: string) => {
    setRouteName(newName);
    setRouteInfo({ ...route.info, name: newName });
  };

  const handleSave = async () => {
    try {
      await updateRouteToBackend();
      toast.success(`${isNewRoute ? "Created" : "Updated"} route successfully.`);

      if (isNewRoute) {
        void navigate(`/map/plan?id=${route.id.toString()}`, { replace: true });
      }
    } catch (error) {
      console.error("Save failed:", error);
      toast.error("An error occurred while saving the route.");
    }
  };

  const preNavigate = () => {
    injectRouteData(route.data);
    void navigate("/map/navigation");
  };


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
        disabled={!hasLoaded}
        onChange={(e) => { handleInputChange(e.target.value); }}
        style={{
          width: "80%",
          padding: "10px",
          marginBottom: "20px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />

      <MapWrapper bindings={getMapBindings()} />

      <div>
        <Button
          onClick={() => {void handleSave();}}
          disabled={!hasLoaded || !isDirty || routeName.trim() === ""}
          className="bg-blue-600 hover:bg-blue-700 text-black px-6 py-2 rounded-md shadow-md"
        >
          Save/Update Route
        </Button>
      </div>

      <div style={{ marginTop: "10px" }}>
        <Button
          onClick={() => {preNavigate();}}
          className="bg-green-600 hover:bg-green-700 text-black px-6 py-2 rounded-md shadow-md"
        >
          Start Navigation
        </Button>
      </div>
    </div>
  );
};

export default RoutePlanningPage;
