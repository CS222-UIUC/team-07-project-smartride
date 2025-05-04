import { API_URL } from "@/utils/api_url";
import { useJwt } from "./useJwt";

const API_URL_DIRECTORIES = {
  WEB: API_URL + "/web",
  MOB: API_URL + "/mob",
  MAP: API_URL + "/map",
  ORS: API_URL + "/ors",
  OMT: API_URL + "/omt",
} as const;

const API_WEB_PREFICES = {
  AUTH: API_URL_DIRECTORIES.WEB + "/auth",
  PROFILE: API_URL_DIRECTORIES.WEB + "/profile",
};
const API_MOB_PREFICES = {
  AUTH: API_URL_DIRECTORIES.MOB + "/auth",
  PROFILE: API_URL_DIRECTORIES.MOB + "/profile",
};
const API_MAP_PREFICES = {
  MANAGE_ROUTES: API_URL_DIRECTORIES.MAP + "/manage",
};
const API_ORS_PREFICES = {
  CALC_ROUTE: API_URL_DIRECTORIES.ORS + "/calc_route",
};
const API_OMT_PREFICES = {
  GET_WEATHER: API_URL_DIRECTORIES.OMT + "/get_weather",
};

// TODO (Brian): Also bind RESTAPI method, GET PUT POST DELETE ...
const API_ROUTES = {
  WEB_PROFILE: API_WEB_PREFICES.PROFILE + "/",
  WEB_LOGIN: API_WEB_PREFICES.AUTH + "/login",
  WEB_REGISTER: API_WEB_PREFICES.AUTH + "/register",
  WEB_LOGOUT: API_WEB_PREFICES.AUTH + "/logout",

  MOB_PROFILE: API_MOB_PREFICES.PROFILE + "/",
  MOB_LOGIN: API_MOB_PREFICES.AUTH + "/login",
  MOB_REGISTER: API_MOB_PREFICES.AUTH + "/register",
  MOB_LOGOUT: API_MOB_PREFICES.AUTH + "/logout",

  ORS_CALC_ROUTE: API_ORS_PREFICES.CALC_ROUTE + "/",

  OMT_GET_WEATHER: API_OMT_PREFICES.GET_WEATHER + "/",

  MAP_GET_ROUTE_BY_ID: API_MAP_PREFICES.MANAGE_ROUTES + "/get_route_by_id",
  MAP_GET_ROUTES_INFO: API_MAP_PREFICES.MANAGE_ROUTES + "/get_routes_info",
  MAP_SET_ROUTE: API_MAP_PREFICES.MANAGE_ROUTES + "/set_route",
};

export enum AUTH_OPTIONS {
  AUTH_STATUS = "AUTH_STATUS",
  AUTH_LOGIN = "AUTH_LOGIN",
  AUTH_REGISTER = "AUTH_REGISTER",
  AUTH_LOGOUT = "AUTH_LOGOUT",
}
const authRoutes = {
  AUTH_STATUS: useJwt ? API_ROUTES.MOB_PROFILE : API_ROUTES.WEB_PROFILE,
  AUTH_LOGIN: useJwt ? API_ROUTES.MOB_LOGIN : API_ROUTES.WEB_LOGIN,
  AUTH_REGISTER: useJwt ? API_ROUTES.MOB_REGISTER : API_ROUTES.WEB_REGISTER,
  AUTH_LOGOUT: useJwt ? API_ROUTES.MOB_LOGOUT : API_ROUTES.WEB_LOGOUT,
};

export enum PROFILE_OPTIONS {
  PROFILE_BASIC_INFO = "PROFILE_BASIC_INFO",
}
const profileRoutes = {
  PROFILE_BASIC_INFO: useJwt ? API_ROUTES.MOB_PROFILE : API_ROUTES.WEB_PROFILE,
};

export enum MAP_OPTIONS {
  MAP_GET_ROUTE_BY_ID = "MAP_GET_ROUTE_BY_ID",
  MAP_GET_ROUTES_INFO = "MAP_GET_ROUTES_INFO",
  MAP_SET_ROUTE = "MAP_SET_ROUTE",
}
const mapRoutes = {
  MAP_GET_ROUTE_BY_ID: API_ROUTES.MAP_GET_ROUTE_BY_ID,
  MAP_GET_ROUTES_INFO: API_ROUTES.MAP_GET_ROUTES_INFO,
  MAP_SET_ROUTE: API_ROUTES.MAP_SET_ROUTE,
};

export enum ORS_OPTIONS {
  ORS_CALC_ROUTE = "ORS_CALC_ROUTE",
}
const orsRoutes = {
  ORS_CALC_ROUTE: API_ROUTES.ORS_CALC_ROUTE,
};

export enum OMT_OPTIONS {
  OMT_GET_WEATHER = "OMT_GET_WEATHER",
}
const omtRoutes = {
  OMT_GET_WEATHER: API_ROUTES.OMT_GET_WEATHER,
};

const routeMap = {
  ...authRoutes,
  ...profileRoutes,
  ...mapRoutes,
  ...orsRoutes,
  ...omtRoutes,
};

type OptionKeys = keyof typeof routeMap;

export function getApiRoute(option: OptionKeys): string {
  const route = routeMap[option];
  if (!route) throw new Error("Invalid option: " + option);
  return route;
}
