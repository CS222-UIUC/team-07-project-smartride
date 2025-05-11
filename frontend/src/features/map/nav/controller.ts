import { useEffect, useRef, useMemo } from "react";
import {
  getViewPoints,
  startPositionTracking,
  stopPositionTracking,
  handlePositionUpdate,
} from "./operations";
import type { NavMapBindings } from "./props";
import { useNavStore } from "./store";
import { injectRouteData } from "./state";

export const useNavController = () => {
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    watchIdRef.current = startPositionTracking(handlePositionUpdate);
    return () => {
      if (watchIdRef.current !== null) {
        stopPositionTracking(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, []);

  const flatCoords = useNavStore((s) => s.flatCoords);
  const userPosition = useNavStore((s) => s.userPosition);
  const nearestIndex = useNavStore((s) => s.nearestIndex);

  const viewData = useMemo(() => {
    return getViewPoints(flatCoords, nearestIndex);
  }, [flatCoords, nearestIndex]);

  const getMapBindings = (): NavMapBindings => ({
    bindClass: "nav",
    userFocus: true,
    userPosition: userPosition ?? [0, 0],
    traveledPolyline: viewData.traveled,
    remainingPolyline: viewData.remaining,
  });

  return {
    flatCoords,
    userPosition,
    nearestIndex,
    viewData,
    injectRouteData,
    getMapBindings,
  };
};
