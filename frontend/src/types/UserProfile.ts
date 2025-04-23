export interface BasicInfoType {
  name: string;
  email: string;
  nickname?: string;
  height?: number;
  weight?: number;
  age?: number;
  map_route?: string;
}

export const EMPTY_BASIC_INFO: BasicInfoType = {
  name: "",
  email: "",
  nickname: "",
  height: undefined,
  weight: undefined,
  age: undefined,
  map_route: "",
};