from pathlib import Path
from typing import ClassVar


class Config:
    # Resolve current file path
    current: ClassVar[Path] = Path(__file__).resolve()
    DATABASE_DIR: ClassVar[Path]
    PROJECT_DIR: ClassVar[Path]
    SQLALCHEMY_DATABASE_URI: ClassVar[str]
    SQLALCHEMY_TRACK_MODIFICATIONS: ClassVar[bool] = False

    # Search upward for 'backend' directory
    for parent in current.parents:
        if parent.name == "backend":
            DATABASE_DIR = parent / "database"
            PROJECT_DIR = parent.parent
            break
    else:
        raise RuntimeError("Cannot locate 'backend' directory from config.py")

    # Convert to string path
    SQLALCHEMY_DATABASE_URI = "sqlite:///" + str(DATABASE_DIR / "userinfo.db")
