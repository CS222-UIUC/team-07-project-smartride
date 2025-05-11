import type { LatLngExpression } from "leaflet";

/**
 * Haversine distance in meters between two LatLngExpression points.
 */
const haversineDistance = (
  a: LatLngExpression,
  b: LatLngExpression
): number => {
  const R = 6371000; // Earth radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const [lat1, lng1] = Array.isArray(a) ? a : [a.lat, a.lng];
  const [lat2, lng2] = Array.isArray(b) ? b : [b.lat, b.lng];

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const aVal =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(aVal));
};

/**
 * Find the nearest point index on the route to the user's current position.
 * Returns -1 if no point is within `radius` meters.
 */
export const findNearestIndex = (
  coords: LatLngExpression[],
  user: LatLngExpression,
  radius: number = 1500 // TODO: default 20, now only for testing
): number => {
  let minDist = Infinity;
  let nearestIndex = -1;

  coords.forEach((coord, i) => {
    const dist = haversineDistance(coord, user);
    if (dist < minDist && dist <= radius) {
      minDist = dist;
      nearestIndex = i;
    }
  });

  return nearestIndex;
};
