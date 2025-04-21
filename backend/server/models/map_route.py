# For now, just id and name, no need for a real route data structure

from server.core.extensions import db


class MapRoute(db.Model):  # type: ignore[name-defined]
    __tablename__ = "map_routes"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    route_name = db.Column(db.String(100), nullable=False)
    route_data = db.Column(db.Text, nullable=True)
