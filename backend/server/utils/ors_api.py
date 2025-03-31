import os

from dotenv import load_dotenv

from server.core.config import Config

project_root = Config.PROJECT_DIR

# Load .env for API key
load_dotenv(project_root / ".env.shared")
load_dotenv(project_root / ".env.local", override=True)

ors_api_key = os.getenv("ORS_API_KEY")

if not ors_api_key:
    raise RuntimeError("ORS_API_KEY is not set in the environment.")
