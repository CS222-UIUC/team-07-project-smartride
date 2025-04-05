import os
from pathlib import Path
from typing import ClassVar

from dotenv import load_dotenv


class Config:
    # Resolve current file path
    current: ClassVar[Path] = Path(__file__).resolve()
    DATABASE_DIR: ClassVar[Path]
    PROJECT_DIR: ClassVar[Path]
    SQLALCHEMY_DATABASE_URI: ClassVar[str]
    SQLALCHEMY_TRACK_MODIFICATIONS: ClassVar[bool] = False
    API_PORT: int | None = 5000
    ORS_API_KEY: str | None = None
    FLASK_SECRET_KEY: str | None = None

    # Search upward for 'backend' directory
    for parent in current.parents:
        if parent.name == "backend":
            DATABASE_DIR = parent / "database"
            PROJECT_DIR = parent.parent
            break
    else:
        raise RuntimeError("Cannot locate 'backend' directory from config.py")

    # Load .env for API key
    load_dotenv(PROJECT_DIR / ".env.shared")
    load_dotenv(PROJECT_DIR / ".env.local", override=True)

    FLASK_SECRET_KEY = os.getenv("FLASK_SECRET_KEY")

    if not FLASK_SECRET_KEY:
        raise RuntimeError("FLASK_SECRET_KEY is not set in the environment.")

    ORS_API_KEY = os.getenv("ORS_API_KEY")

    if not ORS_API_KEY:
        raise RuntimeError("ORS_API_KEY is not set in the environment.")

    api_port_res: str | None = os.getenv("VITE_API_PORT")
    if api_port_res:
        API_PORT = int(api_port_res)
    else:
        print("Warning: VITE_API_PORT not set up! Use 5000 as default")
        API_PORT = 5000

    # Convert to string path
    SQLALCHEMY_DATABASE_URI = "sqlite:///" + str(DATABASE_DIR / "userinfo.db")
