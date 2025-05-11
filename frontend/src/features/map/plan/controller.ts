import { useCallback, useEffect, useState } from "react";
import { useRouteStore } from "./store";
import { isRouteDirty, updateRouteToBackend as rawUpdateRouteToBackend, setRouteData, loadRouteFromBackend, setRouteInfo } from "./state";
import { 
  addPoint as rawAddPoint,
  removePoint as rawRemovePoint,
  reorderPoints as rawReorderPoints,
  togglePointType as rawTogglePointType,
  clearPoints as rawClearPoints,
  onOpenPanel as rawOpenPanel,
  onClosePanel as rawClosePanel,
} from "./operations";
import type { Coordinates } from "@/types/MapRoute";
import { PlanMapBindings } from "./props";

export const usePlanController = () => {
  const [isDirty, setIsDirty] = useState(false);
  const [isPanelOpen, setPanelOpen] = useState(false);
  const route = useRouteStore((state) => state.route);

  useEffect(() => {
    const unsub = useRouteStore.subscribe(
    (state) => [state.route, state.originalRoute],
    () => { setIsDirty(isRouteDirty()) }
    );
    return unsub;
  }, []);

  const updateRouteToBackend = async () => {
    await rawUpdateRouteToBackend();
  };

  const addPoint = useCallback(async (coordinates: Coordinates) => {
    const updated = await rawAddPoint(route.data, coordinates);
    setRouteData(updated);
  }, [route]);

  const removePoint = useCallback(async (id: string) => {
    const updated = await rawRemovePoint(route.data, id);
    setRouteData(updated);
  }, [route]);

  const reorderPoints = useCallback(async (from: number, to: number) => {
    const updated = await rawReorderPoints(route.data, from, to);
    setRouteData(updated);
  }, [route]);

  const togglePointType = useCallback((id: string) => {
    const updated = rawTogglePointType(route.data, id);
    setRouteData(updated);
  }, [route]);

  const clearPoints = useCallback(() => {
    const updated = rawClearPoints(route.data);
    setRouteData(updated);
  }, [route]);


  const getMapBindings = (): PlanMapBindings => ({
    bindClass: "plan",
    routeData: route.data,
    userFocus: route.data.segments.length > 0,

    onClickAddPoint: (lat, lng) => { void addPoint({ lat, lng, ele: 0 }); },
    onReorderPoint: (from, to) => { void reorderPoints(from, to); },
    onTogglePointType: (id) => { togglePointType(id); },
    onRemovePoint: (id) => { void removePoint(id); },

    isPanelOpen,
    onOpenPanel: () => { rawOpenPanel(setPanelOpen) },
    onClosePanel: () => { rawClosePanel(setPanelOpen) },
  });


  return {
    isDirty,
    route,
    updateRouteToBackend,
    clearPoints,
    setRouteInfo,
    loadRouteFromBackend,
    getMapBindings,
  };
};