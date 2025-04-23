import { clearLoginMark, markLoggedIn } from "@/utils/login-marker";
import { useJwt } from "../utils/useJwt";
import { clearToken, getToken, setToken } from "./raw_token_manager";

export function buildAuthHeaders(headers: HeadersInit = {}): HeadersInit {
  const token = getToken();
  if (!(token && useJwt)) return headers;

  const plainHeaders: Record<string, string> =
    headers instanceof Headers
      ? Object.fromEntries(headers.entries())
      : Array.isArray(headers)
      ? Object.fromEntries(headers)
      : { ...headers };

  return {
    ...plainHeaders,
    Authorization: `Bearer ${token}`,
  };
}

export enum TOKEN_STATE {
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT"
}
export function jwtPostProcess(state: TOKEN_STATE, token?: string) {
  if (!(token && useJwt)) return;
  switch (state) {
    case TOKEN_STATE.LOGIN:
      markLoggedIn();
      setToken(token);
      break;
    case TOKEN_STATE.LOGOUT:
      clearLoginMark();
      clearToken();
      break;
  }
}