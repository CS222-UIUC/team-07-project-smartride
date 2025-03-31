from pathlib import Path

from server.core.extensions import db
from server.app import app
from sqlalchemy import inspect

db_uri = app.config["SQLALCHEMY_DATABASE_URI"]

if not db_uri.startswith("sqlite:///"):
    raise RuntimeError("init_db.py only supports sqlite:/// URIs.")

db_path_str = db_uri.replace("sqlite:///", "", 1)
db_path = Path(db_path_str).resolve()

with app.app_context():
    inspector = inspect(db.engine)
    tables = inspector.get_table_names()

    if tables:
        print(f"[Init DB] Tables currently in {db_path}: {tables}")
        print(f"[Init DB] Database already initialized at {db_path}, skipping.")
    else:
        print(f"[Init DB] Creating new database at {db_path}...")
        db_path.parent.mkdir(parents=True, exist_ok=True)  # make sure dir exists
        db.create_all()
        print(f"[Init DB] Tables currently in {db_path}: {tables}")
        print("[Init DB] Database created successfully.")
