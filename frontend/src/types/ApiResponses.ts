import { ORSRouteData } from "./MapRoute";
import { BasicInfoType } from "./UserProfile";

export interface LogoutResponse {
  message: string;
}

export interface LoginResponse {
  message: string;
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

export interface MapGetResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface OrsCalcRouteResponse {
  success: boolean;
  message: string;
  data: ORSRouteData;
}