import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type { RouteData } from "@/types/MapRoute";
import { LatLngExpression } from "leaflet";

interface NavStore {
  // Read-only route data
  routeData: RouteData; // raw RouteData, kept for showing points and future use
  flatCoords: LatLngExpression[]; // RouteSegment[] after flattened, for matching and rendering

  // Real-time tracking
  userPosition: LatLngExpression | null;
  nearestIndex: number;
  isFinished: boolean;

  // User's real-time coordinates, for post-ride log generation
  realCoords: LatLngExpression[];

  // Updaters
  setRouteData: (data: RouteData) => void;
  setUserPosition: (pos: [number, number]) => void;
  setNearestIndex: (index: number) => void;
  setIsFinished: (flag: boolean) => void;
  appendToRealCoords: (pos: [number, number]) => void;
  clearRealCoords: () => void;
}

export const useNavStore = create<
  NavStore,
  [["zustand/subscribeWithSelector", never]]
>(
  subscribeWithSelector((set) => ({
    routeData: { points: [], segments: [] },
    flatCoords: [],

    userPosition: null,
    nearestIndex: 0,
    isFinished: false,

    realCoords: [],

    setRouteData: (data) => {
      const flat = data.segments.flatMap((seg) =>
        seg.path.map((p) => [p.lat, p.lng] as [number, number]),
      );
      set({ routeData: data, flatCoords: flat, realCoords: [] });
    },

    setUserPosition: (pos) => {
      set({ userPosition: pos });
    },

    setNearestIndex: (index) => {
      set({ nearestIndex: index });
    },

    setIsFinished: (flag) => {
      set({ isFinished: flag });
    },

    appendToRealCoords: (pos) => {
      set((state) => ({
        realCoords: [...state.realCoords, pos],
      }));
    },

    clearRealCoords: () => {
      set({ realCoords: [] });
    },
  })),
);
