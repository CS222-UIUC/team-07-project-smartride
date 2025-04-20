const API_URL_DIRECTORIES = {
  WEB: "/api/web",
  MOB: "/api/mob",
  MAP: "/api/map",
  ORS: "/api/ors",
} as const;

const WEB_PREFICES = {
  AUTH: API_URL_DIRECTORIES.WEB + "/auth",
  PROFILE: API_URL_DIRECTORIES.WEB + "/profile",
};
const MOB_PREFICES = {
  AUTH: API_URL_DIRECTORIES.MOB + "/auth",
  PROFILE: API_URL_DIRECTORIES.MOB + "/profile",
};
const MAP_PREFICES = {
  MANAGE_ROUTES: API_URL_DIRECTORIES.MAP + "/manage",
};
const ORS_PREFICES = {
  CALC_ROUTE: API_URL_DIRECTORIES.ORS + "/calc_route",
};

// TODO (Brian): Also bind RESTAPI method, GET PUT POST DELETE ...
// TODO (Brian): Use route_dictionary
export const API_ROUTES = {
  WEB_PROFILE: WEB_PREFICES.PROFILE + "/",
  WEB_LOGIN: WEB_PREFICES.AUTH + "/login",
  WEB_REGISTER: WEB_PREFICES.AUTH + "/register",
  WEB_LOGOUT: WEB_PREFICES.AUTH + "/logout",

  MOB_PROFILE: MOB_PREFICES.PROFILE + "/",
  MOB_LOGIN: MOB_PREFICES.AUTH + "/login",
  MOB_REGISTER: MOB_PREFICES.AUTH + "/register",
  MOB_LOGOUT: MOB_PREFICES.AUTH + "/logout",

  ORS_CALC_ROUTE: ORS_PREFICES.CALC_ROUTE + "/",

  MAP_GET_ROUTE: MAP_PREFICES.MANAGE_ROUTES + "/get_route",
  MAP_GET_ROUTES: MAP_PREFICES.MANAGE_ROUTES + "/get_routes",
  MAP_SET_ROUTE: MAP_PREFICES.MANAGE_ROUTES + "/set_route",
};
