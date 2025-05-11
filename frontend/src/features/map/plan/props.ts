import type { RouteData } from "@/types/MapRoute";

export interface PlanMapBindings {
  bindClass: "plan";

  routeData: RouteData;
  userFocus: boolean;

  onClickAddPoint: (lat: number, lng: number) => void;
  onReorderPoint: (from: number, to: number) => void;
  onTogglePointType: (id: string) => void;
  onRemovePoint: (id: string) => void;

  isPanelOpen: boolean;
  onOpenPanel: () => void;
  onClosePanel: () => void;
}
