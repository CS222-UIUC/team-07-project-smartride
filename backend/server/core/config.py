from pathlib import Path


class Config:
    # Resolve current file path
    current = Path(__file__).resolve()

    # Search upward for 'backend' directory
    for parent in current.parents:
        if parent.name == "backend":
            BASE_DIR = parent / "database"
            break
    else:
        raise RuntimeError("Cannot locate 'backend' directory from config.py")

    # Convert to string path
    SQLALCHEMY_DATABASE_URI = "sqlite:///" + str(BASE_DIR / "userinfo.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
