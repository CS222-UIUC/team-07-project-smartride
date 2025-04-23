import { isDev, isWeb } from "@/utils/platform";

export const useJwt = !(isDev() || isWeb());