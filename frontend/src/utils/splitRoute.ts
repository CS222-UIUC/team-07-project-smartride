export function splitRouteByPosition(
  routePoints: [number, number][],
  userPosition: [number, number],
) {
  if (routePoints.length === 0) {
    return { traveledPoints: [], remainingPoints: [] };
  }

  let minDist = Infinity;
  let closestIdx = 0;

  for (let i = 0; i < routePoints.length; i++) {
    const [lat1, lng1] = userPosition;
    const [lat2, lng2] = routePoints[i];
    const dist = Math.hypot(lat1 - lat2, lng1 - lng2);
    if (dist < minDist) {
      minDist = dist;
      closestIdx = i;
    }
  }

  const DIST_THRESHOLD = 0.0005;

  if (minDist > DIST_THRESHOLD) {
    return { traveledPoints: [], remainingPoints: routePoints };
  }

  const traveledPoints = routePoints.slice(0, closestIdx + 1);
  const remainingPoints = routePoints.slice(closestIdx);

  return { traveledPoints, remainingPoints };
}
