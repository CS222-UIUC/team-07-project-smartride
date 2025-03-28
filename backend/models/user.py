from flask_login import UserMixin
from flask_sqlalchemy.model import Model

from backend.extensions import db


class User(UserMixin, Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)
