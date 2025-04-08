from flask_login import UserMixin

from server.core.extensions import db


class User(UserMixin, db.Model):  # type: ignore[name-defined]
    __tablename__ = "user"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)
    # TODO (Richard): Add more fields to connect with frontend, do NOT uncomment line 16-19
    # New fields
    # nickname = db.Column(db.String(100))
    # height = db.Column(db.Float)
    # weight = db.Column(db.Float)
    # age = db.Column(db.Integer)
