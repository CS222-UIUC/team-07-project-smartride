import { IS_DEV, IS_WEB } from "@/utils/api_url";

export const useJwt = !(IS_DEV || IS_WEB);
