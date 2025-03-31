import os

from dotenv import load_dotenv

# Load .env for API key
load_dotenv(".env.shared")
load_dotenv(".env.local", override=True)

ors_api_key = os.getenv("ORS_API_KEY")

if not ors_api_key:
    raise RuntimeError("ORS_API_KEY is not set in the environment.")
