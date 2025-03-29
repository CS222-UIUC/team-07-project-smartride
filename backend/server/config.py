import os


class Config:
    BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "database"))
    SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(BASE_DIR, "userinfo.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
