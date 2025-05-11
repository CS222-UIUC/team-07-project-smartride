import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { Route, NEW_ROUTE } from "@/types/MapRoute";

interface RouteStore {
  route: Route;
  originalRoute: Route;
  hasLoaded: boolean;
  setRoute: (updater: (prev: Route) => Route) => void;
  setOriginalRoute: (updater: (prev: Route) => Route) => void;
  setHasLoaded: (flag: boolean) => void;
}

export const useRouteStore = create<
  RouteStore,
  [["zustand/subscribeWithSelector", never]]
>(
  subscribeWithSelector((set) => ({
    route: NEW_ROUTE,
    originalRoute: NEW_ROUTE,
    hasLoaded: false,

    setRoute: (updater) => {
      set((store) => {
        const updatedRoute = updater(store.route);
        return { route: updatedRoute };
      });
    },

    setOriginalRoute: (updater) => {
      set((store) => {
        const updated = updater(store.originalRoute);
        return { originalRoute: updated };
      });
    },

    setHasLoaded: (flag) => {
      set(() => ({ hasLoaded: flag }));
    },
  })),
);
