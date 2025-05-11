import type { LatLngExpression } from "leaflet";

export interface NavMapBindings {
  bindClass: "nav";

  // User real-time position and where map should focus
  userPosition: LatLngExpression;
  userFocus: boolean;

  // Splitted route data for rendering
  traveledPolyline: LatLngExpression[];
  remainingPolyline: LatLngExpression[];
}
