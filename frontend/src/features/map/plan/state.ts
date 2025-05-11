import {
  Route,
  RouteData,
  RouteInfo,
  NEW_ROUTE_INFO,
  EMPTY_ROUTE_DATA,
} from "@/types/MapRoute";
import {
  getRouteInfoById,
  getRouteDataById,
  createRouteByInfo,
  updateRouteDataById,
  updateRouteInfoById,
} from "@/api/services/map/manage_routes";
import { useRouteStore } from "./store";

// ========== ACCESSORS ==========

const getRoute = (): Route => useRouteStore.getState().route;
const getRouteId = (): number => getRoute().id;
const getRouteInfo = (): RouteInfo => getRoute().info;
const getRouteData = (): RouteData => getRoute().data;
const getOriginalRoute = (): Route => useRouteStore.getState().originalRoute;
const getOriginalRouteInfo = (): RouteInfo => getOriginalRoute().info;
const getOriginalRouteData = (): RouteData => getOriginalRoute().data;
export const isNewRoute = (): boolean => getRouteId() === -1;

// ========== SETTERS ==========

const setRouteId = (id: number): void => {
  useRouteStore.getState().setRoute((prev) => ({ ...prev, id }));
};

export const setRouteInfo = (info: RouteInfo): void => {
  useRouteStore.getState().setRoute((prev) => ({ ...prev, info }));
};

export const setRouteData = (data: RouteData): void => {
  useRouteStore.getState().setRoute((prev) => ({ ...prev, data }));
};

// ========== DIRTY CHECKS ==========

const isInfoDirty = (): boolean =>
  JSON.stringify(getRouteInfo()) !== JSON.stringify(getOriginalRouteInfo());

const isDataDirty = (): boolean =>
  JSON.stringify(getRouteData()) !== JSON.stringify(getOriginalRouteData());

export const isRouteDirty = (): boolean =>
  isInfoDirty() || isDataDirty() || getRouteId() === -1; // so that we can always save a new route

const markInfoClean = (): void => {
  useRouteStore.getState().setOriginalRoute((prev) => ({
    ...prev,
    info: getRouteInfo(),
  }));
};

const markDataClean = (): void => {
  useRouteStore.getState().setOriginalRoute((prev) => ({
    ...prev,
    data: getRouteData(),
  }));
};

// ========== BACKEND SYNC ==========

export const loadRouteFromBackend = async (id: number): Promise<void> => {
  if (id === -1) {
    useRouteStore.setState({
      route: { id: -1, info: NEW_ROUTE_INFO, data: EMPTY_ROUTE_DATA },
      originalRoute: { id: -1, info: NEW_ROUTE_INFO, data: EMPTY_ROUTE_DATA },
      hasLoaded: true,
    });
    return;
  }

  const [info, data] = await Promise.all([
    getRouteInfoById(id),
    getRouteDataById(id),
  ]);

  useRouteStore.setState({
    route: { id, info, data },
    originalRoute: { id, info, data },
    hasLoaded: true,
  });
};

const createNewRouteOnBackend = async (): Promise<void> => {
  const info = getRouteInfo();
  const id = await createRouteByInfo(info);
  setRouteId(id);
  useRouteStore.getState().setOriginalRoute((prev) => ({
    ...prev,
    id,
  }));
  markInfoClean();
};

const updateRouteInfoToBackend = async (): Promise<void> => {
  if (isNewRoute()) throw new Error("Cannot update route info: id is -1.");
  await updateRouteInfoById(getRouteId(), getRouteInfo());
  markInfoClean();
};

const updateRouteDataToBackend = async (): Promise<void> => {
  if (isNewRoute()) throw new Error("Cannot update route data.");
  await updateRouteDataById(getRouteId(), getRouteData());
  markDataClean();
};

export const updateRouteToBackend = async (): Promise<void> => {
  if (isNewRoute()) {
    await createNewRouteOnBackend(); // already sets id + markInfoClean
    await updateRouteDataToBackend(); // always called upon create, to prevent empty route
    return;
  }

  if (isDataDirty()) {
    await updateRouteDataToBackend();
  }
  if (isInfoDirty()) {
    await updateRouteInfoToBackend();
  }
};
