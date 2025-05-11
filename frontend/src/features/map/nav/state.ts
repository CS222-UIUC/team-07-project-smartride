import { useNavStore } from "./store";
import { LatLngExpression } from "leaflet";
import type { RouteData } from "@/types/MapRoute";

// ========== GETTERS ==========

export const getRouteData = (): RouteData =>
  useNavStore.getState().routeData;

export const getFlatCoords = (): LatLngExpression[] =>
  useNavStore.getState().flatCoords;

export const getUserPosition = (): LatLngExpression | null =>
  useNavStore.getState().userPosition;

export const getNearestIndex = (): number =>
  useNavStore.getState().nearestIndex;

export const getIsFinished = (): boolean =>
  useNavStore.getState().isFinished;

export const getRealCoords = (): LatLngExpression[] =>
  useNavStore.getState().realCoords;

// ========== SETTERS ==========

export const setUserPosition = (pos: [number, number]): void => {
  useNavStore.getState().setUserPosition(pos);
};

export const setNearestIndex = (index: number): void => {
  useNavStore.getState().setNearestIndex(index);
};

export const setIsFinished = (flag: boolean): void => {
  useNavStore.getState().setIsFinished(flag);
};

export const appendToRealCoords = (pos: [number, number]): void => {
  useNavStore.getState().appendToRealCoords(pos);
};

export const clearRealCoords = (): void => {
  useNavStore.getState().clearRealCoords();
};

// ========== LOAD ROUTE DATA ==========

export const injectRouteData = (data: RouteData): void => {
  const flat: LatLngExpression[] = data.segments.flatMap((seg) =>
    seg.path.map((p) => [p.lat, p.lng] as [number, number])
  );
  useNavStore.setState({
    routeData: data,
    flatCoords: flat,
    realCoords: [],
    nearestIndex: 0,
    isFinished: false,
  });
};