import { ORSRouteData, Route } from "./MapRoute";
import { BasicInfoType } from "./UserProfile";

export interface LogoutResponse {
  message: string;
}

export interface LoginResponse {
  message: string;
  // user?: string;
  data?: {
    token?: string;
  };
}

export interface RegisterResponse {
  message: string;
  user?: string;
}

export interface BasicInfoResponse {
  success: boolean;
  data: BasicInfoType;
}

export interface MapGetRouteResponse {
    success: boolean;
    data?: Route;
    message?: string;
}

export interface MapGetRoutesInfoResponse {
    success: boolean;
    data?: Route[];
    message?: string;
}

export interface OrsCalcRouteResponse {
  success: boolean;
  message: string;
  data: ORSRouteData;
}