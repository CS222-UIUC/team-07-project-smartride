import { RouteData } from "@/types/MapRoute";
import { calcRoute } from "@/api/services/ors/calc_route";
import { toast } from "sonner";

export const reorderPoints = async (
  data: RouteData,
  from: number,
  to: number
): Promise<RouteData> => {
  const points = [...data.points];
  const [moved] = points.splice(from, 1);
  points.splice(to, 0, moved);

  const prevOld = from > 0 ? data.points[from - 1] : null;
  const nextOld = from < data.points.length - 1 ? data.points[from + 1] : null;
  const prevNew = to > 0 ? points[to - 1] : null;
  const nextNew = to < points.length - 1 ? points[to + 1] : null;

  const oldSegs = data.segments.filter(
    (seg) =>
      (prevOld && seg.from === prevOld.id && seg.to === moved.id) ||
      (nextOld && seg.from === moved.id && seg.to === nextOld.id)
  );

  const restSegs = data.segments.filter((seg) => !oldSegs.includes(seg));

  const newSegs = [...restSegs];

  if (prevNew) {
    try {
      const res = await calcRoute(prevNew.coordinates, moved.coordinates);
      newSegs.push({ from: prevNew.id, to: moved.id, path: res.route });
    } catch {
      toast.error(`Failed to calc route: ${prevNew.label} → ${moved.label}`);
    }
  }

  if (nextNew) {
    try {
      const res = await calcRoute(moved.coordinates, nextNew.coordinates);
      newSegs.push({ from: moved.id, to: nextNew.id, path: res.route });
    } catch {
      toast.error(`Failed to calc route: ${moved.label} → ${nextNew.label}`);
    }
  }

  return { points, segments: newSegs };
};
