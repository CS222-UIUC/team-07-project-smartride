# For now, just id and name, no need for a real route data structure

from server.core.extensions import db


class MapRoute(db.Model):  # type: ignore[name-defined]
    __tablename__ = "map_routes"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    # TODO (Brian): Split info and data by the respective json structure, into different tables
    # route_info: { name: str }
    info = db.Column(db.Text, nullable=True)
    # data: { points: Point[], segments: Segment[] }
    # Coordinate: { lat: float, lon: float, ele: float }
    # PointType: "main" | "waypoint"
    # Point: { id: str, coordinate: Coordinate, label: str, type: PointType }
    # Segment: { from: str (id of a Point), to: str, path: Coordinate[] }
    data = db.Column(db.Text, nullable=True)
