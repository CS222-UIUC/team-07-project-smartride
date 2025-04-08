from pathlib import Path

from sqlalchemy import inspect

from server.app import app
from server.core.extensions import db

db_uri = app.config["SQLALCHEMY_DATABASE_URI"]

if not db_uri.startswith("sqlite:///"):
    raise RuntimeError("init_db.py only supports sqlite:/// URIs.")

db_path_str = db_uri.replace("sqlite:///", "", 1)
db_path = Path(db_path_str).resolve()

with app.app_context():
    db.create_all()

    # binds = app.config.get("SQLALCHEMY_BINDS", {})
    # for bind_key in binds:
    # db.create_all(bind=bind_key)

    inspector = inspect(db.engine)
    tables = inspector.get_table_names()
    print(f"[Init DB] Tables currently in {db_path}: {tables}")
    print("[Init DB] Database tables ensured/updated successfully.")
