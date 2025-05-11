import type { LatLngExpression } from "leaflet";

export interface ViewPoints {
  traveled: LatLngExpression[];
  remaining: LatLngExpression[];
}

/**
 * Split the flattened route into traveled and remaining segments.
 */
export const getViewPoints = (
  coords: LatLngExpression[],
  nearestIndex: number
): ViewPoints => {
  return {
    traveled: coords.slice(0, nearestIndex + 1),
    remaining: coords.slice(nearestIndex + 1),
  };
};
