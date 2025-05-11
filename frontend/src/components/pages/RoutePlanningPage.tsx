import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import MapWrapper from "@/components/maps/MapWrapper";
import { usePlanController, useNavController } from "@/features/map/controller";

const RoutePlanningPage = () => {
  const [searchParams] = useSearchParams();
  const routeId = parseInt(searchParams.get("id") || "-1");

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

  const [isNewRoute, setIsNewRoute] = useState(routeId === -1);
  const [routeName, setRouteName] = useState("");
  const [hasLoaded, setHasLoaded] = useState(false);
  const [needNewId, setNeedNewId] = useState(false);

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
      toast.success(
        `${isNewRoute ? "Created" : "Updated"} route successfully.`,
      );
      // Note: Currently id is not updated since async nature of react state, we cannot directly navigate
      if (isNewRoute) {
        // Temporarily forbid everything until we navigate
        setNeedNewId(true);
      }
    } catch (error) {
      console.error("Save failed:", error);
      toast.error("An error occurred while saving the route.");
    }
  };

  useEffect(() => {
    if (isNewRoute && needNewId && route.id !== -1) {
      void navigate(`/map/plan?id=${route.id.toString()}`, { replace: true });
      setNeedNewId(false);
      setIsNewRoute(false);
    }
  }, [route.id, needNewId, isNewRoute, navigate]);

  const preNavigate = () => {
    injectRouteData(route.data);
    void navigate(`/map/navigation?id=${route.id.toString()}`);
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
        disabled={!hasLoaded || needNewId}
        onChange={(e) => {
          handleInputChange(e.target.value);
        }}
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
          onClick={() => {
            void handleSave();
          }}
          disabled={
            !hasLoaded || !isDirty || routeName.trim() === "" || needNewId
          }
          className="!bg-blue-600 hover:!bg-blue-700 text-black px-6 py-2 rounded-md shadow-md"
        >
          Save/Update Route
        </Button>
      </div>

      <div style={{ marginTop: "10px" }}>
        <Button
          disabled={
            !hasLoaded ||
            needNewId ||
            isNewRoute ||
            route.data.points.length < 2 ||
            isDirty
          }
          onClick={() => {
            preNavigate();
          }}
          className="!bg-green-600 hover:!bg-green-700 text-black px-6 py-2 rounded-md shadow-md"
        >
          Start Navigation
        </Button>
      </div>
    </div>
  );
};

export default RoutePlanningPage;
