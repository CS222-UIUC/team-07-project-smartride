import json
from server.models.map_route import MapRoute

def upgrade(session):
    """
    Upgrade data format:
    - Wrap lng/lat/ele into 'coordinates' object inside points
    - Ensure each path point inside segments also wraps into coordinates
    """
    routes = session.query(MapRoute).all()

    for route in routes:
        if not route.data:
            continue
        try:
            data = json.loads(route.data)

            if "points" in data and isinstance(data["points"], list):
                for point in data["points"]:
                    # Only migrate if old format exists
                    if "lng" in point and "lat" in point:
                        lng = point.pop("lng")
                        lat = point.pop("lat")
                        ele = point.pop("ele", 0)  # Default elevation 0 if missing
                        point["coordinates"] = {
                            "lat": lat,
                            "lng": lng,
                            "ele": ele,
                        }

            if "segments" in data and isinstance(data["segments"], list):
                for segment in data["segments"]:
                    # from / to: replace object with id
                    if isinstance(segment.get("from"), dict) and "id" in segment["from"]:
                        segment["from"] = segment["from"]["id"]
                    if isinstance(segment.get("to"), dict) and "id" in segment["to"]:
                        segment["to"] = segment["to"]["id"]

                    # path: still coordinates, only fix if old format
                    if "path" in segment and isinstance(segment["path"], list):
                        new_path = []
                        for p in segment["path"]:
                            if "lng" in p and "lat" in p:
                                new_path.append({
                                    "lat": p["lat"],
                                    "lng": p["lng"],
                                    "ele": p.get("ele", 0),
                                })
                            else:
                                new_path.append(p)
                        segment["path"] = new_path

            data["version"] = 2

            route.data = json.dumps(data)

        except Exception as e:
            print(f"[ERROR] Route id={route.id} migration failed: {e}")

    print("[INFO] Migration 001_initial_migrate_data_format applied.")


def downgrade(session):
    """
    Downgrade data format back:
    - Flatten 'coordinates' object into lng/lat/ele fields inside points
    - Flatten each path point inside segments
    """
    routes = session.query(MapRoute).all()

    for route in routes:
        if not route.data:
            continue
        try:
            data = json.loads(route.data)

            points_by_id = {}
            if "points" in data and isinstance(data["points"], list):
                for point in data["points"]:
                    coordinates = point.pop("coordinates", None)
                    if coordinates:
                        point["lat"] = coordinates["lat"]
                        point["lng"] = coordinates["lng"]
                        point["ele"] = coordinates.get("ele", 0)
                    points_by_id[point["id"]] = point

            if "segments" in data and isinstance(data["segments"], list):
                for segment in data["segments"]:
                    # from / to: expand id back to Point object
                    if isinstance(segment.get("from"), str):
                        point_id = segment["from"]
                        if point_id in points_by_id:
                            segment["from"] = points_by_id[point_id]
                    if isinstance(segment.get("to"), str):
                        point_id = segment["to"]
                        if point_id in points_by_id:
                            segment["to"] = points_by_id[point_id]

                    # path: flatten as needed
                    if "path" in segment and isinstance(segment["path"], list):
                        old_path = []
                        for p in segment["path"]:
                            if "lat" in p and "lng" in p:
                                old_path.append({
                                    "lat": p["lat"],
                                    "lng": p["lng"],
                                    "ele": p.get("ele", 0),
                                })
                            else:
                                old_path.append(p)
                        segment["path"] = old_path

            data.pop("version", None)

            route.data = json.dumps(data)

        except Exception as e:
            print(f"[ERROR] Route id={route.id} downgrade failed: {e}")

    print("[INFO] Migration 001_initial_migrate_data_format rolled back.")
